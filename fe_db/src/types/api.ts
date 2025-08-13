// API Response wrapper
export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: 'success' | 'error';
}

// Pagination wrapper
export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number;
  to: number;
}

// Error response
export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
  status: number;
}

// HTTP Methods
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

// API endpoints
export const API_ENDPOINTS = {
  // Analytics endpoints
  ANALYTICS: {
    TOP_URLS: '/api/analytics/top-urls',
    TOP_IPS: '/api/analytics/top-ips',
    STATUS_CODES: '/api/analytics/status-codes',
    TRAFFIC_BY_TIME: '/api/analytics/traffic-by-time',
    RESPONSE_TIMES: '/api/analytics/response-times',
  },
  // Benchmark endpoints
  BENCHMARK: {
    RESULTS: '/api/benchmark/results',
    COMPARISON: '/api/benchmark/comparison',
    STATS: '/api/benchmark/stats',
    EXPORT: '/api/benchmark/export',
    RUN: '/api/benchmark/run',
  },
  // Log endpoints
  LOGS: {
    INDEX: '/api/logs',
    SHOW: '/api/logs/{id}',
    STORE: '/api/logs',
  }
} as const;
