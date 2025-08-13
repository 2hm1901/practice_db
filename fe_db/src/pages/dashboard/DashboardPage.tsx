import React from 'react';
import { Link } from 'react-router-dom';

const DashboardPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Log Analytics Dashboard
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          High-performance log analytics system with database optimization benchmarks
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Total Logs</h3>
          <p className="text-3xl font-bold text-blue-600">--</p>
          <p className="text-sm text-gray-500 mt-1">Records processed</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Avg Response Time</h3>
          <p className="text-3xl font-bold text-green-600">-- ms</p>
          <p className="text-sm text-gray-500 mt-1">Current performance</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Optimizations</h3>
          <p className="text-3xl font-bold text-purple-600">5</p>
          <p className="text-sm text-gray-500 mt-1">Stages completed</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Performance Gain</h3>
          <p className="text-3xl font-bold text-red-600">--%</p>
          <p className="text-sm text-gray-500 mt-1">Speed improvement</p>
        </div>
      </div>

      {/* Main Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <Link 
          to="/analytics"
          className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-8"
        >
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Log Analytics</h3>
            <p className="text-gray-600">
              Analyze web access logs, view top URLs, IPs, status codes, and traffic patterns
            </p>
          </div>
        </Link>

        <Link 
          to="/benchmark"
          className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-8"
        >
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Performance Benchmark</h3>
            <p className="text-gray-600">
              Compare query performance across optimization stages and track improvements
            </p>
          </div>
        </Link>
      </div>

      {/* Optimization Stages Overview */}
      <div className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
          Optimization Journey
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {[
            { stage: 'Baseline', desc: 'No optimization', status: 'completed' },
            { stage: 'Indexing', desc: 'Database indexes', status: 'completed' },
            { stage: 'Caching', desc: 'Redis cache', status: 'in-progress' },
            { stage: 'Partitioning', desc: 'Table partitioning', status: 'pending' },
            { stage: 'Pre-aggregation', desc: 'Summary tables', status: 'pending' },
          ].map((item, index) => (
            <div key={index} className="text-center">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 ${
                item.status === 'completed' ? 'bg-green-100 text-green-600' :
                item.status === 'in-progress' ? 'bg-yellow-100 text-yellow-600' :
                'bg-gray-100 text-gray-400'
              }`}>
                {item.status === 'completed' ? '✓' : index + 1}
              </div>
              <h4 className="font-medium text-gray-900 mb-1">{item.stage}</h4>
              <p className="text-sm text-gray-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
