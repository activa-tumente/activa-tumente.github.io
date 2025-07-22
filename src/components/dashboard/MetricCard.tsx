import React, { ReactNode } from 'react';

interface MetricCardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  icon?: ReactNode;
  color?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  formatter?: (value: number | string) => string;
}

/**
 * Tarjeta para mostrar métricas individuales
 */
const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  color = 'border-blue-dark',
  trend,
  formatter = (val) => typeof val === 'number' ? val.toFixed(1) : val.toString()
}) => {
  const formattedValue = formatter(value);

  return (
    <div className={`bg-white rounded-lg shadow p-6 border-t-4 ${color}`}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <div className="flex items-baseline">
            <p className="text-2xl font-semibold text-gray-900">{formattedValue}</p>
            {trend && (
              <span className={`ml-2 text-sm font-medium ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {trend.isPositive ? '↑' : '↓'} {trend.value}%
              </span>
            )}
          </div>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>
        {icon && <div className="bg-gray-100 p-2 rounded-full">{icon}</div>}
      </div>
    </div>
  );
};

export default MetricCard;
