<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('music_tracks', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('artist')->nullable();
            $table->enum('mood', ['upbeat', 'calm', 'dramatic', 'corporate', 'chill', 'inspirational']);
            $table->enum('source', ['mixkit', 'pixabay', 'mubert', 'musicgen', 'custom']);
            $table->unsignedSmallInteger('duration_seconds');
            $table->string('file_path', 512);
            $table->string('preview_url', 512)->nullable();
            $table->boolean('is_ai_generated')->default(false);
            $table->timestamps();
            $table->index('mood');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('music_tracks');
    }
};
