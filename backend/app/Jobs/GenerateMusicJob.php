<?php

namespace App\Jobs;

use App\Models\MusicTrack;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;

class GenerateMusicJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $timeout = 120;
    public int $tries   = 2;

    public function __construct(
        public MusicTrack $track,
        public string $mood,
        public int $durationSeconds,
    ) {}

    public function handle(): void
    {
        $token = config('services.huggingface.token');

        $prompt   = "{$this->mood} background music for video, no vocals, {$this->durationSeconds} seconds, loopable";
        $response = Http::withToken($token)
            ->timeout(90)
            ->post('https://api-inference.huggingface.co/models/facebook/musicgen-small', [
                'inputs' => $prompt,
            ]);

        if (!$response->successful()) {
            $this->track->update(['title' => $this->track->title . ' (failed)']);
            return;
        }

        // HF returns raw audio (flac/wav) — convert to mp3 via FFmpeg
        $tmpInput  = sys_get_temp_dir() . '/musicgen-' . $this->track->id . '.flac';
        $tmpOutput = sys_get_temp_dir() . '/musicgen-' . $this->track->id . '.mp3';

        file_put_contents($tmpInput, $response->body());

        $ffmpeg = config('services.ffmpeg.path');
        exec("{$ffmpeg} -i " . escapeshellarg($tmpInput) . " -q:a 2 " . escapeshellarg($tmpOutput) . " 2>&1");

        if (!file_exists($tmpOutput)) {
            @unlink($tmpInput);
            return;
        }

        $filename  = 'ai-generated/' . $this->track->id . '-' . time() . '.mp3';
        $filePath  = 'music/' . $filename;
        Storage::disk('public')->put($filePath, file_get_contents($tmpOutput));

        @unlink($tmpInput);
        @unlink($tmpOutput);

        $this->track->update([
            'file_path'       => $filePath,
            'duration_seconds' => $this->durationSeconds,
        ]);
    }
}
