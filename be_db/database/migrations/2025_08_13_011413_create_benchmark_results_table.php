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
            $table->string('query_name')->index(); // Name of the query being benchmarked
            $table->float('duration_ms')->index(); // Duration in milliseconds
            $table->text('description')->nullable(); // Description of the benchmark
            $table->enum('optimization_stage', [
                'baseline',
                'indexed', 
                'cached',
                'partitioned',
                'pre_aggregated'
            ])->index(); // Current optimization stage
            $table->bigInteger('dataset_size')->default(0)->index(); // Size of dataset used
            $table->float('memory_usage')->nullable(); // Memory usage in MB
            $table->float('cpu_usage')->nullable(); // CPU usage percentage
            $table->timestamps();
            
            // Composite indexes for common queries
            $table->index(['query_name', 'optimization_stage']);
            $table->index(['optimization_stage', 'duration_ms']);
            $table->index(['created_at', 'query_name']);
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
