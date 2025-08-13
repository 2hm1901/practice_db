export interface LogEntry {
  id: number;
  ip: string;
  url: string;
  method: string;
  status: number;
  user_agent: string;
  response_time: number;
  created_at: string;
}

export interface TopUrlResult {
  url: string;
  count: number;
  avg_response_time?: number;
}

export interface TopIpResult {
  ip: string;
  count: number;
  last_seen?: string;
}

export interface StatusCodeResult {
  status: number;
  count: number;
  percentage: number;
}

export interface TrafficByTimeResult {
  hour: number;
  count: number;
  avg_response_time: number;
}

export interface ResponseTimeResult {
  date: string;
  avg_response_time: number;
  min_response_time: number;
  max_response_time: number;
}

export interface AnalyticsFilters {
  startDate?: string;
  endDate?: string;
  status?: number;
  method?: string;
  limit?: number;
}
