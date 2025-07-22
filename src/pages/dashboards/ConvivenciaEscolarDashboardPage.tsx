import { useState } from 'react';
import { BarChart, AlertCircle } from 'lucide-react';
import DashboardBase from '../../components/dashboard/DashboardBase';
import ConvivenciaEscolarAnalysis from '../../components/dashboard/ConvivenciaEscolarAnalysis';

/**
 * Página de Dashboard de Convivencia Escolar
 * Muestra análisis de convivencia escolar y dinámicas de acoso
 */
const ConvivenciaEscolarDashboardPage = () => {
  const [loading, setLoading] = useState(false);

  return (
    <DashboardBase title="Dashboard de Convivencia Escolar">
      <div className="mb-6">
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-blue-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700">
                Este dashboard muestra un análisis general de la convivencia escolar y las dinámicas de acoso
                en todas las instituciones registradas en el sistema.
              </p>
            </div>
          </div>
        </div>
      </div>

      <ConvivenciaEscolarAnalysis />
    </DashboardBase>
  );
};

export default ConvivenciaEscolarDashboardPage;
