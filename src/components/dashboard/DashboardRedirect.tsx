import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import LoadingSpinner from '../ui/LoadingSpinner';
import GeneralDashboardPage from '../../pages/dashboards/GeneralDashboardPage';

/**
 * Componente que maneja la redirección inteligente a dashboards
 * Si hay un grupo guardado en localStorage, redirige a ese grupo
 * Si no, busca el primer grupo disponible
 * Si no hay grupos, redirige a la página de selección de dashboards
 */
const DashboardRedirect: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    const loadGroupData = async () => {
      try {
        // Verificar si hay un grupo guardado en localStorage
        const lastVisitedGroupId = localStorage.getItem('lastVisitedGroupId');

        if (lastVisitedGroupId) {
          // Verificar que el grupo siga existiendo
          const { data: groupData, error: groupError } = await supabase
            .from('grupos')
            .select('id')
            .eq('id', lastVisitedGroupId)
            .single();

          if (groupData && !groupError) {
            setSelectedGroupId(lastVisitedGroupId);
            setLoading(false);
            return;
          }
        }

        // Si no hay grupo guardado o ya no existe, buscar el primer grupo disponible
        const { data: groups, error: groupsError } = await supabase
          .from('grupos')
          .select('id')
          .limit(1);

        if (groupsError) {
          console.error('Error al buscar grupos:', groupsError);
          setError(true);
          setLoading(false);
          return;
        }

        if (groups && groups.length > 0) {
          setSelectedGroupId(groups[0].id);
          // Guardar el ID del grupo en localStorage para futuras visitas
          localStorage.setItem('lastVisitedGroupId', groups[0].id);
        } else {
          // No hay grupos disponibles
          setError(true);
        }
      } catch (error) {
        console.error('Error al cargar datos del grupo:', error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    loadGroupData();
  }, [navigate]);

  if (loading) {
    return <LoadingSpinner message="Preparando dashboard..." />;
  }

  if (error) {
    // Si hay un error, redirigir a la página de selección de dashboards
    navigate('/admin/dashboard-general');
    return <LoadingSpinner message="Redirigiendo..." />;
  }

  // Renderizar el dashboard directamente con el ID del grupo seleccionado
  // Esto evita cambiar la URL visible en el navegador
  return selectedGroupId ? <GeneralDashboardPage groupIdProp={selectedGroupId} /> : <LoadingSpinner message="Cargando dashboard..." />;
};

export default DashboardRedirect;
