import React, { useState, useEffect } from 'react';
import { User } from '../../types/user';
import { usersApi } from '../../lib/api';
import { Edit, Trash2, UserPlus, Search, RefreshCw } from 'lucide-react';
import { usePermissions } from '../../lib/auth/PermissionsContext';

interface UsersListProps {
  onAddUser: () => void;
  onEditUser: (user: User) => void;
  onDeleteUser: (user: User) => void;
}

const UsersList: React.FC<UsersListProps> = ({ onAddUser, onEditUser, onDeleteUser }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const { hasPermission } = usePermissions();

  // Cargar usuarios
  const loadUsers = async () => {
    setLoading(true);
    setError(null);

    try {
      console.log('UsersList: Intentando cargar usuarios...');
      const data = await usersApi.getUsers();
      console.log('UsersList: Usuarios cargados correctamente:', data.length);
      setUsers(data);
    } catch (err: any) {
      const errorMsg = err.message || 'Error al cargar usuarios';
      console.error('UsersList: Error al cargar usuarios:', err);
      setError(errorMsg);

      // Mostrar detalles adicionales en la consola para depuración
      if (err.details || err.hint) {
        console.error('Detalles adicionales del error:', {
          details: err.details,
          hint: err.hint,
          code: err.code
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // Cargar usuarios al montar el componente
  useEffect(() => {
    loadUsers();
  }, []);

  // Filtrar usuarios según el término de búsqueda
  const filteredUsers = users.filter(user => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      user.email.toLowerCase().includes(searchTermLower) ||
      user.firstName.toLowerCase().includes(searchTermLower) ||
      user.lastName.toLowerCase().includes(searchTermLower) ||
      user.role.toLowerCase().includes(searchTermLower)
    );
  });

  // Renderizar un indicador de carga
  if (loading && users.length === 0) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="p-4 border-b flex justify-between items-center flex-wrap gap-4">
        <h2 className="text-xl font-semibold text-gray-800">Usuarios</h2>

        <div className="flex items-center space-x-2">
          {/* Buscador */}
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar usuarios..."
              className="pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>

          {/* Botón de recargar */}
          <button
            onClick={loadUsers}
            className="p-2 text-gray-600 hover:text-indigo-600 focus:outline-none"
            title="Recargar usuarios"
          >
            <RefreshCw className="h-5 w-5" />
          </button>

          {/* Botón de añadir usuario */}
          {hasPermission('users:create') && (
            <button
              onClick={onAddUser}
              className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <UserPlus className="mr-2 h-5 w-5" />
              Añadir Usuario
            </button>
          )}
        </div>
      </div>

      {/* Mostrar error si existe */}
      {error && (
        <div className="p-4 bg-red-100 border-l-4 border-red-500 text-red-700">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      )}

      {/* Tabla de usuarios */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nombre
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rol
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                  No se encontraron usuarios
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-800 font-medium">
                          {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user.firstName} {user.lastName}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{user.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                      ${user.role === 'Administrador' ? 'bg-purple-100 text-purple-800' :
                        user.role === 'Psicologo' ? 'bg-blue-100 text-blue-800' :
                        'bg-green-100 text-green-800'}`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                      ${user.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                    >
                      {user.active ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      {hasPermission('users:edit') && (
                        <button
                          onClick={() => onEditUser(user)}
                          className="text-indigo-600 hover:text-indigo-900 focus:outline-none"
                          title="Editar usuario"
                        >
                          <Edit className="h-5 w-5" />
                        </button>
                      )}

                      {hasPermission('users:delete') && (
                        <button
                          onClick={() => onDeleteUser(user)}
                          className="text-red-600 hover:text-red-900 focus:outline-none"
                          title="Eliminar usuario"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsersList;
