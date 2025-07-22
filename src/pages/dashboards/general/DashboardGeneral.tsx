import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link, useOutletContext } from 'react-router-dom';
import {
  BarChart,
  User,
  Users,
  CheckSquare,
  School,
  Calendar,
  BookOpen,
  Award,
  AlertCircle,
  ArrowLeft,
  Loader,
  RefreshCw
} from 'lucide-react';
// Importaciones actualizadas para la nueva estructura
import { supabase } from '../../../lib/supabaseClient';
import DashboardBase from '../../../components/dashboard/DashboardBase';
import DashboardSection from '../../../components/dashboard/DashboardSection';
import MetricCard from '../../../components/dashboard/MetricCard';
import InstitutionsSummary from '../../../components/dashboard/InstitutionsSummary';
import ConvivenciaEscolarAnalysis from '../../../components/dashboard/ConvivenciaEscolarAnalysis';
import { useExpandableSections } from '../../../hooks/useExpandableSections';

interface DashboardGeneralProps {
  groupIdProp?: string;
}

/**
 * Página de Dashboard General
 * Muestra información general y estadísticas del grupo seleccionado
 */
const DashboardGeneral = ({ groupIdProp }: DashboardGeneralProps) => {
  const { groupId: groupIdParam } = useParams<{ groupId: string }>();
  const navigate = useNavigate();
  const outletContext = useOutletContext<{ groupId?: string }>();

  // Usar el ID del grupo proporcionado como prop, el del contexto de la ruta o el de los parámetros de la URL
  const groupId = groupIdProp || outletContext?.groupId || groupIdParam;

  // Estados para almacenar datos
  const [groupData, setGroupData] = useState<any>(null);
  const [studentStats, setStudentStats] = useState<any>(null);
  const [institutionData, setInstitutionData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estado para secciones expandibles
  const { expandedSections, toggleSection } = useExpandableSections({
    overview: true,
    students: true,
    surveys: false,
    academic: false,
    convivencia: true
  });

  // Función para cargar datos
  const fetchGroupData = async () => {
    if (!groupId) return;

    try {
      setLoading(true);
      setError(null);

      // Cargar datos del grupo
      const { data: groupData, error: groupError } = await supabase
        .from('grupos')
        .select(`
          *,
          instituciones_educativas(*)
        `)
        .eq('id', groupId)
        .single();

      if (groupError) throw groupError;
      setGroupData(groupData);

      // Cargar datos de la institución
      if (groupData?.institucion_id) {
        const { data: institutionData } = await supabase
          .from('instituciones_educativas')
          .select('*')
          .eq('id', groupData.institucion_id)
          .single();

        setInstitutionData(institutionData);
      }

      // Cargar estudiantes del grupo
      const { data: studentsData } = await supabase
        .from('estudiantes')
        .select('*')
        .eq('grupo_id', groupId);

      // Cargar respuestas de cuestionarios
      const { data: responsesData } = await supabase
        .from('respuestas')
        .select('estudiante_id')
        .eq('grupo_id', groupId);

      // Calcular estadísticas de estudiantes
      if (studentsData) {
        const totalStudents = studentsData.length;
        const maleStudents = studentsData.filter((s: any) => s.genero === 'M').length;
        const femaleStudents = studentsData.filter((s: any) => s.genero === 'F').length;

        // Calcular edad promedio (si está disponible)
        let avgAge = 'N/A';
        const studentsWithAge = studentsData.filter((s: any) => s.edad);
        if (studentsWithAge.length > 0) {
          const totalAge = studentsWithAge.reduce((sum: number, s: any) => sum + s.edad, 0);
          avgAge = (totalAge / studentsWithAge.length).toFixed(1);
        }

        // Calcular distribución por edad
        const ageGroups: Record<string, number> = {};
        studentsWithAge.forEach((s: any) => {
          const ageGroup = `${s.edad} años`;
          ageGroups[ageGroup] = (ageGroups[ageGroup] || 0) + 1;
        });

        const ageDistribution = Object.entries(ageGroups).map(([name, value]) => ({
          name,
          value
        }));

        // Calcular estudiantes con respuestas
        const uniqueRespondents = new Set();
        responsesData?.forEach((r: any) => uniqueRespondents.add(r.estudiante_id));
        const studentsWithResponses = uniqueRespondents.size;

        setStudentStats({
          total: totalStudents,
          male: maleStudents,
          female: femaleStudents,
          avgAge,
          byAgeGroup: ageDistribution,
          withResponses: studentsWithResponses,
          responseRate: totalStudents > 0 ? (studentsWithResponses / totalStudents) * 100 : 0
        });
      }

    } catch (err: any) {
      console.error('Error al cargar datos del grupo:', err);
      setError(err.message || 'Error al cargar los datos del grupo');
    } finally {
      setLoading(false);
    }
  };

  // Cargar datos al montar el componente o cuando cambia el ID del grupo
  useEffect(() => {
    fetchGroupData();

    // Suscripción a cambios en tiempo real
    const subscription = supabase
      .channel(`dashboard-general-${groupId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'estudiantes', filter: `grupo_id=eq.${groupId}` },
        () => fetchGroupData()
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'respuestas', filter: `grupo_id=eq.${groupId}` },
        () => fetchGroupData()
      )
      .subscribe();

    // Limpiar la suscripción al desmontar el componente
    return () => {
      supabase.removeChannel(subscription);
    };
  }, [groupId]);

  // Manejar caso de error o carga
  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft className="mr-2" size={16} /> Volver
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-8">
        <Loader className="h-8 w-8 text-blue-600 animate-spin mb-4" />
        <p className="text-gray-600">Cargando datos del dashboard...</p>
      </div>
    );
  }

  return (
    <DashboardBase title="Dashboard General">
      {/* Sección de información general */}
      <DashboardSection
        title="Información General"
        icon={<School className="h-5 w-5" />}
        isExpanded={expandedSections.overview}
        onToggle={() => toggleSection('overview')}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <MetricCard
            title="Institución"
            value={groupData?.instituciones_educativas?.nombre || 'No disponible'}
            icon={<School className="h-8 w-8 text-blue-600" />}
            description={groupData?.instituciones_educativas?.tipo_institucion || ''}
          />
          <MetricCard
            title="Grupo"
            value={groupData?.nombre || 'No disponible'}
            icon={<Users className="h-8 w-8 text-green-600" />}
            description={`Grado: ${groupData?.grado || 'No especificado'}`}
          />
          <MetricCard
            title="Año Escolar"
            value={groupData?.año_escolar || 'No disponible'}
            icon={<Calendar className="h-8 w-8 text-purple-600" />}
            description="Periodo académico actual"
          />
          <MetricCard
            title="Estudiantes"
            value={studentStats?.total || 0}
            icon={<User className="h-8 w-8 text-orange-600" />}
            description={`${studentStats?.withResponses || 0} con respuestas`}
          />
        </div>

        {/* Resumen de la institución */}
        {institutionData && (
          <InstitutionsSummary institution={institutionData} />
        )}
      </DashboardSection>

      {/* Sección de estudiantes */}
      <DashboardSection
        title="Estudiantes"
        icon={<User className="h-5 w-5" />}
        isExpanded={expandedSections.students}
        onToggle={() => toggleSection('students')}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <MetricCard
            title="Total Estudiantes"
            value={studentStats?.total || 0}
            icon={<Users className="h-8 w-8 text-blue-600" />}
            description="Matriculados en el grupo"
          />
          <MetricCard
            title="Distribución por Género"
            value={`${studentStats?.male || 0} / ${studentStats?.female || 0}`}
            icon={<User className="h-8 w-8 text-purple-600" />}
            description="Masculino / Femenino"
          />
          <MetricCard
            title="Edad Promedio"
            value={studentStats?.avgAge || 'N/A'}
            icon={<Calendar className="h-8 w-8 text-green-600" />}
            description="Años"
          />
        </div>

        {/* Tasa de respuesta */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <h3 className="text-lg font-semibold mb-2">Tasa de Respuesta al Cuestionario</h3>
          <div className="relative pt-1">
            <div className="flex mb-2 items-center justify-between">
              <div>
                <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
                  {studentStats?.responseRate.toFixed(1)}%
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold inline-block text-blue-600">
                  {studentStats?.withResponses} de {studentStats?.total} estudiantes
                </span>
              </div>
            </div>
            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
              <div
                style={{ width: `${studentStats?.responseRate || 0}%` }}
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-600"
              ></div>
            </div>
          </div>
          {studentStats?.responseRate < 70 && (
            <div className="flex items-start mt-2 text-amber-700 bg-amber-50 p-3 rounded-md">
              <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
              <p className="text-sm">
                La tasa de respuesta es inferior al 70%. Para obtener resultados más precisos,
                se recomienda que más estudiantes completen el cuestionario.
              </p>
            </div>
          )}
        </div>
      </DashboardSection>

      {/* Sección de cuestionarios */}
      <DashboardSection
        title="Cuestionarios y Respuestas"
        icon={<CheckSquare className="h-5 w-5" />}
        isExpanded={expandedSections.surveys}
        onToggle={() => toggleSection('surveys')}
      >
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Estado de Cuestionarios</h3>

          {/* Aquí iría un componente para mostrar el estado de los cuestionarios */}
          <p className="text-gray-600 mb-4">
            Esta sección mostrará información detallada sobre los cuestionarios aplicados
            y el estado de las respuestas.
          </p>

          <div className="flex flex-col md:flex-row gap-4">
            <Link
              to={`/admin/grupo/${groupId}/bullying`}
              className="bg-blue-800 hover:bg-blue-900 text-white py-2 px-4 rounded flex items-center justify-center"
            >
              <BarChart className="h-5 w-5 mr-2" />
              Ver Dashboard de Bullying
            </Link>

            <button
              onClick={fetchGroupData}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded flex items-center justify-center"
            >
              <RefreshCw className="h-5 w-5 mr-2" />
              Actualizar Datos
            </button>
          </div>
        </div>
      </DashboardSection>

      {/* Sección académica */}
      <DashboardSection
        title="Información Académica"
        icon={<BookOpen className="h-5 w-5" />}
        isExpanded={expandedSections.academic}
        onToggle={() => toggleSection('academic')}
      >
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Rendimiento Académico</h3>

          {/* Aquí iría un componente para mostrar información académica */}
          <p className="text-gray-600 mb-4">
            Esta sección mostrará información sobre el rendimiento académico del grupo,
            incluyendo promedios, asistencia y otros indicadores relevantes.
          </p>

          <Link
            to={`/admin/grupo/${groupId}/academico`}
            className="bg-blue-800 hover:bg-blue-900 text-white py-2 px-4 rounded inline-flex items-center"
          >
            <Award className="h-5 w-5 mr-2" />
            Ver Dashboard Académico
          </Link>
        </div>
      </DashboardSection>

      {/* Sección de Convivencia Escolar y Dinámicas de Acoso */}
      <DashboardSection
        title="Resumen General de Convivencia Escolar y Dinámicas de Acoso"
        icon={<AlertCircle className="h-5 w-5" />}
        isExpanded={expandedSections.convivencia}
        onToggle={() => toggleSection('convivencia')}
      >
        <ConvivenciaEscolarAnalysis />
      </DashboardSection>
    </DashboardBase>
  );
};

export default DashboardGeneral;