import React from 'react';
import UserProfileBadge from '../components/auth/UserProfileBadge';
import Navbar from '../components/layout/Navbar';

const UserProfileBadgeExamplePage: React.FC = () => {
  // Manejadores de eventos para el UserProfileBadge
  const handleProfileClick = () => {
    console.log('Ver perfil');
  };

  const handleSettingsClick = () => {
    console.log('Configuración');
  };

  const handleLogoutClick = () => {
    console.log('Cerrar sesión');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar title="Ejemplos de UserProfileBadge" />
      
      <div className="container mx-auto p-8">
        <h1 className="text-3xl font-bold mb-8">Ejemplos de UserProfileBadge</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Ejemplo 1: Con avatar */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Con Avatar</h2>
            <div className="flex justify-center mb-4">
              <UserProfileBadge
                avatarUrl="https://i.pravatar.cc/300?img=1"
                userName="John Doe"
                userId="user-1"
                userStatus="online"
                onProfileClick={handleProfileClick}
                onSettingsClick={handleSettingsClick}
                onLogoutClick={handleLogoutClick}
              />
            </div>
            <p className="text-sm text-gray-600 text-center">
              Muestra un avatar con un indicador de estado "online"
            </p>
          </div>
          
          {/* Ejemplo 2: Sin avatar (fallback con iniciales) */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Sin Avatar (Fallback)</h2>
            <div className="flex justify-center mb-4">
              <UserProfileBadge
                userName="Jane Smith"
                userId="user-2"
                userStatus="offline"
                onProfileClick={handleProfileClick}
                onSettingsClick={handleSettingsClick}
                onLogoutClick={handleLogoutClick}
              />
            </div>
            <p className="text-sm text-gray-600 text-center">
              Muestra iniciales con un indicador de estado "offline"
            </p>
          </div>
          
          {/* Ejemplo 3: Con nombre y apellido */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Con Nombre y Apellido</h2>
            <div className="flex justify-center mb-4">
              <UserProfileBadge
                firstName="Robert"
                lastName="Johnson"
                userId="user-3"
                userStatus="away"
                onProfileClick={handleProfileClick}
                onSettingsClick={handleSettingsClick}
                onLogoutClick={handleLogoutClick}
              />
            </div>
            <p className="text-sm text-gray-600 text-center">
              Muestra iniciales basadas en nombre y apellido con estado "away"
            </p>
          </div>
          
          {/* Ejemplo 4: Con color de fondo personalizado */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Color Personalizado</h2>
            <div className="flex justify-center mb-4">
              <UserProfileBadge
                userName="Custom Color"
                fallbackBgColor="bg-pink-600"
                onProfileClick={handleProfileClick}
                onSettingsClick={handleSettingsClick}
                onLogoutClick={handleLogoutClick}
              />
            </div>
            <p className="text-sm text-gray-600 text-center">
              Muestra iniciales con un color de fondo personalizado
            </p>
          </div>
          
          {/* Ejemplo 5: Sin estado */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Sin Estado</h2>
            <div className="flex justify-center mb-4">
              <UserProfileBadge
                avatarUrl="https://i.pravatar.cc/300?img=5"
                userName="No Status"
                userId="user-5"
                onProfileClick={handleProfileClick}
                onSettingsClick={handleSettingsClick}
                onLogoutClick={handleLogoutClick}
              />
            </div>
            <p className="text-sm text-gray-600 text-center">
              Muestra un avatar sin indicador de estado
            </p>
          </div>
          
          {/* Ejemplo 6: Con tamaño personalizado */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Tamaño Personalizado</h2>
            <div className="flex justify-center mb-4">
              <div className="scale-150">
                <UserProfileBadge
                  userName="Larger Size"
                  userId="user-6"
                  userStatus="online"
                  onProfileClick={handleProfileClick}
                  onSettingsClick={handleSettingsClick}
                  onLogoutClick={handleLogoutClick}
                />
              </div>
            </div>
            <p className="text-sm text-gray-600 text-center">
              Muestra un badge con tamaño personalizado usando scale-150
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileBadgeExamplePage;
