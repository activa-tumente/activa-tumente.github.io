import React, { ReactNode, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Clipboard, Menu, X } from 'lucide-react';
import PageTransition from '../ui/PageTransition';
import useWindowSize from '../../hooks/useWindowSize';

interface DashboardBaseProps {
  title: string;
  groupId: string;
  groupName: string;
  children: ReactNode;
  loading?: boolean;
  error?: string | null;
  actions?: ReactNode;
}

/**
 * Componente base para todos los dashboards
 * Proporciona una estructura común con encabezado, manejo de errores y carga
 */
const DashboardBase: React.FC<DashboardBaseProps> = ({
  title,
  groupId,
  groupName,
  children,
  loading = false,
  error = null,
  actions
}) => {
  const navigate = useNavigate();
  const { isMobile } = useWindowSize();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <PageTransition className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header con navegación */}
      <div className="mb-6">
        <div className="flex items-center text-gray-500 mb-2">
          <button
            onClick={() => {
              // Siempre volver a la lista de dashboards por grupo
              navigate('/admin/dashboards-por-grupo');
            }}
            className="flex items-center hover:text-blue-dark"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            <span>Volver a la lista de grupos</span>
          </button>
        </div>

        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <h1 className="text-2xl font-bold text-gray-800">
            {title}: {groupName}
          </h1>

          {/* Botón de menú móvil */}
          {isMobile ? (
            <div className="relative">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="px-3 py-2 bg-blue-dark text-white rounded-md hover:bg-blue-900 flex items-center"
              >
                {mobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
                <span className="ml-1">Acciones</span>
              </button>

              {mobileMenuOpen && (
                <div className="absolute right-0 mt-2 w-60 bg-white rounded-md shadow-lg z-20 border border-gray-200">
                  <div className="p-2 space-y-2">
                    <button
                      onClick={() => {
                        window.print();
                        setMobileMenuOpen(false);
                      }}
                      className="w-full px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 flex items-center justify-center"
                    >
                      <Clipboard className="mr-2 h-4 w-4" />
                      Imprimir Reporte
                    </button>
                    <div className="space-y-2">
                      {actions}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 flex items-center"
              >
                <Clipboard className="mr-2 h-4 w-4" />
                Imprimir Reporte
              </button>
              {actions}
            </div>
          )}
        </div>
      </div>

      {/* Mensaje de error */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Indicador de carga */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-dark"></div>
        </div>
      ) : (
        children
      )}
    </PageTransition>
  );
};

export default DashboardBase;
