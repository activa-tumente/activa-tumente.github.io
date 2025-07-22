import React, { ReactNode } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface ExpandableSectionProps {
  title: string;
  children: ReactNode;
  icon?: ReactNode;
  expanded: boolean;
  onToggle: () => void;
  className?: string;
}

/**
 * Componente para secciones expandibles/colapsables
 */
const ExpandableSection: React.FC<ExpandableSectionProps> = ({
  title,
  children,
  icon,
  expanded,
  onToggle,
  className = ''
}) => {
  return (
    <div className={`mb-6 border rounded-lg overflow-hidden ${className}`}>
      <div 
        className="flex justify-between items-center p-4 bg-gray-50 cursor-pointer"
        onClick={onToggle}
      >
        <div className="flex items-center">
          {icon && <div className="mr-2">{icon}</div>}
          <h2 className="text-lg font-medium text-gray-800">{title}</h2>
        </div>
        <button className="text-gray-500 hover:text-gray-700">
          {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
      </div>
      
      {expanded && (
        <div className="p-4 border-t">
          {children}
        </div>
      )}
    </div>
  );
};

export default ExpandableSection;
