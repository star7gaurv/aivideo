<?php

namespace Database\Seeders;

use App\Models\MusicTrack;
use Illuminate\Database\Seeder;

class MusicTrackSeeder extends Seeder
{
    public function run(): void
    {
        $tracks = [
            // UPBEAT
            ['title' => 'Energetic Corporate Loop',    'artist' => 'Mixkit',   'mood' => 'upbeat',        'source' => 'mixkit',  'duration_seconds' => 120, 'file_path' => 'music/upbeat/mixkit-energetic-corporate-loop.mp3'],
            ['title' => 'Bright Morning',              'artist' => 'Pixabay',  'mood' => 'upbeat',        'source' => 'pixabay', 'duration_seconds' => 90,  'file_path' => 'music/upbeat/pixabay-bright-morning.mp3'],
            ['title' => 'Happy Pop Groove',            'artist' => 'Mixkit',   'mood' => 'upbeat',        'source' => 'mixkit',  'duration_seconds' => 105, 'file_path' => 'music/upbeat/mixkit-happy-pop-groove.mp3'],
            ['title' => 'Motivational Beats',          'artist' => 'Pixabay',  'mood' => 'upbeat',        'source' => 'pixabay', 'duration_seconds' => 130, 'file_path' => 'music/upbeat/pixabay-motivational-beats.mp3'],
            ['title' => 'Fun Summer Vibes',            'artist' => 'Mixkit',   'mood' => 'upbeat',        'source' => 'mixkit',  'duration_seconds' => 95,  'file_path' => 'music/upbeat/mixkit-fun-summer-vibes.mp3'],

            // CALM
            ['title' => 'Soft Piano Breeze',           'artist' => 'Mixkit',   'mood' => 'calm',          'source' => 'mixkit',  'duration_seconds' => 150, 'file_path' => 'music/calm/mixkit-soft-piano-breeze.mp3'],
            ['title' => 'Peaceful Meditation',         'artist' => 'Pixabay',  'mood' => 'calm',          'source' => 'pixabay', 'duration_seconds' => 180, 'file_path' => 'music/calm/pixabay-peaceful-meditation.mp3'],
            ['title' => 'Gentle Acoustic',             'artist' => 'Mixkit',   'mood' => 'calm',          'source' => 'mixkit',  'duration_seconds' => 120, 'file_path' => 'music/calm/mixkit-gentle-acoustic.mp3'],
            ['title' => 'Ambient Flow',                'artist' => 'Pixabay',  'mood' => 'calm',          'source' => 'pixabay', 'duration_seconds' => 200, 'file_path' => 'music/calm/pixabay-ambient-flow.mp3'],
            ['title' => 'Serene Strings',              'artist' => 'Mixkit',   'mood' => 'calm',          'source' => 'mixkit',  'duration_seconds' => 135, 'file_path' => 'music/calm/mixkit-serene-strings.mp3'],

            // DRAMATIC
            ['title' => 'Epic Cinematic Rise',         'artist' => 'Pixabay',  'mood' => 'dramatic',      'source' => 'pixabay', 'duration_seconds' => 90,  'file_path' => 'music/dramatic/pixabay-epic-cinematic-rise.mp3'],
            ['title' => 'Tense Documentary Score',     'artist' => 'Mixkit',   'mood' => 'dramatic',      'source' => 'mixkit',  'duration_seconds' => 110, 'file_path' => 'music/dramatic/mixkit-tense-documentary-score.mp3'],
            ['title' => 'Orchestral Power',            'artist' => 'Pixabay',  'mood' => 'dramatic',      'source' => 'pixabay', 'duration_seconds' => 120, 'file_path' => 'music/dramatic/pixabay-orchestral-power.mp3'],
            ['title' => 'Dark Thriller',               'artist' => 'Mixkit',   'mood' => 'dramatic',      'source' => 'mixkit',  'duration_seconds' => 100, 'file_path' => 'music/dramatic/mixkit-dark-thriller.mp3'],
            ['title' => 'Suspense Build',              'artist' => 'Pixabay',  'mood' => 'dramatic',      'source' => 'pixabay', 'duration_seconds' => 85,  'file_path' => 'music/dramatic/pixabay-suspense-build.mp3'],

            // CORPORATE
            ['title' => 'Professional Presentation',   'artist' => 'Pixabay',  'mood' => 'corporate',     'source' => 'pixabay', 'duration_seconds' => 140, 'file_path' => 'music/corporate/pixabay-professional-presentation.mp3'],
            ['title' => 'Business Innovation',         'artist' => 'Mixkit',   'mood' => 'corporate',     'source' => 'mixkit',  'duration_seconds' => 125, 'file_path' => 'music/corporate/mixkit-business-innovation.mp3'],
            ['title' => 'Clean Corporate Tech',        'artist' => 'Pixabay',  'mood' => 'corporate',     'source' => 'pixabay', 'duration_seconds' => 115, 'file_path' => 'music/corporate/pixabay-clean-corporate-tech.mp3'],
            ['title' => 'Success Story',               'artist' => 'Mixkit',   'mood' => 'corporate',     'source' => 'mixkit',  'duration_seconds' => 100, 'file_path' => 'music/corporate/mixkit-success-story.mp3'],
            ['title' => 'Modern Minimal',              'artist' => 'Pixabay',  'mood' => 'corporate',     'source' => 'pixabay', 'duration_seconds' => 130, 'file_path' => 'music/corporate/pixabay-modern-minimal.mp3'],

            // CHILL
            ['title' => 'Lo-Fi Study Beats',           'artist' => 'Pixabay',  'mood' => 'chill',         'source' => 'pixabay', 'duration_seconds' => 180, 'file_path' => 'music/chill/pixabay-lofi-study-beats.mp3'],
            ['title' => 'Coffee House Jazz',           'artist' => 'Mixkit',   'mood' => 'chill',         'source' => 'mixkit',  'duration_seconds' => 150, 'file_path' => 'music/chill/mixkit-coffee-house-jazz.mp3'],
            ['title' => 'Sunset Groove',               'artist' => 'Pixabay',  'mood' => 'chill',         'source' => 'pixabay', 'duration_seconds' => 165, 'file_path' => 'music/chill/pixabay-sunset-groove.mp3'],
            ['title' => 'Easy Listening',              'artist' => 'Mixkit',   'mood' => 'chill',         'source' => 'mixkit',  'duration_seconds' => 140, 'file_path' => 'music/chill/mixkit-easy-listening.mp3'],
            ['title' => 'Mellow Afternoon',            'artist' => 'Pixabay',  'mood' => 'chill',         'source' => 'pixabay', 'duration_seconds' => 175, 'file_path' => 'music/chill/pixabay-mellow-afternoon.mp3'],

            // INSPIRATIONAL
            ['title' => 'Rise and Shine',              'artist' => 'Pixabay',  'mood' => 'inspirational', 'source' => 'pixabay', 'duration_seconds' => 120, 'file_path' => 'music/inspirational/pixabay-rise-and-shine.mp3'],
            ['title' => 'Dream Big',                   'artist' => 'Mixkit',   'mood' => 'inspirational', 'source' => 'mixkit',  'duration_seconds' => 110, 'file_path' => 'music/inspirational/mixkit-dream-big.mp3'],
            ['title' => 'Hopeful Journey',             'artist' => 'Pixabay',  'mood' => 'inspirational', 'source' => 'pixabay', 'duration_seconds' => 145, 'file_path' => 'music/inspirational/pixabay-hopeful-journey.mp3'],
            ['title' => 'Uplifting Triumph',           'artist' => 'Mixkit',   'mood' => 'inspirational', 'source' => 'mixkit',  'duration_seconds' => 130, 'file_path' => 'music/inspirational/mixkit-uplifting-triumph.mp3'],
            ['title' => 'New Beginnings',              'artist' => 'Pixabay',  'mood' => 'inspirational', 'source' => 'pixabay', 'duration_seconds' => 155, 'file_path' => 'music/inspirational/pixabay-new-beginnings.mp3'],
        ];

        foreach ($tracks as $track) {
            MusicTrack::firstOrCreate(
                ['file_path' => $track['file_path']],
                $track
            );
        }
    }
}
