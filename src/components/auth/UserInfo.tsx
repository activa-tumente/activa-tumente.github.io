import React from 'react';
import { useAuth } from '../../lib/auth/AuthContext';
import { useNavigate } from 'react-router-dom';

const UserInfo: React.FC = () => {
  const { user, logout, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  if (isLoading) {
    return (
      <div className="flex items-center space-x-2">
        <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse"></div>
        <div className="h-4 w-24 bg-gray-200 animate-pulse rounded"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const displayName = user.user_metadata?.username || user.email || 'Usuario';

  return (
    <div className="flex items-center space-x-4">
      <div className="flex flex-col">
        <span className="text-sm font-medium text-gray-700">{displayName}</span>
        <button
          onClick={handleLogout}
          className="text-xs text-indigo-600 hover:text-indigo-800"
        >
          Cerrar sesión
        </button>
      </div>
    </div>
  );
};

export default UserInfo;
