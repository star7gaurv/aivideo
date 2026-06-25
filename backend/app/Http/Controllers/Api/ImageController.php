<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\GeneratedImage;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ImageController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = GeneratedImage::where('user_id', auth()->id());

        if ($request->has('project_id')) {
            $query->where('project_id', $request->project_id);
        }

        return response()->json($query->orderByDesc('created_at')->get());
    }

    public function generate(Request $request): JsonResponse
    {
        $data = $request->validate([
            'prompt'     => 'required|string|max:500',
            'provider'   => 'sometimes|in:pollinations,gemini,cloudflare,huggingface',
            'project_id' => 'nullable|exists:projects,id',
            'width'      => 'sometimes|integer|min:256|max:2048',
            'height'     => 'sometimes|integer|min:256|max:2048',
        ]);

        $provider = $data['provider'] ?? 'pollinations';
        $width    = $data['width'] ?? 1024;
        $height   = $data['height'] ?? 1024;

        $imageContents = match ($provider) {
            'pollinations' => $this->fromPollinations($data['prompt'], $width, $height),
            'gemini'       => $this->fromGemini($data['prompt'], $width, $height),
            'cloudflare'   => $this->fromCloudflare($data['prompt'], $width, $height),
            'huggingface'  => $this->fromHuggingFace($data['prompt']),
            default        => $this->fromPollinations($data['prompt'], $width, $height),
        };

        if (!$imageContents) {
            return response()->json(['error' => 'Image generation failed'], 502);
        }

        $path = 'generated/' . auth()->id() . '/' . Str::uuid() . '.png';
        Storage::disk('public')->put($path, $imageContents);

        $image = GeneratedImage::create([
            'user_id'    => auth()->id(),
            'project_id' => $data['project_id'] ?? null,
            'prompt'     => $data['prompt'],
            'provider'   => $provider,
            'file_path'  => $path,
            'width'      => $width,
            'height'     => $height,
        ]);

        return response()->json([
            'id'     => $image->id,
            'url'    => $image->url,
            'width'  => $image->width,
            'height' => $image->height,
        ]);
    }

    private function fromPollinations(string $prompt, int $width, int $height): ?string
    {
        $encoded  = urlencode($prompt);
        $url      = "https://image.pollinations.ai/prompt/{$encoded}?width={$width}&height={$height}&nologo=true";
        $response = Http::timeout(30)->get($url);
        return $response->successful() ? $response->body() : null;
    }

    private function fromGemini(string $prompt, int $width, int $height): ?string
    {
        $apiKey   = config('services.gemini.key');
        $response = Http::withHeaders(['Content-Type' => 'application/json'])
            ->timeout(60)
            ->post("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-preview-image-generation:generateContent?key={$apiKey}", [
                'contents'          => [['parts' => [['text' => $prompt]]]],
                'generationConfig'  => ['responseModalities' => ['IMAGE', 'TEXT']],
            ]);

        if (!$response->successful()) {
            return null;
        }

        $b64 = $response->json('candidates.0.content.parts.0.inlineData.data');
        return $b64 ? base64_decode($b64) : null;
    }

    private function fromCloudflare(string $prompt, int $width, int $height): ?string
    {
        $accountId = config('services.cloudflare.account_id');
        $token     = config('services.cloudflare.ai_token');

        $response = Http::withToken($token)
            ->timeout(60)
            ->post("https://api.cloudflare.com/client/v4/accounts/{$accountId}/ai/run/@cf/black-forest-labs/flux-1-schnell", [
                'prompt' => $prompt,
                'width'  => $width,
                'height' => $height,
            ]);

        if (!$response->successful()) {
            return null;
        }

        $b64 = $response->json('result.image');
        return $b64 ? base64_decode($b64) : null;
    }

    private function fromHuggingFace(string $prompt): ?string
    {
        $token    = config('services.huggingface.token');
        $response = Http::withToken($token)
            ->timeout(60)
            ->post('https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell', [
                'inputs' => $prompt,
            ]);

        return $response->successful() ? $response->body() : null;
    }
}
