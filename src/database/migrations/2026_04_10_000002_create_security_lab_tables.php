<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('game_sessions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('stage_code');
            $table->timestamp('started_at');
            $table->timestamp('finished_at')->nullable();
            $table->integer('client_score')->nullable();
            $table->integer('validated_score')->nullable();
            $table->boolean('is_valid')->default(false);
            $table->json('meta_json')->nullable();
            $table->timestamps();
        });

        Schema::create('high_scores', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('stage_code');
            $table->integer('score');
            $table->text('comment')->nullable();
            $table->timestamps();
        });

        Schema::create('stage_progresses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('stage_code');
            $table->boolean('vuln_viewed')->default(false);
            $table->boolean('fixed_viewed')->default(false);
            $table->boolean('completed')->default(false);
            $table->timestamps();

            $table->unique(['user_id', 'stage_code']);
        });

        Schema::create('audit_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->string('action');
            $table->string('target_type')->nullable();
            $table->string('target_id')->nullable();
            $table->json('meta_json')->nullable();
            $table->timestamp('created_at')->useCurrent();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('audit_logs');
        Schema::dropIfExists('stage_progresses');
        Schema::dropIfExists('high_scores');
        Schema::dropIfExists('game_sessions');
    }
};
