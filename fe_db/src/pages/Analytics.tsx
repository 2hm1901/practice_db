import { useQuery } from '@tanstack/react-query';
import { analyticsApi } from '../api/endpoints';
import LoadingSpinner from '../components/LoadingSpinner';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

const Analytics = () => {
  const { data: methodsData, isLoading: methodsLoading } = useQuery({
    queryKey: ['methodsDistribution'],
    queryFn: () => analyticsApi.getMethodsDistribution(),
  });

  const { data: statusCodesData, isLoading: statusLoading } = useQuery({
    queryKey: ['statusCodes'],
    queryFn: () => analyticsApi.getStatusCodes(),
  });

  const { data: topUrlsData, isLoading: urlsLoading } = useQuery({
    queryKey: ['topUrls'],
    queryFn: () => analyticsApi.getTopUrls(10),
  });

  const { data: timelineData, isLoading: timelineLoading } = useQuery({
    queryKey: ['timeline'],
    queryFn: () => analyticsApi.getTimeline(30),
  });

  if (methodsLoading || statusLoading || urlsLoading || timelineLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
        <p className="mt-2 text-sm text-gray-600">
          Detailed analytics and insights from your log data
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* HTTP Methods Distribution */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">HTTP Methods Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={methodsData?.data.data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ method, percentage }) => `${method}: ${percentage.toFixed(1)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
              >
                {methodsData?.data.data?.map((_entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Status Codes Distribution */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Status Codes Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={statusCodesData?.data.data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="status_code" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Timeline Chart */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Request Timeline (Last 30 Days)</h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={timelineData?.data.data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="total_requests" fill="#0088FE" name="Total Requests" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Top URLs Table */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Top URLs</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  URL
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Requests
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Avg Response Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Success Rate
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {topUrlsData?.data.data?.map((url, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    <div className="truncate max-w-md" title={url.url}>
                      {url.url}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {url.requests.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {url.avg_response_time.toFixed(2)}ms
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-semibold rounded bg-blue-100 text-blue-800">
                      N/A
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
