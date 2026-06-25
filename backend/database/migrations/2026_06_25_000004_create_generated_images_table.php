<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('generated_images', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('project_id')->nullable()->constrained()->onDelete('set null');
            $table->text('prompt');
            $table->enum('provider', ['pollinations', 'gemini', 'cloudflare', 'huggingface']);
            $table->string('file_path', 512);
            $table->unsignedSmallInteger('width')->default(1024);
            $table->unsignedSmallInteger('height')->default(1024);
            $table->timestamps();
            $table->index(['user_id', 'project_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('generated_images');
    }
};
