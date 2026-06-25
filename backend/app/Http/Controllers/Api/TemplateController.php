<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;

class TemplateController extends Controller
{
    private array $templates = [
        [
            'id'            => 'SolarFilm',
            'name'          => 'Solar Energy',
            'format'        => 'landscape',
            'width'         => 1920,
            'height'        => 1080,
            'duration_sec'  => 57,
            'description'   => 'Educational documentary about solar energy — Hindi + English narration.',
            'thumbnail_url' => null,
            'scenes'        => ['Title', 'How It Works', 'Benefits', 'Stats', 'CTA'],
        ],
        [
            'id'            => 'AncientHumans',
            'name'          => 'Ancient Humans',
            'format'        => 'landscape',
            'width'         => 1920,
            'height'        => 1080,
            'duration_sec'  => 60,
            'description'   => 'Documentary-style with custom animated figures — storytelling format.',
            'thumbnail_url' => null,
            'scenes'        => ['Discovery', 'Question', 'Twist', 'Mechanism', 'Reveal'],
        ],
        [
            'id'            => 'DreamFilm',
            'name'          => 'Dream Story',
            'format'        => 'landscape',
            'width'         => 1920,
            'height'        => 1080,
            'duration_sec'  => 49,
            'description'   => 'Kurzgesagt-inspired mascot cartoon — 6 scenes with narration.',
            'thumbnail_url' => null,
            'scenes'        => ['Title', 'Question', 'Memory', 'Creativity', 'Emotion', 'Mystery'],
        ],
        [
            'id'            => 'ShortFilm',
            'name'          => 'Short / Reel',
            'format'        => 'portrait',
            'width'         => 1080,
            'height'        => 1920,
            'duration_sec'  => 30,
            'description'   => 'Vertical format for Reels, Shorts, and TikTok — image backgrounds with text overlays.',
            'thumbnail_url' => null,
            'scenes'        => ['Intro', 'Main', 'CTA'],
        ],
        [
            'id'            => 'AdFilm',
            'name'          => 'Product Ad (15s)',
            'format'        => 'ad',
            'width'         => 1080,
            'height'        => 1920,
            'duration_sec'  => 15,
            'description'   => '15-second product advertisement — intro, showcase, CTA.',
            'thumbnail_url' => null,
            'scenes'        => ['Intro (5s)', 'Showcase (7s)', 'CTA (3s)'],
        ],
    ];

    public function index(): JsonResponse
    {
        return response()->json($this->templates);
    }
}
