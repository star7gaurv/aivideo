<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;

class TtsController extends Controller
{
    public function generate(Request $request): JsonResponse
    {
        $data = $request->validate([
            'scenes'     => 'required|array|min:1',
            'scenes.*.id'        => 'required|string',
            'scenes.*.narration' => 'nullable|string',
            'project_id' => 'nullable|integer|exists:projects,id',
            'voice'      => 'nullable|string|in:ryan',
        ]);

        $scenes     = $data['scenes'];
        $projectId  = $data['project_id'] ?? ('preview-' . auth()->id());
        $voiceName  = $data['voice'] ?? 'ryan';

        $voicePath  = config('services.piper.voice_path');
        $piperCmd   = config('services.piper.cmd', 'python3 -m piper');

        if (!$voicePath || !file_exists($voicePath)) {
            return response()->json([
                'error' => 'Piper voice model not found. Run: bash video-engine/scripts/download-voice.sh',
                'voice_path_configured' => $voicePath,
            ], 503);
        }

        // Output audio to public storage so frontend can preview
        $outputDir = Storage::disk('public')->path("tts/{$projectId}");
        @mkdir($outputDir, 0775, true);

        $scenesJson = json_encode(array_map(fn($s) => [
            'id'        => $s['id'],
            'narration' => $s['narration'] ?? '',
        ], $scenes));

        $enginePath = config('services.video_engine.path');
        $script     = "{$enginePath}/scripts/generate-tts.py";

        $cmd = "python3 " . escapeshellarg($script)
            . " --scenes-json " . escapeshellarg($scenesJson)
            . " --output-dir "  . escapeshellarg($outputDir)
            . " --voice "       . escapeshellarg($voicePath)
            . " --piper "       . escapeshellarg($piperCmd);

        $output   = [];
        $exitCode = 0;
        exec($cmd . " 2>/dev/null", $output, $exitCode);

        $jsonOutput = implode('', $output);
        $result     = json_decode($jsonOutput, true);

        if (!$result || $exitCode !== 0) {
            return response()->json([
                'error'  => 'TTS generation failed',
                'output' => $jsonOutput,
            ], 500);
        }

        // Build public URLs for each scene's audio
        $baseUrl  = Storage::disk('public')->url("tts/{$projectId}");
        $scenes_out = array_map(function ($scene) use ($baseUrl, $projectId) {
            $hasAudio = !empty($scene['wavPath']);
            return [
                'id'               => $scene['id'],
                'audioUrl'         => $hasAudio ? "{$baseUrl}/{$scene['id']}.wav" : null,
                'audioPath'        => $hasAudio ? "tts/{$projectId}/{$scene['id']}.wav" : null,
                'durationSec'      => $scene['durationSec'] ?? null,
                'durationInFrames' => $scene['durationInFrames'] ?? null,
                'error'            => $scene['error'] ?? null,
            ];
        }, $result['scenes']);

        return response()->json([
            'scenes'      => $scenes_out,
            'totalFrames' => $result['totalFrames'],
            'fps'         => $result['fps'],
        ]);
    }

    public function voices(): JsonResponse
    {
        return response()->json([
            ['id' => 'ryan', 'label' => 'Ryan (English Male, High Quality)', 'language' => 'en-US'],
        ]);
    }
}
