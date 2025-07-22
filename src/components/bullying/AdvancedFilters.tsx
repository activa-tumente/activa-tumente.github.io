import React, { useState } from 'react';
import { Filter, ChevronDown, ChevronUp, X, Check } from 'lucide-react';

interface FilterOption {
  id: string;
  label: string;
}

interface FilterCategory {
  id: string;
  label: string;
  options: FilterOption[];
}

interface AdvancedFiltersProps {
  onFiltersChange: (filters: Record<string, string[]>) => void;
  initialFilters?: Record<string, string[]>;
}

/**
 * Componente de filtros avanzados para el Dashboard de Bullying
 */
const AdvancedFilters: React.FC<AdvancedFiltersProps> = ({ 
  onFiltersChange,
  initialFilters = {}
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>(initialFilters);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  // Categorías de filtros disponibles
  const filterCategories: FilterCategory[] = [
    {
      id: 'period',
      label: 'Período',
      options: [
        { id: 'current', label: 'Período actual' },
        { id: 'last_month', label: 'Último mes' },
        { id: 'last_quarter', label: 'Último trimestre' },
        { id: 'last_year', label: 'Último año' },
        { id: 'custom', label: 'Personalizado' }
      ]
    },
    {
      id: 'aggression_type',
      label: 'Tipo de agresión',
      options: [
        { id: 'physical', label: 'Física' },
        { id: 'verbal', label: 'Verbal' },
        { id: 'social', label: 'Social' },
        { id: 'cyber', label: 'Cibernética' }
      ]
    },
    {
      id: 'gender',
      label: 'Género',
      options: [
        { id: 'male', label: 'Masculino' },
        { id: 'female', label: 'Femenino' },
        { id: 'other', label: 'Otro' }
      ]
    },
    {
      id: 'role',
      label: 'Rol',
      options: [
        { id: 'victim', label: 'Víctima' },
        { id: 'bully', label: 'Agresor' },
        { id: 'bully_victim', label: 'Víctima-Agresor' },
        { id: 'observer', label: 'Observador' }
      ]
    },
    {
      id: 'risk_level',
      label: 'Nivel de riesgo',
      options: [
        { id: 'high', label: 'Alto' },
        { id: 'medium', label: 'Medio' },
        { id: 'low', label: 'Bajo' }
      ]
    }
  ];

  // Contar filtros activos
  const countActiveFilters = () => {
    return Object.values(selectedFilters).reduce((count, values) => count + values.length, 0);
  };

  // Manejar selección de filtro
  const handleFilterSelect = (categoryId: string, optionId: string) => {
    setSelectedFilters(prev => {
      const newFilters = { ...prev };
      
      if (!newFilters[categoryId]) {
        newFilters[categoryId] = [];
      }
      
      if (newFilters[categoryId].includes(optionId)) {
        // Remover filtro si ya está seleccionado
        newFilters[categoryId] = newFilters[categoryId].filter(id => id !== optionId);
        if (newFilters[categoryId].length === 0) {
          delete newFilters[categoryId];
        }
      } else {
        // Añadir filtro
        newFilters[categoryId] = [...newFilters[categoryId], optionId];
      }
      
      return newFilters;
    });
  };

  // Aplicar filtros
  const applyFilters = () => {
    onFiltersChange(selectedFilters);
    setIsOpen(false);
  };

  // Limpiar todos los filtros
  const clearAllFilters = () => {
    setSelectedFilters({});
    onFiltersChange({});
    setIsOpen(false);
  };

  // Verificar si un filtro está seleccionado
  const isFilterSelected = (categoryId: string, optionId: string) => {
    return selectedFilters[categoryId]?.includes(optionId) || false;
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        title="Filtros avanzados"
      >
        <Filter className="h-4 w-4 mr-1" />
        Filtros
        {countActiveFilters() > 0 && (
          <span className="ml-1 px-1.5 py-0.5 text-xs font-semibold rounded-full bg-blue-dark text-white">
            {countActiveFilters()}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg z-10 border border-gray-200">
          <div className="p-3 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-sm font-medium text-gray-700">Filtros avanzados</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-500"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          
          <div className="p-3 max-h-96 overflow-y-auto">
            {filterCategories.map(category => (
              <div key={category.id} className="mb-3">
                <button
                  onClick={() => setActiveCategory(activeCategory === category.id ? null : category.id)}
                  className="w-full flex justify-between items-center p-2 hover:bg-gray-50 rounded-md"
                >
                  <span className="text-sm font-medium text-gray-700 flex items-center">
                    {category.label}
                    {selectedFilters[category.id]?.length > 0 && (
                      <span className="ml-2 px-1.5 py-0.5 text-xs font-semibold rounded-full bg-blue-dark text-white">
                        {selectedFilters[category.id].length}
                      </span>
                    )}
                  </span>
                  {activeCategory === category.id ? (
                    <ChevronUp className="h-4 w-4 text-gray-400" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  )}
                </button>
                
                {activeCategory === category.id && (
                  <div className="mt-1 pl-2 space-y-1">
                    {category.options.map(option => (
                      <div 
                        key={option.id}
                        className="flex items-center p-1 hover:bg-gray-50 rounded"
                      >
                        <button
                          onClick={() => handleFilterSelect(category.id, option.id)}
                          className={`w-full flex items-center text-sm ${
                            isFilterSelected(category.id, option.id) 
                              ? 'text-blue-dark font-medium' 
                              : 'text-gray-600'
                          }`}
                        >
                          <span className={`w-5 h-5 mr-2 flex items-center justify-center rounded-sm border ${
                            isFilterSelected(category.id, option.id)
                              ? 'border-blue-dark bg-blue-dark text-white'
                              : 'border-gray-300'
                          }`}>
                            {isFilterSelected(category.id, option.id) && (
                              <Check className="h-3 w-3" />
                            )}
                          </span>
                          {option.label}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
          
          <div className="p-3 bg-gray-50 flex justify-between space-x-2 rounded-b-md">
            <button
              onClick={clearAllFilters}
              className="px-3 py-1 text-xs text-gray-700 hover:text-gray-900 border border-gray-300 rounded-md hover:bg-gray-100"
            >
              Limpiar filtros
            </button>
            <button
              onClick={applyFilters}
              className="px-3 py-1 text-xs text-white bg-blue-dark hover:bg-blue-900 rounded-md flex items-center"
            >
              <Check className="h-3 w-3 mr-1" />
              Aplicar
            </button>
          </div>
        </div>
      )}
      
      {/* Mostrar filtros activos */}
      {countActiveFilters() > 0 && !isOpen && (
        <div className="mt-2 flex flex-wrap gap-2">
          {Object.entries(selectedFilters).map(([categoryId, optionIds]) => {
            const category = filterCategories.find(c => c.id === categoryId);
            if (!category) return null;
            
            return optionIds.map(optionId => {
              const option = category.options.find(o => o.id === optionId);
              if (!option) return null;
              
              return (
                <div 
                  key={`${categoryId}-${optionId}`}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800"
                >
                  <span className="mr-1">{category.label}: {option.label}</span>
                  <button
                    onClick={() => {
                      handleFilterSelect(categoryId, optionId);
                      onFiltersChange(selectedFilters);
                    }}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              );
            });
          }).flat().filter(Boolean)}
          
          <button
            onClick={clearAllFilters}
            className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700 hover:bg-gray-200"
          >
            Limpiar todos
          </button>
        </div>
      )}
    </div>
  );
};

export default AdvancedFilters;
