import React, { useState, useEffect } from 'react';
import { AlertTriangle, X, Bell, User } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';

interface CriticalCase {
  id: string;
  studentName: string;
  riskLevel: 'high' | 'medium';
  reason: string;
  date: string;
}

interface CriticalCaseNotificationProps {
  groupId: string;
}

/**
 * Componente para mostrar notificaciones de casos críticos
 */
const CriticalCaseNotification: React.FC<CriticalCaseNotificationProps> = ({ groupId }) => {
  const [criticalCases, setCriticalCases] = useState<CriticalCase[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [loading, setLoading] = useState(true);

  // Cargar casos críticos
  useEffect(() => {
    const loadCriticalCases = async () => {
      try {
        setLoading(true);
        
        // En un sistema real, esto obtendría datos de la base de datos
        // Para este ejemplo, simulamos casos críticos
        
        // Obtener estudiantes del grupo
        const { data: estudiantes, error } = await supabase
          .from('estudiantes')
          .select(`
            id,
            nombre_estudiante,
            apellido_estudiante
          `)
          .eq('grupo_id', groupId)
          .limit(3); // Limitamos a 3 para el ejemplo
        
        if (error) throw error;
        
        // Simular casos críticos con estudiantes reales
        if (estudiantes && estudiantes.length > 0) {
          const mockCases: CriticalCase[] = [
            {
              id: '1',
              studentName: `${estudiantes[0].nombre_estudiante} ${estudiantes[0].apellido_estudiante}`,
              riskLevel: 'high',
              reason: 'Múltiples reportes de victimización en la última semana',
              date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toLocaleDateString() // 2 días atrás
            }
          ];
          
          // Añadir un segundo caso si hay suficientes estudiantes
          if (estudiantes.length > 1) {
            mockCases.push({
              id: '2',
              studentName: `${estudiantes[1].nombre_estudiante} ${estudiantes[1].apellido_estudiante}`,
              riskLevel: 'medium',
              reason: 'Aislamiento social detectado en sociograma',
              date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toLocaleDateString() // 5 días atrás
            });
          }
          
          setCriticalCases(mockCases);
        } else {
          // Casos de ejemplo si no hay estudiantes
          setCriticalCases([
            {
              id: '1',
              studentName: 'María Rodríguez',
              riskLevel: 'high',
              reason: 'Múltiples reportes de victimización en la última semana',
              date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toLocaleDateString()
            },
            {
              id: '2',
              studentName: 'Pedro Sánchez',
              riskLevel: 'medium',
              reason: 'Aislamiento social detectado en sociograma',
              date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toLocaleDateString()
            }
          ]);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error al cargar casos críticos:', error);
        setCriticalCases([]);
        setLoading(false);
      }
    };
    
    if (groupId) {
      loadCriticalCases();
    }
  }, [groupId]);

  // Descartar una notificación
  const dismissNotification = (id: string) => {
    setCriticalCases(criticalCases.filter(c => c.id !== id));
  };

  // Si no hay casos críticos, no mostrar nada
  if (criticalCases.length === 0 && !loading) {
    return null;
  }

  return (
    <div className="relative">
      {/* Botón de notificaciones */}
      <button
        onClick={() => setShowNotifications(!showNotifications)}
        className="relative p-2 text-gray-600 hover:text-blue-dark focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full"
        title="Ver notificaciones"
      >
        <Bell className="h-6 w-6" />
        {criticalCases.length > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
            {criticalCases.length}
          </span>
        )}
      </button>

      {/* Panel de notificaciones */}
      {showNotifications && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg z-20 border border-gray-200">
          <div className="p-3 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-sm font-medium text-gray-700">Casos Críticos</h3>
            <button
              onClick={() => setShowNotifications(false)}
              className="text-gray-400 hover:text-gray-500"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          
          {loading ? (
            <div className="p-4 text-center text-gray-500">
              Cargando notificaciones...
            </div>
          ) : criticalCases.length > 0 ? (
            <div className="max-h-96 overflow-y-auto">
              {criticalCases.map(caseItem => (
                <div 
                  key={caseItem.id}
                  className={`p-3 border-b border-gray-100 ${
                    caseItem.riskLevel === 'high' 
                      ? 'bg-red-50' 
                      : 'bg-yellow-50'
                  }`}
                >
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mr-2">
                      <AlertTriangle className={`h-5 w-5 ${
                        caseItem.riskLevel === 'high' 
                          ? 'text-red-500' 
                          : 'text-yellow-500'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm font-medium text-gray-800 flex items-center">
                            <User className="h-3 w-3 mr-1" />
                            {caseItem.studentName}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {caseItem.date}
                          </p>
                        </div>
                        <button
                          onClick={() => dismissNotification(caseItem.id)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">
                        {caseItem.reason}
                      </p>
                      <div className="mt-2">
                        <button
                          className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                          onClick={() => {
                            // Navegar a la sección de análisis individual
                            const individualSection = document.querySelector('[data-section="individual"]');
                            if (individualSection) {
                              individualSection.scrollIntoView({ behavior: 'smooth' });
                              setShowNotifications(false);
                            }
                          }}
                        >
                          Ver detalles
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-gray-500">
              No hay notificaciones
            </div>
          )}
          
          <div className="p-2 bg-gray-50 text-center text-xs text-gray-500 rounded-b-md">
            Las notificaciones se actualizan automáticamente
          </div>
        </div>
      )}
    </div>
  );
};

export default CriticalCaseNotification;
