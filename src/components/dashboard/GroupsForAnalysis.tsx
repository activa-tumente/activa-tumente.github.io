import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { BarChart } from 'lucide-react';

const GroupsForAnalysis = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [groups, setGroups] = useState<any[]>([]);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log("Iniciando carga de datos de grupos...");

        // Obtener los grupos con sus instituciones educativas
        const { data: groupsData, error: groupsError } = await supabase
          .from('grupos')
          .select(`
            id,
            nombre,
            institucion_id,
            instituciones_educativas(nombre)
          `)
          .order('nombre');

        if (groupsError) throw groupsError;
        console.log("Grupos obtenidos:", groupsData);

        // PASO 1: Obtener conteo de estudiantes y respuestas por grupo usando una consulta más eficiente
        console.log("Obteniendo conteo de estudiantes y respuestas por grupo...");

        // Crear una consulta SQL personalizada para obtener los conteos directamente
        const { data: groupStats, error: groupStatsError } = await supabase
          .rpc('get_groups_with_responses');

        if (groupStatsError) {
          console.error("Error al obtener estadísticas de grupos:", groupStatsError);

          // Si la función RPC no existe, usamos un enfoque alternativo
          console.log("Usando enfoque alternativo para contar estudiantes y respuestas...");

          // Obtener todos los estudiantes
          const { data: studentsData, error: studentsError } = await supabase
            .from('estudiantes')
            .select('id, grado, institucion_id');

          if (studentsError) throw studentsError;
          console.log("Estudiantes obtenidos:", studentsData?.length || 0);

          // Obtener todas las respuestas
          const { data: responsesData, error: responsesError } = await supabase
            .from('respuestas')
            .select('estudiante_id, grupo_id, pregunta_id');

          if (responsesError) throw responsesError;
          console.log("Respuestas obtenidas:", responsesData?.length || 0);

          // PASO 2: Contar estudiantes por grupo
          const studentCounts = {};

          if (studentsData && groupsData) {
            // Agrupar estudiantes por grado (que corresponde al nombre del grupo)
            studentsData.forEach(student => {
              const grado = student.grado;
              if (grado) {
                // Buscar el grupo correspondiente por nombre
                const matchingGroup = groupsData.find(g => g.nombre === grado);

                if (matchingGroup) {
                  if (!studentCounts[matchingGroup.id]) {
                    studentCounts[matchingGroup.id] = 0;
                  }
                  studentCounts[matchingGroup.id]++;
                }
              }
            });
          }

          console.log("Conteo de estudiantes por grupo:", studentCounts);

          // PASO 3: Contar estudiantes únicos con respuestas por grupo
          const responseCounts = {};

          if (responsesData) {
            // Crear un mapa para contar estudiantes únicos por grupo
            const uniqueStudentsByGroup = new Map<string, Set<string>>();

            // Procesar todas las respuestas
            responsesData.forEach(response => {
              if (response.grupo_id && response.estudiante_id) {
                // Si no existe una entrada para este grupo, crearla
                if (!uniqueStudentsByGroup.has(response.grupo_id)) {
                  uniqueStudentsByGroup.set(response.grupo_id, new Set());
                }

                // Añadir el estudiante al conjunto de estudiantes de este grupo
                uniqueStudentsByGroup.get(response.grupo_id)?.add(response.estudiante_id);
              }
            });

            // Convertir el mapa a un objeto para facilitar su uso
            uniqueStudentsByGroup.forEach((students, groupId) => {
              responseCounts[groupId] = students.size;
            });
          }

          console.log("Conteo de estudiantes con respuestas por grupo:", responseCounts);

          // PASO 4: Combinar los datos
          let data;

          if (groupStats) {
            // Si tenemos datos de la función RPC, usarlos directamente
            console.log("Usando datos de la función RPC:", groupStats);

            // Mapear los datos de la función RPC a la estructura esperada
            data = groupsData?.map(group => {
              // Buscar las estadísticas para este grupo
              const stats = groupStats.find((g: any) => g.id === group.id) || {
                estudiantes_count: 0,
                estudiantes_con_respuestas_count: 0
              };

              return {
                ...group,
                student_count: stats.estudiantes_count || 0,
                responses_count: stats.estudiantes_con_respuestas_count || 0
              };
            });
          } else {

            // Si no tenemos datos de la función RPC, usar los datos calculados manualmente
            data = groupsData?.map(group => {
              // Para depuración, imprimir los datos específicos de cada grupo
              console.log(`Datos del grupo ${group.nombre} (ID: ${group.id}):`, {
                studentCount: studentCounts[group.id] || 0,
                responseCount: responseCounts[group.id] || 0
              });

              return {
                ...group,
                student_count: studentCounts[group.id] || 0,
                responses_count: responseCounts[group.id] || 0
              };
            });
          }

          // Mostrar todos los grupos, incluso los que no tienen respuestas
          setGroups(data || []);
          console.log("Datos finales de grupos:", data);
        }


      } catch (err: any) {
        console.error('Error al cargar grupos:', err);
        setError(err.message || 'Error al cargar grupos');
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, []);

  if (loading) {
    return <div className="p-4 text-center text-gray-500">Cargando grupos...</div>;
  }

  if (error) {
    return (
      <div className="p-4 bg-red-100 border-l-4 border-red-500 text-red-700">
        <p className="font-bold">Error</p>
        <p>{error}</p>
      </div>
    );
  }

  if (groups.length === 0) {
    return (
      <div className="p-4 bg-blue-100 border-l-4 border-blue-500 text-blue-700">
        <p>No hay grupos disponibles para análisis.</p>
        <p className="mt-2">Para ver análisis, primero debe haber grupos configurados en el sistema.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {groups.map(group => (
        <Link
          key={group.id}
          to={`/admin/dashboard/${group.id}/general`}
          className="block p-4 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
          onClick={(e) => {
            // Guardar el ID del grupo actual en localStorage para futuras referencias
            localStorage.setItem('lastVisitedGroupId', group.id);
          }}
        >
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-900">{group.nombre}</h3>
              <p className="text-sm text-gray-500">{group.instituciones_educativas?.nombre}</p>
              <div className="mt-2 flex space-x-4">
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                  {group.student_count} estudiantes
                </span>
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                  {group.responses_count} con respuestas
                </span>
              </div>
            </div>
            <div className="bg-purple-100 p-2 rounded-full">
              <BarChart className="h-5 w-5 text-purple-800" />
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default GroupsForAnalysis;