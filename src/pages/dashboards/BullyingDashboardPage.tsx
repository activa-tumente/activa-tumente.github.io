import React from 'react';
import DashboardByGroup from './byGroup/DashboardByGroup';

/**
 * Componente de redirección para el Dashboard de Bullying
 * Este componente simplemente importa y re-exporta el componente DashboardByGroup
 * para mantener compatibilidad con las rutas existentes
 */
const BullyingDashboardPage: React.FC = () => {
  return <DashboardByGroup />;
};

export default BullyingDashboardPage;
