#!/bin/bash
# One-time script to download free royalty-free music from Mixkit and Pixabay
# All tracks are license-free with no attribution required
# Run from the repo root: bash video-engine/scripts/download-music.sh

DEST="backend/storage/app/public/music"

mkdir -p "$DEST/upbeat" "$DEST/calm" "$DEST/dramatic" "$DEST/corporate" "$DEST/chill" "$DEST/inspirational" "$DEST/ai-generated"

echo "Downloading upbeat tracks..."
curl -L -o "$DEST/upbeat/mixkit-energetic-corporate-loop.mp3" "https://cdn.mixkit.co/music/preview/mixkit-tech-house-vibes-130.mp3"
curl -L -o "$DEST/upbeat/pixabay-bright-morning.mp3" "https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0c6ff1bab.mp3"
curl -L -o "$DEST/upbeat/mixkit-happy-pop-groove.mp3" "https://cdn.mixkit.co/music/preview/mixkit-happy-bits-109.mp3"
curl -L -o "$DEST/upbeat/pixabay-motivational-beats.mp3" "https://cdn.pixabay.com/download/audio/2022/03/15/audio_8cb749d5d5.mp3"
curl -L -o "$DEST/upbeat/mixkit-fun-summer-vibes.mp3" "https://cdn.mixkit.co/music/preview/mixkit-summer-fun-13.mp3"

echo "Downloading calm tracks..."
curl -L -o "$DEST/calm/mixkit-soft-piano-breeze.mp3" "https://cdn.mixkit.co/music/preview/mixkit-relaxing-in-nature-522.mp3"
curl -L -o "$DEST/calm/pixabay-peaceful-meditation.mp3" "https://cdn.pixabay.com/download/audio/2022/03/10/audio_1a609c5533.mp3"
curl -L -o "$DEST/calm/mixkit-gentle-acoustic.mp3" "https://cdn.mixkit.co/music/preview/mixkit-just-kidding-8.mp3"
curl -L -o "$DEST/calm/pixabay-ambient-flow.mp3" "https://cdn.pixabay.com/download/audio/2021/10/25/audio_ded12b1898.mp3"
curl -L -o "$DEST/calm/mixkit-serene-strings.mp3" "https://cdn.mixkit.co/music/preview/mixkit-serene-view-443.mp3"

echo "Downloading dramatic tracks..."
curl -L -o "$DEST/dramatic/pixabay-epic-cinematic-rise.mp3" "https://cdn.pixabay.com/download/audio/2022/08/02/audio_2dde668d05.mp3"
curl -L -o "$DEST/dramatic/mixkit-tense-documentary-score.mp3" "https://cdn.mixkit.co/music/preview/mixkit-dramatic-documentary-score-30.mp3"
curl -L -o "$DEST/dramatic/pixabay-orchestral-power.mp3" "https://cdn.pixabay.com/download/audio/2022/01/20/audio_d3b8bfe891.mp3"
curl -L -o "$DEST/dramatic/mixkit-dark-thriller.mp3" "https://cdn.mixkit.co/music/preview/mixkit-cinematic-mystery-suspense-68.mp3"
curl -L -o "$DEST/dramatic/pixabay-suspense-build.mp3" "https://cdn.pixabay.com/download/audio/2022/03/24/audio_c8f3d53949.mp3"

echo "Downloading corporate tracks..."
curl -L -o "$DEST/corporate/pixabay-professional-presentation.mp3" "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3"
curl -L -o "$DEST/corporate/mixkit-business-innovation.mp3" "https://cdn.mixkit.co/music/preview/mixkit-business-casual-73.mp3"
curl -L -o "$DEST/corporate/pixabay-clean-corporate-tech.mp3" "https://cdn.pixabay.com/download/audio/2021/11/25/audio_910944d8f8.mp3"
curl -L -o "$DEST/corporate/mixkit-success-story.mp3" "https://cdn.mixkit.co/music/preview/mixkit-corporate-approach-23.mp3"
curl -L -o "$DEST/corporate/pixabay-modern-minimal.mp3" "https://cdn.pixabay.com/download/audio/2022/02/22/audio_d1718ab41b.mp3"

echo "Downloading chill tracks..."
curl -L -o "$DEST/chill/pixabay-lofi-study-beats.mp3" "https://cdn.pixabay.com/download/audio/2022/05/17/audio_69a61cd6d6.mp3"
curl -L -o "$DEST/chill/mixkit-coffee-house-jazz.mp3" "https://cdn.mixkit.co/music/preview/mixkit-coffee-house-background-552.mp3"
curl -L -o "$DEST/chill/pixabay-sunset-groove.mp3" "https://cdn.pixabay.com/download/audio/2022/04/27/audio_67f8573b6b.mp3"
curl -L -o "$DEST/chill/mixkit-easy-listening.mp3" "https://cdn.mixkit.co/music/preview/mixkit-chill-guitar-background-544.mp3"
curl -L -o "$DEST/chill/pixabay-mellow-afternoon.mp3" "https://cdn.pixabay.com/download/audio/2022/03/19/audio_28e74a6490.mp3"

echo "Downloading inspirational tracks..."
curl -L -o "$DEST/inspirational/pixabay-rise-and-shine.mp3" "https://cdn.pixabay.com/download/audio/2022/01/27/audio_d0c6ff1bab.mp3"
curl -L -o "$DEST/inspirational/mixkit-dream-big.mp3" "https://cdn.mixkit.co/music/preview/mixkit-inspiring-innovation-267.mp3"
curl -L -o "$DEST/inspirational/pixabay-hopeful-journey.mp3" "https://cdn.pixabay.com/download/audio/2021/08/04/audio_c8111e5a76.mp3"
curl -L -o "$DEST/inspirational/mixkit-uplifting-triumph.mp3" "https://cdn.mixkit.co/music/preview/mixkit-life-is-a-dream-837.mp3"
curl -L -o "$DEST/inspirational/pixabay-new-beginnings.mp3" "https://cdn.pixabay.com/download/audio/2022/06/08/audio_6d09edcf09.mp3"

echo "Done! All music tracks downloaded to $DEST"
echo "Now run: php artisan db:seed --class=MusicTrackSeeder"
