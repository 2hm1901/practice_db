export interface BenchmarkResult {
  id: number;
  query_name: string;
  duration_ms: number;
  description: string;
  optimization_stage: OptimizationStage;
  optimization_stage_name: string;
  dataset_size: number;
  memory_usage?: number;
  cpu_usage?: number;
  created_at: string;
}

export type OptimizationStage = 
  | 'baseline'
  | 'indexed'
  | 'cached'
  | 'partitioned'
  | 'pre_aggregated';

export interface BenchmarkComparison {
  query_name: string;
  baseline: number;
  after_indexing?: number;
  after_caching?: number;
  after_partitioning?: number;
  after_pre_aggregation?: number;
  improvement_percentage: number;
}

export interface BenchmarkFilters {
  query_name?: string;
  optimization_stage?: OptimizationStage;
  start_date?: string;
  end_date?: string;
}

export interface BenchmarkStats {
  total_queries: number;
  avg_improvement: number;
  best_improvement: number;
  worst_improvement: number;
}
