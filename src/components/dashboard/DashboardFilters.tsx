import React, { useState, useEffect } from 'react';
import { Filter, Calendar, Users, School, X } from 'lucide-react';
import bullsAnalysisService from '../../services/bullsAnalysisService';

interface DashboardFiltersProps {
  onFiltersChange: (filters: FilterState) => void;
  className?: string;
}

export interface FilterState {
  grupoId?: string;
  genero?: 'Masculino' | 'Femenino' | 'all';
  edadMin?: number;
  edadMax?: number;
  fechaInicio?: string;
  fechaFin?: string;
  tipoAnalisis?: 'sociometrico' | 'bullying' | 'situacional' | 'all';
}

const DashboardFilters: React.FC<DashboardFiltersProps> = ({ onFiltersChange, className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    grupoId: 'all',
    genero: 'all',
    edadMin: 10,
    edadMax: 14,
    tipoAnalisis: 'all'
  });
  const [grupos, setGrupos] = useState<any[]>([]);
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);

  useEffect(() => {
    loadGrupos();
  }, []);

  useEffect(() => {
    // Contar filtros activos (diferentes de los valores por defecto)
    let count = 0;
    if (filters.grupoId && filters.grupoId !== 'all') count++;
    if (filters.genero && filters.genero !== 'all') count++;
    if (filters.edadMin && filters.edadMin !== 10) count++;
    if (filters.edadMax && filters.edadMax !== 14) count++;
    if (filters.fechaInicio) count++;
    if (filters.fechaFin) count++;
    if (filters.tipoAnalisis && filters.tipoAnalisis !== 'all') count++;
    
    setActiveFiltersCount(count);
    onFiltersChange(filters);
  }, [filters, onFiltersChange]);

  const loadGrupos = async () => {
    try {
      const resumenGrupos = await bullsAnalysisService.getResumenGrupos();
      setGrupos(resumenGrupos);
    } catch (error) {
      console.error('Error al cargar grupos:', error);
    }
  };

  const updateFilter = (key: keyof FilterState, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      grupoId: 'all',
      genero: 'all',
      edadMin: 10,
      edadMax: 14,
      tipoAnalisis: 'all'
    });
  };

  const applyQuickFilter = (type: string) => {
    switch (type) {
      case 'agresores':
        setFilters(prev => ({ ...prev, tipoAnalisis: 'bullying' }));
        break;
      case 'victimas':
        setFilters(prev => ({ ...prev, tipoAnalisis: 'bullying' }));
        break;
      case 'sociometrico':
        setFilters(prev => ({ ...prev, tipoAnalisis: 'sociometrico' }));
        break;
      case 'masculinos':
        setFilters(prev => ({ ...prev, genero: 'Masculino' }));
        break;
      case 'femeninos':
        setFilters(prev => ({ ...prev, genero: 'Femenino' }));
        break;
    }
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`}>
      {/* Botón principal de filtros */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center px-4 py-2 rounded-lg border transition-colors ${
          activeFiltersCount > 0
            ? 'bg-blue-50 border-blue-300 text-blue-700'
            : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
        }`}
      >
        <Filter className="h-4 w-4 mr-2" />
        Filtros
        {activeFiltersCount > 0 && (
          <span className="ml-2 px-2 py-1 text-xs bg-blue-600 text-white rounded-full">
            {activeFiltersCount}
          </span>
        )}
      </button>

      {/* Panel de filtros */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border z-20">
          <div className="p-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Filtros de Análisis</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Filtros rápidos */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filtros Rápidos
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => applyQuickFilter('agresores')}
                  className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded-full hover:bg-red-200"
                >
                  Agresores
                </button>
                <button
                  onClick={() => applyQuickFilter('victimas')}
                  className="px-3 py-1 text-xs bg-yellow-100 text-yellow-700 rounded-full hover:bg-yellow-200"
                >
                  Víctimas
                </button>
                <button
                  onClick={() => applyQuickFilter('sociometrico')}
                  className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded-full hover:bg-green-200"
                >
                  Sociométrico
                </button>
                <button
                  onClick={() => applyQuickFilter('masculinos')}
                  className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200"
                >
                  Masculinos
                </button>
                <button
                  onClick={() => applyQuickFilter('femeninos')}
                  className="px-3 py-1 text-xs bg-purple-100 text-purple-700 rounded-full hover:bg-purple-200"
                >
                  Femeninos
                </button>
              </div>
            </div>

            {/* Grupo */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <School className="h-4 w-4 inline mr-1" />
                Grupo
              </label>
              <select
                value={filters.grupoId || 'all'}
                onChange={(e) => updateFilter('grupoId', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Todos los grupos</option>
                {grupos.map(grupo => (
                  <option key={grupo.grupo_id} value={grupo.grupo_id}>
                    {grupo.nombre_grupo} ({grupo.total_estudiantes} estudiantes)
                  </option>
                ))}
              </select>
            </div>

            {/* Género */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Users className="h-4 w-4 inline mr-1" />
                Género
              </label>
              <select
                value={filters.genero || 'all'}
                onChange={(e) => updateFilter('genero', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Todos</option>
                <option value="Masculino">Masculino</option>
                <option value="Femenino">Femenino</option>
              </select>
            </div>

            {/* Rango de edad */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rango de Edad
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  min="6"
                  max="18"
                  value={filters.edadMin || 10}
                  onChange={(e) => updateFilter('edadMin', parseInt(e.target.value))}
                  className="w-20 px-2 py-1 border border-gray-300 rounded text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-gray-500">a</span>
                <input
                  type="number"
                  min="6"
                  max="18"
                  value={filters.edadMax || 14}
                  onChange={(e) => updateFilter('edadMax', parseInt(e.target.value))}
                  className="w-20 px-2 py-1 border border-gray-300 rounded text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-gray-500">años</span>
              </div>
            </div>

            {/* Tipo de análisis */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Análisis
              </label>
              <select
                value={filters.tipoAnalisis || 'all'}
                onChange={(e) => updateFilter('tipoAnalisis', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Todos los análisis</option>
                <option value="sociometrico">Sociométrico</option>
                <option value="bullying">Roles de Bullying</option>
                <option value="situacional">Variables Situacionales</option>
              </select>
            </div>

            {/* Rango de fechas */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="h-4 w-4 inline mr-1" />
                Período de Análisis
              </label>
              <div className="space-y-2">
                <input
                  type="date"
                  value={filters.fechaInicio || ''}
                  onChange={(e) => updateFilter('fechaInicio', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Fecha inicio"
                />
                <input
                  type="date"
                  value={filters.fechaFin || ''}
                  onChange={(e) => updateFilter('fechaFin', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Fecha fin"
                />
              </div>
            </div>

            {/* Botones de acción */}
            <div className="flex justify-between pt-4 border-t">
              <button
                onClick={clearFilters}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
              >
                Limpiar filtros
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
              >
                Aplicar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Overlay para cerrar */}
      {isOpen && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default DashboardFilters;