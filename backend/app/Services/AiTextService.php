<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

/**
 * AI text generation with Gemini primary + Pollinations free fallback.
 * No vendor lock-in: works with zero API keys via Pollinations.
 */
class AiTextService
{
    /**
     * Free-form completion. Returns plain text.
     */
    public function complete(string $system, string $user): string
    {
        // Try Gemini first if a key is configured
        $key = config('services.gemini.key');
        if ($key) {
            $text = $this->geminiComplete($key, $system, $user);
            if ($text !== null) return $text;
        }

        // Fall back to Pollinations (free, no key)
        return $this->pollinationsComplete($system, $user) ?? '';
    }

    /**
     * Completion that must return JSON. Parses defensively (strips code fences,
     * extracts the first {...} or [...] block). Returns array or null.
     */
    public function json(string $system, string $user): ?array
    {
        $sys = $system . "\n\nRespond ONLY with valid minified JSON. No markdown, no code fences, no commentary.";

        $key = config('services.gemini.key');

        // Free models are non-deterministic. Plain mode handles large payloads
        // reliably; JSON mode is a backup for when plain returns prose.
        foreach ([false, true] as $jsonMode) {
            $raw = ($key ? $this->geminiComplete($key, $sys, $user, $jsonMode) : null)
                ?? $this->pollinationsComplete($sys, $user, $jsonMode);

            $parsed = $this->extractJson($raw ?? '');
            if ($parsed !== null) return $parsed;
        }
        return null;
    }

    private function geminiComplete(string $key, string $system, string $user, bool $jsonMode = false): ?string
    {
        try {
            $genConfig = ['temperature' => 0.9, 'maxOutputTokens' => 2048];
            if ($jsonMode) $genConfig['responseMimeType'] = 'application/json';

            $resp = Http::timeout(45)->post(
                "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={$key}",
                [
                    'systemInstruction' => ['parts' => [['text' => $system]]],
                    'contents'          => [['parts' => [['text' => $user]]]],
                    'generationConfig'  => $genConfig,
                ]
            );
            if (!$resp->successful()) return null;
            $text = $resp->json('candidates.0.content.parts.0.text');
            return $text ?: null;
        } catch (\Throwable $e) {
            Log::warning('Gemini failed, falling back: ' . $e->getMessage());
            return null;
        }
    }

    private function pollinationsComplete(string $system, string $user, bool $jsonMode = false): ?string
    {
        try {
            $payload = [
                'messages' => [
                    ['role' => 'system', 'content' => $system],
                    ['role' => 'user',   'content' => $user],
                ],
                'model'    => 'openai',
            ];
            if ($jsonMode) $payload['jsonMode'] = true;

            $resp = Http::timeout(60)->post('https://text.pollinations.ai/', $payload);
            if (!$resp->successful()) return null;
            return trim($resp->body());
        } catch (\Throwable $e) {
            Log::error('Pollinations failed: ' . $e->getMessage());
            return null;
        }
    }

    private function extractJson(string $raw): ?array
    {
        $raw = trim($raw);
        // Strip ```json ... ``` fences
        $raw = preg_replace('/^```(?:json)?\s*/i', '', $raw);
        $raw = preg_replace('/\s*```$/', '', $raw);

        $decoded = json_decode($raw, true);
        if (is_array($decoded)) return $decoded;

        // Extract first JSON object or array
        if (preg_match('/(\{.*\}|\[.*\])/s', $raw, $m)) {
            $decoded = json_decode($m[1], true);
            if (is_array($decoded)) return $decoded;
        }
        return null;
    }
}
