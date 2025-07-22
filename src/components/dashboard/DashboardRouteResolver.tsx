import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Outlet } from 'react-router-dom';
import { dashboardRouteService } from '../../services/dashboardRouteService';
import LoadingSpinner from '../ui/LoadingSpinner';
import { DashboardProvider } from '../../lib/context/DashboardContext';

/**
 * Componente que resuelve las rutas amigables de los dashboards
 * Extrae el ID del grupo a partir de los slugs y lo pasa como parámetro a los componentes hijos
 */
const DashboardRouteResolver: React.FC = () => {
  const { institutionSlug, groupSlug } = useParams<{ institutionSlug: string; groupSlug: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [groupId, setGroupId] = useState<string | null>(null);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    const resolveRoute = async () => {
      try {
        if (!institutionSlug || !groupSlug) {
          setError(true);
          setLoading(false);
          return;
        }

        // Obtener el ID del grupo a partir de los slugs
        const resolvedGroupId = await dashboardRouteService.getGroupIdFromFriendlyRoute(
          institutionSlug,
          groupSlug
        );

        if (!resolvedGroupId) {
          setError(true);
          setLoading(false);
          return;
        }

        // Guardar el ID del grupo en localStorage para futuras referencias
        localStorage.setItem('lastVisitedGroupId', resolvedGroupId);
        setGroupId(resolvedGroupId);
        setLoading(false);
      } catch (error) {
        console.error('Error al resolver ruta amigable:', error);
        setError(true);
        setLoading(false);
      }
    };

    resolveRoute();
  }, [institutionSlug, groupSlug, navigate]);

  if (loading) {
    return <LoadingSpinner message="Cargando dashboard..." />;
  }

  if (error || !groupId) {
    // Si hay un error, redirigir a la página de selección de dashboards
    navigate('/admin/dashboard-general');
    return <LoadingSpinner message="Redirigiendo..." />;
  }

  // Renderizar los componentes hijos con el ID del grupo resuelto
  return (
    <DashboardProvider>
      <Outlet context={{ groupId }} />
    </DashboardProvider>
  );
};

export default DashboardRouteResolver;
