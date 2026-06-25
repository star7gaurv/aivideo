<?php

namespace Database\Seeders;

use App\Models\MusicTrack;
use Illuminate\Database\Seeder;

class MusicTrackSeeder extends Seeder
{
    public function run(): void
    {
        // All tracks: Kevin MacLeod (incompetech.com), licensed CC-BY 4.0.
        $tracks = [
            // upbeat
            ['Carefree', 'upbeat', 'carefree.mp3', 209],
            ['Fluffing a Duck', 'upbeat', 'fluffing-a-duck.mp3', 86],
            ['Monkeys Spinning Monkeys', 'upbeat', 'monkeys-spinning-monkeys.mp3', 132],
            ['Itty Bitty 8 Bit', 'upbeat', 'itty-bitty-8-bit.mp3', 102],
            // calm
            ['Pamgaea', 'calm', 'pamgaea.mp3', 224],
            ['Local Forecast (Elevator)', 'calm', 'local-forecast-elevator.mp3', 175],
            ['Wholesome', 'calm', 'wholesome.mp3', 138],
            // dramatic
            ['Heroic Age', 'dramatic', 'heroic-age.mp3', 154],
            ['Darkest Child', 'dramatic', 'darkest-child.mp3', 230],
            ['Long Note Three', 'dramatic', 'long-note-three.mp3', 180],
            // corporate
            ['Inspired', 'corporate', 'inspired.mp3', 173],
            ['The Builder', 'corporate', 'the-builder.mp3', 120],
            ['Wallpaper', 'corporate', 'wallpaper.mp3', 100],
            // chill
            ['Lobby Time', 'chill', 'lobby-time.mp3', 121],
            ['Bossa Antigua', 'chill', 'bossa-antigua.mp3', 222],
            ['Sneaky Snitch', 'chill', 'sneaky-snitch.mp3', 154],
            // inspirational
            ['Rising Tide', 'inspirational', 'rising-tide.mp3', 130],
            ['Hero Theme', 'inspirational', 'hero-theme.mp3', 156],
            ['New Friendly', 'inspirational', 'new-friendly.mp3', 110],
            ['Salty Ditty', 'inspirational', 'salty-ditty.mp3', 95],
        ];

        MusicTrack::query()->where('is_ai_generated', false)->delete();

        foreach ($tracks as [$title, $mood, $file, $dur]) {
            MusicTrack::create([
                'title'            => $title,
                'artist'           => 'Kevin MacLeod',
                'mood'             => $mood,
                'source'           => 'custom',
                'duration_seconds' => $dur,
                'file_path'        => "music/{$mood}/{$file}",
                'is_ai_generated'  => false,
            ]);
        }
    }
}
