/**
 * render-worker.js
 * Called by Laravel's RenderVideoJob via proc_open.
 * Reports progress to stdout as "PROGRESS:N" lines (0-99).
 * Exits 0 on success, 1 on failure.
 *
 * Usage:
 *   node render-worker.js \
 *     --composition=ShortFilm \
 *     --props-file=/tmp/props-123.json \
 *     --output=/path/to/output.mp4
 */

const path    = require('path');
const fs      = require('fs');
const { execSync } = require('child_process');

// Parse CLI args
const args = {};
process.argv.slice(2).forEach((arg) => {
  const [k, v] = arg.replace(/^--/, '').split('=');
  args[k] = v;
});

const composition = args['composition'];
const propsFile   = args['props-file'];
const outputFile  = args['output'];

if (!composition || !propsFile || !outputFile) {
  console.error('Missing required args: --composition --props-file --output');
  process.exit(1);
}

if (!fs.existsSync(propsFile)) {
  console.error(`Props file not found: ${propsFile}`);
  process.exit(1);
}

const props = JSON.parse(fs.readFileSync(propsFile, 'utf8'));

const engineRoot   = path.resolve(__dirname, '..');
const entryPoint   = path.join(engineRoot, 'src', 'index.ts');
const ffmpegPath   = process.env.FFMPEG_PATH || 'ffmpeg';
const piperVoice   = process.env.PIPER_VOICE_PATH || '';
const piperCmd     = process.env.PIPER_CMD || 'python3 -m piper';
const ttsScript    = path.join(__dirname, 'generate-tts.py');

// Laravel public storage root — files stored via Storage::disk('public')
// Defaults to the sibling backend directory relative to video-engine/remotion-pro
const laravelPublicStorage = process.env.LARAVEL_STORAGE_PUBLIC
  || path.resolve(engineRoot, '../../backend/storage/app/public');

/**
 * Copy avatar MP4s (and any other storage-relative asset paths on scenes)
 * into remotion-pro/public/ so staticFile() can serve them.
 * Skips if the file is already in place or the source doesn't exist.
 */
function stageAvatarAssets(scenes) {
  if (!Array.isArray(scenes)) return;

  scenes.forEach((scene) => {
    if (!scene.avatarVideoPath) return;

    const dest = path.join(engineRoot, 'public', scene.avatarVideoPath);
    if (fs.existsSync(dest)) return; // already staged

    const src = path.join(laravelPublicStorage, scene.avatarVideoPath);
    if (!fs.existsSync(src)) {
      console.error(`[Avatar] Source not found, skipping: ${src}`);
      return;
    }

    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(src, dest);
    console.error(`[Avatar] Staged: ${scene.avatarVideoPath}`);
  });
}

/**
 * Run TTS for any scenes that have narration text but no narrationAudioPath.
 * Updates props.scenes in-place with generated audio paths.
 */
function runTts(scenes, projectId) {
  if (!piperVoice || !fs.existsSync(piperVoice)) {
    console.error('[TTS] Voice model not found — skipping narration. Set PIPER_VOICE_PATH.');
    return;
  }

  const needing = scenes.filter(
    (s) => s.narration && s.narration.trim() && !s.narrationAudioPath
  );
  if (needing.length === 0) return;

  const outputDir = path.join(engineRoot, 'public', 'tts', String(projectId));
  fs.mkdirSync(outputDir, { recursive: true });

  const scenesJson = JSON.stringify(needing.map((s) => ({ id: s.id, narration: s.narration })));
  const cmd = `python3 ${ttsScript} --scenes-json ${JSON.stringify(scenesJson)} --output-dir ${JSON.stringify(outputDir)} --voice ${JSON.stringify(piperVoice)} --piper ${JSON.stringify(piperCmd)}`;

  try {
    const result = execSync(cmd, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] });
    const data   = JSON.parse(result.trim());

    // Patch scenes with generated audio paths and updated durations
    data.scenes.forEach((ttsScene) => {
      const scene = scenes.find((s) => s.id === ttsScene.id);
      if (!scene) return;
      if (ttsScene.wavPath) {
        // Path relative to remotion-pro/public/
        scene.narrationAudioPath = path.relative(
          path.join(engineRoot, 'public'),
          ttsScene.wavPath
        ).replace(/\\/g, '/');
      }
      // Update duration to match audio length
      if (!scene.durationInFrames || scene.durationInFrames < ttsScene.durationInFrames) {
        scene.durationInFrames = ttsScene.durationInFrames;
      }
    });

    console.error(`[TTS] Generated narration for ${needing.length} scenes`);
  } catch (err) {
    console.error('[TTS] TTS generation error:', err.message);
  }
}

async function main() {
  try {
    const { bundle }      = require('@remotion/bundler');
    const { renderMedia, selectComposition } = require('@remotion/renderer');

    process.stdout.write('PROGRESS:5\n');

    // Auto-generate TTS for scenes missing audio
    if (props.scenes && props.projectId) {
      runTts(props.scenes, props.projectId);
    }

    // Stage avatar videos into public/ so staticFile() can find them
    if (props.scenes) {
      stageAvatarAssets(props.scenes);
    }

    // Re-write props file with any updated paths/durations
    if (props.scenes) {
      fs.writeFileSync(propsFile, JSON.stringify(props));
    }

    // Bundle
    const bundleLocation = await bundle({
      entryPoint,
      webpackOverride: (config) => config,
    });

    process.stdout.write('PROGRESS:20\n');

    // Select composition
    const selectedComp = await selectComposition({
      serveUrl:    bundleLocation,
      id:          composition,
      inputProps:  props,
    });

    process.stdout.write('PROGRESS:25\n');

    // Render video (visual only, no audio mix yet)
    const videoOnly = outputFile.replace('.mp4', '-video-only.mp4');

    await renderMedia({
      composition: selectedComp,
      serveUrl:    bundleLocation,
      codec:       'h264',
      outputLocation: videoOnly,
      inputProps:  props,
      onProgress:  ({ progress }) => {
        // progress is 0-1 — map to 25-90
        const pct = Math.round(25 + progress * 65);
        process.stdout.write(`PROGRESS:${pct}\n`);
      },
    });

    process.stdout.write('PROGRESS:90\n');

    // Mix music if provided
    const musicFile = props.musicFilePath;

    if (musicFile && fs.existsSync(musicFile)) {
      // Narration audio from props (optional)
      const narrationFile = props.narrationAudioFile;

      if (narrationFile && fs.existsSync(narrationFile)) {
        // Mix: video + narration at full volume + music at -18dBFS
        execSync(
          `"${ffmpegPath}" -y -i "${videoOnly}" -i "${narrationFile}" -i "${musicFile}" ` +
          `-filter_complex "[1:a]volume=1.0[narr];[2:a]volume=0.12[music];[narr][music]amix=inputs=2:duration=first[aout]" ` +
          `-map 0:v -map "[aout]" -c:v copy -c:a aac -shortest "${outputFile}"`,
          { stdio: 'pipe' }
        );
      } else {
        // Mix: video (may already have embedded audio) + background music at low volume
        execSync(
          `"${ffmpegPath}" -y -i "${videoOnly}" -i "${musicFile}" ` +
          `-filter_complex "[0:a]volume=1.0[va];[1:a]volume=0.12[music];[va][music]amix=inputs=2:duration=first[aout]" ` +
          `-map 0:v -map "[aout]" -c:v copy -c:a aac -shortest "${outputFile}"`,
          { stdio: 'pipe' }
        );
      }
      fs.unlinkSync(videoOnly);
    } else {
      // No music — just rename
      fs.renameSync(videoOnly, outputFile);
    }

    process.stdout.write('PROGRESS:99\n');
    console.log(`Render complete: ${outputFile}`);
    process.exit(0);

  } catch (err) {
    console.error(err.message || err);
    process.exit(1);
  }
}

main();
