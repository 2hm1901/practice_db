<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class BenchmarkResult extends Model
{
    use HasFactory;

    protected $fillable = [
        'stage',
        'query_count',
        'total_execution_time',
        'avg_execution_time',
        'records_processed',
        'results_data'
    ];

    protected $casts = [
        'query_count' => 'integer',
        'total_execution_time' => 'float',
        'avg_execution_time' => 'float',
        'records_processed' => 'integer',
        'results_data' => 'json',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    // Optimization stage constants
    const STAGE_BASELINE = 'baseline';
    const STAGE_INDEXING = 'indexing';
    const STAGE_CACHING = 'caching';
    const STAGE_PARTITIONING = 'partitioning';
    const STAGE_PRE_AGGREGATION = 'pre_aggregation';

    // Optimization stages enum
    const STAGES = [
        self::STAGE_BASELINE => 'Baseline (No optimization)',
        self::STAGE_INDEXING => 'After indexing optimization',
        self::STAGE_CACHING => 'After caching optimization',
        self::STAGE_PARTITIONING => 'After partitioning optimization',
        self::STAGE_PRE_AGGREGATION => 'After pre-aggregation optimization'
    ];

    public function scopeByStage($query, $stage)
    {
        return $query->where('stage', $stage);
    }

    public function getStageNameAttribute()
    {
        return self::STAGES[$this->stage] ?? $this->stage;
    }
}
