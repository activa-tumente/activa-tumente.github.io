import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../lib/auth/AuthContext';
import { AlertCircle } from 'lucide-react';

interface LinkIdentityProps {
  provider: 'google' | 'github' | 'facebook' | 'twitter';
  buttonText?: string;
  className?: string;
}

/**
 * Componente para vincular una identidad de proveedor OAuth a un usuario existente
 */
const LinkIdentity: React.FC<LinkIdentityProps> = ({ 
  provider, 
  buttonText = `Vincular con ${provider}`, 
  className = "link-identity-button" 
}) => {
  const { isAuthenticated } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLinkIdentity = async () => {
    // Verificar que el usuario esté autenticado
    if (!isAuthenticated) {
      setError('Debes iniciar sesión para vincular una identidad');
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      // Intentar vincular la identidad
      const { data, error } = await supabase.auth.linkIdentity({
        provider
      });

      if (error) {
        console.error('Error al vincular identidad:', error);
        setError(error.message || 'Error al vincular identidad');
        return;
      }

      // Si estamos en el navegador, la redirección es automática
      // Si estamos en el servidor, necesitaríamos manejar la redirección manualmente
      console.log('Vinculación iniciada, redirigiendo...', data);
    } catch (err: any) {
      console.error('Error inesperado:', err);
      setError(err.message || 'Error inesperado al vincular identidad');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="link-identity-container">
      {error && (
        <div className="flex items-center justify-center text-red-500 text-sm p-2 bg-red-50 rounded mb-4">
          <AlertCircle className="h-4 w-4 mr-2" />
          <span>{error}</span>
        </div>
      )}
      
      <button
        onClick={handleLinkIdentity}
        disabled={isLoading || !isAuthenticated}
        className={className}
      >
        {isLoading ? 'Vinculando...' : buttonText}
      </button>
    </div>
  );
};

export default LinkIdentity;
