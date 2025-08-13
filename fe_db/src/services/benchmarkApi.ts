import { httpClient } from './httpClient';
import { API_ENDPOINTS } from '../types/api';
import type {
  BenchmarkResult,
  BenchmarkComparison,
  BenchmarkFilters,
  BenchmarkStats,
  OptimizationStage,
  ApiResponse,
  PaginatedResponse
} from '../types';

class BenchmarkService {
  async getResults(filters?: BenchmarkFilters): Promise<ApiResponse<PaginatedResponse<BenchmarkResult>>> {
    const params = filters ? this.filtersToParams(filters) : undefined;
    return httpClient.get<ApiResponse<PaginatedResponse<BenchmarkResult>>>(
      API_ENDPOINTS.BENCHMARK.RESULTS,
      params
    );
  }

  async getComparison(queryName?: string): Promise<ApiResponse<BenchmarkComparison[]>> {
    const params = queryName ? { query_name: queryName } : undefined;
    return httpClient.get<ApiResponse<BenchmarkComparison[]>>(
      API_ENDPOINTS.BENCHMARK.COMPARISON,
      params
    );
  }

  async getStats(): Promise<ApiResponse<BenchmarkStats>> {
    return httpClient.get<ApiResponse<BenchmarkStats>>(
      API_ENDPOINTS.BENCHMARK.STATS
    );
  }

  async runBenchmark(
    queryName: string, 
    stage: OptimizationStage
  ): Promise<ApiResponse<BenchmarkResult>> {
    return httpClient.post<ApiResponse<BenchmarkResult>>(
      API_ENDPOINTS.BENCHMARK.RUN,
      { query_name: queryName, optimization_stage: stage }
    );
  }

  async exportResults(format: 'csv' | 'json' = 'csv'): Promise<Blob> {
    const response = await fetch(`${API_ENDPOINTS.BENCHMARK.EXPORT}?format=${format}`);
    
    if (!response.ok) {
      throw new Error(`Export failed: ${response.statusText}`);
    }
    
    return response.blob();
  }

  private filtersToParams(filters: BenchmarkFilters): Record<string, string> {
    const params: Record<string, string> = {};
    
    if (filters.query_name) params.query_name = filters.query_name;
    if (filters.optimization_stage) params.optimization_stage = filters.optimization_stage;
    if (filters.start_date) params.start_date = filters.start_date;
    if (filters.end_date) params.end_date = filters.end_date;
    
    return params;
  }
}

export const benchmarkService = new BenchmarkService();
export default benchmarkService;
