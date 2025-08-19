<?php

namespace App\Http\Controllers;

use App\Models\BenchmarkResult;
use App\Models\Log;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class BenchmarkController extends Controller
{
    /**
     * Run performance benchmark tests
     */
    public function runBenchmark(Request $request)
    {
        $stage = $request->get('stage', BenchmarkResult::STAGE_BASELINE);
        $iterations = $request->get('iterations', 3);
        
        $testResults = [];
        
        // Define benchmark queries
        $queries = [
            'dashboard_stats' => 'Basic dashboard statistics',
            'methods_distribution' => 'HTTP methods distribution',
            'top_urls' => 'Top URLs analysis',
            'complex_analytics' => 'Complex multi-group analytics',
            'timeline_analysis' => 'Timeline hourly breakdown'
        ];
        
        foreach ($queries as $queryType => $description) {
            $queryResults = [];
            
            for ($i = 0; $i < $iterations; $i++) {
                $result = $this->executeQuery($queryType);
                $queryResults[] = $result;
            }
            
            // Calculate statistics
            $executionTimes = array_column($queryResults, 'execution_time');
            $recordsCounts = array_column($queryResults, 'records_processed');
            
            $testResults[] = [
                'query_type' => $queryType,
                'description' => $description,
                'iterations' => $iterations,
                'avg_execution_time' => round(array_sum($executionTimes) / count($executionTimes), 2),
                'min_execution_time' => min($executionTimes),
                'max_execution_time' => max($executionTimes),
                'avg_records_processed' => round(array_sum($recordsCounts) / count($recordsCounts)),
                'query_results' => $queryResults
            ];
        }
        
        // Store benchmark results
        $benchmarkResult = BenchmarkResult::create([
            'stage' => $stage,
            'query_count' => count($queries) * $iterations,
            'total_execution_time' => array_sum(array_column($testResults, 'avg_execution_time')),
            'avg_execution_time' => round(array_sum(array_column($testResults, 'avg_execution_time')) / count($testResults), 2),
            'records_processed' => array_sum(array_column($testResults, 'avg_records_processed')),
            'results_data' => json_encode($testResults),
            'created_at' => now(),
            'updated_at' => now()
        ]);
        
        return response()->json([
            'status' => 'success',
            'data' => [
                'benchmark_id' => $benchmarkResult->id,
                'stage' => $stage,
                'summary' => [
                    'total_queries' => count($queries) * $iterations,
                    'avg_execution_time' => $benchmarkResult->avg_execution_time,
                    'total_execution_time' => $benchmarkResult->total_execution_time,
                    'records_processed' => $benchmarkResult->records_processed
                ],
                'detailed_results' => $testResults
            ]
        ]);
    }
    
    /**
     * Compare benchmark results between stages
     */
    public function compareStages(Request $request)
    {
        $baselineStage = $request->get('baseline', BenchmarkResult::STAGE_BASELINE);
        $compareStage = $request->get('compare', BenchmarkResult::STAGE_INDEXING);
        
        $baseline = BenchmarkResult::where('stage', $baselineStage)
            ->latest()
            ->first();
            
        $comparison = BenchmarkResult::where('stage', $compareStage)
            ->latest()
            ->first();
            
        if (!$baseline || !$comparison) {
            return response()->json([
                'status' => 'error',
                'message' => 'Benchmark data not found for comparison'
            ], 404);
        }
        
        $improvementPercentage = $this->calculateImprovement(
            $baseline->avg_execution_time,
            $comparison->avg_execution_time
        );
        
        return response()->json([
            'status' => 'success',
            'data' => [
                'baseline' => [
                    'stage' => $baseline->stage,
                    'avg_execution_time' => $baseline->avg_execution_time,
                    'total_execution_time' => $baseline->total_execution_time,
                    'created_at' => $baseline->created_at
                ],
                'comparison' => [
                    'stage' => $comparison->stage,
                    'avg_execution_time' => $comparison->avg_execution_time,
                    'total_execution_time' => $comparison->total_execution_time,
                    'created_at' => $comparison->created_at
                ],
                'improvement' => [
                    'percentage' => $improvementPercentage,
                    'absolute_ms' => round($baseline->avg_execution_time - $comparison->avg_execution_time, 2),
                    'is_improvement' => $improvementPercentage > 0
                ]
            ]
        ]);
    }
    
    /**
     * Get all benchmark results
     */
    public function getAllResults()
    {
        $results = BenchmarkResult::orderBy('created_at', 'desc')->get();
        
        $groupedByStage = $results->groupBy('stage')->map(function($stageResults) {
            return $stageResults->map(function($result) {
                return [
                    'id' => $result->id,
                    'avg_execution_time' => $result->avg_execution_time,
                    'total_execution_time' => $result->total_execution_time,
                    'query_count' => $result->query_count,
                    'records_processed' => $result->records_processed,
                    'created_at' => $result->created_at
                ];
            });
        });
        
        return response()->json([
            'status' => 'success',
            'data' => $groupedByStage
        ]);
    }
    
    /**
     * Get benchmark result details
     */
    public function getResultDetails($id)
    {
        $result = BenchmarkResult::find($id);
        
        if (!$result) {
            return response()->json([
                'status' => 'error',
                'message' => 'Benchmark result not found'
            ], 404);
        }
        
        return response()->json([
            'status' => 'success',
            'data' => [
                'id' => $result->id,
                'stage' => $result->stage,
                'avg_execution_time' => $result->avg_execution_time,
                'total_execution_time' => $result->total_execution_time,
                'query_count' => $result->query_count,
                'records_processed' => $result->records_processed,
                'detailed_results' => json_decode($result->results_data, true),
                'created_at' => $result->created_at
            ]
        ]);
    }
    
    /**
     * Test database connection and basic performance
     */
    public function healthCheck()
    {
        $startTime = microtime(true);
        
        try {
            // Basic connectivity test
            $totalLogs = Log::count();
            
            // Simple query test
            $recentLogs = Log::latest()->limit(10)->count();
            
            // Aggregation test
            $methodsCount = Log::distinct('method')->count();
            
            $executionTime = (microtime(true) - $startTime) * 1000;
            
            return response()->json([
                'status' => 'success',
                'data' => [
                    'database_status' => 'connected',
                    'total_logs' => $totalLogs,
                    'recent_logs_sample' => $recentLogs,
                    'unique_methods' => $methodsCount,
                    'health_check_time_ms' => round($executionTime, 2)
                ]
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage()
            ], 500);
        }
    }
    
    // Private helper methods
    private function executeQuery($queryType)
    {
        $startTime = microtime(true);
        $recordsProcessed = 0;
        
        switch ($queryType) {
            case 'dashboard_stats':
                $recordsProcessed = Log::where('created_at', '>=', Carbon::now()->subDays(7))->count();
                Log::where('created_at', '>=', Carbon::now()->subDays(7))
                    ->selectRaw('COUNT(*) as total, AVG(response_time) as avg_time')
                    ->first();
                break;
                
            case 'methods_distribution':
                $result = Log::select('method', DB::raw('COUNT(*) as count'))
                    ->groupBy('method')
                    ->get();
                $recordsProcessed = $result->sum('count');
                break;
                
            case 'top_urls':
                $result = Log::select('url', DB::raw('COUNT(*) as requests'))
                    ->groupBy('url')
                    ->orderBy('requests', 'desc')
                    ->limit(20)
                    ->get();
                $recordsProcessed = $result->sum('requests');
                break;
                
            case 'complex_analytics':
                $result = Log::where('created_at', '>=', Carbon::now()->subDays(30))
                    ->selectRaw('DATE(created_at) as date, method, status, COUNT(*) as requests, AVG(response_time) as avg_time')
                    ->groupBy(['date', 'method', 'status'])
                    ->get();
                $recordsProcessed = $result->sum('requests');
                break;
                
            case 'timeline_analysis':
                $result = Log::where('created_at', '>=', Carbon::now()->subDays(1))
                    ->selectRaw('DATE_FORMAT(created_at, "%Y-%m-%d %H:00:00") as hour, COUNT(*) as requests')
                    ->groupBy('hour')
                    ->get();
                $recordsProcessed = $result->sum('requests');
                break;
        }
        
        $executionTime = (microtime(true) - $startTime) * 1000;
        
        return [
            'execution_time' => round($executionTime, 2),
            'records_processed' => $recordsProcessed
        ];
    }
    
    private function calculateImprovement($baseline, $comparison)
    {
        if ($baseline == 0) return 0;
        return round((($baseline - $comparison) / $baseline) * 100, 2);
    }
}
