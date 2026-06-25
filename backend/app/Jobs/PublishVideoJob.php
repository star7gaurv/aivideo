<?php

namespace App\Jobs;

use App\Models\PublishJob;
use App\Models\SocialAccount;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;

class PublishVideoJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $timeout = 1800; // 30 min — large file uploads can be slow
    public int $tries   = 1;

    public function __construct(public PublishJob $publishJob) {}

    public function handle(): void
    {
        $job     = $this->publishJob;
        $project = $job->project;

        $job->update(['status' => 'processing']);

        $account = SocialAccount::where('user_id', $job->user_id)
            ->where('platform', $job->platform)
            ->first();

        if (!$account) {
            return $this->fail($job, 'No connected account for platform: ' . $job->platform);
        }

        // Resolve the rendered video path
        $renderJob  = $job->renderJob ?? $project->renderJobs()->latest()->first();
        $outputPath = $renderJob?->output_url
            ? Storage::disk('public')->path(
                str_replace(Storage::disk('public')->url(''), '', $renderJob->output_url)
              )
            : null;

        if (!$outputPath || !file_exists($outputPath)) {
            // Try resolving from project output_path
            $outputPath = $project->output_path
                ? Storage::disk('public')->path($project->output_path)
                : null;
        }

        if (!$outputPath || !file_exists($outputPath)) {
            return $this->fail($job, 'Rendered video file not found. Render the project first.');
        }

        $accessToken = $this->freshToken($account);
        if (!$accessToken) {
            return $this->fail($job, 'Could not refresh access token.');
        }

        try {
            $result = match ($job->platform) {
                'youtube'   => $this->publishYoutube($job, $account, $accessToken, $outputPath),
                'instagram' => $this->publishInstagram($job, $account, $accessToken, $outputPath, $project),
                default     => throw new \RuntimeException("Unsupported platform: {$job->platform}"),
            };

            $job->update([
                'status'            => 'done',
                'platform_video_id' => $result['id']  ?? null,
                'platform_url'      => $result['url'] ?? null,
                'published_at'      => now(),
            ]);
        } catch (\Throwable $e) {
            $this->fail($job, $e->getMessage());
        }
    }

    // ── YouTube ──────────────────────────────────────────────────────────────

    private function publishYoutube(PublishJob $job, SocialAccount $account, string $token, string $videoPath): array
    {
        $enginePath = config('services.video_engine.path');
        $script     = "{$enginePath}/scripts/publish-youtube.py";

        $metadata = json_encode([
            'title'       => $job->title ?? $job->project->title,
            'description' => $job->description ?? '',
            'privacyStatus' => 'public',
        ]);

        $cmd = "python3 " . escapeshellarg($script)
            . " --video "        . escapeshellarg($videoPath)
            . " --access-token " . escapeshellarg($token)
            . " --metadata "     . escapeshellarg($metadata);

        $output   = [];
        $exitCode = 0;
        exec($cmd . " 2>/dev/null", $output, $exitCode);

        $result = json_decode(implode('', $output), true);

        if ($exitCode !== 0 || empty($result['id'])) {
            throw new \RuntimeException($result['error'] ?? implode("\n", $output) ?: 'YouTube upload failed');
        }

        return [
            'id'  => $result['id'],
            'url' => "https://www.youtube.com/watch?v={$result['id']}",
        ];
    }

    // ── Instagram ─────────────────────────────────────────────────────────────

    private function publishInstagram(PublishJob $job, SocialAccount $account, string $token, string $videoPath, $project): array
    {
        // Instagram Graph API requires a public HTTPS URL for the video
        $publicUrl = Storage::disk('public')->url($project->output_path);

        if (!str_starts_with($publicUrl, 'http')) {
            // Dev fallback — use tunnel URL from env
            $appUrl    = config('app.url');
            $publicUrl = rtrim($appUrl, '/') . '/storage/' . $project->output_path;
        }

        $igUserId = $account->platform_user_id;

        // Step 1: Create media container
        $containerResp = Http::post(
            "https://graph.facebook.com/v19.0/{$igUserId}/media",
            [
                'media_type'   => 'REELS',
                'video_url'    => $publicUrl,
                'caption'      => ($job->title ?? $project->title) . "\n\n" . ($job->description ?? ''),
                'access_token' => $token,
            ]
        );

        if (!$containerResp->successful() || empty($containerResp->json('id'))) {
            throw new \RuntimeException('Instagram container creation failed: ' . $containerResp->body());
        }

        $containerId = $containerResp->json('id');

        // Step 2: Wait for container to be ready (poll up to 5 min)
        $ready = false;
        for ($i = 0; $i < 30; $i++) {
            sleep(10);
            $statusResp = Http::get("https://graph.facebook.com/v19.0/{$containerId}", [
                'fields'       => 'status_code',
                'access_token' => $token,
            ]);
            if ($statusResp->json('status_code') === 'FINISHED') {
                $ready = true;
                break;
            }
            if ($statusResp->json('status_code') === 'ERROR') {
                throw new \RuntimeException('Instagram video processing failed.');
            }
        }

        if (!$ready) {
            throw new \RuntimeException('Instagram container timed out (>5 min).');
        }

        // Step 3: Publish
        $publishResp = Http::post(
            "https://graph.facebook.com/v19.0/{$igUserId}/media_publish",
            ['creation_id' => $containerId, 'access_token' => $token]
        );

        if (!$publishResp->successful() || empty($publishResp->json('id'))) {
            throw new \RuntimeException('Instagram publish failed: ' . $publishResp->body());
        }

        $mediaId = $publishResp->json('id');

        return [
            'id'  => $mediaId,
            'url' => "https://www.instagram.com/p/{$mediaId}/",
        ];
    }

    // ── Token refresh ─────────────────────────────────────────────────────────

    private function freshToken(SocialAccount $account): ?string
    {
        if (!$account->isExpired()) {
            return $account->access_token;
        }

        if (!$account->refresh_token) return null;

        try {
            $resp = match ($account->platform) {
                'youtube' => Http::post('https://oauth2.googleapis.com/token', [
                    'client_id'     => config('services.google.client_id'),
                    'client_secret' => config('services.google.client_secret'),
                    'refresh_token' => $account->refresh_token,
                    'grant_type'    => 'refresh_token',
                ]),
                'instagram' => Http::get('https://graph.facebook.com/oauth/access_token', [
                    'grant_type'        => 'fb_exchange_token',
                    'client_id'         => config('services.facebook.client_id'),
                    'client_secret'     => config('services.facebook.client_secret'),
                    'fb_exchange_token' => $account->access_token,
                ]),
                default => null,
            };

            if (!$resp || !$resp->successful()) return null;

            $newToken = $resp->json('access_token');
            $expiresIn = $resp->json('expires_in', 3600);

            $account->update([
                'access_token'     => $newToken,
                'token_expires_at' => now()->addSeconds($expiresIn),
            ]);

            return $newToken;
        } catch (\Throwable) {
            return null;
        }
    }

    private function fail(PublishJob $job, string $log): void
    {
        $job->update(['status' => 'failed', 'log' => $log]);
    }
}
