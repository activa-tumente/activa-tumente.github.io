import React, { useState } from 'react';
import { Filter, X, ChevronDown, ChevronUp, Calendar, Users } from 'lucide-react';

interface FiltersOption {
  id: string;
  label: string;
  value: string;
}

interface FiltersPanelProps {
  onFilterChange: (filters: Record<string, string>) => void;
  institutionOptions?: FiltersOption[];
  gradeOptions?: FiltersOption[];
  yearOptions?: FiltersOption[];
  initialFilters?: Record<string, string>;
}

/**
 * Componente que muestra un panel de filtros para el dashboard
 */
const FiltersPanel: React.FC<FiltersPanelProps> = ({
  onFilterChange,
  institutionOptions = [],
  gradeOptions = [],
  yearOptions = [],
  initialFilters = {}
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [filters, setFilters] = useState<Record<string, string>>(initialFilters);

  // Manejar cambios en los filtros
  const handleFilterChange = (filterName: string, value: string) => {
    const newFilters = { ...filters, [filterName]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  // Limpiar todos los filtros
  const clearFilters = () => {
    const emptyFilters: Record<string, string> = {};
    setFilters(emptyFilters);
    onFilterChange(emptyFilters);
  };

  return (
    <div className="bg-white rounded-lg shadow mb-6">
      {/* Cabecera del panel de filtros */}
      <div 
        className="p-4 flex items-center justify-between cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center">
          <Filter className="h-5 w-5 text-blue-600 mr-2" />
          <h3 className="font-medium text-gray-800">Filtros</h3>
          {Object.keys(filters).length > 0 && (
            <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
              {Object.keys(filters).length} activos
            </span>
          )}
        </div>
        <div className="flex items-center">
          {Object.keys(filters).length > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                clearFilters();
              }}
              className="text-sm text-gray-500 hover:text-red-500 mr-3"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          {isExpanded ? (
            <ChevronUp className="h-5 w-5 text-gray-500" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-500" />
          )}
        </div>
      </div>

      {/* Contenido del panel de filtros */}
      {isExpanded && (
        <div className="p-4 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Filtro de institución */}
            {institutionOptions.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    <span>Institución</span>
                  </div>
                </label>
                <select
                  className="block w-full bg-white border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={filters.institution || ''}
                  onChange={(e) => handleFilterChange('institution', e.target.value)}
                >
                  <option value="">Todas las instituciones</option>
                  {institutionOptions.map((option) => (
                    <option key={option.id} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Filtro de grado */}
            {gradeOptions.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    <span>Grado</span>
                  </div>
                </label>
                <select
                  className="block w-full bg-white border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={filters.grade || ''}
                  onChange={(e) => handleFilterChange('grade', e.target.value)}
                >
                  <option value="">Todos los grados</option>
                  {gradeOptions.map((option) => (
                    <option key={option.id} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Filtro de año escolar */}
            {yearOptions.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>Año Escolar</span>
                  </div>
                </label>
                <select
                  className="block w-full bg-white border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={filters.year || ''}
                  onChange={(e) => handleFilterChange('year', e.target.value)}
                >
                  <option value="">Todos los años</option>
                  {yearOptions.map((option) => (
                    <option key={option.id} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FiltersPanel;