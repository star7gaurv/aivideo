<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SocialAccount;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class SocialController extends Controller
{
    /**
     * List all connected platforms for the current user.
     */
    public function accounts()
    {
        $accounts = SocialAccount::where('user_id', auth()->id())
            ->get(['id', 'platform', 'platform_username', 'platform_channel_id', 'token_expires_at', 'created_at']);

        return response()->json($accounts);
    }

    /**
     * Initiate OAuth flow — returns the URL the frontend should redirect to.
     * Frontend opens this in a popup; the popup then calls the callback endpoint.
     */
    public function connect(string $platform, Request $request)
    {
        $redirectUri = route('social.callback', $platform);

        $url = match ($platform) {
            'youtube' => $this->youtubeAuthUrl($redirectUri),
            'instagram' => $this->instagramAuthUrl($redirectUri),
            default => abort(422, "Unsupported platform: {$platform}"),
        };

        return response()->json(['url' => $url]);
    }

    /**
     * OAuth callback — exchange code for tokens, store, close popup.
     */
    public function callback(string $platform, Request $request)
    {
        $code        = $request->query('code');
        $redirectUri = route('social.callback', $platform);

        if (!$code) {
            return response('<script>window.close();</script>', 400)->header('Content-Type', 'text/html');
        }

        try {
            $tokens = match ($platform) {
                'youtube'   => $this->youtubeExchange($code, $redirectUri),
                'instagram' => $this->instagramExchange($code, $redirectUri),
                default     => throw new \InvalidArgumentException("Unknown platform"),
            };
        } catch (\Throwable $e) {
            return response(
                "<script>window.opener?.postMessage({error:'" . addslashes($e->getMessage()) . "'},'*');window.close();</script>",
                400
            )->header('Content-Type', 'text/html');
        }

        SocialAccount::updateOrCreate(
            ['user_id' => auth()->id(), 'platform' => $platform],
            $tokens
        );

        // Close the popup and notify the parent window
        return response(
            "<script>window.opener?.postMessage({success:true,platform:'{$platform}'},'*');window.close();</script>"
        )->header('Content-Type', 'text/html');
    }

    /**
     * Disconnect (delete) a platform account.
     */
    public function disconnect(string $platform)
    {
        SocialAccount::where('user_id', auth()->id())
            ->where('platform', $platform)
            ->delete();

        return response()->json(['disconnected' => $platform]);
    }

    // ── OAuth helpers ──────────────────────────────────────────────────────────

    private function youtubeAuthUrl(string $redirectUri): string
    {
        $params = http_build_query([
            'client_id'     => config('services.google.client_id'),
            'redirect_uri'  => $redirectUri,
            'response_type' => 'code',
            'scope'         => 'https://www.googleapis.com/auth/youtube.upload https://www.googleapis.com/auth/youtube.readonly',
            'access_type'   => 'offline',
            'prompt'        => 'consent',
        ]);
        return "https://accounts.google.com/o/oauth2/v2/auth?{$params}";
    }

    private function youtubeExchange(string $code, string $redirectUri): array
    {
        $resp = Http::post('https://oauth2.googleapis.com/token', [
            'code'          => $code,
            'client_id'     => config('services.google.client_id'),
            'client_secret' => config('services.google.client_secret'),
            'redirect_uri'  => $redirectUri,
            'grant_type'    => 'authorization_code',
        ]);

        if (!$resp->successful()) {
            throw new \RuntimeException('Google token exchange failed: ' . $resp->body());
        }

        // Fetch channel info
        $channelResp = Http::withToken($resp->json('access_token'))
            ->get('https://www.googleapis.com/youtube/v3/channels', ['part' => 'snippet', 'mine' => 'true']);

        $channel = $channelResp->json('items.0');

        return [
            'access_token'      => $resp->json('access_token'),
            'refresh_token'     => $resp->json('refresh_token'),
            'token_expires_at'  => now()->addSeconds($resp->json('expires_in', 3600)),
            'platform_user_id'  => $channel['id'] ?? null,
            'platform_username' => $channel['snippet']['title'] ?? null,
            'platform_channel_id' => $channel['id'] ?? null,
        ];
    }

    private function instagramAuthUrl(string $redirectUri): string
    {
        $params = http_build_query([
            'client_id'     => config('services.facebook.client_id'),
            'redirect_uri'  => $redirectUri,
            'response_type' => 'code',
            'scope'         => 'instagram_basic,instagram_content_publish,pages_read_engagement',
        ]);
        return "https://www.facebook.com/v19.0/dialog/oauth?{$params}";
    }

    private function instagramExchange(string $code, string $redirectUri): array
    {
        // Exchange code for short-lived token
        $resp = Http::post('https://graph.facebook.com/v19.0/oauth/access_token', [
            'client_id'     => config('services.facebook.client_id'),
            'client_secret' => config('services.facebook.client_secret'),
            'redirect_uri'  => $redirectUri,
            'code'          => $code,
        ]);

        if (!$resp->successful()) {
            throw new \RuntimeException('Facebook token exchange failed: ' . $resp->body());
        }

        $shortToken = $resp->json('access_token');

        // Exchange for long-lived token (60 days)
        $longResp = Http::get('https://graph.facebook.com/v19.0/oauth/access_token', [
            'grant_type'        => 'fb_exchange_token',
            'client_id'         => config('services.facebook.client_id'),
            'client_secret'     => config('services.facebook.client_secret'),
            'fb_exchange_token' => $shortToken,
        ]);

        $longToken = $longResp->json('access_token');

        // Fetch IG business account
        $meResp = Http::get('https://graph.facebook.com/v19.0/me/accounts', [
            'access_token' => $longToken,
            'fields'       => 'instagram_business_account,name',
        ]);

        $page  = $meResp->json('data.0');
        $igId  = $page['instagram_business_account']['id'] ?? null;
        $igName = $page['name'] ?? null;

        return [
            'access_token'     => $longToken,
            'refresh_token'    => null,
            'token_expires_at' => now()->addDays(60),
            'platform_user_id' => $igId,
            'platform_username' => $igName,
        ];
    }
}
