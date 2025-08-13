import { httpClient } from './httpClient';
import { API_ENDPOINTS } from '../types/api';
import type {
  TopUrlResult,
  TopIpResult,
  StatusCodeResult,
  TrafficByTimeResult,
  ResponseTimeResult,
  AnalyticsFilters,
  ApiResponse
} from '../types';

class AnalyticsService {
  async getTopUrls(filters?: AnalyticsFilters): Promise<ApiResponse<TopUrlResult[]>> {
    const params = filters ? this.filtersToParams(filters) : undefined;
    return httpClient.get<ApiResponse<TopUrlResult[]>>(
      API_ENDPOINTS.ANALYTICS.TOP_URLS,
      params
    );
  }

  async getTopIps(filters?: AnalyticsFilters): Promise<ApiResponse<TopIpResult[]>> {
    const params = filters ? this.filtersToParams(filters) : undefined;
    return httpClient.get<ApiResponse<TopIpResult[]>>(
      API_ENDPOINTS.ANALYTICS.TOP_IPS,
      params
    );
  }

  async getStatusCodes(filters?: AnalyticsFilters): Promise<ApiResponse<StatusCodeResult[]>> {
    const params = filters ? this.filtersToParams(filters) : undefined;
    return httpClient.get<ApiResponse<StatusCodeResult[]>>(
      API_ENDPOINTS.ANALYTICS.STATUS_CODES,
      params
    );
  }

  async getTrafficByTime(filters?: AnalyticsFilters): Promise<ApiResponse<TrafficByTimeResult[]>> {
    const params = filters ? this.filtersToParams(filters) : undefined;
    return httpClient.get<ApiResponse<TrafficByTimeResult[]>>(
      API_ENDPOINTS.ANALYTICS.TRAFFIC_BY_TIME,
      params
    );
  }

  async getResponseTimes(filters?: AnalyticsFilters): Promise<ApiResponse<ResponseTimeResult[]>> {
    const params = filters ? this.filtersToParams(filters) : undefined;
    return httpClient.get<ApiResponse<ResponseTimeResult[]>>(
      API_ENDPOINTS.ANALYTICS.RESPONSE_TIMES,
      params
    );
  }

  private filtersToParams(filters: AnalyticsFilters): Record<string, string> {
    const params: Record<string, string> = {};
    
    if (filters.startDate) params.start_date = filters.startDate;
    if (filters.endDate) params.end_date = filters.endDate;
    if (filters.status) params.status = filters.status.toString();
    if (filters.method) params.method = filters.method;
    if (filters.limit) params.limit = filters.limit.toString();
    
    return params;
  }
}

export const analyticsService = new AnalyticsService();
export default analyticsService;
