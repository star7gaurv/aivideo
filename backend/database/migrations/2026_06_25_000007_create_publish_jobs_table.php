<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('publish_jobs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('project_id')->constrained()->onDelete('cascade');
            $table->foreignId('render_job_id')->nullable()->constrained()->onDelete('set null');
            $table->enum('platform', ['youtube', 'instagram', 'tiktok']);
            $table->enum('status', ['queued', 'processing', 'done', 'failed'])->default('queued');
            $table->string('title', 512)->nullable();
            $table->text('description')->nullable();
            $table->string('platform_video_id', 256)->nullable();
            $table->string('platform_url', 512)->nullable();
            $table->text('log')->nullable();
            $table->timestamp('published_at')->nullable();
            $table->timestamps();
            $table->index(['user_id', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('publish_jobs');
    }
};
