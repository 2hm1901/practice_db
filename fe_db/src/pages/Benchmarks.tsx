import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { benchmarkApi } from '../api/endpoints';
import LoadingSpinner from '../components/LoadingSpinner';
import { Play, BarChart3, Trash2, Activity } from 'lucide-react';

const BENCHMARK_STAGES = [
  { value: 'baseline', label: 'Baseline (No optimization)' },
  { value: 'indexing', label: 'With Database Indexing' },
  { value: 'caching', label: 'With Query Caching' },
  { value: 'partitioning', label: 'With Table Partitioning' },
  { value: 'pre_aggregation', label: 'With Pre-aggregated Data' },
];

const Benchmarks = () => {
  const [selectedStage, setSelectedStage] = useState('baseline');
  const [queryCount, setQueryCount] = useState(1000);

  const { data: resultsData, isLoading: resultsLoading, refetch } = useQuery({
    queryKey: ['benchmarkResults'],
    queryFn: () => benchmarkApi.getResults(),
  });

  const { data: healthData } = useQuery({
    queryKey: ['benchmarkHealth'],
    queryFn: () => benchmarkApi.healthCheck(),
  });

  const runBenchmarkMutation = useMutation({
    mutationFn: ({ stage, count }: { stage: string; count: number }) => 
      benchmarkApi.runBenchmark(stage, count),
    onSuccess: () => {
      refetch();
    },
  });

  const clearResultsMutation = useMutation({
    mutationFn: () => benchmarkApi.clearResults(),
    onSuccess: () => {
      refetch();
    },
  });

  const handleRunBenchmark = () => {
    runBenchmarkMutation.mutate({ stage: selectedStage, count: queryCount });
  };

  const handleClearResults = () => {
    clearResultsMutation.mutate();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Performance Benchmarks</h1>
        <p className="mt-2 text-sm text-gray-600">
          Test and compare query performance across different optimization strategies
        </p>
      </div>

      {/* Health Status */}
      {healthData && (
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <div className="flex items-center">
            <Activity className="h-5 w-5 text-green-600 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">System Health</h3>
          </div>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {healthData.data?.log_count?.toLocaleString() || 'N/A'}
              </div>
              <div className="text-sm text-gray-500">Total Log Records</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {healthData.data?.avg_response_time?.toFixed(2) || 'N/A'}ms
              </div>
              <div className="text-sm text-gray-500">Avg Response Time</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {resultsData?.data?.length || 0}
              </div>
              <div className="text-sm text-gray-500">Benchmark Results</div>
            </div>
          </div>
        </div>
      )}

      {/* Benchmark Controls */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Run New Benchmark</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Optimization Stage
            </label>
            <select
              value={selectedStage}
              onChange={(e) => setSelectedStage(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              disabled={runBenchmarkMutation.isPending}
            >
              {BENCHMARK_STAGES.map((stage) => (
                <option key={stage.value} value={stage.value}>
                  {stage.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Query Count
            </label>
            <input
              type="number"
              min="100"
              max="10000"
              step="100"
              value={queryCount}
              onChange={(e) => setQueryCount(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              disabled={runBenchmarkMutation.isPending}
            />
          </div>

          <div className="flex space-x-2">
            <button
              onClick={handleRunBenchmark}
              disabled={runBenchmarkMutation.isPending}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {runBenchmarkMutation.isPending ? (
                <LoadingSpinner size="sm" className="mr-2" />
              ) : (
                <Play className="h-4 w-4 mr-2" />
              )}
              Run Benchmark
            </button>

            <button
              onClick={handleClearResults}
              disabled={clearResultsMutation.isPending}
              className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear Results
            </button>
          </div>
        </div>

        {runBenchmarkMutation.isPending && (
          <div className="mt-4 p-4 bg-blue-50 rounded-md">
            <div className="flex items-center">
              <LoadingSpinner size="sm" className="mr-2" />
              <span className="text-blue-700">Running benchmark for {selectedStage} with {queryCount} queries...</span>
            </div>
          </div>
        )}

        {runBenchmarkMutation.error && (
          <div className="mt-4 p-4 bg-red-50 rounded-md">
            <span className="text-red-700">Error running benchmark: {(runBenchmarkMutation.error as Error).message}</span>
          </div>
        )}
      </div>

      {/* Results Table */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <BarChart3 className="h-5 w-5 text-blue-600 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">Benchmark Results</h3>
          </div>
        </div>

        {resultsLoading ? (
          <LoadingSpinner size="md" />
        ) : resultsData?.data && resultsData.data.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stage
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Queries
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Avg Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Records Processed
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created At
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {resultsData.data
                  .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                  .map((result) => (
                    <tr key={result.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-semibold rounded bg-blue-100 text-blue-800">
                          {BENCHMARK_STAGES.find(s => s.value === result.stage)?.label || result.stage}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {result.query_count.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {result.total_execution_time.toFixed(2)}ms
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <span className={`font-medium ${
                          result.avg_execution_time < 50 ? 'text-green-600' :
                          result.avg_execution_time < 100 ? 'text-yellow-600' :
                          'text-red-600'
                        }`}>
                          {result.avg_execution_time.toFixed(2)}ms
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {result.records_processed.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(result.created_at).toLocaleString()}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No benchmark results yet. Run your first benchmark to see performance metrics.
          </div>
        )}
      </div>
    </div>
  );
};

export default Benchmarks;
