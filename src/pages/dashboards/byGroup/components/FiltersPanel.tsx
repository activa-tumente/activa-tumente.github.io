import React, { useState, useEffect } from 'react';
import { Filter, X, ChevronDown, ChevronUp, Calendar, Users, AlertTriangle, MapPin } from 'lucide-react';

interface FiltersProps {
  onFilterChange: (filters: Record<string, string>) => void;
  students: any[];
  responses: any[];
}

/**
 * Componente de panel de filtros para el dashboard por grupo
 */
const FiltersPanel: React.FC<FiltersProps> = ({ onFilterChange, students, responses }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [availableFilters, setAvailableFilters] = useState<{
    genders: string[];
    ageRanges: string[];
    bullyingTypes: string[];
    bullyingPlaces: string[];
  }>({ genders: [], ageRanges: [], bullyingTypes: [], bullyingPlaces: [] });

  // Extraer opciones de filtro disponibles de los datos
  useEffect(() => {
    if (students.length === 0 && responses.length === 0) return;

    // Extraer géneros únicos
    const genders = [...new Set(students.filter(s => s.genero).map(s => s.genero))];

    // Crear rangos de edad
    const ages = students.filter(s => s.edad).map(s => s.edad);
    const minAge = Math.min(...ages);
    const maxAge = Math.max(...ages);
    const ageRanges = [];
    
    // Crear rangos de 2 años
    for (let i = minAge; i <= maxAge; i += 2) {
      ageRanges.push(`${i}-${Math.min(i + 1, maxAge)}`);
    }

    // Extraer tipos de bullying
    const bullyingTypes: string[] = [];
    responses.forEach(response => {
      if (response.pregunta?.texto.includes('tipo de agresión')) {
        const types = response.respuesta.split(',').map((t: string) => t.trim().toLowerCase());
        types.forEach((type: string) => {
          if (!bullyingTypes.includes(type)) {
            bullyingTypes.push(type);
          }
        });
      }
    });

    // Extraer lugares de bullying
    const bullyingPlaces: string[] = [];
    responses.forEach(response => {
      if (response.pregunta?.texto.includes('lugar donde ocurre')) {
        const places = response.respuesta.split(',').map((p: string) => p.trim().toLowerCase());
        places.forEach((place: string) => {
          if (!bullyingPlaces.includes(place)) {
            bullyingPlaces.push(place);
          }
        });
      }
    });

    setAvailableFilters({
      genders,
      ageRanges,
      bullyingTypes,
      bullyingPlaces
    });
  }, [students, responses]);

  // Manejar cambios en los filtros
  const handleFilterChange = (filterName: string, value: string) => {
    const newFilters = { ...filters };
    if (value) {
      newFilters[filterName] = value;
    } else {
      delete newFilters[filterName];
    }
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  // Limpiar todos los filtros
  const clearFilters = () => {
    setFilters({});
    onFilterChange({});
  };

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center bg-white border border-gray-300 rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          <Filter className="h-4 w-4 mr-2" />
          Filtros
          {Object.keys(filters).length > 0 && (
            <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded-full">
              {Object.keys(filters).length}
            </span>
          )}
          {isOpen ? (
            <ChevronUp className="h-4 w-4 ml-2" />
          ) : (
            <ChevronDown className="h-4 w-4 ml-2" />
          )}
        </button>
        
        {Object.keys(filters).length > 0 && (
          <button
            onClick={clearFilters}
            className="flex items-center text-sm text-gray-500 hover:text-red-500"
          >
            <X className="h-4 w-4 mr-1" />
            Limpiar filtros
          </button>
        )}
      </div>
      
      {isOpen && (
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
          <h4 className="font-medium text-gray-800 mb-3">Filtrar datos del grupo</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Filtro por género */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Users className="h-4 w-4 inline mr-1" />
                Género
              </label>
              <select
                value={filters.gender || ''}
                onChange={(e) => handleFilterChange('gender', e.target.value)}
                className="w-full rounded-md border border-gray-300 py-2 px-3 text-sm"
              >
                <option value="">Todos</option>
                {availableFilters.genders.map((gender) => (
                  <option key={gender} value={gender}>
                    {gender.charAt(0).toUpperCase() + gender.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Filtro por rango de edad */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Calendar className="h-4 w-4 inline mr-1" />
                Rango de edad
              </label>
              <select
                value={filters.ageRange || ''}
                onChange={(e) => handleFilterChange('ageRange', e.target.value)}
                className="w-full rounded-md border border-gray-300 py-2 px-3 text-sm"
              >
                <option value="">Todos</option>
                {availableFilters.ageRanges.map((range) => (
                  <option key={range} value={range}>
                    {range} años
                  </option>
                ))}
              </select>
            </div>
            
            {/* Filtro por tipo de bullying */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <AlertTriangle className="h-4 w-4 inline mr-1" />
                Tipo de bullying
              </label>
              <select
                value={filters.bullyingType || ''}
                onChange={(e) => handleFilterChange('bullyingType', e.target.value)}
                className="w-full rounded-md border border-gray-300 py-2 px-3 text-sm"
              >
                <option value="">Todos</option>
                {availableFilters.bullyingTypes.map((type) => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Filtro por lugar */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <MapPin className="h-4 w-4 inline mr-1" />
                Lugar
              </label>
              <select
                value={filters.bullyingPlace || ''}
                onChange={(e) => handleFilterChange('bullyingPlace', e.target.value)}
                className="w-full rounded-md border border-gray-300 py-2 px-3 text-sm"
              >
                <option value="">Todos</option>
                {availableFilters.bullyingPlaces.map((place) => (
                  <option key={place} value={place}>
                    {place.charAt(0).toUpperCase() + place.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          {Object.keys(filters).length > 0 && (
            <div className="mt-4 bg-blue-50 p-3 rounded-lg">
              <h5 className="text-sm font-medium text-blue-800 mb-1">Filtros activos:</h5>
              <div className="flex flex-wrap gap-2">
                {Object.entries(filters).map(([key, value]) => (
                  <span key={key} className="inline-flex items-center bg-white border border-blue-200 rounded-full px-2 py-1 text-xs text-blue-800">
                    {key === 'gender' && 'Género: '}
                    {key === 'ageRange' && 'Edad: '}
                    {key === 'bullyingType' && 'Tipo: '}
                    {key === 'bullyingPlace' && 'Lugar: '}
                    {value}
                    <button
                      onClick={() => handleFilterChange(key, '')}
                      className="ml-1 text-blue-500 hover:text-blue-700"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FiltersPanel;