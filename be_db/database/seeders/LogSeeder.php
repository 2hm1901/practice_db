<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Log;
use Faker\Factory as Faker;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class LogSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = Faker::create();
        
        // Configuration
        $batchSize = 1000; // Smaller batch size to avoid MySQL prepared statement limit
        $totalRecords = 50000; // Start with 50K records for testing
        $batches = ceil($totalRecords / $batchSize);
        
        $this->command->info("Starting to seed {$totalRecords} log records in {$batches} batches...");
        
        // Common URLs to make data more realistic
        $commonUrls = [
            '/api/users',
            '/api/products',
            '/api/orders',
            '/api/auth/login',
            '/api/auth/logout',
            '/api/dashboard',
            '/api/reports',
            '/api/analytics',
            '/api/settings',
            '/api/notifications',
            '/home',
            '/about',
            '/contact',
            '/products',
            '/product/{id}',
            '/cart',
            '/checkout',
            '/profile',
            '/search',
            '/category/{slug}',
        ];
        
        // Common User Agents
        $userAgents = [
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/91.0.4472.124',
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/91.0.4472.124',
            'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/91.0.4472.124',
            'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15',
            'Mozilla/5.0 (iPad; CPU OS 14_6 like Mac OS X) AppleWebKit/605.1.15',
            'Mozilla/5.0 (Android 11; Mobile; rv:89.0) Gecko/89.0 Firefox/89.0',
        ];
        
        // HTTP Methods distribution (realistic)
        $methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];
        $methodWeights = [70, 15, 8, 4, 3]; // GET is most common
        
        // HTTP Status codes distribution
        $statusCodes = [200, 201, 204, 400, 401, 403, 404, 422, 500, 502, 503];
        $statusWeights = [75, 5, 3, 5, 2, 2, 5, 1, 1, 0.5, 0.5]; // 200 is most common
        
        DB::disableQueryLog(); // Improve performance
        
        for ($batch = 0; $batch < $batches; $batch++) {
            $records = [];
            $currentBatchSize = min($batchSize, $totalRecords - ($batch * $batchSize));
            
            for ($i = 0; $i < $currentBatchSize; $i++) {
                // Generate realistic timestamp (last 30 days)
                $createdAt = Carbon::now()
                    ->subDays(rand(0, 30))
                    ->subHours(rand(0, 23))
                    ->subMinutes(rand(0, 59))
                    ->subSeconds(rand(0, 59));
                
                // Weight-based selection for methods
                $method = $this->weightedRandom($methods, $methodWeights);
                
                // Weight-based selection for status codes
                $status = $this->weightedRandom($statusCodes, $statusWeights);
                
                // Generate realistic response time based on status
                $responseTime = match($status) {
                    200, 201, 204 => $faker->randomFloat(2, 10, 1000), // Normal responses
                    400, 404, 422 => $faker->randomFloat(2, 50, 300),  // Client errors
                    401, 403 => $faker->randomFloat(2, 20, 200),       // Auth errors
                    500, 502, 503 => $faker->randomFloat(2, 1000, 5000), // Server errors
                    default => $faker->randomFloat(2, 100, 2000)
                };
                
                // Some IPs should appear more frequently (simulate real traffic)
                $ip = rand(1, 100) <= 20 
                    ? $this->getFrequentIp($faker) // 20% frequent IPs
                    : $faker->ipv4;               // 80% random IPs
                
                $url = $faker->randomElement($commonUrls);
                // Sometimes add parameters to URLs
                if (rand(1, 100) <= 30) {
                    $url .= '?' . $faker->randomElement(['page=1', 'limit=10', 'sort=name', 'filter=active']);
                }
                
                $records[] = [
                    'ip' => $ip,
                    'url' => $url,
                    'method' => $method,
                    'status' => $status,
                    'user_agent' => $faker->randomElement($userAgents),
                    'response_time' => $responseTime,
                    'created_at' => $createdAt,
                    'updated_at' => $createdAt,
                ];
            }
            
            // Bulk insert for better performance
            Log::insert($records);
            
            $completed = ($batch + 1) * $batchSize;
            $percentage = round(($completed / $totalRecords) * 100, 1);
            $this->command->info("Batch " . ($batch + 1) . "/{$batches} completed ({$percentage}%)");
        }
        
        DB::enableQueryLog();
        
        $this->command->info("Successfully seeded {$totalRecords} log records!");
        
        // Display some statistics
        $this->displayStatistics();
    }
    
    /**
     * Weighted random selection
     */
    private function weightedRandom($items, $weights)
    {
        $totalWeight = array_sum($weights);
        $random = rand(1, $totalWeight * 100) / 100;
        
        $currentWeight = 0;
        foreach ($items as $index => $item) {
            $currentWeight += $weights[$index];
            if ($random <= $currentWeight) {
                return $item;
            }
        }
        
        return $items[0]; // fallback
    }
    
    /**
     * Get frequent IPs (simulate heavy users)
     */
    private function getFrequentIp($faker)
    {
        static $frequentIps = null;
        
        if ($frequentIps === null) {
            $frequentIps = [
                '192.168.1.100',
                '192.168.1.101',
                '10.0.0.50',
                '203.0.113.1',
                '198.51.100.10',
            ];
        }
        
        return $faker->randomElement($frequentIps);
    }
    
    /**
     * Display seeding statistics
     */
    private function displayStatistics()
    {
        $total = Log::count();
        $statusDistribution = Log::select('status', DB::raw('count(*) as count'))
            ->groupBy('status')
            ->orderBy('count', 'desc')
            ->get();
        
        $methodDistribution = Log::select('method', DB::raw('count(*) as count'))
            ->groupBy('method')
            ->orderBy('count', 'desc')
            ->get();
            
        $this->command->info("\n=== Seeding Statistics ===");
        $this->command->info("Total Records: " . number_format($total));
        
        $this->command->info("\nStatus Code Distribution:");
        foreach ($statusDistribution as $stat) {
            $percentage = round(($stat->count / $total) * 100, 2);
            $this->command->info("  {$stat->status}: " . number_format($stat->count) . " ({$percentage}%)");
        }
        
        $this->command->info("\nHTTP Method Distribution:");
        foreach ($methodDistribution as $stat) {
            $percentage = round(($stat->count / $total) * 100, 2);
            $this->command->info("  {$stat->method}: " . number_format($stat->count) . " ({$percentage}%)");
        }
        
        $avgResponseTime = Log::avg('response_time');
        $this->command->info("\nAverage Response Time: " . round($avgResponseTime, 2) . "ms");
    }
}
