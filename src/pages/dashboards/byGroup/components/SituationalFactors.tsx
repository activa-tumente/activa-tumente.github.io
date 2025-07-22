import React, { useState, useEffect } from 'react';
import { MapPin, Clock, AlertTriangle, Filter, Info } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface Student {
  id: string;
  nombre: string;
  apellido: string;
  genero?: string;
  edad?: number;
}

interface Response {
  id: string;
  estudiante_id: string;
  pregunta_id: string;
  respuesta: string;
  estudiante?: {
    id: string;
    nombre: string;
    apellido: string;
    genero?: string;
  };
  pregunta?: {
    id: string;
    texto: string;
    tipo: string;
    categoria: string;
  };
}

interface SituationalFactorsProps {
  students: Student[];
  responses: Response[];
  filters: Record<string, string>;
}

// Colores para los gráficos
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

/**
 * Componente que muestra los factores situacionales del bullying en el grupo
 */
const SituationalFactors: React.FC<SituationalFactorsProps> = ({ students, responses, filters }) => {
  const [situationalData, setSituationalData] = useState<any>(null);
  const [selectedFactor, setSelectedFactor] = useState<string>('place');

  // Procesar datos situacionales cuando cambian los estudiantes o respuestas
  useEffect(() => {
    if (students.length === 0 || responses.length === 0) return;

    // Filtrar respuestas según los filtros activos
    const filteredResponses = responses.filter(response => {
      // Filtrar por tipo de bullying
      if (filters.bullyingType && response.pregunta?.texto.includes('tipo de agresión')) {
        const types = response.respuesta.split(',').map(t => t.trim().toLowerCase());
        if (!types.includes(filters.bullyingType.toLowerCase())) {
          return false;
        }
      }
      
      // Filtrar por lugar
      if (filters.bullyingPlace && response.pregunta?.texto.includes('lugar donde ocurre')) {
        const places = response.respuesta.split(',').map(p => p.trim().toLowerCase());
        if (!places.includes(filters.bullyingPlace.toLowerCase())) {
          return false;
        }
      }
      
      return true;
    });

    // Procesar respuestas para identificar factores situacionales
    const processSituationalData = () => {
      // Contadores para diferentes lugares
      const placesCounts: Record<string, number> = {
        'aula': 0,
        'patio': 0,
        'pasillos': 0,
        'baños': 0,
        'comedor': 0,
        'fuera del colegio': 0,
        'redes sociales': 0,
        'otro': 0
      };

      // Contadores para diferentes horarios
      const timesCounts: Record<string, number> = {
        'entrada': 0,
        'clases': 0,
        'recreo': 0,
        'almuerzo': 0,
        'salida': 0,
        'fuera del horario escolar': 0,
        'otro': 0
      };

      // Contadores para diferentes tipos de agresión
      const typesCounts: Record<string, number> = {
        'físico': 0,
        'verbal': 0,
        'social': 0,
        'psicológico': 0,
        'cibernético': 0,
        'otro': 0
      };

      // Procesar respuestas relacionadas con factores situacionales
      filteredResponses.forEach(response => {
        // Analizar lugares donde ocurre el bullying
        if (response.pregunta?.texto.includes('lugar donde ocurre')) {
          const places = response.respuesta.split(',').map(p => p.trim().toLowerCase());
          places.forEach(place => {
            if (place in placesCounts) {
              placesCounts[place]++;
            } else {
              placesCounts['otro']++;
            }
          });
        }

        // Analizar horarios donde ocurre el bullying
        if (response.pregunta?.texto.includes('momento del día') || response.pregunta?.texto.includes('horario')) {
          const times = response.respuesta.split(',').map(t => t.trim().toLowerCase());
          times.forEach(time => {
            if (time in timesCounts) {
              timesCounts[time]++;
            } else {
              timesCounts['otro']++;
            }
          });
        }

        // Analizar tipos de agresión
        if (response.pregunta?.texto.includes('tipo de agresión')) {
          const types = response.respuesta.split(',').map(t => t.trim().toLowerCase());
          types.forEach(type => {
            if (type in typesCounts) {
              typesCounts[type]++;
            } else {
              typesCounts['otro']++;
            }
          });
        }
      });

      // Preparar datos para gráficos
      const placesData = Object.entries(placesCounts)
        .filter(([_, value]) => value > 0)
        .map(([name, value]) => ({ name, value }));

      const timesData = Object.entries(timesCounts)
        .filter(([_, value]) => value > 0)
        .map(([name, value]) => ({ name, value }));

      const typesData = Object.entries(typesCounts)
        .filter(([_, value]) => value > 0)
        .map(([name, value]) => ({ name, value }));

      // Identificar patrones de riesgo
      const riskPatterns = [];
      
      // Patrón 1: Alta concentración en un lugar específico
      const maxPlaceCount = Math.max(...Object.values(placesCounts));
      const maxPlaceName = Object.entries(placesCounts).find(([_, value]) => value === maxPlaceCount)?.[0];
      if (maxPlaceCount > 5 && maxPlaceName) {
        riskPatterns.push({
          type: 'place',
          description: `Alta concentración de incidentes en ${maxPlaceName}`,
          severity: 'high'
        });
      }

      // Patrón 2: Alta concentración en un horario específico
      const maxTimeCount = Math.max(...Object.values(timesCounts));
      const maxTimeName = Object.entries(timesCounts).find(([_, value]) => value === maxTimeCount)?.[0];
      if (maxTimeCount > 5 && maxTimeName) {
        riskPatterns.push({
          type: 'time',
          description: `Alta concentración de incidentes durante ${maxTimeName}`,
          severity: 'medium'
        });
      }

      // Patrón 3: Predominancia de un tipo de agresión
      const maxTypeCount = Math.max(...Object.values(typesCounts));
      const maxTypeName = Object.entries(typesCounts).find(([_, value]) => value === maxTypeCount)?.[0];
      const totalTypes = Object.values(typesCounts).reduce((sum, count) => sum + count, 0);
      if (maxTypeCount > 0 && totalTypes > 0 && (maxTypeCount / totalTypes > 0.6) && maxTypeName) {
        riskPatterns.push({
          type: 'type',
          description: `Predominancia de agresión ${maxTypeName}`,
          severity: maxTypeName === 'físico' || maxTypeName === 'cibernético' ? 'high' : 'medium'
        });
      }

      // Guardar todos los datos procesados
      setSituationalData({
        places: placesData,
        times: timesData,
        types: typesData,
        riskPatterns
      });
    };

    processSituationalData();
  }, [students, responses, filters]);

  // Renderizar recomendaciones según el factor seleccionado
  const renderRecommendations = () => {
    if (!situationalData) return null;

    switch (selectedFactor) {
      case 'place':
        return (
          <div className="bg-white p-4 rounded-lg border border-gray-200 mt-4">
            <h4 className="font-medium text-gray-800 mb-2">Recomendaciones por Lugar</h4>
            <p className="text-gray-600 text-sm mb-3">
              {situationalData.places.length > 0 ? (
                `Los incidentes se concentran principalmente en ${situationalData.places[0].name}.`
              ) : 'No hay datos suficientes sobre lugares de incidentes.'}
            </p>
            {situationalData.places.length > 0 && (
              <div className="bg-blue-50 p-3 rounded-lg">
                <h5 className="font-medium text-blue-800 text-sm mb-1">Acciones sugeridas</h5>
                <ul className="text-blue-700 text-xs list-disc pl-4">
                  <li>Aumentar la supervisión en {situationalData.places[0].name}</li>
                  <li>Implementar un sistema de vigilancia por pares en zonas de riesgo</li>
                  <li>Reorganizar espacios para mejorar la visibilidad y reducir zonas aisladas</li>
                </ul>
              </div>
            )}
          </div>
        );
      case 'time':
        return (
          <div className="bg-white p-4 rounded-lg border border-gray-200 mt-4">
            <h4 className="font-medium text-gray-800 mb-2">Recomendaciones por Horario</h4>
            <p className="text-gray-600 text-sm mb-3">
              {situationalData.times.length > 0 ? (
                `Los incidentes ocurren principalmente durante ${situationalData.times[0].name}.`
              ) : 'No hay datos suficientes sobre horarios de incidentes.'}
            </p>
            {situationalData.times.length > 0 && (
              <div className="bg-blue-50 p-3 rounded-lg">
                <h5 className="font-medium text-blue-800 text-sm mb-1">Acciones sugeridas</h5>
                <ul className="text-blue-700 text-xs list-disc pl-4">
                  <li>Reforzar la supervisión durante {situationalData.times[0].name}</li>
                  <li>Implementar actividades estructuradas durante este horario</li>
                  <li>Capacitar a los docentes para intervención temprana en estos momentos</li>
                </ul>
              </div>
            )}
          </div>
        );
      case 'type':
        return (
          <div className="bg-white p-4 rounded-lg border border-gray-200 mt-4">
            <h4 className="font-medium text-gray-800 mb-2">Recomendaciones por Tipo de Agresión</h4>
            <p className="text-gray-600 text-sm mb-3">
              {situationalData.types.length > 0 ? (
                `El tipo de agresión predominante es ${situationalData.types[0].name}.`
              ) : 'No hay datos suficientes sobre tipos de agresión.'}
            </p>
            {situationalData.types.length > 0 && (
              <div className="bg-blue-50 p-3 rounded-lg">
                <h5 className="font-medium text-blue-800 text-sm mb-1">Acciones sugeridas</h5>
                <ul className="text-blue-700 text-xs list-disc pl-4">
                  {situationalData.types[0].name === 'físico' ? (
                    <>
                      <li>Implementar protocolos específicos para prevenir agresiones físicas</li>
                      <li>Capacitar al personal en técnicas de intervención segura</li>
                      <li>Establecer consecuencias claras para agresiones físicas</li>
                    </>
                  ) : situationalData.types[0].name === 'verbal' ? (
                    <>
                      <li>Desarrollar programas de comunicación asertiva</li>
                      <li>Implementar campañas de respeto y lenguaje positivo</li>
                      <li>Trabajar en el reconocimiento de agresiones verbales</li>
                    </>
                  ) : situationalData.types[0].name === 'social' ? (
                    <>
                      <li>Implementar actividades de inclusión y cohesión grupal</li>
                      <li>Trabajar en la empatía y el reconocimiento de la exclusión</li>
                      <li>Fomentar la integración de todos los estudiantes</li>
                    </>
                  ) : situationalData.types[0].name === 'cibernético' ? (
                    <>
                      <li>Desarrollar programas de ciudadanía digital</li>
                      <li>Establecer protocolos para reportar ciberbullying</li>
                      <li>Educar sobre el uso responsable de redes sociales</li>
                    </>
                  ) : (
                    <>
                      <li>Implementar programas generales de prevención del bullying</li>
                      <li>Capacitar a la comunidad educativa en detección temprana</li>
                      <li>Establecer canales seguros para reportar incidentes</li>
                    </>
                  )}
                </ul>
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  if (!situationalData) {
    return (
      <div className="bg-gray-50 p-8 rounded-lg text-center">
        <p className="text-gray-600">Procesando datos situacionales...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-6">
        <div className="flex">
          <MapPin className="h-6 w-6 text-amber-600 mr-2" />
          <div>
            <h4 className="font-medium text-amber-800">Factores Situacionales</h4>
            <p className="text-sm text-amber-700">
              Este análisis muestra dónde, cuándo y cómo ocurren las situaciones de bullying,
              permitiendo identificar patrones y desarrollar intervenciones específicas.
            </p>
          </div>
        </div>
      </div>
      
      {/* Patrones de riesgo identificados */}
      {situationalData.riskPatterns.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center mb-3">
            <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
            <h4 className="font-medium text-red-800">Patrones de Riesgo Identificados</h4>
          </div>
          <ul className="space-y-2">
            {situationalData.riskPatterns.map((pattern: any, index: number) => (
              <li key={index} className="flex items-start">
                <span className={`inline-block w-2 h-2 rounded-full mt-1.5 mr-2 ${
                  pattern.severity === 'high' ? 'bg-red-500' : 
                  pattern.severity === 'medium' ? 'bg-amber-500' : 'bg-blue-500'
                }`}></span>
                <span className="text-sm text-gray-700">{pattern.description}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {/* Gráficos de factores situacionales */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Gráfico por lugar */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center mb-3">
            <MapPin className="h-5 w-5 text-blue-600 mr-2" />
            <h4 className="font-medium text-gray-800">Por Lugar</h4>
          </div>
          
          {situationalData.places.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={situationalData.places}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#0088FE" name="Casos" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              <p className="text-gray-500">No hay datos disponibles</p>
            </div>
          )}
        </div>
        
        {/* Gráfico por horario */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center mb-3">
            <Clock className="h-5 w-5 text-green-600 mr-2" />
            <h4 className="font-medium text-gray-800">Por Horario</h4>
          </div>
          
          {situationalData.times.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={situationalData.times}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#00C49F" name="Casos" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              <p className="text-gray-500">No hay datos disponibles</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Gráfico por tipo de agresión */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex items-center mb-3">
          <AlertTriangle className="h-5 w-5 text-amber-600 mr-2" />
          <h4 className="font-medium text-gray-800">Por Tipo de Agresión</h4>
        </div>
        
        {situationalData.types.length > 0 ? (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={situationalData.types}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {situationalData.types.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <p className="text-gray-500">No hay datos disponibles</p>
          </div>
        )}
      </div>
      
      {/* Selector de factores para recomendaciones */}
      <div className="mb-4">
        <h4 className="font-medium text-gray-800 mb-3">Seleccionar factor para recomendaciones:</h4>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedFactor('place')}
            className={`px-3 py-1 rounded-full text-sm ${selectedFactor === 'place' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            Lugar
          </button>
          <button
            onClick={() => setSelectedFactor('time')}
            className={`px-3 py-1 rounded-full text-sm ${selectedFactor === 'time' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            Horario
          </button>
          <button
            onClick={() => setSelectedFactor('type')}
            className={`px-3 py-1 rounded-full text-sm ${selectedFactor === 'type' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            Tipo de Agresión
          </button>
        </div>
      </div>
      
      {/* Recomendaciones según el factor seleccionado */}
      {renderRecommendations()}
    </div>
  );
};

export default SituationalFactors;