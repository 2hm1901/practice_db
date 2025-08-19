<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AnalyticsController;
use App\Http\Controllers\BenchmarkController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('api')->group(function () {
    
    // Analytics Routes
    Route::prefix('analytics')->group(function () {
        Route::get('/dashboard', [AnalyticsController::class, 'dashboard']);
        Route::get('/methods', [AnalyticsController::class, 'methodsDistribution']);
        Route::get('/status-codes', [AnalyticsController::class, 'statusCodesDistribution']);
        Route::get('/top-urls', [AnalyticsController::class, 'topUrls']);
        Route::get('/timeline', [AnalyticsController::class, 'timeline']);
        Route::get('/top-ips', [AnalyticsController::class, 'topIps']);
        Route::get('/complex', [AnalyticsController::class, 'complexAnalytics']);
    });

    // Benchmark Routes
    Route::prefix('benchmark')->group(function () {
        Route::post('/run', [BenchmarkController::class, 'runBenchmark']);
        Route::get('/compare', [BenchmarkController::class, 'compareStages']);
        Route::get('/results', [BenchmarkController::class, 'getAllResults']);
        Route::get('/results/{id}', [BenchmarkController::class, 'getResultDetails']);
        Route::get('/health', [BenchmarkController::class, 'healthCheck']);
    });

    // Quick test route
    Route::get('/test', function () {
        return response()->json([
            'status' => 'success',
            'message' => 'Log Analytics API is working!',
            'timestamp' => now(),
            'database_status' => \App\Models\Log::count() > 0 ? 'ready' : 'empty'
        ]);
    });
});
