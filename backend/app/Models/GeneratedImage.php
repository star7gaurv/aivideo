<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

class GeneratedImage extends Model
{
    protected $fillable = [
        'user_id', 'project_id', 'prompt', 'provider', 'file_path', 'width', 'height',
    ];

    protected $appends = ['url'];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function getUrlAttribute(): ?string
    {
        if (empty($this->file_path)) return null;
        return Storage::disk('public')->url($this->file_path);
    }
}
