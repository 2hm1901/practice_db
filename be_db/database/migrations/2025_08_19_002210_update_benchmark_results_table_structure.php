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
        Schema::table('benchmark_results', function (Blueprint $table) {
            // Add new columns needed by BenchmarkController
            $table->integer('query_count')->after('optimization_stage')->index();
            $table->float('total_execution_time')->after('query_count');
            $table->float('avg_execution_time')->after('total_execution_time');
            $table->bigInteger('records_processed')->after('avg_execution_time')->index();
            $table->json('results_data')->after('records_processed');
            
            // Rename optimization_stage to stage for consistency with controller
            $table->renameColumn('optimization_stage', 'stage');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('benchmark_results', function (Blueprint $table) {
            // Remove added columns
            $table->dropColumn(['query_count', 'total_execution_time', 'avg_execution_time', 'records_processed', 'results_data']);
            
            // Rename back to original name
            $table->renameColumn('stage', 'optimization_stage');
        });
    }
};
