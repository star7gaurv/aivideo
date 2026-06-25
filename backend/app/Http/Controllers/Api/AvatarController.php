<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Jobs\GenerateAvatarJob;
use App\Models\AvatarJob;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class AvatarController extends Controller
{
    /**
     * Upload a face image and queue SadTalker generation.
     * The audio_path should be a storage-relative path from a prior TTS generate call.
     */
    public function generate(Request $request)
    {
        $request->validate([
            'face_image'  => 'required|file|image|max:5120',
            'audio_path'  => 'nullable|string',
            'project_id'  => 'nullable|integer|exists:projects,id',
            'scene_id'    => 'nullable|string|max:64',
        ]);

        $userId = auth()->id();

        // Store uploaded face image
        $faceFile       = $request->file('face_image');
        $faceStorePath  = $faceFile->store("avatars/{$userId}/faces", 'public');

        $job = AvatarJob::create([
            'user_id'         => $userId,
            'project_id'      => $request->project_id,
            'scene_id'        => $request->scene_id,
            'face_image_path' => $faceStorePath,
            'audio_path'      => $request->audio_path,
            'status'          => 'queued',
        ]);

        GenerateAvatarJob::dispatch($job);

        return response()->json([
            'id'         => $job->id,
            'status'     => 'queued',
            'message'    => 'Avatar generation queued. Check /status for updates (typically 3–10 min).',
            'status_url' => url("/api/v1/avatars/{$job->id}/status"),
        ], 202);
    }

    /**
     * Poll status for a queued avatar job.
     */
    public function status(int $id)
    {
        $job = AvatarJob::where('id', $id)
            ->where('user_id', auth()->id())
            ->firstOrFail();

        return response()->json([
            'id'          => $job->id,
            'status'      => $job->status,
            'videoUrl'    => $job->output_video_url,
            'durationSec' => $job->duration_sec,
            'log'         => $job->status === 'failed' ? $job->log : null,
            'startedAt'   => $job->started_at?->toIso8601String(),
            'completedAt' => $job->completed_at?->toIso8601String(),
        ]);
    }

    /**
     * List recent avatar jobs for the current user.
     */
    public function index()
    {
        $jobs = AvatarJob::where('user_id', auth()->id())
            ->orderByDesc('id')
            ->limit(20)
            ->get(['id', 'scene_id', 'status', 'output_video_url', 'duration_sec', 'created_at']);

        return response()->json($jobs);
    }
}
