import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import { userManagementApi, roleManagementApi } from '../lib/api';
import ServerlessFunctionsGuide from '../components/admin/ServerlessFunctionsGuide';
import { useAuth } from '../lib/auth/AuthContext';

const ServerlessFunctionsPage: React.FC = () => {
  const { user, getAccessToken } = useAuth();
  const [loading, setLoading] = useState({
    createUser: false,
    updateUser: false,
    deleteUser: false,
    assignRole: false,
    createRole: false,
    updateRole: false,
    deleteRole: false,
    assignPermissions: false,
    createModule: false,
    updateModule: false,
    deleteModule: false
  });
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    // Datos para crear usuario
    email: 'test@example.com',
    password: 'password123',
    firstName: 'Test',
    lastName: 'User',
    role: 'Psicologo',

    // IDs para operaciones
    userId: '',
    roleId: '',
    moduleId: '',

    // Datos para roles y módulos
    name: 'Nuevo Rol',
    description: 'Descripción del nuevo rol',
    key: 'nuevo_modulo',
    icon: 'settings',
    order: 1,
    active: true,

    // Permisos
    permissionIds: []
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData({
      ...formData,
      [name]: checked
    });
  };

  const executeFunction = async (functionName: string, callback: () => Promise<any>) => {
    try {
      setLoading({ ...loading, [functionName]: true });
      setError(null);

      if (!user) {
        setError('Debes iniciar sesión para ejecutar esta función');
        setLoading({ ...loading, [functionName]: false });
        return;
      }

      // Obtener el token de acceso
      const accessToken = await getAccessToken();

      if (!accessToken) {
        setError('No se pudo obtener el token de acceso. Por favor, inicia sesión de nuevo.');
        setLoading({ ...loading, [functionName]: false });
        return;
      }

      const result = await callback();

      console.log(`${functionName} resultado:`, result);
      setResult(result);
    } catch (error: any) {
      console.error(`Error en ${functionName}:`, error);
      setError(error.message || `Error en ${functionName}`);
    } finally {
      setLoading({ ...loading, [functionName]: false });
    }
  };

  // Funciones de gestión de usuarios
  const handleCreateUser = () => {
    executeFunction('createUser', () =>
      userManagementApi.createUser({
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        role: formData.role
      })
    );
  };

  const handleUpdateUser = () => {
    if (!formData.userId) {
      setError('Se requiere un ID de usuario');
      return;
    }

    executeFunction('updateUser', () =>
      userManagementApi.updateUser(formData.userId, {
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        role: formData.role,
        active: formData.active
      })
    );
  };

  const handleDeleteUser = () => {
    if (!formData.userId) {
      setError('Se requiere un ID de usuario');
      return;
    }

    executeFunction('deleteUser', () =>
      userManagementApi.deleteUser(formData.userId)
    );
  };

  const handleAssignRole = () => {
    if (!formData.userId) {
      setError('Se requiere un ID de usuario');
      return;
    }

    executeFunction('assignRole', () =>
      userManagementApi.assignRole(formData.userId, formData.role)
    );
  };

  // Funciones de gestión de roles
  const handleCreateRole = () => {
    executeFunction('createRole', () =>
      roleManagementApi.createRole({
        name: formData.name,
        description: formData.description
      })
    );
  };

  const handleUpdateRole = () => {
    if (!formData.roleId) {
      setError('Se requiere un ID de rol');
      return;
    }

    executeFunction('updateRole', () =>
      roleManagementApi.updateRole(formData.roleId, {
        name: formData.name,
        description: formData.description
      })
    );
  };

  const handleDeleteRole = () => {
    if (!formData.roleId) {
      setError('Se requiere un ID de rol');
      return;
    }

    executeFunction('deleteRole', () =>
      roleManagementApi.deleteRole(formData.roleId)
    );
  };

  const handleAssignPermissions = () => {
    if (!formData.roleId) {
      setError('Se requiere un ID de rol');
      return;
    }

    if (!formData.permissionIds.length) {
      setError('Se requiere al menos un ID de permiso');
      return;
    }

    executeFunction('assignPermissions', () =>
      roleManagementApi.assignPermissions(formData.roleId, formData.permissionIds)
    );
  };

  // Funciones de gestión de módulos
  const handleCreateModule = () => {
    executeFunction('createModule', () =>
      roleManagementApi.createModule({
        name: formData.name,
        key: formData.key,
        description: formData.description,
        icon: formData.icon,
        order: Number(formData.order)
      })
    );
  };

  const handleUpdateModule = () => {
    if (!formData.moduleId) {
      setError('Se requiere un ID de módulo');
      return;
    }

    executeFunction('updateModule', () =>
      roleManagementApi.updateModule(formData.moduleId, {
        name: formData.name,
        key: formData.key,
        description: formData.description,
        icon: formData.icon,
        order: Number(formData.order),
        active: formData.active
      })
    );
  };

  const handleDeleteModule = () => {
    if (!formData.moduleId) {
      setError('Se requiere un ID de módulo');
      return;
    }

    executeFunction('deleteModule', () =>
      roleManagementApi.deleteModule(formData.moduleId)
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200">
      <Navbar />
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Prueba de Funciones Serverless</h1>

        {!user ? (
          <div className="bg-white shadow-md rounded-lg p-8 text-center">
            <h2 className="text-xl font-semibold mb-4">Autenticación Requerida</h2>
            <p className="text-gray-700 mb-6">
              Debes iniciar sesión para acceder a las funciones serverless.
            </p>
            <Link
              to="/login"
              className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300 ease-in-out text-base font-medium shadow-sm"
            >
              <LogIn className="mr-2 h-5 w-5" />
              Iniciar Sesión
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Formulario */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Formulario</h2>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">Datos de Usuario</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Apellido</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Rol</label>
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="Administrador">Administrador</option>
                      <option value="Psicologo">Psicólogo</option>
                      <option value="Estudiante">Estudiante</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Activo</label>
                    <input
                      type="checkbox"
                      name="active"
                      checked={formData.active}
                      onChange={handleCheckboxChange}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">IDs para Operaciones</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">ID de Usuario</label>
                    <input
                      type="text"
                      name="userId"
                      value={formData.userId}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">ID de Rol</label>
                    <input
                      type="text"
                      name="roleId"
                      value={formData.roleId}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">ID de Módulo</label>
                    <input
                      type="text"
                      name="moduleId"
                      value={formData.moduleId}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Datos de Rol/Módulo</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Clave (para módulos)</label>
                    <input
                      type="text"
                      name="key"
                      value={formData.key}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      rows={2}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Icono (para módulos)</label>
                    <input
                      type="text"
                      name="icon"
                      value={formData.icon}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Orden (para módulos)</label>
                    <input
                      type="number"
                      name="order"
                      value={formData.order}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-medium mb-2">Acciones</h3>

              <div className="space-y-4">
                <div>
                  <h4 className="text-md font-medium mb-2">Gestión de Usuarios</h4>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={handleCreateUser}
                      disabled={loading.createUser}
                      className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                    >
                      {loading.createUser ? 'Creando...' : 'Crear Usuario'}
                    </button>
                    <button
                      onClick={handleUpdateUser}
                      disabled={loading.updateUser}
                      className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                    >
                      {loading.updateUser ? 'Actualizando...' : 'Actualizar Usuario'}
                    </button>
                    <button
                      onClick={handleDeleteUser}
                      disabled={loading.deleteUser}
                      className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
                    >
                      {loading.deleteUser ? 'Eliminando...' : 'Eliminar Usuario'}
                    </button>
                    <button
                      onClick={handleAssignRole}
                      disabled={loading.assignRole}
                      className="px-3 py-1 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50"
                    >
                      {loading.assignRole ? 'Asignando...' : 'Asignar Rol'}
                    </button>
                  </div>
                </div>

                <div>
                  <h4 className="text-md font-medium mb-2">Gestión de Roles</h4>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={handleCreateRole}
                      disabled={loading.createRole}
                      className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                    >
                      {loading.createRole ? 'Creando...' : 'Crear Rol'}
                    </button>
                    <button
                      onClick={handleUpdateRole}
                      disabled={loading.updateRole}
                      className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                    >
                      {loading.updateRole ? 'Actualizando...' : 'Actualizar Rol'}
                    </button>
                    <button
                      onClick={handleDeleteRole}
                      disabled={loading.deleteRole}
                      className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
                    >
                      {loading.deleteRole ? 'Eliminando...' : 'Eliminar Rol'}
                    </button>
                    <button
                      onClick={handleAssignPermissions}
                      disabled={loading.assignPermissions}
                      className="px-3 py-1 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50"
                    >
                      {loading.assignPermissions ? 'Asignando...' : 'Asignar Permisos'}
                    </button>
                  </div>
                </div>

                <div>
                  <h4 className="text-md font-medium mb-2">Gestión de Módulos</h4>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={handleCreateModule}
                      disabled={loading.createModule}
                      className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                    >
                      {loading.createModule ? 'Creando...' : 'Crear Módulo'}
                    </button>
                    <button
                      onClick={handleUpdateModule}
                      disabled={loading.updateModule}
                      className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                    >
                      {loading.updateModule ? 'Actualizando...' : 'Actualizar Módulo'}
                    </button>
                    <button
                      onClick={handleDeleteModule}
                      disabled={loading.deleteModule}
                      className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
                    >
                      {loading.deleteModule ? 'Eliminando...' : 'Eliminar Módulo'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Resultados */}
          <div>
            <div className="bg-white shadow-md rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Resultados</h2>

              {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
                  <h3 className="font-medium">Error:</h3>
                  <p>{error}</p>
                </div>
              )}

              {result && (
                <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
                  <h3 className="font-medium mb-2">Resultado:</h3>
                  <pre className="text-sm overflow-auto max-h-60">
                    {JSON.stringify(result, null, 2)}
                  </pre>
                </div>
              )}

              <div className="text-sm text-gray-600">
                <p>
                  <strong>Nota:</strong> Los resultados se mostrarán aquí después de ejecutar una acción.
                </p>
              </div>
            </div>

            <ServerlessFunctionsGuide />
          </div>
        </div>
        )}
      </div>
    </div>
  );
};

export default ServerlessFunctionsPage;
