<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Project extends Model
{
    protected $fillable = [
        'user_id', 'title', 'format', 'template_id', 'config', 'status', 'output_path',
    ];

    protected $casts = [
        'config' => 'array',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function renderJobs(): HasMany
    {
        return $this->hasMany(RenderJob::class);
    }

    public function generatedImages(): HasMany
    {
        return $this->hasMany(GeneratedImage::class);
    }

    public function publishJobs(): HasMany
    {
        return $this->hasMany(PublishJob::class);
    }
}
