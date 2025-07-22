import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Users,
  UserPlus,
  AlertTriangle,
  ArrowLeft,
  Loader,
  RefreshCw,
  FileText,
  Download
} from 'lucide-react';
import { supabase } from '../../../lib/supabaseClient';
import DashboardBase from '../../../components/dashboard/DashboardBase';
import DashboardSection from '../../../components/dashboard/DashboardSection';
import { useExpandableSections } from '../../../hooks/useExpandableSections';

// Importar componentes específicos del dashboard por grupo
import SociometricAnalysis from './components/SociometricAnalysis';
import BullyingIndicators from './components/BullyingIndicators';
import GroupCohesion from './components/GroupCohesion';
import SituationalFactors from './components/SituationalFactors';
import FiltersPanel from './components/FiltersPanel';

interface DashboardByGroupProps {
  groupIdProp?: string;
}

/**
 * Página de Dashboard por Grupo
 * Muestra análisis detallado de un grupo específico con sociograma
 */
const DashboardByGroup: React.FC<DashboardByGroupProps> = ({ groupIdProp }) => {
  const { groupId: groupIdParam } = useParams<{ groupId: string }>();
  const navigate = useNavigate();
  
  // Usar el ID del grupo proporcionado como prop o el de los parámetros de la URL
  const groupId = groupIdProp || groupIdParam;

  // Estados para almacenar datos
  const [groupData, setGroupData] = useState<any>(null);
  const [studentsData, setStudentsData] = useState<any[]>([]);
  const [responsesData, setResponsesData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<Record<string, string>>({});

  // Estado para secciones expandibles
  const { expandedSections, toggleSection } = useExpandableSections({
    sociometric: true,
    bullying: true,
    cohesion: false,
    situational: false
  });

  // Función para cargar datos del grupo
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

      // Cargar estudiantes del grupo
      const { data: studentsData, error: studentsError } = await supabase
        .from('estudiantes')
        .select('*')
        .eq('grupo_id', groupId);

      if (studentsError) throw studentsError;
      setStudentsData(studentsData || []);

      // Cargar respuestas de cuestionarios
      const { data: responsesData, error: responsesError } = await supabase
        .from('respuestas')
        .select(`
          *,
          estudiante:estudiante_id(id, nombre, apellido, genero),
          pregunta:pregunta_id(id, texto, tipo, categoria)
        `)
        .eq('grupo_id', groupId);

      if (responsesError) throw responsesError;
      setResponsesData(responsesData || []);

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
  }, [groupId]);

  // Manejar cambios en los filtros
  const handleFilterChange = (newFilters: Record<string, string>) => {
    setFilters(newFilters);
    // Aquí se podrían aplicar los filtros a los datos mostrados
  };

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
        <p className="text-gray-600">Cargando datos del grupo...</p>
      </div>
    );
  }

  return (
    <DashboardBase 
      title={`Dashboard del Grupo: ${groupData?.nombre || 'Sin nombre'}`}
      subtitle={`${groupData?.instituciones_educativas?.nombre || 'Institución no especificada'} - ${groupData?.grado || ''} - ${groupData?.año_escolar || ''}`}
    >
      {/* Panel de filtros */}
      <FiltersPanel 
        onFilterChange={handleFilterChange}
        initialFilters={filters}
      />

      {/* Sección de análisis sociométrico */}
      <DashboardSection
        title="Análisis Sociométrico"
        icon={<Users className="h-5 w-5" />}
        isExpanded={expandedSections.sociometric}
        onToggle={() => toggleSection('sociometric')}
      >
        <SociometricAnalysis 
          students={studentsData} 
          responses={responsesData}
          filters={filters}
        />
      </DashboardSection>

      {/* Sección de indicadores de bullying */}
      <DashboardSection
        title="Indicadores de Bullying"
        icon={<AlertTriangle className="h-5 w-5" />}
        isExpanded={expandedSections.bullying}
        onToggle={() => toggleSection('bullying')}
      >
        <BullyingIndicators 
          students={studentsData} 
          responses={responsesData}
          filters={filters}
        />
      </DashboardSection>

      {/* Sección de cohesión grupal */}
      <DashboardSection
        title="Cohesión Grupal"
        icon={<UserPlus className="h-5 w-5" />}
        isExpanded={expandedSections.cohesion}
        onToggle={() => toggleSection('cohesion')}
      >
        <GroupCohesion 
          students={studentsData} 
          responses={responsesData}
          filters={filters}
        />
      </DashboardSection>

      {/* Sección de factores situacionales */}
      <DashboardSection
        title="Factores Situacionales"
        icon={<FileText className="h-5 w-5" />}
        isExpanded={expandedSections.situational}
        onToggle={() => toggleSection('situational')}
      >
        <SituationalFactors 
          students={studentsData} 
          responses={responsesData}
          filters={filters}
        />
      </DashboardSection>

      {/* Acciones */}
      <div className="flex flex-wrap gap-4 mt-6">
        <button
          onClick={fetchGroupData}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded flex items-center"
        >
          <RefreshCw className="h-5 w-5 mr-2" />
          Actualizar Datos
        </button>
        
        <button
          className="bg-blue-800 hover:bg-blue-900 text-white py-2 px-4 rounded flex items-center"
        >
          <Download className="h-5 w-5 mr-2" />
          Exportar Informe
        </button>
      </div>
    </DashboardBase>
  );
};

export default DashboardByGroup;