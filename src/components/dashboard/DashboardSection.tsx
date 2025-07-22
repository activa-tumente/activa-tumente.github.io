import React, { ReactNode } from 'react';
import { BarChart2 } from 'lucide-react';

interface DashboardSectionProps {
  title: string;
  children: ReactNode;
  icon?: ReactNode;
  className?: string;
}

/**
 * Componente para mostrar secciones de dashboard
 */
const DashboardSection: React.FC<DashboardSectionProps> = ({ 
  title, 
  children, 
  icon,
  className = ''
}) => (
  <div className={`bg-white shadow rounded-lg p-6 mb-6 ${className}`}>
    <div className="flex items-center mb-4">
      {icon || <BarChart2 className="h-5 w-5 text-blue-dark mr-2" />}
      <h2 className="text-xl font-medium text-gray-800">{title}</h2>
    </div>
    {children}
  </div>
);

export default DashboardSection;
