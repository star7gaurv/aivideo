<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('render_jobs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('project_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->enum('status', ['queued', 'processing', 'done', 'failed'])->default('queued');
            $table->unsignedTinyInteger('progress')->default(0);
            $table->text('log')->nullable();
            $table->timestamp('started_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->string('output_url', 512)->nullable();
            $table->timestamps();
            $table->index('project_id');
            $table->index('user_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('render_jobs');
    }
};
