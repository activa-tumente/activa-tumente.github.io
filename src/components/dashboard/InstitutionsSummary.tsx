import React, { useState, useEffect } from 'react';
import { School, Users, CheckSquare, AlertCircle } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';

interface InstitutionsSummaryProps {
  className?: string;
}

const InstitutionsSummary: React.FC<InstitutionsSummaryProps> = ({ className = '' }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    institutionsCount: 0,
    groupsCount: 0,
    studentsCount: 0,
    completedSurveysCount: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);

        // Obtener conteo de instituciones
        const { count: institutionsCount, error: institutionsError } = await supabase
          .from('instituciones_educativas')
          .select('*', { count: 'exact', head: true });

        if (institutionsError) throw institutionsError;

        // Obtener conteo de grupos
        const { count: groupsCount, error: groupsError } = await supabase
          .from('grupos')
          .select('*', { count: 'exact', head: true });

        if (groupsError) throw groupsError;

        // Obtener conteo de estudiantes
        const { count: studentsCount, error: studentsError } = await supabase
          .from('estudiantes')
          .select('*', { count: 'exact', head: true });

        if (studentsError) throw studentsError;

        // Obtener estudiantes únicos que han completado cuestionarios
        // Primero verificamos si la tabla respuestas tiene el campo grupo_id
        const { data: tableInfo, error: tableError } = await supabase
          .from('respuestas')
          .select('*')
          .limit(1);

        if (tableError) throw tableError;

        // Determinar si la tabla tiene el campo grupo_id
        const hasGrupoId = tableInfo && tableInfo.length > 0 && 'grupo_id' in tableInfo[0];

        // Consulta adaptada según la estructura de la tabla
        let completedSurveysCount = 0;

        try {
          // Intentar usar la función SQL optimizada si existe
          const { data: sqlCount, error: sqlError } = await supabase
            .rpc('count_estudiantes_con_respuestas');

          if (!sqlError && sqlCount !== null) {
            completedSurveysCount = sqlCount;
            console.log('Usando función SQL optimizada para contar estudiantes con respuestas');
          } else {
            // Si la función no existe, usar la consulta estándar
            const { data: responsesData, error: responsesError } = await supabase
              .from('respuestas')
              .select('estudiante_id')
              .is('estudiante_id', null, { negate: true });

            if (responsesError) throw responsesError;

            // Filtrar estudiantes únicos usando un Set para eliminar duplicados
            const uniqueStudentIds = new Set();
            responsesData?.forEach(response => {
              if (response.estudiante_id) {
                uniqueStudentIds.add(response.estudiante_id);
              }
            });
            completedSurveysCount = uniqueStudentIds.size;
            console.log('Usando consulta estándar para contar estudiantes con respuestas');
          }
        } catch (countError) {
          console.warn('Error al usar método optimizado, usando método alternativo:', countError);

          // Método alternativo si ambos fallan
          const { data: responsesData, error: responsesError } = await supabase
            .from('respuestas')
            .select('estudiante_id')
            .is('estudiante_id', null, { negate: true });

          if (responsesError) throw responsesError;

          // Filtrar estudiantes únicos usando un Set para eliminar duplicados
          const uniqueStudentIds = new Set();
          responsesData?.forEach(response => {
            if (response.estudiante_id) {
              uniqueStudentIds.add(response.estudiante_id);
            }
          });
          completedSurveysCount = uniqueStudentIds.size;
        }

        // Registrar información de diagnóstico
        console.log(`Estructura de respuestas: ${hasGrupoId ? 'Incluye grupo_id' : 'Sin grupo_id'}`);
        console.log(`Estudiantes únicos con respuestas: ${completedSurveysCount}`);

        // Actualizar estadísticas
        setStats({
          institutionsCount: institutionsCount || 0,
          groupsCount: groupsCount || 0,
          studentsCount: studentsCount || 0,
          completedSurveysCount
        });

        setLoading(false);
      } catch (err: any) {
        console.error('Error al cargar estadísticas:', err);
        setError(err.message || 'Error al cargar estadísticas');
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className={`bg-white p-4 rounded-lg shadow-md ${className}`}>
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-white p-4 rounded-lg shadow-md ${className}`}>
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white p-4 rounded-lg shadow-md ${className}`}>
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Resumen del Sistema</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg flex items-center">
          <School className="h-10 w-10 text-blue-600 mr-3" />
          <div>
            <h3 className="text-sm font-medium text-gray-600">Colegios Inscritos</h3>
            <p className="text-2xl font-bold text-blue-600">{stats.institutionsCount}</p>
          </div>
        </div>

        <div className="bg-green-50 p-4 rounded-lg flex items-center">
          <Users className="h-10 w-10 text-green-600 mr-3" />
          <div>
            <h3 className="text-sm font-medium text-gray-600">Grupos Registrados</h3>
            <p className="text-2xl font-bold text-green-600">{stats.groupsCount}</p>
          </div>
        </div>

        <div className="bg-purple-50 p-4 rounded-lg flex items-center">
          <Users className="h-10 w-10 text-purple-600 mr-3" />
          <div>
            <h3 className="text-sm font-medium text-gray-600">Estudiantes Totales</h3>
            <p className="text-2xl font-bold text-purple-600">{stats.studentsCount}</p>
          </div>
        </div>

        <div className="bg-orange-50 p-4 rounded-lg flex items-center">
          <CheckSquare className="h-10 w-10 text-orange-600 mr-3" />
          <div>
            <h3 className="text-sm font-medium text-gray-600">Cuestionarios Completados</h3>
            <p className="text-2xl font-bold text-orange-600">{stats.completedSurveysCount}</p>
            {stats.studentsCount > 0 && (
              <p className="text-xs text-gray-500">
                {Math.round((stats.completedSurveysCount / stats.studentsCount) * 100)}% del total
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstitutionsSummary;
