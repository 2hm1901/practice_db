<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('logs', function (Blueprint $table) {
            $table->id();
            $table->string('ip', 45)->index(); // IPv4/IPv6 support with index
            $table->text('url')->index(); // URL path with index for analytics
            $table->string('method', 10)->default('GET')->index(); // HTTP method
            $table->smallInteger('status')->index(); // HTTP status code
            $table->text('user_agent')->nullable(); // Browser info
            $table->float('response_time')->nullable()->index(); // Response time in ms
            $table->timestamp('created_at')->index(); // Request timestamp with index
            $table->timestamp('updated_at')->nullable();
            
            // Composite indexes for common queries
            $table->index(['status', 'created_at']);
            $table->index(['ip', 'created_at']);
            $table->index(['created_at', 'response_time']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('logs');
    }
};
