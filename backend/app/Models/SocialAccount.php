<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Crypt;

class SocialAccount extends Model
{
    protected $fillable = [
        'user_id', 'platform', 'access_token', 'refresh_token',
        'token_expires_at', 'platform_user_id', 'platform_username', 'platform_channel_id',
    ];

    protected $hidden = ['access_token', 'refresh_token'];

    protected $casts = [
        'token_expires_at' => 'datetime',
    ];

    public function user(): BelongsTo { return $this->belongsTo(User::class); }

    // Encrypt tokens on write, decrypt on read
    public function setAccessTokenAttribute(string $value): void
    {
        $this->attributes['access_token'] = Crypt::encryptString($value);
    }

    public function getAccessTokenAttribute(string $value): string
    {
        return Crypt::decryptString($value);
    }

    public function setRefreshTokenAttribute(?string $value): void
    {
        $this->attributes['refresh_token'] = $value ? Crypt::encryptString($value) : null;
    }

    public function getRefreshTokenAttribute(?string $value): ?string
    {
        return $value ? Crypt::decryptString($value) : null;
    }

    public function isExpired(): bool
    {
        return $this->token_expires_at && $this->token_expires_at->isPast();
    }
}
