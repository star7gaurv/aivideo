<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\AiTextService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class AssistController extends Controller
{
    public function __construct(private AiTextService $ai) {}

    /**
     * Suggest video topic ideas for a given interest (or trending if blank).
     * POST /api/v1/assist/ideas  { interest? }
     */
    public function ideas(Request $request): JsonResponse
    {
        $data = $request->validate(['interest' => 'nullable|string|max:200']);
        $interest = $data['interest'] ?? '';

        $system = "You are a viral video strategist. You generate punchy, specific, high-engagement short video ideas.";
        $user = $interest
            ? "Give 6 video ideas about: \"{$interest}\". For each, a catchy title, a one-line hook, and the angle."
            : "Give 6 trending, broadly-appealing video ideas anyone could make. For each, a catchy title, a one-line hook, and the angle.";
        $user .= ' Return JSON: {"ideas":[{"title":"","hook":"","angle":""}]}';

        $result = $this->ai->json($system, $user);
        $ideas  = $result['ideas'] ?? $result ?? [];

        return response()->json(['ideas' => array_values($ideas)]);
    }

    /**
     * Full YouTube channel plan for someone who doesn't know what to post.
     * POST /api/v1/assist/channel  { passion }
     */
    public function channel(Request $request): JsonResponse
    {
        $data = $request->validate(['passion' => 'nullable|string|max:300']);
        $passion = $data['passion'] ?? '';

        $system = "You are a YouTube growth strategist who helps beginners launch channels. "
                . "You are concrete, encouraging, and practical.";
        $user = ($passion
                ? "Someone wants to start a YouTube channel related to: \"{$passion}\". "
                : "Someone wants to start a YouTube channel but has no idea what niche. ")
            . "Propose ONE focused niche and a starter plan. "
            . 'Return JSON: {"niche":"","description":"","audience":"","why_it_works":"",'
            . '"video_ideas":[{"title":"","hook":""}],"schedule":""}. '
            . "Include 6 video ideas. Keep every field concise; schedule one sentence.";

        $result = $this->ai->json($system, $user);

        return response()->json($result ?? [
            'niche' => '', 'description' => '', 'audience' => '',
            'why_it_works' => '', 'video_ideas' => [], 'schedule' => '',
        ]);
    }

    /**
     * Generate a full video script split into scenes.
     * POST /api/v1/assist/script  { topic, format?, target_seconds? }
     */
    public function script(Request $request): JsonResponse
    {
        $data = $request->validate([
            'topic'          => 'required|string|max:300',
            'format'         => 'nullable|in:landscape,portrait,ad',
            'target_seconds' => 'nullable|integer|min:10|max:600',
        ]);

        $format  = $data['format'] ?? 'portrait';
        $seconds = $data['target_seconds'] ?? ($format === 'ad' ? 15 : ($format === 'portrait' ? 40 : 90));
        // ~4s narration per scene → scene count
        $sceneCount = max(3, min(12, (int) round($seconds / ($format === 'ad' ? 5 : 8))));

        $formatDesc = match ($format) {
            'landscape' => 'a 16:9 YouTube explainer video',
            'ad'        => 'a 15-second vertical product ad',
            default     => 'a 9:16 vertical short / reel',
        };

        $system = "You are an expert video scriptwriter. You write tight, engaging narration that hooks in the "
                . "first 3 seconds and keeps energy high. Each scene's narration is 1-2 spoken sentences.";
        $user = "Write {$formatDesc} about: \"{$data['topic']}\". "
            . "Target about {$seconds} seconds across {$sceneCount} scenes. "
            . "For each scene give: narration (what's spoken), overlayText (short on-screen caption, max 6 words), "
            . "and imagePrompt (a vivid visual description for an AI image generator). "
            . "Also choose musicMood (one of: upbeat, calm, dramatic, corporate, chill, inspirational) "
            . "and style (one of: bold, minimal, cinematic, playful, professional). "
            . 'Return JSON: {"title":"","musicMood":"","style":"","scenes":[{"narration":"","overlayText":"","imagePrompt":""}]}';

        $result = $this->ai->json($system, $user);

        if (!$result || empty($result['scenes'])) {
            return response()->json(['error' => 'Script generation failed, please try again.'], 502);
        }

        return response()->json([
            'title'     => $result['title'] ?? $data['topic'],
            'musicMood' => $result['musicMood'] ?? 'upbeat',
            'style'     => $result['style'] ?? 'bold',
            'format'    => $format,
            'scenes'    => array_values($result['scenes']),
        ]);
    }

    /**
     * Rewrite a piece of narration per an instruction.
     * POST /api/v1/assist/rewrite  { text, instruction? }
     */
    public function rewrite(Request $request): JsonResponse
    {
        $data = $request->validate([
            'text'        => 'required|string|max:1000',
            'instruction' => 'nullable|string|max:200',
        ]);
        $instruction = $data['instruction'] ?? 'Make it punchier and more engaging.';

        $system = "You rewrite video narration. Return only the rewritten line, no quotes, no commentary.";
        $text = $this->ai->complete($system, "Rewrite this narration. {$instruction}\n\nNarration: {$data['text']}");

        return response()->json(['text' => trim($text, " \"\n")]);
    }
}
