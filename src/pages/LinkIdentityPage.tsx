import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/auth/AuthContext';
import LinkIdentity from '../components/auth/LinkIdentity';
import '../components/auth/LinkIdentity.css';
import { supabase } from '../lib/supabase';

const LinkIdentityPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, isLoading } = useAuth();
  const [linkedIdentities, setLinkedIdentities] = useState<any[]>([]);
  const [loadingIdentities, setLoadingIdentities] = useState(true);

  // Redirigir si el usuario no está autenticado
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, isLoading, navigate]);

  // Cargar las identidades vinculadas al usuario
  useEffect(() => {
    const fetchLinkedIdentities = async () => {
      if (!isAuthenticated || !user) return;

      try {
        setLoadingIdentities(true);
        const { data, error } = await supabase.auth.getUserIdentities();
        
        if (error) {
          console.error('Error al obtener identidades:', error);
          return;
        }
        
        setLinkedIdentities(data?.identities || []);
      } catch (error) {
        console.error('Error al cargar identidades:', error);
      } finally {
        setLoadingIdentities(false);
      }
    };

    fetchLinkedIdentities();
  }, [isAuthenticated, user]);

  // Manejar la desvinculación de una identidad
  const handleUnlinkIdentity = async (provider: string, id: string) => {
    try {
      const { error } = await supabase.auth.unlinkIdentity({
        provider,
        id
      });

      if (error) {
        console.error('Error al desvincular identidad:', error);
        return;
      }

      // Actualizar la lista de identidades
      setLinkedIdentities(prevIdentities => 
        prevIdentities.filter(identity => identity.id !== id)
      );
    } catch (error) {
      console.error('Error al desvincular identidad:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-800"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-50 py-12 px-4">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Vincular Identidades</h1>
        
        {/* Información del usuario */}
        <div className="mb-6 p-4 bg-blue-50 rounded-md">
          <h2 className="text-lg font-semibold mb-2">Usuario actual</h2>
          <p><strong>Email:</strong> {user?.email}</p>
          <p><strong>ID:</strong> {user?.id}</p>
        </div>

        {/* Identidades vinculadas */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Identidades vinculadas</h2>
          
          {loadingIdentities ? (
            <div className="flex justify-center p-4">
              <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-800"></div>
            </div>
          ) : linkedIdentities.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {linkedIdentities.map((identity) => (
                <li key={identity.id} className="py-3 flex justify-between items-center">
                  <div>
                    <p className="font-medium">{identity.provider}</p>
                    <p className="text-sm text-gray-500">{identity.email || identity.id}</p>
                  </div>
                  <button
                    onClick={() => handleUnlinkIdentity(identity.provider, identity.id)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Desvincular
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-center py-3">No hay identidades vinculadas</p>
          )}
        </div>

        {/* Botones para vincular identidades */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold mb-2">Vincular nueva identidad</h2>
          
          <LinkIdentity 
            provider="google" 
            buttonText="Vincular con Google" 
            className="link-identity-button google-button" 
          />
          
          <LinkIdentity 
            provider="github" 
            buttonText="Vincular con GitHub" 
            className="link-identity-button github-button" 
          />
          
          <LinkIdentity 
            provider="facebook" 
            buttonText="Vincular con Facebook" 
            className="link-identity-button facebook-button" 
          />
          
          <LinkIdentity 
            provider="twitter" 
            buttonText="Vincular con Twitter" 
            className="link-identity-button twitter-button" 
          />
        </div>

        {/* Botón para volver */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <button
            onClick={() => navigate('/')}
            className="w-full py-2 px-4 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    </div>
  );
};

export default LinkIdentityPage;
