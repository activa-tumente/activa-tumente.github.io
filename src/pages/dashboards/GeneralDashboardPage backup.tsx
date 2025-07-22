import React from 'react';
import DashboardGeneral from './general/DashboardGeneral';

/**
 * Componente de redirección para el Dashboard General
 * Este componente simplemente importa y re-exporta el componente DashboardGeneral
 * para mantener compatibilidad con las rutas existentes
 */
const GeneralDashboardPage: React.FC = () => {
  return <DashboardGeneral />;
};

export default GeneralDashboardPage;
