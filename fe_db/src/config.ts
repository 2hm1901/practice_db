// Environment configuration
export const config = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
  APP_NAME: import.meta.env.VITE_APP_NAME || 'Log Analytics',
  APP_VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0',
  
  // Pagination
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
  
  // Chart configurations
  CHART_COLORS: {
    primary: '#3B82F6',
    secondary: '#10B981',
    accent: '#F59E0B',
    danger: '#EF4444',
    info: '#6366F1',
  },
  
  // Date formats
  DATE_FORMATS: {
    API: 'YYYY-MM-DD HH:mm:ss',
    DISPLAY: 'MMM DD, YYYY',
    DISPLAY_WITH_TIME: 'MMM DD, YYYY HH:mm',
  },
  
  // Benchmark configuration
  BENCHMARK: {
    OPTIMIZATION_STAGES: [
      'baseline',
      'indexed', 
      'cached',
      'partitioned',
      'pre_aggregated'
    ] as const,
    DEFAULT_DATASET_SIZE: 1000000,
    TIMEOUT_MS: 30000,
  }
} as const;
