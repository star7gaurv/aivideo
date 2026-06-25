# AI Video Studio — CLAUDE.md

## Project overview

Full-stack AI video creation platform. Users create, render, and publish professional videos (long-form 16:9, portrait Reels 9:16, 15-second ads). All AI features run free via open-source models or free API tiers.

## Stack

| Layer | Tech |
|---|---|
| Frontend | Next.js 15.3 + React 19, Tailwind CSS 4, Zustand, TanStack Query, Howler.js |
| Backend | Laravel 11 + Wave SaaS, JWT auth (tymon/jwt-auth), Redis queue |
| Video engine | Remotion 4, FFmpeg 8.1.1 |
| TTS | Piper TTS (offline, ryan.onnx) |
| Talking avatar | SadTalker via HuggingFace Spaces (gradio_client, free) |
| Image gen | Pollinations.ai (free, no key), Gemini API, Cloudflare AI, HF Inference |
| Music | Mixkit + Pixabay curated library; Mubert API; MusicGen via HF |
| Publishing | YouTube Data API v3, Instagram Graph API |
| Database | MySQL (dev) / PostgreSQL (prod) |
| Queue | Redis |

## Repo layout

```
aivideo/
├── backend/                   Laravel 11 + Wave SaaS
│   ├── app/
│   │   ├── Http/Controllers/Api/
│   │   │   ├── ProjectController.php
│   │   │   ├── TemplateController.php
│   │   │   ├── MusicController.php
│   │   │   ├── ImageController.php
│   │   │   ├── VideoRenderController.php
│   │   │   ├── TtsController.php
│   │   │   ├── AvatarController.php
│   │   │   ├── SocialController.php      ← OAuth connect/callback
│   │   │   └── PublishController.php
│   │   ├── Jobs/
│   │   │   ├── RenderVideoJob.php        ← shells out to render-worker.js
│   │   │   ├── GenerateMusicJob.php      ← HF MusicGen fallback
│   │   │   ├── GenerateAvatarJob.php     ← SadTalker via gradio_client
│   │   │   └── PublishVideoJob.php       ← YouTube/Instagram upload
│   │   └── Models/
│   │       ├── Project.php, RenderJob.php, MusicTrack.php
│   │       ├── GeneratedImage.php, AvatarJob.php
│   │       ├── SocialAccount.php         ← encrypted OAuth tokens
│   │       └── PublishJob.php
│   ├── database/migrations/   7 new tables (projects → publish_jobs)
│   ├── database/seeders/MusicTrackSeeder.php   (30 free tracks)
│   └── routes/api.php         all v1 routes under auth:api
│
├── frontend/                  Next.js 15
│   └── src/
│       ├── app/
│       │   ├── (auth)/login/              JWT login
│       │   └── (dashboard)/
│       │       ├── layout.tsx             sidebar + auth guard
│       │       ├── projects/page.tsx      project grid
│       │       ├── projects/new/page.tsx  5-step creator wizard
│       │       ├── projects/[id]/page.tsx edit existing project
│       │       └── templates/page.tsx
│       ├── components/dashboard/
│       │   ├── ProjectWizard.tsx          shared 5-step wizard
│       │   ├── FormatPicker.tsx
│       │   ├── TemplateBrowser.tsx
│       │   ├── ContentEditor.tsx          scenes + narration + images + avatar
│       │   ├── MusicPicker.tsx
│       │   ├── PublishPanel.tsx           render + platform publish
│       │   ├── RenderStatus.tsx           polls every 2s
│       │   ├── ImageGenerator.tsx         4-provider modal
│       │   ├── AvatarCreator.tsx          face upload → SadTalker modal
│       │   └── PlatformConnect.tsx        OAuth connect/disconnect
│       ├── lib/
│       │   ├── api.ts                     axios + JWT interceptor
│       │   └── hooks/
│       │       ├── useProjects.ts, useTemplates.ts, useMusicTracks.ts
│       │       ├── useImageGen.ts, useRenderStatus.ts
│       │       ├── useTts.ts, useAvatar.ts, usePublish.ts
│       └── store/projectStore.ts          Zustand project state
│
└── video-engine/remotion-pro/
    ├── src/
    │   ├── Root.tsx             registers all compositions
    │   ├── ShortFilm/           9:16 portrait — scenes with PIP avatar
    │   ├── AdFilm/              9:16 15s ad — intro/main/CTA
    │   ├── SolarFilm/, AncientHumans/, DreamFilm/   existing long-form
    │   └── lib/anim.ts          sceneFade, ramp, floaty helpers
    ├── public/tts/              generated WAV files (gitignored output)
    └── scripts/
        ├── render-worker.js     Remotion programmatic render + FFmpeg mix
        ├── generate-tts.py      Piper TTS per-scene WAV generation
        ├── generate-avatar.py   SadTalker via gradio_client
        └── publish-youtube.py   google-api-python-client resumable upload
```

## Key flows

### Render flow
1. `PublishPanel` → `POST /api/v1/video/render` → `RenderVideoJob` dispatched
2. Job runs: TTS for missing narration → stage avatar MP4s → `node render-worker.js`
3. Worker: bundle → selectComposition → renderMedia (PROGRESS:N stdout) → FFmpeg music mix
4. `RenderStatus` polls every 2s via `GET /api/v1/video/render/{id}/status`

### TTS flow
1. `ContentEditor` "Generate Narration" → `POST /api/v1/tts/generate`
2. `TtsController` calls `generate-tts.py` with scene JSON
3. Piper TTS outputs WAV per scene, measures duration, returns frame counts
4. `ShortFilm` renders `<Audio src={staticFile(narrationAudioPath)} />` per scene

### Avatar flow
1. `AvatarCreator` face upload → `POST /api/v1/avatars`
2. `GenerateAvatarJob` calls `generate-avatar.py` → `gradio_client` → `vinthony/SadTalker`
3. Returns MP4 → stored in `storage/app/public/avatars/{userId}/{jobId}.mp4`
4. `render-worker.js` `stageAvatarAssets()` copies to `remotion-pro/public/` before render
5. `ShortFilm` renders `<Video>` PIP circle (lower-right, accent border)

### Publish flow
1. User connects platform via OAuth popup (`SocialController`)
2. `PublishPanel` "Publish to YouTube/Instagram" → `POST /api/v1/publish`
3. `PublishVideoJob` dispatched — YouTube: `publish-youtube.py` (resumable upload); Instagram: Graph API container → poll → publish
4. Status polls every 4s

## Running locally

```bash
# Backend
cd backend
composer install
cp .env.example .env          # fill in DB + required keys
php artisan key:generate
php artisan migrate
php artisan db:seed --class=MusicTrackSeeder
php artisan storage:link
php artisan serve             # http://localhost:8000

# Queue worker (separate terminal)
php artisan queue:work redis --tries=1 --timeout=900

# Frontend
cd frontend
npm install
npm run dev                   # http://localhost:3000

# Music library (one-time)
bash video-engine/scripts/download-music.sh

# Piper voice model (one-time, for TTS)
bash video-engine/scripts/download-voice.sh
pip install piper-tts

# Python deps (for avatar + publishing)
pip install gradio_client google-api-python-client google-auth
```

## API routes (all under `/api/v1`, JWT required)

```
GET/POST/PUT/DELETE  /projects{/id}
GET                  /templates
GET                  /music?mood=calm
POST                 /music/generate
GET                  /images
POST                 /images/generate
POST                 /video/render
GET                  /video/render/{id}/status
POST                 /tts/generate
GET                  /tts/voices
POST                 /avatars
GET                  /avatars
GET                  /avatars/{id}/status
GET                  /social/accounts
GET                  /social/connect/{platform}
DELETE               /social/{platform}
POST                 /publish
GET                  /publish
GET                  /publish/{id}/status
```

## Environment variables

See `backend/.env.example` for the full list. Keys split into:
- **Required locally**: `APP_KEY`, `DB_*`, `QUEUE_CONNECTION=redis`, `VIDEO_ENGINE_PATH`, `FFMPEG_PATH`
- **Optional locally** (features degrade gracefully without): `PIPER_VOICE_PATH`, `GEMINI_API_KEY`, `HF_TOKEN`, `MUBERT_API_KEY`
- **Server only**: `GOOGLE_CLIENT_ID/SECRET`, `FACEBOOK_APP_ID/SECRET`, `CLOUDFLARE_*`

## Remotion compositions

| ID | Format | Resolution | Duration | Notes |
|---|---|---|---|---|
| SolarFilm | landscape | 1920×1080 | ~57s | existing |
| AncientHumans | landscape | 1920×1080 | ~60s | existing |
| DreamFilm | landscape | 1920×1080 | ~49s | existing |
| ShortFilm | portrait | 1080×1920 | dynamic | per-scene TTS + avatar PIP |
| AdFilm | portrait/ad | 1080×1920 | 15s fixed | 3 hardcoded sections |
