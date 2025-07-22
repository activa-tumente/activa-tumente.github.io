import React, { useState } from 'react';
import { 
  Target, 
  Users, 
  Calendar, 
  CheckCircle, 
  AlertTriangle, 
  Clock,
  ChevronDown,
  ChevronRight,
  User,
  MapPin,
  BookOpen,
  Activity
} from 'lucide-react';

interface Recomendacion {
  id: string;
  titulo: string;
  descripcion: string;
  tipo: 'inmediata' | 'corto_plazo' | 'mediano_plazo' | 'largo_plazo';
  prioridad: 'alta' | 'media' | 'baja';
  categoria: 'intervencion_individual' | 'dinamica_grupal' | 'ambiente_escolar' | 'capacitacion_docente';
  estudiantes_objetivo?: string[];
  recursos_necesarios: string[];
  plazo_estimado: string;
  indicadores_exito: string[];
  responsable_sugerido: string;
  estado?: 'pendiente' | 'en_progreso' | 'completada';
}

interface InterventionRecommendationsProps {
  recomendaciones: Recomendacion[];
  onUpdateStatus?: (id: string, status: Recomendacion['estado']) => void;
  className?: string;
}

const InterventionRecommendations: React.FC<InterventionRecommendationsProps> = ({
  recomendaciones,
  onUpdateStatus,
  className = ''
}) => {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [filterPrioridad, setFilterPrioridad] = useState<'all' | 'alta' | 'media' | 'baja'>('all');
  const [filterCategoria, setFilterCategoria] = useState<'all' | Recomendacion['categoria']>('all');

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  const getPrioridadColor = (prioridad: Recomendacion['prioridad']) => {
    switch (prioridad) {
      case 'alta':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'media':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'baja':
        return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  const getTipoIcon = (tipo: Recomendacion['tipo']) => {
    switch (tipo) {
      case 'inmediata':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'corto_plazo':
        return <Clock className="h-4 w-4 text-orange-500" />;
      case 'mediano_plazo':
        return <Calendar className="h-4 w-4 text-blue-500" />;
      case 'largo_plazo':
        return <Target className="h-4 w-4 text-purple-500" />;
    }
  };

  const getCategoriaIcon = (categoria: Recomendacion['categoria']) => {
    switch (categoria) {
      case 'intervencion_individual':
        return <User className="h-4 w-4" />;
      case 'dinamica_grupal':
        return <Users className="h-4 w-4" />;
      case 'ambiente_escolar':
        return <MapPin className="h-4 w-4" />;
      case 'capacitacion_docente':
        return <BookOpen className="h-4 w-4" />;
    }
  };

  const getEstadoColor = (estado?: Recomendacion['estado']) => {
    switch (estado) {
      case 'completada':
        return 'bg-green-500';
      case 'en_progreso':
        return 'bg-blue-500';
      default:
        return 'bg-gray-300';
    }
  };

  const recomendacionesFiltradas = recomendaciones.filter(rec => {
    if (filterPrioridad !== 'all' && rec.prioridad !== filterPrioridad) return false;
    if (filterCategoria !== 'all' && rec.categoria !== filterCategoria) return false;
    return true;
  });

  const recomendacionesOrdenadas = recomendacionesFiltradas.sort((a, b) => {
    // Ordenar por prioridad primero
    const prioridadOrder = { alta: 3, media: 2, baja: 1 };
    const prioridadDiff = prioridadOrder[b.prioridad] - prioridadOrder[a.prioridad];
    if (prioridadDiff !== 0) return prioridadDiff;
    
    // Luego por tipo (inmediata primero)
    const tipoOrder = { inmediata: 4, corto_plazo: 3, mediano_plazo: 2, largo_plazo: 1 };
    return tipoOrder[b.tipo] - tipoOrder[a.tipo];
  });

  return (
    <div className={`bg-white rounded-lg shadow-sm border p-6 ${className}`}>
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Recomendaciones de Intervención
        </h3>
        
        {/* Filtros */}
        <div className="flex flex-wrap gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Prioridad
            </label>
            <select
              value={filterPrioridad}
              onChange={(e) => setFilterPrioridad(e.target.value as any)}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Todas</option>
              <option value="alta">Alta</option>
              <option value="media">Media</option>
              <option value="baja">Baja</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Categoría
            </label>
            <select
              value={filterCategoria}
              onChange={(e) => setFilterCategoria(e.target.value as any)}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Todas</option>
              <option value="intervencion_individual">Intervención Individual</option>
              <option value="dinamica_grupal">Dinámica Grupal</option>
              <option value="ambiente_escolar">Ambiente Escolar</option>
              <option value="capacitacion_docente">Capacitación Docente</option>
            </select>
          </div>
        </div>
      </div>

      {/* Lista de recomendaciones */}
      <div className="space-y-4">
        {recomendacionesOrdenadas.map((recomendacion) => {
          const isExpanded = expandedItems.has(recomendacion.id);
          const CategoriaIcon = getCategoriaIcon(recomendacion.categoria);

          return (
            <div
              key={recomendacion.id}
              className="border border-gray-200 rounded-lg overflow-hidden"
            >
              {/* Header */}
              <div
                className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => toggleExpanded(recomendacion.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    {/* Indicador de estado */}
                    <div className="flex flex-col items-center mt-1">
                      <div className={`w-3 h-3 rounded-full ${getEstadoColor(recomendacion.estado)}`} />
                      {onUpdateStatus && (
                        <div className="mt-2">
                          <select
                            value={recomendacion.estado || 'pendiente'}
                            onChange={(e) => {
                              e.stopPropagation();
                              onUpdateStatus(recomendacion.id, e.target.value as Recomendacion['estado']);
                            }}
                            className="text-xs border border-gray-300 rounded px-1 py-0.5"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <option value="pendiente">Pendiente</option>
                            <option value="en_progreso">En Progreso</option>
                            <option value="completada">Completada</option>
                          </select>
                        </div>
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        {getTipoIcon(recomendacion.tipo)}
                        <h4 className="font-semibold text-gray-900">{recomendacion.titulo}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPrioridadColor(recomendacion.prioridad)}`}>
                          {recomendacion.prioridad.toUpperCase()}
                        </span>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-2">{recomendacion.descripcion}</p>
                      
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <div className="flex items-center">
                          {CategoriaIcon}
                          <span className="ml-1 capitalize">
                            {recomendacion.categoria.replace('_', ' ')}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {recomendacion.plazo_estimado}
                        </div>
                        <div className="flex items-center">
                          <User className="h-3 w-3 mr-1" />
                          {recomendacion.responsable_sugerido}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="ml-4">
                    {isExpanded ? (
                      <ChevronDown className="h-5 w-5 text-gray-400" />
                    ) : (
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    )}
                  </div>
                </div>
              </div>

              {/* Contenido expandido */}
              {isExpanded && (
                <div className="px-4 pb-4 border-t border-gray-100 bg-gray-50">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    {/* Estudiantes objetivo */}
                    {recomendacion.estudiantes_objetivo && recomendacion.estudiantes_objetivo.length > 0 && (
                      <div>
                        <h5 className="font-medium text-gray-900 mb-2">Estudiantes Objetivo</h5>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {recomendacion.estudiantes_objetivo.map((estudiante, index) => (
                            <li key={index} className="flex items-center">
                              <User className="h-3 w-3 mr-2" />
                              {estudiante}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Recursos necesarios */}
                    <div>
                      <h5 className="font-medium text-gray-900 mb-2">Recursos Necesarios</h5>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {recomendacion.recursos_necesarios.map((recurso, index) => (
                          <li key={index} className="flex items-center">
                            <Activity className="h-3 w-3 mr-2" />
                            {recurso}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Indicadores de éxito */}
                    <div className="md:col-span-2">
                      <h5 className="font-medium text-gray-900 mb-2">Indicadores de Éxito</h5>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {recomendacion.indicadores_exito.map((indicador, index) => (
                          <li key={index} className="flex items-center">
                            <CheckCircle className="h-3 w-3 mr-2 text-green-500" />
                            {indicador}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {recomendacionesOrdenadas.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <Target className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p>No hay recomendaciones que coincidan con los filtros seleccionados.</p>
        </div>
      )}
    </div>
  );
};

// Datos de ejemplo para recomendaciones
export const recomendacionesEjemplo: Recomendacion[] = [
  {
    id: '1',
    titulo: 'Intervención Inmediata para Agresores Principales',
    descripcion: 'Implementar sesiones individuales de counseling para estudiantes identificados como agresores principales.',
    tipo: 'inmediata',
    prioridad: 'alta',
    categoria: 'intervencion_individual',
    estudiantes_objetivo: ['Isabella León', 'Mía Cardozo'],
    recursos_necesarios: ['Psicólogo escolar', 'Espacio privado para sesiones', 'Material terapéutico'],
    plazo_estimado: '2-4 semanas',
    indicadores_exito: [
      'Reducción del 50% en reportes de agresión',
      'Mejora en habilidades de autorregulación emocional',
      'Participación activa en actividades de grupo'
    ],
    responsable_sugerido: 'Psicólogo Escolar',
    estado: 'pendiente'
  },
  {
    id: '2',
    titulo: 'Programa de Apoyo para Víctimas',
    descripcion: 'Desarrollar un programa de fortalecimiento de autoestima y habilidades sociales para estudiantes vulnerables.',
    tipo: 'corto_plazo',
    prioridad: 'alta',
    categoria: 'intervencion_individual',
    estudiantes_objetivo: ['Paulina Bermúdez', 'María Paula Amaya'],
    recursos_necesarios: ['Trabajador social', 'Talleres grupales', 'Material de apoyo psicológico'],
    plazo_estimado: '4-6 semanas',
    indicadores_exito: [
      'Aumento en la participación en actividades grupales',
      'Mejora en indicadores de autoestima',
      'Reducción en reportes de victimización'
    ],
    responsable_sugerido: 'Trabajador Social',
    estado: 'pendiente'
  },
  {
    id: '3',
    titulo: 'Reestructuración del Ambiente de Aula',
    descripcion: 'Reorganizar la distribución física del aula y establecer zonas de convivencia positiva.',
    tipo: 'corto_plazo',
    prioridad: 'media',
    categoria: 'ambiente_escolar',
    recursos_necesarios: ['Mobiliario flexible', 'Señalización visual', 'Espacios de relajación'],
    plazo_estimado: '2-3 semanas',
    indicadores_exito: [
      'Reducción del 30% en incidentes en el aula',
      'Mejora en la dinámica de trabajo grupal',
      'Aumento en la satisfacción del ambiente escolar'
    ],
    responsable_sugerido: 'Coordinador Académico',
    estado: 'en_progreso'
  },
  {
    id: '4',
    titulo: 'Capacitación Docente en Detección Temprana',
    descripcion: 'Entrenar a los docentes en técnicas de identificación y manejo de situaciones de bullying.',
    tipo: 'mediano_plazo',
    prioridad: 'alta',
    categoria: 'capacitacion_docente',
    recursos_necesarios: ['Facilitador especializado', 'Material de capacitación', 'Tiempo de formación'],
    plazo_estimado: '6-8 semanas',
    indicadores_exito: [
      'Aumento del 80% en detección temprana de casos',
      'Mejora en protocolos de intervención',
      'Reducción en escalamiento de conflictos'
    ],
    responsable_sugerido: 'Director Académico',
    estado: 'pendiente'
  }
];

export default InterventionRecommendations;