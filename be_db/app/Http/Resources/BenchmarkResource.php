<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BenchmarkResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'query_name' => $this->query_name,
            'duration_ms' => $this->duration_ms,
            'description' => $this->description,
            'optimization_stage' => $this->optimization_stage,
            'optimization_stage_name' => $this->optimization_stage_name,
            'dataset_size' => $this->dataset_size,
            'memory_usage' => $this->memory_usage,
            'cpu_usage' => $this->cpu_usage,
            'created_at' => $this->created_at->toISOString(),
        ];
    }
}
