import React from 'react';
import { Loader } from 'lucide-react';

interface LoadingSpinnerProps {
  message?: string;
}

/**
 * Componente de carga para mostrar durante la carga de componentes lazy
 */
const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ message = 'Cargando...' }) => {
  return (
    <div className="flex justify-center items-center h-full min-h-[300px]">
      <div className="text-center">
        <Loader className="h-12 w-12 animate-spin mx-auto mb-4 text-blue-dark" />
        <p className="text-gray-500">{message}</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
