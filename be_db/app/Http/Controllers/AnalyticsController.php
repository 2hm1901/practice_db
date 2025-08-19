<?php

namespace App\Http\Controllers;

use App\Models\Log;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;

class AnalyticsController extends Controller
{
    /**
     * Get overall statistics dashboard
     */
    public function dashboard(Request $request)
    {
        $startTime = microtime(true);
        
        try {
            // Get date range filter
            $days = $request->get('days', 7);
            $startDate = Carbon::now()->subDays($days);
            
            // Basic statistics
            $stats = [
                'total_requests' => Log::where('created_at', '>=', $startDate)->count(),
                'unique_ips' => Log::where('created_at', '>=', $startDate)->distinct('ip')->count(),
                'avg_response_time' => Log::where('created_at', '>=', $startDate)->avg('response_time'),
                'success_rate' => $this->getSuccessRate($startDate),
            ];
            
            $executionTime = (microtime(true) - $startTime) * 1000;
            
            return response()->json([
                'status' => 'success',
                'data' => $stats,
                'meta' => [
                    'execution_time_ms' => round($executionTime, 2),
                    'date_range' => "{$days} days",
                    'query_count' => DB::getQueryLog() ? count(DB::getQueryLog()) : 'N/A'
                ]
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage(),
                'execution_time_ms' => round((microtime(true) - $startTime) * 1000, 2)
            ], 500);
        }
    }
    
    /**
     * Get HTTP methods distribution
     */
    public function methodsDistribution(Request $request)
    {
        $startTime = microtime(true);
        
        try {
            $days = $request->get('days', 7);
            $startDate = Carbon::now()->subDays($days);
            
            $methods = Log::select('method', DB::raw('COUNT(*) as count'))
                ->where('created_at', '>=', $startDate)
                ->groupBy('method')
                ->orderBy('count', 'desc')
                ->get();
                
            $total = $methods->sum('count');
            
            $methodsWithPercentage = $methods->map(function($method) use ($total) {
                return [
                    'method' => $method->method,
                    'count' => $method->count,
                    'percentage' => $total > 0 ? round(($method->count / $total) * 100, 2) : 0
                ];
            });
            
            $executionTime = (microtime(true) - $startTime) * 1000;
            
            return response()->json([
                'status' => 'success',
                'data' => $methodsWithPercentage,
                'meta' => [
                    'execution_time_ms' => round($executionTime, 2),
                    'total_requests' => $total
                ]
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error', 
                'message' => $e->getMessage(),
                'execution_time_ms' => round((microtime(true) - $startTime) * 1000, 2)
            ], 500);
        }
    }
    
    /**
     * Get status codes distribution
     */
    public function statusCodesDistribution(Request $request)
    {
        $startTime = microtime(true);
        
        try {
            $days = $request->get('days', 7);
            $startDate = Carbon::now()->subDays($days);
            
            $statuses = Log::select('status', DB::raw('COUNT(*) as count'))
                ->where('created_at', '>=', $startDate)
                ->groupBy('status')
                ->orderBy('count', 'desc')
                ->get();
                
            $total = $statuses->sum('count');
            
            $statusesWithDetails = $statuses->map(function($status) use ($total) {
                return [
                    'status' => $status->status,
                    'count' => $status->count,
                    'percentage' => $total > 0 ? round(($status->count / $total) * 100, 2) : 0,
                    'category' => $this->getStatusCategory($status->status)
                ];
            });
            
            $executionTime = (microtime(true) - $startTime) * 1000;
            
            return response()->json([
                'status' => 'success',
                'data' => $statusesWithDetails,
                'meta' => [
                    'execution_time_ms' => round($executionTime, 2),
                    'total_requests' => $total
                ]
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage(),
                'execution_time_ms' => round((microtime(true) - $startTime) * 1000, 2)
            ], 500);
        }
    }
    
    /**
     * Get top URLs by request count
     */
    public function topUrls(Request $request)
    {
        $startTime = microtime(true);
        
        try {
            $days = $request->get('days', 7);
            $limit = $request->get('limit', 10);
            $startDate = Carbon::now()->subDays($days);
            
            $urls = Log::select('url', DB::raw('COUNT(*) as requests'), DB::raw('AVG(response_time) as avg_response_time'))
                ->where('created_at', '>=', $startDate)
                ->groupBy('url')
                ->orderBy('requests', 'desc')
                ->limit($limit)
                ->get();
                
            $urlsWithDetails = $urls->map(function($url) {
                return [
                    'url' => $url->url,
                    'requests' => $url->requests,
                    'avg_response_time' => round($url->avg_response_time, 2)
                ];
            });
            
            $executionTime = (microtime(true) - $startTime) * 1000;
            
            return response()->json([
                'status' => 'success',
                'data' => $urlsWithDetails,
                'meta' => [
                    'execution_time_ms' => round($executionTime, 2),
                    'limit' => $limit
                ]
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage(),
                'execution_time_ms' => round((microtime(true) - $startTime) * 1000, 2)
            ], 500);
        }
    }
    
    /**
     * Get requests timeline (hourly breakdown)
     */
    public function timeline(Request $request)
    {
        $startTime = microtime(true);
        
        try {
            $days = $request->get('days', 1);
            $startDate = Carbon::now()->subDays($days);
            
            $timeline = Log::select(
                DB::raw('DATE_FORMAT(created_at, "%Y-%m-%d %H:00:00") as hour'),
                DB::raw('COUNT(*) as requests'),
                DB::raw('AVG(response_time) as avg_response_time')
            )
            ->where('created_at', '>=', $startDate)
            ->groupBy('hour')
            ->orderBy('hour')
            ->get();
            
            $timelineData = $timeline->map(function($item) {
                return [
                    'hour' => $item->hour,
                    'requests' => $item->requests,
                    'avg_response_time' => round($item->avg_response_time, 2)
                ];
            });
            
            $executionTime = (microtime(true) - $startTime) * 1000;
            
            return response()->json([
                'status' => 'success',
                'data' => $timelineData,
                'meta' => [
                    'execution_time_ms' => round($executionTime, 2),
                    'hours_count' => $timeline->count()
                ]
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage(),
                'execution_time_ms' => round((microtime(true) - $startTime) * 1000, 2)
            ], 500);
        }
    }
    
    /**
     * Get top IPs by request count
     */
    public function topIps(Request $request)
    {
        $startTime = microtime(true);
        
        try {
            $days = $request->get('days', 7);
            $limit = $request->get('limit', 10);
            $startDate = Carbon::now()->subDays($days);
            
            $ips = Log::select('ip', DB::raw('COUNT(*) as requests'))
                ->where('created_at', '>=', $startDate)
                ->groupBy('ip')
                ->orderBy('requests', 'desc')
                ->limit($limit)
                ->get();
            
            $executionTime = (microtime(true) - $startTime) * 1000;
            
            return response()->json([
                'status' => 'success',
                'data' => $ips,
                'meta' => [
                    'execution_time_ms' => round($executionTime, 2),
                    'limit' => $limit
                ]
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage(),
                'execution_time_ms' => round((microtime(true) - $startTime) * 1000, 2)
            ], 500);
        }
    }
    
    /**
     * Performance-intensive query for benchmarking
     */
    public function complexAnalytics(Request $request)
    {
        $startTime = microtime(true);
        
        try {
            $days = $request->get('days', 30);
            $startDate = Carbon::now()->subDays($days);
            
            // Complex query that joins multiple aggregations
            $result = Log::where('created_at', '>=', $startDate)
                ->selectRaw('
                    DATE(created_at) as date,
                    method,
                    status,
                    COUNT(*) as requests,
                    AVG(response_time) as avg_response_time,
                    MIN(response_time) as min_response_time,
                    MAX(response_time) as max_response_time,
                    COUNT(DISTINCT ip) as unique_ips
                ')
                ->groupBy(['date', 'method', 'status'])
                ->orderBy('date')
                ->orderBy('requests', 'desc')
                ->get();
            
            $executionTime = (microtime(true) - $startTime) * 1000;
            
            return response()->json([
                'status' => 'success',
                'data' => $result,
                'meta' => [
                    'execution_time_ms' => round($executionTime, 2),
                    'records_analyzed' => Log::where('created_at', '>=', $startDate)->count(),
                    'result_count' => $result->count()
                ]
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage(),
                'execution_time_ms' => round((microtime(true) - $startTime) * 1000, 2)
            ], 500);
        }
    }
    
    // Helper methods
    private function getSuccessRate($startDate)
    {
        $total = Log::where('created_at', '>=', $startDate)->count();
        if ($total == 0) return 0;
        
        $successful = Log::where('created_at', '>=', $startDate)
            ->where('status', '>=', 200)
            ->where('status', '<', 400)
            ->count();
            
        return round(($successful / $total) * 100, 2);
    }
    
    private function getStatusCategory($status)
    {
        if ($status >= 200 && $status < 300) return 'Success';
        if ($status >= 300 && $status < 400) return 'Redirection'; 
        if ($status >= 400 && $status < 500) return 'Client Error';
        if ($status >= 500) return 'Server Error';
        return 'Unknown';
    }
}
