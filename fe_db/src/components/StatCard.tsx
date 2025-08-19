import type { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

const StatCard = ({ title, value, subtitle, icon, trend, className = '' }: StatCardProps) => {
  return (
    <div className={`bg-white rounded-lg shadow-md border border-gray-200 p-6 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">{title}</h3>
          <div className="mt-2 flex items-baseline">
            <p className="text-2xl font-semibold text-gray-900">{value}</p>
            {subtitle && (
              <span className="ml-2 text-sm text-gray-500">{subtitle}</span>
            )}
          </div>
          {trend && (
            <div className="mt-2 flex items-center">
              <span
                className={`inline-flex items-baseline px-2.5 py-0.5 rounded-full text-sm font-medium ${
                  trend.isPositive
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {trend.isPositive ? '↗' : '↘'} {Math.abs(trend.value)}%
              </span>
            </div>
          )}
        </div>
        {icon && (
          <div className="flex-shrink-0">
            <div className="text-blue-600">{icon}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
