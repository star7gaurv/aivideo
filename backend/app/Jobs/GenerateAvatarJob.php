<?php

namespace App\Jobs;

use App\Models\AvatarJob;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Storage;

class GenerateAvatarJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $timeout = 900; // 15 min — HF queue can be slow
    public int $tries   = 1;

    public function __construct(public AvatarJob $avatarJob) {}

    public function handle(): void
    {
        $job = $this->avatarJob;
        $job->update(['status' => 'processing', 'started_at' => now()]);

        $enginePath = config('services.video_engine.path');
        $script     = "{$enginePath}/scripts/generate-avatar.py";
        $space      = config('services.sadtalker.space', 'vinthony/SadTalker');

        // Resolve absolute paths for face image and audio
        $faceImagePath = Storage::disk('public')->path($job->face_image_path);
        $audioPath     = $job->audio_path
            ? Storage::disk('public')->path($job->audio_path)
            : null;

        $outputDir  = Storage::disk('public')->path("avatars/{$job->user_id}");
        @mkdir($outputDir, 0775, true);
        $outputFile = "{$outputDir}/{$job->id}.mp4";

        $cmd = "python3 " . escapeshellarg($script)
            . " --face-image " . escapeshellarg($faceImagePath)
            . " --output "     . escapeshellarg($outputFile)
            . " --space "      . escapeshellarg($space)
            . " --still";

        if ($audioPath && file_exists($audioPath)) {
            $cmd .= " --audio " . escapeshellarg($audioPath);
        }

        $output   = [];
        $exitCode = 0;
        exec($cmd . " 2>/dev/null", $output, $exitCode);

        $jsonOutput = implode('', $output);
        $result     = json_decode($jsonOutput, true);

        if ($exitCode !== 0 || empty($result['videoPath']) || !file_exists($result['videoPath'])) {
            $job->update([
                'status'       => 'failed',
                'log'          => $result['error'] ?? $jsonOutput ?: 'Unknown error',
                'completed_at' => now(),
            ]);
            return;
        }

        $publicPath = "avatars/{$job->user_id}/{$job->id}.mp4";
        $outputUrl  = Storage::disk('public')->url($publicPath);

        $job->update([
            'status'            => 'done',
            'output_video_path' => $publicPath,
            'output_video_url'  => $outputUrl,
            'duration_sec'      => $result['durationSec'] ?? null,
            'completed_at'      => now(),
        ]);
    }
}
