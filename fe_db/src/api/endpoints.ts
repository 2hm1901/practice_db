import { apiClient } from './client';

export interface DashboardData {
  total_requests: number;
  unique_ips: number;
  avg_response_time: number;
  success_rate: number; // Already in percentage format
  recent_requests?: any[];
}

export interface ApiResponse<T> {
  status: string;
  data: T;
  meta: {
    execution_time_ms: number;
    date_range: string;
    query_count: string;
  };
}

export interface MethodsDistribution {
  method: string;
  count: number;
  percentage: number;
}

export interface StatusCodesData {
  status_code: number;
  count: number;
  percentage: number;
}

export interface TopUrlsData {
  url: string;
  requests: number; // Changed from 'count' to 'requests'
  avg_response_time: number;
}

export interface TopIpsData {
  ip_address: string;
  request_count: number;
  avg_response_time: number;
  success_rate: number;
}

export interface TimelineData {
  date: string;
  total_requests: number;
  avg_response_time: number;
  success_rate: number;
}

export interface ComplexAnalyticsData {
  hourly_patterns: any[];
  method_status_cross: any[];
  response_time_ranges: any[];
  top_user_agents: any[];
  geographic_distribution: any[];
  execution_time_ms: number;
}

export interface BenchmarkResult {
  id: number;
  stage: string;
  query_count: number;
  total_execution_time: number;
  avg_execution_time: number;
  records_processed: number;
  results_data: any;
  created_at: string;
}

// Analytics API calls
export const analyticsApi = {
  getDashboard: () => apiClient.get<ApiResponse<DashboardData>>('/analytics/dashboard'),
  getMethodsDistribution: () => apiClient.get<ApiResponse<MethodsDistribution[]>>('/analytics/methods'),
  getStatusCodes: () => apiClient.get<ApiResponse<StatusCodesData[]>>('/analytics/status-codes'),
  getTopUrls: (limit: number = 10) => apiClient.get<ApiResponse<TopUrlsData[]>>(`/analytics/top-urls?limit=${limit}`),
  getTopIPs: (limit: number = 10) => apiClient.get<ApiResponse<TopIpsData[]>>(`/analytics/top-ips?limit=${limit}`),
  getTimeline: (days: number = 30) => apiClient.get<ApiResponse<TimelineData[]>>(`/analytics/timeline?days=${days}`),
  getComplexAnalytics: () => apiClient.get<ApiResponse<ComplexAnalyticsData>>('/analytics/complex'),
};

// Benchmark API calls
export const benchmarkApi = {
  runBenchmark: (stage: string, queryCount: number = 1000) => 
    apiClient.post<BenchmarkResult>('/benchmark/run', { stage, query_count: queryCount }),
  
  compareStages: (stages: string[]) => 
    apiClient.get('/benchmark/compare', { params: { stages } }),
  
  getResults: (stage?: string) => {
    const params = stage ? { stage } : {};
    return apiClient.get<BenchmarkResult[]>('/benchmark/results', { params });
  },
  
  healthCheck: () => 
    apiClient.get('/benchmark/health'),
  
  clearResults: () => 
    apiClient.delete('/benchmark/clear'),
};
