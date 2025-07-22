import React, { useState, useEffect } from 'react';
import { Clock, Save, ToggleLeft, ToggleRight } from 'lucide-react';
import { useAuth } from '../../lib/auth/AuthContext';

/**
 * Componente para configurar el tiempo de inactividad
 */
const InactivitySettings: React.FC = () => {
  const { 
    inactivityEnabled, 
    toggleInactivityMonitoring, 
    setInactivityTimeout,
    inactivityTimeoutRef,
    inactivityWarningRef
  } = useAuth();
  
  const [timeout, setTimeout] = useState<number>(inactivityTimeoutRef / 60000); // Convertir a minutos
  const [warningTime, setWarningTime] = useState<number>(inactivityWarningRef / 60000); // Convertir a minutos
  const [isEnabled, setIsEnabled] = useState<boolean>(inactivityEnabled);
  const [isSaved, setIsSaved] = useState<boolean>(true);

  // Actualizar estado local cuando cambian las props
  useEffect(() => {
    setTimeout(inactivityTimeoutRef / 60000);
    setWarningTime(inactivityWarningRef / 60000);
    setIsEnabled(inactivityEnabled);
  }, [inactivityTimeoutRef, inactivityWarningRef, inactivityEnabled]);

  // Manejar cambios en el formulario
  const handleTimeoutChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setTimeout(value);
    setIsSaved(false);
  };

  const handleWarningTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setWarningTime(value);
    setIsSaved(false);
  };

  const handleToggleChange = () => {
    const newValue = !isEnabled;
    setIsEnabled(newValue);
    toggleInactivityMonitoring(newValue);
  };

  // Guardar configuración
  const handleSave = () => {
    // Convertir minutos a milisegundos
    const timeoutMs = timeout * 60 * 1000;
    const warningTimeMs = warningTime * 60 * 1000;
    
    // Validar que el tiempo de advertencia sea menor que el tiempo de inactividad
    if (warningTimeMs >= timeoutMs) {
      alert('El tiempo de advertencia debe ser menor que el tiempo de inactividad');
      return;
    }
    
    setInactivityTimeout(timeoutMs, warningTimeMs);
    setIsSaved(true);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-lg font-medium mb-4 flex items-center">
        <Clock className="h-5 w-5 mr-2 text-blue-dark" />
        Configuración de inactividad
      </h2>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Cierre de sesión automático</span>
          <button
            onClick={handleToggleChange}
            className="focus:outline-none"
            aria-label={isEnabled ? 'Desactivar' : 'Activar'}
          >
            {isEnabled ? (
              <ToggleRight className="h-6 w-6 text-blue-dark" />
            ) : (
              <ToggleLeft className="h-6 w-6 text-gray-400" />
            )}
          </button>
        </div>
        
        <div className={isEnabled ? 'opacity-100' : 'opacity-50 pointer-events-none'}>
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tiempo de inactividad (minutos)
            </label>
            <input
              type="number"
              min="1"
              max="120"
              value={timeout}
              onChange={handleTimeoutChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              Tiempo de inactividad antes de cerrar la sesión automáticamente
            </p>
          </div>
          
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tiempo de advertencia (minutos)
            </label>
            <input
              type="number"
              min="0.5"
              max={timeout - 0.5}
              step="0.5"
              value={warningTime}
              onChange={handleWarningTimeChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              Tiempo antes del cierre de sesión para mostrar una advertencia
            </p>
          </div>
          
          <button
            onClick={handleSave}
            disabled={isSaved}
            className={`px-4 py-2 rounded-md flex items-center text-sm ${
              isSaved 
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                : 'bg-blue-dark text-white hover:bg-blue-900'
            }`}
          >
            <Save className="h-4 w-4 mr-1" />
            {isSaved ? 'Guardado' : 'Guardar cambios'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InactivitySettings;
