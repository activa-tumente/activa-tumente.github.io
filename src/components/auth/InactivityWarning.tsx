import React, { useState, useEffect } from 'react';
import { Clock, AlertTriangle } from 'lucide-react';
import { inactivityService } from '../../lib/inactivityService';

interface InactivityWarningProps {
  onContinue: () => void;
  onLogout: () => void;
}

/**
 * Componente para mostrar una advertencia de inactividad antes del cierre de sesión automático
 */
const InactivityWarning: React.FC<InactivityWarningProps> = ({ onContinue, onLogout }) => {
  const [remainingTime, setRemainingTime] = useState<number>(0);
  const [isVisible, setIsVisible] = useState<boolean>(false);

  // Actualizar el tiempo restante cada segundo
  useEffect(() => {
    if (!isVisible) return;

    const interval = setInterval(() => {
      const remaining = inactivityService.getRemainingTime();
      setRemainingTime(remaining);
      
      // Si el tiempo ha expirado, cerrar el modal y ejecutar el logout
      if (remaining <= 0) {
        setIsVisible(false);
        onLogout();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isVisible, onLogout]);

  // Formatear el tiempo restante en minutos y segundos
  const formatTime = (ms: number): string => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Mostrar el modal de advertencia
  const showWarning = () => {
    setRemainingTime(inactivityService.getRemainingTime());
    setIsVisible(true);
  };

  // Ocultar el modal y continuar la sesión
  const handleContinue = () => {
    setIsVisible(false);
    onContinue();
  };

  // Exponer la función showWarning para que pueda ser llamada desde fuera
  React.useImperativeHandle(
    React.createRef(),
    () => ({
      showWarning
    })
  );

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 mx-4">
        <div className="flex items-center mb-4 text-yellow-600">
          <AlertTriangle className="h-6 w-6 mr-2" />
          <h2 className="text-lg font-semibold">Sesión a punto de expirar</h2>
        </div>
        
        <p className="text-gray-600 mb-4">
          Tu sesión está a punto de expirar por inactividad. Serás desconectado automáticamente en:
        </p>
        
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 mb-4 flex items-center justify-center">
          <Clock className="h-5 w-5 text-yellow-600 mr-2" />
          <span className="text-xl font-mono font-semibold text-yellow-700">
            {formatTime(remainingTime)}
          </span>
        </div>
        
        <div className="flex flex-col sm:flex-row sm:justify-between gap-3">
          <button
            onClick={onLogout}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
          >
            Cerrar sesión ahora
          </button>
          <button
            onClick={handleContinue}
            className="px-4 py-2 bg-blue-dark text-white rounded-md hover:bg-blue-900 transition-colors"
          >
            Continuar sesión
          </button>
        </div>
      </div>
    </div>
  );
};

export default InactivityWarning;
