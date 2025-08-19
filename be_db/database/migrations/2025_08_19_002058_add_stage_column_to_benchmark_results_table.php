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
            $table->string('stage')->after('id')->index(); // Add stage column
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('benchmark_results', function (Blueprint $table) {
            $table->dropColumn('stage');
        });
    }
};
