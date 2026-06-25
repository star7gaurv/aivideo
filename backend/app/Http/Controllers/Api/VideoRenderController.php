<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Jobs\RenderVideoJob;
use App\Models\Project;
use App\Models\RenderJob;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class VideoRenderController extends Controller
{
    public function render(Request $request): JsonResponse
    {
        $data = $request->validate([
            'project_id' => 'required|integer',
        ]);

        $project = Project::where('id', $data['project_id'])
            ->where('user_id', auth()->id())
            ->firstOrFail();

        // Block double-renders
        if ($project->status === 'rendering') {
            return response()->json(['error' => 'Project is already rendering'], 409);
        }

        $job = RenderJob::create([
            'project_id' => $project->id,
            'user_id'    => auth()->id(),
            'status'     => 'queued',
            'progress'   => 0,
        ]);

        $project->update(['status' => 'rendering']);

        RenderVideoJob::dispatch($job);

        return response()->json([
            'render_job_id' => $job->id,
            'status'        => 'queued',
        ], 202);
    }

    public function status(string $id): JsonResponse
    {
        $job = RenderJob::where('id', $id)
            ->where('user_id', auth()->id())
            ->firstOrFail();

        return response()->json([
            'id'         => $job->id,
            'status'     => $job->status,
            'progress'   => $job->progress,
            'output_url' => $job->output_url,
            'log'        => $job->status === 'failed' ? $job->log : null,
            'started_at' => $job->started_at,
            'done_at'    => $job->completed_at,
        ]);
    }
}
