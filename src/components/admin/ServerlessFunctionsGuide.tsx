import React from 'react';

const ServerlessFunctionsGuide: React.FC = () => {
  return (
    <div className="bg-white shadow-md rounded-lg p-6 mt-6">
      <h2 className="text-xl font-semibold mb-4">Guía de Funciones Serverless</h2>
      
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium mb-2">Gestión de Usuarios</h3>
          <div className="bg-gray-50 p-3 rounded-md">
            <pre className="text-sm overflow-auto">
{`// Crear un nuevo usuario
const result = await userManagementApi.createUser({
  email: 'usuario@ejemplo.com',
  password: 'contraseña',
  firstName: 'Nombre',
  lastName: 'Apellido',
  role: 'Psicologo'
});

// Actualizar un usuario existente
const result = await userManagementApi.updateUser('user-id', {
  email: 'nuevo@ejemplo.com',
  firstName: 'Nuevo Nombre',
  lastName: 'Nuevo Apellido',
  role: 'Administrador',
  active: true
});

// Eliminar un usuario
const result = await userManagementApi.deleteUser('user-id');

// Asignar un rol a un usuario
const result = await userManagementApi.assignRole('user-id', 'Administrador');`}
            </pre>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-2">Gestión de Roles y Permisos</h3>
          <div className="bg-gray-50 p-3 rounded-md">
            <pre className="text-sm overflow-auto">
{`// Crear un nuevo rol
const result = await roleManagementApi.createRole({
  name: 'Nuevo Rol',
  description: 'Descripción del rol'
});

// Actualizar un rol existente
const result = await roleManagementApi.updateRole('role-id', {
  name: 'Nombre Actualizado',
  description: 'Nueva descripción'
});

// Eliminar un rol
const result = await roleManagementApi.deleteRole('role-id');

// Asignar permisos a un rol
const result = await roleManagementApi.assignPermissions('role-id', [
  'permiso-id-1',
  'permiso-id-2'
]);

// Crear un nuevo módulo
const result = await roleManagementApi.createModule({
  name: 'Nuevo Módulo',
  key: 'nuevo_modulo',
  description: 'Descripción del módulo',
  icon: 'icon-name',
  order: 1
});

// Actualizar un módulo existente
const result = await roleManagementApi.updateModule('module-id', {
  name: 'Nombre Actualizado',
  key: 'clave_actualizada',
  description: 'Nueva descripción',
  icon: 'nuevo-icono',
  order: 2,
  active: true
});

// Eliminar un módulo
const result = await roleManagementApi.deleteModule('module-id');`}
            </pre>
          </div>
        </div>
      </div>
      
      <div className="mt-4 text-sm text-gray-600">
        <p>
          <strong>Nota:</strong> Estas funciones requieren que el usuario tenga los permisos adecuados para ejecutarlas.
          Las funciones serverless validan los permisos del usuario antes de realizar cualquier operación.
        </p>
      </div>
    </div>
  );
};

export default ServerlessFunctionsGuide;
