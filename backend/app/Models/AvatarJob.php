<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

class AvatarJob extends Model
{
    protected $fillable = [
        'user_id', 'project_id', 'scene_id',
        'face_image_path', 'audio_path',
        'status', 'output_video_path', 'output_video_url',
        'duration_sec', 'log', 'started_at', 'completed_at',
    ];

    protected $casts = [
        'started_at'   => 'datetime',
        'completed_at' => 'datetime',
        'duration_sec' => 'float',
    ];

    public function user(): BelongsTo    { return $this->belongsTo(User::class); }
    public function project(): BelongsTo { return $this->belongsTo(Project::class); }
}
