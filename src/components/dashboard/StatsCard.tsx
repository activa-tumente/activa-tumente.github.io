import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  color?: 'blue' | 'green' | 'red' | 'yellow' | 'purple' | 'gray';
  trend?: {
    value: number;
    isPositive: boolean;
    label: string;
  };
  className?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  color = 'blue',
  trend,
  className = ''
}) => {
  const colorClasses = {
    blue: {
      bg: 'bg-blue-500',
      text: 'text-blue-600',
      lightBg: 'bg-blue-50',
      border: 'border-blue-200'
    },
    green: {
      bg: 'bg-green-500',
      text: 'text-green-600',
      lightBg: 'bg-green-50',
      border: 'border-green-200'
    },
    red: {
      bg: 'bg-red-500',
      text: 'text-red-600',
      lightBg: 'bg-red-50',
      border: 'border-red-200'
    },
    yellow: {
      bg: 'bg-yellow-500',
      text: 'text-yellow-600',
      lightBg: 'bg-yellow-50',
      border: 'border-yellow-200'
    },
    purple: {
      bg: 'bg-purple-500',
      text: 'text-purple-600',
      lightBg: 'bg-purple-50',
      border: 'border-purple-200'
    },
    gray: {
      bg: 'bg-gray-500',
      text: 'text-gray-600',
      lightBg: 'bg-gray-50',
      border: 'border-gray-200'
    }
  };

  const colors = colorClasses[color];

  return (
    <div className={`bg-white rounded-lg shadow-sm border ${colors.border} p-6 transition-all hover:shadow-md ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center">
            <div className={`flex-shrink-0 p-3 rounded-lg ${colors.bg} mr-4`}>
              <Icon className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
              <div className="flex items-baseline">
                <p className="text-2xl font-bold text-gray-900">{value}</p>
                {subtitle && (
                  <p className="ml-2 text-sm text-gray-500">{subtitle}</p>
                )}
              </div>
            </div>
          </div>
          
          {trend && (
            <div className="mt-3 flex items-center">
              <div className={`flex items-center ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {trend.isPositive ? (
                  <TrendingUp className="h-4 w-4 mr-1" />
                ) : (
                  <TrendingDown className="h-4 w-4 mr-1" />
                )}
                <span className="text-sm font-medium">
                  {Math.abs(trend.value)}%
                </span>
              </div>
              <span className="ml-2 text-sm text-gray-500">{trend.label}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatsCard;