<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Jobs\GenerateMusicJob;
use App\Models\MusicTrack;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;

class MusicController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = MusicTrack::query();

        if ($request->has('mood')) {
            $query->where('mood', $request->mood);
        }

        $tracks = $query->orderBy('title')->get();
        return response()->json($tracks);
    }

    public function generate(Request $request): JsonResponse
    {
        $data = $request->validate([
            'mood'             => 'required|in:upbeat,calm,dramatic,corporate,chill,inspirational',
            'duration_seconds' => 'required|integer|min:5|max:300',
        ]);

        // Try Mubert first (fast, ~10s response)
        $mubertToken = config('services.mubert.token');
        if ($mubertToken) {
            return $this->generateWithMubert($data['mood'], $data['duration_seconds']);
        }

        // Fall back to async MusicGen via HF
        $track = MusicTrack::create([
            'title'            => ucfirst($data['mood']) . ' AI Track',
            'mood'             => $data['mood'],
            'source'           => 'musicgen',
            'duration_seconds' => $data['duration_seconds'],
            'file_path'        => '',
            'is_ai_generated'  => true,
        ]);

        GenerateMusicJob::dispatch($track, $data['mood'], $data['duration_seconds']);

        return response()->json([
            'track_id' => $track->id,
            'status'   => 'generating',
        ], 202);
    }

    private function generateWithMubert(string $mood, int $seconds): JsonResponse
    {
        $response = Http::post('https://api.mubert.com/v2/TTMusicGen', [
            'method' => 'TTM',
            'params' => [
                'pat'      => config('services.mubert.token'),
                'duration' => $seconds,
                'mode'     => 'loop',
                'tags'     => $mood,
                'format'   => 'mp3',
            ],
        ]);

        if (!$response->successful()) {
            return response()->json(['error' => 'Mubert generation failed'], 502);
        }

        $taskUrl = $response->json('data.tasks.0.download_link') ?? null;

        if (!$taskUrl) {
            return response()->json(['error' => 'No download link from Mubert'], 502);
        }

        // Download the MP3
        $mp3Contents = Http::get($taskUrl)->body();
        $filename     = 'ai-generated/' . auth()->id() . '-' . time() . '.mp3';
        Storage::disk('public')->put('music/' . $filename, $mp3Contents);

        $track = MusicTrack::create([
            'title'            => ucfirst($mood) . ' — Mubert AI',
            'mood'             => $mood,
            'source'           => 'mubert',
            'duration_seconds' => $seconds,
            'file_path'        => 'music/' . $filename,
            'is_ai_generated'  => true,
        ]);

        return response()->json([
            'track_id'    => $track->id,
            'status'      => 'ready',
            'preview_url' => $track->stream_url,
        ]);
    }
}
