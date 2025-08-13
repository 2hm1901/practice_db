import React from 'react';

const AnalyticsPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Log Analytics
      </h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Top URLs Card */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Top URLs
          </h2>
          <p className="text-gray-600">
            Most accessed URLs and their statistics
          </p>
        </div>

        {/* Top IPs Card */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Top IP Addresses
          </h2>
          <p className="text-gray-600">
            Most active IP addresses
          </p>
        </div>

        {/* Status Codes Card */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            HTTP Status Codes
          </h2>
          <p className="text-gray-600">
            Distribution of HTTP response codes
          </p>
        </div>

        {/* Traffic by Time Card */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Traffic by Time
          </h2>
          <p className="text-gray-600">
            Request volume throughout the day
          </p>
        </div>
      </div>

      {/* Response Times Chart */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Response Times
        </h2>
        <p className="text-gray-600">
          Average response times over time
        </p>
      </div>
    </div>
  );
};

export default AnalyticsPage;
