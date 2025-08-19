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
        Schema::create('benchmark_results', function (Blueprint $table) {
            $table->id();
            // Columns used by BenchmarkController
            $table->string('stage')->index(); // baseline, indexing, caching, partitioning, pre_aggregation
            $table->integer('query_count')->index();
            $table->float('total_execution_time');
            $table->float('avg_execution_time');
            $table->bigInteger('records_processed')->index();
            $table->json('results_data');
            $table->timestamps();
            
            // Composite indexes for common queries
            $table->index(['stage', 'avg_execution_time']);
            $table->index(['created_at', 'stage']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('benchmark_results');
    }
};
