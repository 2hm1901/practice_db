// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;

// HTTP Methods
export const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
  PATCH: 'PATCH',
} as const;

// Common HTTP status code ranges
export const STATUS_RANGES = {
  SUCCESS: [200, 299],
  CLIENT_ERROR: [400, 499],
  SERVER_ERROR: [500, 599],
} as const;

// Query time thresholds (in ms)
export const PERFORMANCE_THRESHOLDS = {
  FAST: 100,
  MEDIUM: 1000,
  SLOW: 5000,
} as const;

// Analytics default filters
export const DEFAULT_FILTERS = {
  LIMIT: 10,
  DAYS_BACK: 7,
} as const;

// Chart data limits
export const CHART_LIMITS = {
  MAX_DATA_POINTS: 100,
  MAX_PIE_SLICES: 10,
} as const;

// Local storage keys
export const STORAGE_KEYS = {
  THEME: 'log_analytics_theme',
  FILTERS: 'log_analytics_filters',
  DASHBOARD_LAYOUT: 'log_analytics_dashboard_layout',
} as const;
