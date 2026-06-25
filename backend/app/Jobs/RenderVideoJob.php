<?php

namespace App\Jobs;

use App\Models\RenderJob;
use App\Models\Project;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class RenderVideoJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $timeout = 900;
    public int $tries   = 1;

    public function __construct(public RenderJob $renderJob) {}

    public function handle(): void
    {
        $job     = $this->renderJob;
        $project = $job->project;

        $job->update(['status' => 'processing', 'started_at' => now()]);

        $propsFile  = storage_path("app/renders/props-{$job->id}.json");
        $outputDir  = storage_path("app/public/renders/{$job->user_id}");
        $outputFile = "{$outputDir}/{$job->id}.mp4";

        @mkdir(dirname($propsFile), 0775, true);
        @mkdir($outputDir, 0775, true);

        // Build props for Remotion
        $config = $project->config ?? [];
        $props  = array_merge($config, [
            'projectId' => $project->id,
            'format'    => $project->format,
        ]);

        // Attach music file path if set
        if (!empty($config['music_track_id'])) {
            $track = \App\Models\MusicTrack::find($config['music_track_id']);
            if ($track) {
                $props['musicFilePath'] = Storage::disk('public')->path($track->file_path);
            }
        }

        file_put_contents($propsFile, json_encode($props));

        $enginePath = config('services.video_engine.path');
        $workerScript = "{$enginePath}/scripts/render-worker.js";

        $cmd = "node " . escapeshellarg($workerScript)
            . " --composition=" . escapeshellarg($project->template_id)
            . " --props-file=" . escapeshellarg($propsFile)
            . " --output=" . escapeshellarg($outputFile);

        $descriptors = [
            0 => ['pipe', 'r'],
            1 => ['pipe', 'w'],
            2 => ['pipe', 'w'],
        ];

        $process = proc_open($cmd, $descriptors, $pipes, $enginePath);

        if (!is_resource($process)) {
            $this->fail($job, $project, 'Failed to start render process');
            return;
        }

        fclose($pipes[0]);
        $lastLog = '';

        // Read stdout line by line for PROGRESS:N updates
        while (!feof($pipes[1])) {
            $line = fgets($pipes[1]);
            if ($line === false) break;
            $line = trim($line);
            if (str_starts_with($line, 'PROGRESS:')) {
                $progress = (int) substr($line, 9);
                $job->update(['progress' => min(99, $progress)]);
            }
            $lastLog = $line;
        }

        $stderr   = stream_get_contents($pipes[2]);
        $exitCode = proc_close($process);

        @unlink($propsFile);

        if ($exitCode !== 0) {
            $this->fail($job, $project, $stderr ?: $lastLog ?: 'Render failed');
            return;
        }

        // Move output to public storage
        $publicPath = "renders/{$job->user_id}/{$job->id}.mp4";
        Storage::disk('public')->put($publicPath, file_get_contents($outputFile));
        @unlink($outputFile);

        $outputUrl = Storage::disk('public')->url($publicPath);

        $job->update([
            'status'       => 'done',
            'progress'     => 100,
            'output_url'   => $outputUrl,
            'completed_at' => now(),
        ]);

        $project->update(['status' => 'done', 'output_path' => $publicPath]);
    }

    private function fail(RenderJob $job, Project $project, string $log): void
    {
        $job->update([
            'status'       => 'failed',
            'log'          => $log,
            'completed_at' => now(),
        ]);
        $project->update(['status' => 'failed']);
    }
}
