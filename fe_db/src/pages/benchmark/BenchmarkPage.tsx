import React from 'react';

const BenchmarkPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Performance Benchmark
      </h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Benchmark Stats Cards */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Total Queries
          </h3>
          <p className="text-3xl font-bold text-blue-600">--</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Avg Improvement
          </h3>
          <p className="text-3xl font-bold text-green-600">--%</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Best Improvement
          </h3>
          <p className="text-3xl font-bold text-green-600">--%</p>
        </div>
      </div>

      {/* Optimization Stages Comparison */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Optimization Stages Comparison
        </h2>
        <p className="text-gray-600 mb-4">
          Performance improvements across different optimization stages
        </p>
        
        {/* Placeholder for chart */}
        <div className="h-64 bg-gray-100 rounded flex items-center justify-center">
          <p className="text-gray-500">Chart will be displayed here</p>
        </div>
      </div>

      {/* Benchmark Results Table */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            Benchmark Results
          </h2>
          <div className="space-x-2">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
              Run Benchmark
            </button>
            <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
              Export CSV
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Query Name</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Stage</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Duration (ms)</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Dataset Size</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Date</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                  No benchmark results available. Run your first benchmark to see results.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BenchmarkPage;
