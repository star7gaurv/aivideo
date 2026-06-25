<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('avatar_jobs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('project_id')->nullable()->constrained()->onDelete('set null');
            $table->string('scene_id', 64)->nullable();
            $table->string('face_image_path', 512);
            $table->string('audio_path', 512)->nullable();
            $table->enum('status', ['queued', 'processing', 'done', 'failed'])->default('queued');
            $table->string('output_video_path', 512)->nullable();
            $table->string('output_video_url', 512)->nullable();
            $table->float('duration_sec')->nullable();
            $table->text('log')->nullable();
            $table->timestamp('started_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();
            $table->index(['user_id', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('avatar_jobs');
    }
};
