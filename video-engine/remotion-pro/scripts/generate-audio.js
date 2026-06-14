#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

// Scene configuration with narration and timing
const scenes = [
  {
    name: 'TitleScene',
    narration: 'सौर ऊर्जा। सूरज की अपार शक्ति का उपयोग करके हम अपने भविष्य को उज्ज्वल बना सकते हैं।',
    duration: 4,
    fps: 30,
  },
  {
    name: 'HowItWorksScene',
    narration: 'सोलर पैनल सूरज की किरणों को पकड़ते हैं। इसमें फोटॉन कण होते हैं जो सिलिकॉन सेल में टकराते हैं। यह विद्युत ऊर्जा पैदा करता है।',
    duration: 9,
    fps: 30,
  },
  {
    name: 'BenefitsScene',
    narration: 'सौर ऊर्जा प्रदूषण मुक्त है, कभी ख़त्म नहीं होती, आपके बिजली बिल को कम करती है, और पृथ्वी को बचाती है।',
    duration: 8,
    fps: 30,
  },
  {
    name: 'StatsScene',
    narration: 'भारत में अभी 160 गीगावाट सौर क्षमता स्थापित है। 2030 तक हमारा लक्ष्य 500 गीगावाट है। यह एक बड़ा कदम है नवीकरणीय ऊर्जा की ओर।',
    duration: 8,
    fps: 30,
  },
  {
    name: 'ActionScene',
    narration: 'आज ही शुरुआत करो। सूरज की शक्ति का उपयोग करके एक स्वच्छ भविष्य बनाओ।',
    duration: 5,
    fps: 30,
  },
];

const outputDir = path.join(__dirname, '../output');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function generateAudio() {
  console.log('🎙️ Generating scene-specific Hindi audio...\n');

  for (const scene of scenes) {
    const audioFile = path.join(outputDir, `${scene.name}_audio.mp3`);

    try {
      // Use gTTS via Python
      const pythonScript = `
from gtts import gTTS
tts = gTTS(text='${scene.narration.replace(/'/g, "\\'")}', lang='hi', slow=False)
tts.save('${audioFile}')
`;

      // Write Python script to temp file
      const tempScript = `/tmp/gtts_${scene.name}.py`;
      fs.writeFileSync(tempScript, pythonScript);

      // Execute Python script
      await execAsync(`python3 ${tempScript}`);

      console.log(`✓ ${scene.name}: ${audioFile}`);
      fs.unlinkSync(tempScript); // Clean up
    } catch (error) {
      console.error(`✗ ${scene.name}: ${error.message}`);
    }
  }

  console.log('\n✓ All audio files generated');
  console.log('\nScene timing:');
  scenes.forEach((scene) => {
    console.log(`  ${scene.name}: ${scene.duration}s (${scene.duration * scene.fps} frames)`);
  });

  // Save config for ffmpeg merge
  const config = {
    scenes: scenes.map((s) => ({
      name: s.name,
      duration: s.duration,
      audioFile: `${s.name}_audio.mp3`,
    })),
  };

  fs.writeFileSync(path.join(outputDir, 'audio-config.json'), JSON.stringify(config, null, 2));
  console.log('\n✓ Audio config saved for rendering');
}

generateAudio().catch((error) => {
  console.error('Error:', error);
  process.exit(1);
});
