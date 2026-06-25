#!/usr/bin/env python3
"""
Upload a video to YouTube via the YouTube Data API v3.
Uses an existing OAuth2 access_token (token refresh is handled by Laravel).

Usage:
  python3 publish-youtube.py \
    --video /path/to/output.mp4 \
    --access-token ya29.xxx \
    --metadata '{"title":"My Video","description":"...","privacyStatus":"public"}'

Prints JSON: { "id": "dQw4w9WgXcQ" }
Exits 0 on success, 1 on failure.

Requires: pip install google-api-python-client
"""

import sys, json, argparse

def parse_args():
    p = argparse.ArgumentParser()
    p.add_argument("--video",        required=True)
    p.add_argument("--access-token", required=True, dest="access_token")
    p.add_argument("--metadata",     default="{}")
    return p.parse_args()

def main():
    args     = parse_args()
    metadata = json.loads(args.metadata)

    try:
        from googleapiclient.discovery import build
        from googleapiclient.http import MediaFileUpload
        from google.oauth2.credentials import Credentials
    except ImportError:
        print(json.dumps({"error": "Missing dependency: pip install google-api-python-client google-auth"}))
        sys.exit(1)

    creds = Credentials(token=args.access_token)
    yt    = build("youtube", "v3", credentials=creds, cache_discovery=False)

    body = {
        "snippet": {
            "title":       metadata.get("title", "Untitled Video"),
            "description": metadata.get("description", ""),
            "tags":        metadata.get("tags", []),
            "categoryId":  metadata.get("categoryId", "22"),  # 22 = People & Blogs
        },
        "status": {
            "privacyStatus":           metadata.get("privacyStatus", "public"),
            "selfDeclaredMadeForKids": False,
        },
    }

    media = MediaFileUpload(
        args.video,
        mimetype="video/mp4",
        resumable=True,
        chunksize=10 * 1024 * 1024,  # 10 MB chunks
    )

    print("[YouTube] Starting upload...", file=sys.stderr)

    request  = yt.videos().insert(part="snippet,status", body=body, media_body=media)
    response = None

    while response is None:
        status, response = request.next_chunk()
        if status:
            pct = int(status.progress() * 100)
            print(f"[YouTube] Uploading... {pct}%", file=sys.stderr)

    video_id = response.get("id")
    if not video_id:
        print(json.dumps({"error": f"Upload completed but no video ID returned: {response}"}))
        sys.exit(1)

    print(f"[YouTube] Done → https://www.youtube.com/watch?v={video_id}", file=sys.stderr)
    print(json.dumps({"id": video_id}))

if __name__ == "__main__":
    main()
