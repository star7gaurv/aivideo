<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('projects', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('title');
            $table->enum('format', ['landscape', 'portrait', 'ad'])->default('landscape');
            $table->string('template_id', 64);
            $table->json('config')->nullable();
            $table->enum('status', ['draft', 'rendering', 'done', 'failed'])->default('draft');
            $table->string('output_path', 512)->nullable();
            $table->timestamps();
            $table->index('user_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('projects');
    }
};
