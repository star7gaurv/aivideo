<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class MusicTrack extends Model
{
    protected $fillable = [
        'title', 'artist', 'mood', 'source', 'duration_seconds', 'file_path', 'preview_url', 'is_ai_generated',
    ];

    protected $casts = [
        'is_ai_generated' => 'boolean',
    ];

    protected $appends = ['stream_url'];

    public function getStreamUrlAttribute(): ?string
    {
        if (empty($this->file_path)) return null;
        return Storage::disk('public')->url($this->file_path);
    }
}
