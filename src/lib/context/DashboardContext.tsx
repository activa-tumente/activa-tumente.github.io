import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../supabaseClient';

// Tipos para los datos del dashboard
interface DashboardData {
  groupId: string | null;
  groupName: string | null;
  institutionName: string | null;
  totalStudents: number;
  completedQuestionnaires: number;
  schoolYear: string | null;
  isLoading: boolean;
  error: string | null;
}

// Tipo para el contexto
interface DashboardContextType {
  dashboardData: DashboardData;
  refreshData: (groupId?: string) => Promise<void>;
  setGroupId: (groupId: string) => void;
}

// Valores iniciales
const initialDashboardData: DashboardData = {
  groupId: null,
  groupName: null,
  institutionName: null,
  totalStudents: 0,
  completedQuestionnaires: 0,
  schoolYear: null,
  isLoading: false,
  error: null
};

// Crear el contexto
const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

// Hook personalizado para usar el contexto
export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error('useDashboard debe ser usado dentro de un DashboardProvider');
  }
  return context;
};

// Proveedor del contexto
interface DashboardProviderProps {
  children: ReactNode;
}

export const DashboardProvider: React.FC<DashboardProviderProps> = ({ children }) => {
  const [dashboardData, setDashboardData] = useState<DashboardData>(initialDashboardData);

  // Función para establecer el ID del grupo
  const setGroupId = (groupId: string) => {
    setDashboardData(prev => ({ ...prev, groupId }));
  };

  // Función para cargar los datos del dashboard
  const refreshData = async (groupId?: string) => {
    const targetGroupId = groupId || dashboardData.groupId;
    
    if (!targetGroupId) {
      setDashboardData(prev => ({ 
        ...prev, 
        error: 'No se ha especificado un grupo',
        isLoading: false 
      }));
      return;
    }

    setDashboardData(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // Obtener datos del grupo
      const { data: groupData, error: groupError } = await supabase
        .from('grupos')
        .select('*, instituciones_educativas(nombre)')
        .eq('id', targetGroupId)
        .single();

      if (groupError) {
        throw new Error(`Error al cargar datos del grupo: ${groupError.message}`);
      }

      // Obtener total de estudiantes
      const { count: totalStudents, error: studentsError } = await supabase
        .from('estudiantes')
        .select('*', { count: 'exact', head: true })
        .eq('grupo_id', targetGroupId);

      if (studentsError) {
        throw new Error(`Error al contar estudiantes: ${studentsError.message}`);
      }

      // Obtener cuestionarios completados
      const { data: completedData, error: completedError } = await supabase
        .from('respuestas')
        .select('estudiante_id', { count: 'exact' })
        .eq('grupo_id', targetGroupId)
        .limit(1);

      if (completedError) {
        throw new Error(`Error al contar cuestionarios completados: ${completedError.message}`);
      }

      // Actualizar el estado
      setDashboardData({
        groupId: targetGroupId,
        groupName: groupData.nombre,
        institutionName: groupData.instituciones_educativas?.nombre || 'Institución desconocida',
        totalStudents: totalStudents || 0,
        completedQuestionnaires: completedData?.length || 0,
        schoolYear: groupData.año_escolar || 'Año escolar no especificado',
        isLoading: false,
        error: null
      });
    } catch (error) {
      console.error('Error al cargar datos del dashboard:', error);
      setDashboardData(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Error desconocido al cargar datos' 
      }));
    }
  };

  // Cargar datos cuando cambia el groupId
  useEffect(() => {
    if (dashboardData.groupId) {
      refreshData();
    }
  }, [dashboardData.groupId]);

  return (
    <DashboardContext.Provider value={{ dashboardData, refreshData, setGroupId }}>
      {children}
    </DashboardContext.Provider>
  );
};

export default DashboardContext;
