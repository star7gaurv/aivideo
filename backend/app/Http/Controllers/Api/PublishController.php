<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Jobs\PublishVideoJob;
use App\Models\PublishJob;
use App\Models\Project;
use App\Models\SocialAccount;
use Illuminate\Http\Request;

class PublishController extends Controller
{
    /**
     * Queue a publish job for a rendered project.
     */
    public function publish(Request $request)
    {
        $request->validate([
            'project_id'  => 'required|integer',
            'platform'    => 'required|in:youtube,instagram,tiktok',
            'title'       => 'nullable|string|max:500',
            'description' => 'nullable|string|max:5000',
        ]);

        $userId    = auth()->id();
        $project   = Project::where('id', $request->project_id)
            ->where('user_id', $userId)
            ->firstOrFail();

        if ($project->status !== 'done') {
            return response()->json(['error' => 'Project must be rendered before publishing.'], 422);
        }

        $account = SocialAccount::where('user_id', $userId)
            ->where('platform', $request->platform)
            ->first();

        if (!$account) {
            return response()->json([
                'error' => "No {$request->platform} account connected. Connect it first in settings.",
            ], 422);
        }

        $renderJob = $project->renderJobs()->where('status', 'done')->latest()->first();

        if (!$renderJob) {
            return response()->json(['error' => 'No completed render found. Render the project first.'], 422);
        }

        $job = PublishJob::create([
            'user_id'       => $userId,
            'project_id'    => $project->id,
            'render_job_id' => $renderJob?->id,
            'platform'      => $request->platform,
            'title'         => $request->title ?? $project->title,
            'description'   => $request->description,
            'status'        => 'queued',
        ]);

        PublishVideoJob::dispatch($job);

        return response()->json([
            'id'         => $job->id,
            'status'     => 'queued',
            'platform'   => $job->platform,
            'status_url' => url("/api/v1/publish/{$job->id}/status"),
        ], 202);
    }

    /**
     * Poll publish job status.
     */
    public function status(int $id)
    {
        $job = PublishJob::where('id', $id)
            ->where('user_id', auth()->id())
            ->firstOrFail();

        return response()->json([
            'id'                => $job->id,
            'status'            => $job->status,
            'platform'          => $job->platform,
            'platform_video_id' => $job->platform_video_id,
            'platform_url'      => $job->platform_url,
            'published_at'      => $job->published_at?->toIso8601String(),
            'log'               => $job->status === 'failed' ? $job->log : null,
        ]);
    }

    /**
     * List recent publish jobs for the current user.
     */
    public function index(Request $request)
    {
        $jobs = PublishJob::where('user_id', auth()->id())
            ->when($request->project_id, fn ($q) => $q->where('project_id', $request->project_id))
            ->orderByDesc('id')
            ->limit(30)
            ->get(['id', 'project_id', 'platform', 'status', 'platform_url', 'published_at', 'created_at']);

        return response()->json($jobs);
    }
}
