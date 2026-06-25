<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('social_accounts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->enum('platform', ['youtube', 'instagram', 'tiktok']);
            $table->text('access_token');          // encrypted at rest
            $table->text('refresh_token')->nullable();
            $table->timestamp('token_expires_at')->nullable();
            $table->string('platform_user_id', 128)->nullable();
            $table->string('platform_username', 128)->nullable();
            $table->string('platform_channel_id', 128)->nullable(); // YouTube channel ID
            $table->timestamps();
            $table->unique(['user_id', 'platform']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('social_accounts');
    }
};
