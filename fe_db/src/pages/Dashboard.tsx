import { useQuery } from '@tanstack/react-query';
import { analyticsApi } from '../api/endpoints';
import StatCard from '../components/StatCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { Users, Globe, Clock, CheckCircle, AlertTriangle } from 'lucide-react';

const Dashboard = () => {
  const { data: dashboardData, isLoading, error } = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => analyticsApi.getDashboard(),
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        <strong>Error:</strong> Failed to load dashboard data. Please check if the Laravel API is running on port 8000.
      </div>
    );
  }

  if (!dashboardData?.data) {
    return (
      <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
        No dashboard data available.
      </div>
    );
  }

  const apiResponse = dashboardData.data;
  const data = apiResponse.data;
  const meta = apiResponse.meta;

  // Calculate error rate from success rate
  const successRate = data.success_rate || 0;
  const errorRate = 100 - successRate;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-sm text-gray-600">
            Overview of your log analytics and performance metrics
          </p>
        </div>
        <div className="text-sm text-gray-500">
          Query executed in {meta?.execution_time_ms || 0}ms
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Requests"
          value={(data.total_requests || 0).toLocaleString()}
          icon={<Globe className="h-6 w-6" />}
        />
        <StatCard
          title="Unique IPs"
          value={(data.unique_ips || 0).toLocaleString()}
          icon={<Users className="h-6 w-6" />}
        />
        <StatCard
          title="Avg Response Time"
          value={`${(data.avg_response_time || 0).toFixed(2)}ms`}
          icon={<Clock className="h-6 w-6" />}
        />
        <StatCard
          title="Success Rate"
          value={`${successRate.toFixed(1)}%`}
          icon={<CheckCircle className="h-6 w-6" />}
          trend={{
            value: successRate,
            isPositive: successRate > 95
          }}
        />
      </div>

      {/* Error Rate Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <StatCard
          title="Error Rate"
          value={`${errorRate.toFixed(2)}%`}
          icon={<AlertTriangle className="h-6 w-6" />}
          trend={{
            value: errorRate,
            isPositive: false
          }}
          className="lg:col-span-1"
        />

        {/* System Info */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">System Information</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-500">Date Range:</span>
                <span className="text-sm text-gray-900">{meta?.date_range || 'N/A'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-500">Query Execution Time:</span>
                <span className="text-sm text-gray-900">{meta?.execution_time_ms || 0}ms</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-500">Query Count:</span>
                <span className="text-sm text-gray-900">{meta?.query_count || 'N/A'}</span>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {((data.total_requests || 0) * successRate / 100).toFixed(0)}
                  </div>
                  <div className="text-sm text-green-600">Successful Requests</div>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">
                    {((data.total_requests || 0) * errorRate / 100).toFixed(0)}
                  </div>
                  <div className="text-sm text-red-600">Failed Requests</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
