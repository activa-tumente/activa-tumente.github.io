import React, { useState, useEffect } from 'react';
import { Users, UserPlus, UserMinus, Info, Activity, Heart } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

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

interface GroupCohesionProps {
  students: Student[];
  responses: Response[];
  filters: Record<string, string>;
}

/**
 * Componente que muestra métricas de cohesión grupal
 */
const GroupCohesion: React.FC<GroupCohesionProps> = ({ students, responses, filters }) => {
  const [cohesionData, setCohesionData] = useState<any>(null);
  const [selectedMetric, setSelectedMetric] = useState<string>('general');

  // Procesar datos de cohesión cuando cambian los estudiantes o respuestas
  useEffect(() => {
    if (students.length === 0 || responses.length === 0) return;

    // Filtrar estudiantes y respuestas según los filtros activos
    const filteredStudents = students.filter(student => {
      // Filtrar por género
      if (filters.gender && student.genero !== filters.gender) {
        return false;
      }
      
      // Filtrar por edad
      if (filters.ageRange && student.edad) {
        const [minAge, maxAge] = filters.ageRange.split('-').map(Number);
        if (student.edad < minAge || student.edad > maxAge) {
          return false;
        }
      }
      
      return true;
    });

    // Procesar respuestas para calcular métricas de cohesión
    const processCohesionData = () => {
      // Contadores para diferentes métricas
      const metrics = {
        // Índice de cohesión general (proporción de elecciones positivas vs total posible)
        generalCohesion: 0,
        // Índice de reciprocidad (proporción de elecciones mutuas)
        reciprocityIndex: 0,
        // Densidad de la red (proporción de conexiones existentes vs posibles)
        networkDensity: 0,
        // Centralización (grado en que la red está centralizada en pocos estudiantes)
        centralization: 0,
        // Fragmentación (número de subgrupos aislados)
        fragmentation: 0
      };

      // Matriz de relaciones positivas
      const positiveRelations: Record<string, string[]> = {};
      filteredStudents.forEach(student => {
        positiveRelations[student.id] = [];
      });

      // Contar elecciones positivas
      let totalPositiveChoices = 0;
      let reciprocalChoices = 0;

      // Procesar respuestas de aceptación
      responses.forEach(response => {
        if (response.pregunta?.categoria === 'aceptacion') {
          const fromStudentId = response.estudiante_id;
          const toStudentIds = response.respuesta.split(',').map(id => id.trim());
          
          // Registrar elecciones positivas
          toStudentIds.forEach(toStudentId => {
            if (positiveRelations[fromStudentId]) {
              positiveRelations[fromStudentId].push(toStudentId);
              totalPositiveChoices++;
            }
          });
        }
      });

      // Calcular elecciones recíprocas
      Object.entries(positiveRelations).forEach(([studentId, choices]) => {
        choices.forEach(choiceId => {
          if (
            positiveRelations[choiceId] && 
            positiveRelations[choiceId].includes(studentId)
          ) {
            reciprocalChoices++;
          }
        });
      });
      // Dividir por 2 para no contar dos veces cada relación recíproca
      reciprocalChoices = reciprocalChoices / 2;

      // Calcular métricas
      const totalStudents = filteredStudents.length;
      const totalPossibleChoices = totalStudents * (totalStudents - 1);
      
      // Índice de cohesión general
      metrics.generalCohesion = totalPossibleChoices > 0 ? 
        (totalPositiveChoices / totalPossibleChoices) * 100 : 0;
      
      // Índice de reciprocidad
      metrics.reciprocityIndex = totalPositiveChoices > 0 ? 
        (reciprocalChoices / (totalPositiveChoices / 2)) * 100 : 0;
      
      // Densidad de la red
      metrics.networkDensity = totalPossibleChoices > 0 ? 
        (totalPositiveChoices / totalPossibleChoices) * 100 : 0;

      // Centralización (simplificado)
      // Contar el número máximo de elecciones recibidas por un estudiante
      const inDegrees: Record<string, number> = {};
      filteredStudents.forEach(student => {
        inDegrees[student.id] = 0;
      });

      Object.values(positiveRelations).forEach(choices => {
        choices.forEach(choiceId => {
          if (inDegrees[choiceId] !== undefined) {
            inDegrees[choiceId]++;
          }
        });
      });

      const maxInDegree = Math.max(...Object.values(inDegrees));
      const sumOfDifferences = Object.values(inDegrees).reduce(
        (sum, degree) => sum + (maxInDegree - degree), 
        0
      );

      const maxPossibleCentralization = totalStudents > 1 ? 
        (totalStudents - 1) * (totalStudents - 1) : 0;

      metrics.centralization = maxPossibleCentralization > 0 ? 
        (sumOfDifferences / maxPossibleCentralization) * 100 : 0;

      // Identificar subgrupos (simplificado)
      // Usar un algoritmo simple de componentes conectados
      const visited: Record<string, boolean> = {};
      let subgroups = 0;

      const dfs = (studentId: string) => {
        visited[studentId] = true;
        positiveRelations[studentId].forEach(peerId => {
          if (!visited[peerId]) {
            dfs(peerId);
          }
        });
      };

      filteredStudents.forEach(student => {
        if (!visited[student.id]) {
          dfs(student.id);
          subgroups++;
        }
      });

      metrics.fragmentation = subgroups;

      // Preparar datos para gráficos
      const radarData = [
        {
          metric: 'Cohesión',
          value: metrics.generalCohesion,
          fullMark: 100
        },
        {
          metric: 'Reciprocidad',
          value: metrics.reciprocityIndex,
          fullMark: 100
        },
        {
          metric: 'Densidad',
          value: metrics.networkDensity,
          fullMark: 100
        },
        {
          metric: 'Centralización',
          value: 100 - metrics.centralization, // Invertir para que valores altos sean mejores
          fullMark: 100
        },
        {
          metric: 'Integración',
          value: totalStudents > 0 ? 
            (1 - (metrics.fragmentation / totalStudents)) * 100 : 0,
          fullMark: 100
        }
      ];

      setCohesionData({
        metrics,
        radarData,
        subgroups
      });
    };

    processCohesionData();
  }, [students, responses, filters]);

  // Renderizar interpretación según la métrica seleccionada
  const renderInterpretation = () => {
    if (!cohesionData) return null;

    const { metrics } = cohesionData;

    switch (selectedMetric) {
      case 'general':
        return (
          <div className="bg-white p-4 rounded-lg border border-gray-200 mt-4">
            <h4 className="font-medium text-gray-800 mb-2">Interpretación de la Cohesión Grupal</h4>
            <p className="text-gray-600 text-sm mb-3">
              El índice de cohesión general del grupo es de <span className="font-semibold">{metrics.generalCohesion.toFixed(1)}%</span>.
              {metrics.generalCohesion > 70 ? (
                ' Esto indica un grupo con alta cohesión, donde la mayoría de los estudiantes mantienen relaciones positivas entre sí.'
              ) : metrics.generalCohesion > 40 ? (
                ' El grupo muestra una cohesión moderada, con un balance entre relaciones positivas y neutrales.'
              ) : (
                ' La cohesión del grupo es baja, lo que sugiere posibles dificultades en las relaciones interpersonales.'
              )}
            </p>
            <div className="bg-blue-50 p-3 rounded-lg">
              <h5 className="font-medium text-blue-800 text-sm mb-1">Recomendaciones</h5>
              {metrics.generalCohesion > 70 ? (
                <p className="text-blue-700 text-xs">
                  Mantener las dinámicas positivas del grupo y reforzar la inclusión de todos los miembros.
                </p>
              ) : metrics.generalCohesion > 40 ? (
                <p className="text-blue-700 text-xs">
                  Implementar actividades de integración grupal y fomentar la cooperación entre estudiantes.
                </p>
              ) : (
                <p className="text-blue-700 text-xs">
                  Se recomienda intervención prioritaria con actividades de cohesión grupal y mediación de conflictos.
                </p>
              )}
            </div>
          </div>
        );
      case 'reciprocity':
        return (
          <div className="bg-white p-4 rounded-lg border border-gray-200 mt-4">
            <h4 className="font-medium text-gray-800 mb-2">Interpretación de la Reciprocidad</h4>
            <p className="text-gray-600 text-sm mb-3">
              El índice de reciprocidad es de <span className="font-semibold">{metrics.reciprocityIndex.toFixed(1)}%</span>.
              {metrics.reciprocityIndex > 60 ? (
                ' Esto indica un alto nivel de relaciones mutuas, donde las elecciones son correspondidas.'
              ) : metrics.reciprocityIndex > 30 ? (
                ' El grupo muestra un nivel moderado de reciprocidad en sus relaciones.'
              ) : (
                ' La reciprocidad es baja, lo que sugiere relaciones unidireccionales o desequilibradas.'
              )}
            </p>
          </div>
        );
      case 'density':
        return (
          <div className="bg-white p-4 rounded-lg border border-gray-200 mt-4">
            <h4 className="font-medium text-gray-800 mb-2">Interpretación de la Densidad de Red</h4>
            <p className="text-gray-600 text-sm mb-3">
              La densidad de la red social es de <span className="font-semibold">{metrics.networkDensity.toFixed(1)}%</span>.
              {metrics.networkDensity > 60 ? (
                ' Esto indica una red densa con muchas conexiones entre estudiantes.'
              ) : metrics.networkDensity > 30 ? (
                ' La red muestra una densidad moderada con un número razonable de conexiones.'
              ) : (
                ' La red es poco densa, con pocas conexiones entre los miembros del grupo.'
              )}
            </p>
          </div>
        );
      case 'centralization':
        return (
          <div className="bg-white p-4 rounded-lg border border-gray-200 mt-4">
            <h4 className="font-medium text-gray-800 mb-2">Interpretación de la Centralización</h4>
            <p className="text-gray-600 text-sm mb-3">
              El índice de centralización es de <span className="font-semibold">{metrics.centralization.toFixed(1)}%</span>.
              {metrics.centralization > 60 ? (
                ' Esto indica un grupo altamente centralizado, donde unos pocos estudiantes concentran la mayoría de las elecciones.'
              ) : metrics.centralization > 30 ? (
                ' El grupo muestra una centralización moderada.'
              ) : (
                ' La centralización es baja, lo que sugiere una distribución más equitativa de las relaciones.'
              )}
            </p>
          </div>
        );
      case 'fragmentation':
        return (
          <div className="bg-white p-4 rounded-lg border border-gray-200 mt-4">
            <h4 className="font-medium text-gray-800 mb-2">Interpretación de la Fragmentación</h4>
            <p className="text-gray-600 text-sm mb-3">
              Se han identificado <span className="font-semibold">{cohesionData.subgroups}</span> subgrupos en la clase.
              {cohesionData.subgroups > 3 ? (
                ' El grupo muestra una alta fragmentación, con varios subgrupos aislados entre sí.'
              ) : cohesionData.subgroups > 1 ? (
                ' Existe cierta fragmentación en el grupo, con algunos subgrupos identificables.'
              ) : (
                ' El grupo muestra una buena integración, sin fragmentación significativa.'
              )}
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  if (!cohesionData) {
    return (
      <div className="bg-gray-50 p-8 rounded-lg text-center">
        <p className="text-gray-600">Procesando datos de cohesión grupal...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
        <div className="flex">
          <Heart className="h-6 w-6 text-blue-600 mr-2" />
          <div>
            <h4 className="font-medium text-blue-800">Cohesión Grupal</h4>
            <p className="text-sm text-blue-700">
              Este análisis muestra las métricas de cohesión del grupo, incluyendo
              reciprocidad, densidad de la red social y centralización.
            </p>
          </div>
        </div>
      </div>
      
      {/* Gráfico de radar para métricas de cohesión */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Métricas de Cohesión</h3>
        
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={cohesionData.radarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="metric" />
              <PolarRadiusAxis angle={30} domain={[0, 100]} />
              <Radar
                name="Cohesión"
                dataKey="value"
                stroke="#8884d8"
                fill="#8884d8"
                fillOpacity={0.6}
              />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </div>
        
        {/* Selector de métricas para interpretación */}
        <div className="mt-6">
          <h4 className="font-medium text-gray-800 mb-3">Seleccionar métrica para interpretación:</h4>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedMetric('general')}
              className={`px-3 py-1 rounded-full text-sm ${selectedMetric === 'general' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              Cohesión General
            </button>
            <button
              onClick={() => setSelectedMetric('reciprocity')}
              className={`px-3 py-1 rounded-full text-sm ${selectedMetric === 'reciprocity' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              Reciprocidad
            </button>
            <button
              onClick={() => setSelectedMetric('density')}
              className={`px-3 py-1 rounded-full text-sm ${selectedMetric === 'density' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              Densidad de Red
            </button>
            <button
              onClick={() => setSelectedMetric('centralization')}
              className={`px-3 py-1 rounded-full text-sm ${selectedMetric === 'centralization' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              Centralización
            </button>
            <button
              onClick={() => setSelectedMetric('fragmentation')}
              className={`px-3 py-1 rounded-full text-sm ${selectedMetric === 'fragmentation' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              Fragmentación
            </button>
          </div>
        </div>
        
        {/* Interpretación de la métrica seleccionada */}
        {renderInterpretation()}
      </div>
      
      {/* Resumen de métricas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center mb-2">
            <Activity className="h-5 w-5 text-blue-600 mr-2" />
            <h4 className="font-medium text-gray-800">Índice de Cohesión</h4>
          </div>
          <p className="text-2xl font-bold text-blue-700">{cohesionData.metrics.generalCohesion.toFixed(1)}%</p>
          <p className="text-xs text-gray-600">Proporción de elecciones positivas</p>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center mb-2">
            <UserPlus className="h-5 w-5 text-green-600 mr-2" />
            <h4 className="font-medium text-gray-800">Reciprocidad</h4>
          </div>
          <p className="text-2xl font-bold text-green-700">{cohesionData.metrics.reciprocityIndex.toFixed(1)}%</p>
          <p className="text-xs text-gray-600">Elecciones mutuas</p>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center mb-2">
            <Users className="h-5 w-5 text-amber-600 mr-2" />
            <h4 className="font-medium text-gray-800">Subgrupos</h4>
          </div>
          <p className="text-2xl font-bold text-amber-700">{cohesionData.subgroups}</p>
          <p className="text-xs text-gray-600">Número de subgrupos identificados</p>
        </div>
      </div>
    </div>
  );
};

export default GroupCohesion;