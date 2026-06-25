<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PublishJob extends Model
{
    protected $fillable = [
        'user_id', 'project_id', 'render_job_id', 'platform',
        'status', 'title', 'description',
        'platform_video_id', 'platform_url', 'log', 'published_at',
    ];

    protected $casts = [
        'published_at' => 'datetime',
    ];

    public function user(): BelongsTo    { return $this->belongsTo(User::class); }
    public function project(): BelongsTo { return $this->belongsTo(Project::class); }
}
