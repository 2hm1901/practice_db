<?php

namespace Database\Seeders;

use App\Models\Log;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SimpleLogSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Simple configuration
        $batchSize = 500;  // Larger batches now that we know it works
        $totalRecords = 50000; // Add another 50K records
        $batches = ceil($totalRecords / $batchSize);
        
        $this->command->info("Starting to seed {$totalRecords} log records in {$batches} batches...");
        
        // Simple data arrays
        $urls = ['/api/users', '/api/products', '/home', '/products', '/cart'];
        $methods = ['GET', 'POST', 'PUT', 'DELETE'];
        $statuses = [200, 201, 400, 404, 500];
        $userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/91.0.4472.124';
        
        DB::disableQueryLog();
        
        for ($batch = 0; $batch < $batches; $batch++) {
            $records = [];
            
            for ($i = 0; $i < $batchSize && ($batch * $batchSize + $i) < $totalRecords; $i++) {
                $now = Carbon::now()->subDays(rand(0, 30));
                $records[] = [
                    'ip' => '192.168.1.' . rand(1, 100),
                    'url' => $urls[array_rand($urls)],
                    'method' => $methods[array_rand($methods)],
                    'status' => $statuses[array_rand($statuses)],
                    'response_time' => rand(50, 1000),
                    'user_agent' => $userAgent,
                    'created_at' => $now,
                    'updated_at' => $now,
                ];
            }
            
            Log::insert($records);
            unset($records);
            
            $this->command->info("Batch " . ($batch + 1) . "/{$batches} completed");
        }
        
        $this->command->info("Successfully seeded {$totalRecords} log records!");
        
        // Basic stats
        $total = Log::count();
        $this->command->info("Total logs in database: " . number_format($total));
    }
}
