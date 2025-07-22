import React from 'react';
import { User } from '../../types/user';
import { AlertTriangle } from 'lucide-react';

interface DeleteUserConfirmationProps {
  user: User;
  onConfirm: () => void;
  onCancel: () => void;
}

const DeleteUserConfirmation: React.FC<DeleteUserConfirmationProps> = ({
  user,
  onConfirm,
  onCancel
}) => {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-center mb-4 text-red-500">
          <AlertTriangle className="h-12 w-12" />
        </div>
        
        <h3 className="text-lg font-medium text-gray-900 text-center mb-2">
          Eliminar Usuario
        </h3>
        
        <p className="text-sm text-gray-500 text-center mb-6">
          ¿Estás seguro de que deseas eliminar al usuario <strong>{user.firstName} {user.lastName}</strong>?
          Esta acción no se puede deshacer.
        </p>
        
        <div className="flex justify-center space-x-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteUserConfirmation;
