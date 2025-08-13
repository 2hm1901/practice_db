<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class BenchmarkResult extends Model
{
    use HasFactory;

    protected $fillable = [
        'query_name',
        'duration_ms',
        'description',
        'optimization_stage',
        'dataset_size',
        'memory_usage',
        'cpu_usage'
    ];

    protected $casts = [
        'duration_ms' => 'float',
        'dataset_size' => 'integer',
        'memory_usage' => 'float',
        'cpu_usage' => 'float',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    // Optimization stages enum
    const STAGES = [
        'baseline' => 'Baseline (No optimization)',
        'indexed' => 'After indexing',
        'cached' => 'After caching',
        'partitioned' => 'After partitioning',
        'pre_aggregated' => 'After pre-aggregation'
    ];

    public function scopeByStage($query, $stage)
    {
        return $query->where('optimization_stage', $stage);
    }

    public function scopeByQuery($query, $queryName)
    {
        return $query->where('query_name', $queryName);
    }

    public function getOptimizationStageNameAttribute()
    {
        return self::STAGES[$this->optimization_stage] ?? $this->optimization_stage;
    }
}
