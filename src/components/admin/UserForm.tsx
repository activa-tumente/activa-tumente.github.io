import React, { useState, useEffect } from 'react';
import { User, UserRole, Permission, DEFAULT_ROLE_PERMISSIONS } from '../../types/user';
import { X, Info, RefreshCw } from 'lucide-react';

interface UserFormProps {
  user?: User;
  onSubmit: (userData: any) => void;
  onCancel: () => void;
}

const UserForm: React.FC<UserFormProps> = ({ user, onSubmit, onCancel }) => {
  // Estados
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    role: 'Estudiante' as UserRole,
    permissions: [] as Permission[],
    active: true
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [customPermissions, setCustomPermissions] = useState(false);
  const [showTooltip, setShowTooltip] = useState<string | null>(null);

  // Cargar datos del usuario si se está editando
  useEffect(() => {
    if (user) {
      setFormData({
        email: user.email,
        password: '',
        confirmPassword: '',
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        permissions: user.permissions,
        active: user.active
      });
    }
  }, [user]);

  // Manejar cambios en los campos del formulario
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));

    // Limpiar error del campo
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Manejar cambio de rol
  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const role = e.target.value as UserRole;

    // Solo actualizar los permisos si no se están personalizando
    if (!customPermissions) {
      setFormData(prev => ({
        ...prev,
        role,
        permissions: DEFAULT_ROLE_PERMISSIONS[role]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        role
      }));
    }
  };

  // Manejar cambio en permisos
  const handlePermissionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    const permission = value as Permission;

    // Activar modo de permisos personalizados
    if (!customPermissions) {
      setCustomPermissions(true);
    }

    setFormData(prev => ({
      ...prev,
      permissions: checked
        ? [...prev.permissions, permission]
        : prev.permissions.filter(p => p !== permission)
    }));
  };

  // Restablecer permisos por defecto según el rol
  const handleResetPermissions = () => {
    setFormData(prev => ({
      ...prev,
      permissions: DEFAULT_ROLE_PERMISSIONS[prev.role]
    }));
    setCustomPermissions(false);
  };

  // Validar el formulario
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Validar email
    if (!formData.email) {
      newErrors.email = 'El email es obligatorio';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El email no es válido';
    }

    // Validar contraseña solo si es un nuevo usuario o si se está cambiando
    if (!user && !formData.password) {
      newErrors.password = 'La contraseña es obligatoria';
    } else if (formData.password && formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    // Validar confirmación de contraseña
    if (formData.password && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    // Validar nombre
    if (!formData.firstName) {
      newErrors.firstName = 'El nombre es obligatorio';
    }

    // Validar apellido
    if (!formData.lastName) {
      newErrors.lastName = 'El apellido es obligatorio';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Manejar envío del formulario
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      // Preparar datos para enviar
      const userData = {
        ...formData,
        // No enviar confirmPassword
        confirmPassword: undefined
      };

      // Si no se está cambiando la contraseña, no enviarla
      if (user && !userData.password) {
        userData.password = undefined;
      }

      onSubmit(userData);
    }
  };

  // Lista de todos los permisos disponibles agrupados por categoría
  const permissionGroups = [
    {
      name: 'Administración',
      permissions: [
        { id: 'admin:view', label: 'Ver panel de administración' },
        { id: 'admin:edit', label: 'Editar configuración' },
        { id: 'admin:create', label: 'Crear configuración' },
        { id: 'admin:delete', label: 'Eliminar configuración' }
      ]
    },
    {
      name: 'Usuarios',
      permissions: [
        { id: 'users:view', label: 'Ver usuarios' },
        { id: 'users:edit', label: 'Editar usuarios' },
        { id: 'users:create', label: 'Crear usuarios' },
        { id: 'users:delete', label: 'Eliminar usuarios' }
      ]
    },
    {
      name: 'Estudiantes',
      permissions: [
        { id: 'students:view', label: 'Ver estudiantes' },
        { id: 'students:edit', label: 'Editar estudiantes' },
        { id: 'students:create', label: 'Crear estudiantes' },
        { id: 'students:delete', label: 'Eliminar estudiantes' }
      ]
    },
    {
      name: 'Cuestionarios',
      permissions: [
        { id: 'questionnaires:view', label: 'Ver cuestionarios' },
        { id: 'questionnaires:edit', label: 'Editar cuestionarios' },
        { id: 'questionnaires:create', label: 'Crear cuestionarios' },
        { id: 'questionnaires:delete', label: 'Eliminar cuestionarios' }
      ]
    },
    {
      name: 'Informes',
      permissions: [
        { id: 'reports:view', label: 'Ver informes' },
        { id: 'reports:generate', label: 'Generar informes' }
      ]
    }
  ];

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-xl font-semibold text-gray-800">
          {user ? 'Editar Usuario' : 'Añadir Usuario'}
        </h2>
        <button
          onClick={onCancel}
          className="text-gray-500 hover:text-gray-700 focus:outline-none"
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Email */}
          <div className="col-span-2">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                errors.email ? 'border-red-500' : ''
              }`}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email}</p>
            )}
          </div>

          {/* Contraseña */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Contraseña {!user && <span className="text-red-500">*</span>}
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                errors.password ? 'border-red-500' : ''
              }`}
              placeholder={user ? 'Dejar en blanco para no cambiar' : ''}
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-500">{errors.password}</p>
            )}
          </div>

          {/* Confirmar Contraseña */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
              Confirmar Contraseña
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                errors.confirmPassword ? 'border-red-500' : ''
              }`}
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>
            )}
          </div>

          {/* Nombre */}
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
              Nombre <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                errors.firstName ? 'border-red-500' : ''
              }`}
            />
            {errors.firstName && (
              <p className="mt-1 text-sm text-red-500">{errors.firstName}</p>
            )}
          </div>

          {/* Apellido */}
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
              Apellido <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                errors.lastName ? 'border-red-500' : ''
              }`}
            />
            {errors.lastName && (
              <p className="mt-1 text-sm text-red-500">{errors.lastName}</p>
            )}
          </div>

          {/* Rol */}
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700">
              Rol <span className="text-red-500">*</span>
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleRoleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="Administrador">Administrador</option>
              <option value="Psicologo">Psicólogo</option>
              <option value="Estudiante">Estudiante</option>
            </select>
            <p className="mt-1 text-xs text-gray-500">
              El rol determina los permisos predeterminados del usuario.
            </p>
          </div>

          {/* Estado */}
          <div>
            <label htmlFor="active" className="block text-sm font-medium text-gray-700">
              Estado
            </label>
            <div className="mt-2">
              <div className="flex items-center">
                <input
                  id="active"
                  name="active"
                  type="checkbox"
                  checked={formData.active}
                  onChange={(e) => setFormData(prev => ({ ...prev, active: e.target.checked }))}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="active" className="ml-2 block text-sm text-gray-900">
                  Usuario activo
                </label>
              </div>
            </div>
          </div>

          {/* Permisos */}
          <div className="col-span-2 mt-4">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center">
                <h3 className="text-lg font-medium text-gray-900">Permisos</h3>
                <button
                  type="button"
                  className="ml-2 text-gray-500 hover:text-indigo-600 focus:outline-none"
                  onMouseEnter={() => setShowTooltip('permissions')}
                  onMouseLeave={() => setShowTooltip(null)}
                >
                  <Info className="h-5 w-5" />
                </button>

                {showTooltip === 'permissions' && (
                  <div className="absolute mt-2 ml-8 p-2 bg-gray-800 text-white text-xs rounded shadow-lg z-10 max-w-xs">
                    Los permisos determinan a qué funcionalidades puede acceder el usuario.
                    Por defecto, se asignan según el rol seleccionado.
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={handleResetPermissions}
                className={`flex items-center text-sm ${customPermissions ? 'text-indigo-600 hover:text-indigo-800' : 'text-gray-400 cursor-not-allowed'}`}
                disabled={!customPermissions}
                title="Restablecer permisos predeterminados del rol"
              >
                <RefreshCw className="h-4 w-4 mr-1" />
                Restablecer predeterminados
              </button>
            </div>

            <p className="text-sm text-gray-500 mb-4">
              {customPermissions
                ? 'Permisos personalizados activados. Puedes modificarlos según tus necesidades.'
                : 'Los permisos se asignarán automáticamente según el rol seleccionado.'}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {permissionGroups.map((group) => (
                <div key={group.name} className="border rounded-md p-4">
                  <h4 className="font-medium text-gray-900 mb-2">{group.name}</h4>
                  <div className="space-y-2">
                    {group.permissions.map((permission) => (
                      <div key={permission.id} className="flex items-center">
                        <input
                          id={permission.id}
                          name="permissions"
                          type="checkbox"
                          value={permission.id}
                          checked={formData.permissions.includes(permission.id as Permission)}
                          onChange={handlePermissionChange}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <label htmlFor={permission.id} className="ml-2 block text-sm text-gray-900">
                          {permission.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="mt-8 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {user ? 'Actualizar' : 'Crear'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserForm;
