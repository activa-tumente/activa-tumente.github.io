import React, { useState, useEffect } from 'react';
import { Edit, Trash2, Plus, RefreshCw, AlertTriangle } from 'lucide-react';
import { usePermissions } from '../../../lib/auth/PermissionsContext';

// Tipos
interface Role {
  id: string;
  name: string;
  description: string;
  isSystem: boolean;
  createdAt: string;
  updatedAt: string;
}

interface RoleFormData {
  name: string;
  description: string;
}

interface RolesManagementProps {
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
}

// Datos de ejemplo (en una implementación real, estos vendrían de la API)
const SAMPLE_ROLES: Role[] = [
  {
    id: '1',
    name: 'Administrador',
    description: 'Acceso completo a todas las funcionalidades del sistema',
    isSystem: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Psicologo',
    description: 'Acceso a gestión de estudiantes, cuestionarios e informes',
    isSystem: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '3',
    name: 'Estudiante',
    description: 'Acceso limitado solo a cuestionarios asignados',
    isSystem: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '4',
    name: 'Profesor',
    description: 'Acceso a gestión de estudiantes y visualización de informes',
    isSystem: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const RolesManagement: React.FC<RolesManagementProps> = ({ onSuccess, onError }) => {
  const { hasPermission } = usePermissions();
  
  // Estados
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [formData, setFormData] = useState<RoleFormData>({ name: '', description: '' });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  
  // Cargar roles (simulado)
  useEffect(() => {
    // En una implementación real, esto sería una llamada a la API
    setLoading(true);
    setTimeout(() => {
      setRoles(SAMPLE_ROLES);
      setLoading(false);
    }, 500);
  }, []);
  
  // Manejadores para modales
  const handleAddRole = () => {
    setFormData({ name: '', description: '' });
    setFormErrors({});
    setIsAddModalOpen(true);
  };
  
  const handleEditRole = (role: Role) => {
    setSelectedRole(role);
    setFormData({ name: role.name, description: role.description });
    setFormErrors({});
    setIsEditModalOpen(true);
  };
  
  const handleDeleteRole = (role: Role) => {
    setSelectedRole(role);
    setIsDeleteModalOpen(true);
  };
  
  // Manejadores para cerrar modales
  const handleCancelAdd = () => setIsAddModalOpen(false);
  const handleCancelEdit = () => setIsEditModalOpen(false);
  const handleCancelDelete = () => setIsDeleteModalOpen(false);
  
  // Manejador para cambios en el formulario
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Limpiar error si el campo tiene valor
    if (value.trim() && formErrors[name]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  // Validar formulario
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      errors.name = 'El nombre del rol es obligatorio';
    }
    
    if (!formData.description.trim()) {
      errors.description = 'La descripción del rol es obligatoria';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Manejadores para guardar
  const handleSaveRole = () => {
    if (!validateForm()) return;
    
    // En una implementación real, esto sería una llamada a la API
    if (isAddModalOpen) {
      // Simular creación de rol
      const newRole: Role = {
        id: Math.random().toString(36).substring(2, 9),
        name: formData.name,
        description: formData.description,
        isSystem: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      setRoles(prev => [...prev, newRole]);
      onSuccess(`Rol "${formData.name}" creado exitosamente`);
    } else if (isEditModalOpen && selectedRole) {
      // Simular actualización de rol
      setRoles(prev => 
        prev.map(role => 
          role.id === selectedRole.id 
            ? { 
                ...role, 
                name: formData.name, 
                description: formData.description,
                updatedAt: new Date().toISOString()
              } 
            : role
        )
      );
      onSuccess(`Rol "${formData.name}" actualizado exitosamente`);
    }
    
    // Cerrar modales
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
  };
  
  // Manejador para eliminar
  const handleConfirmDelete = () => {
    if (!selectedRole) return;
    
    // En una implementación real, esto sería una llamada a la API
    if (selectedRole.isSystem) {
      onError('No se puede eliminar un rol del sistema');
      setIsDeleteModalOpen(false);
      return;
    }
    
    setRoles(prev => prev.filter(role => role.id !== selectedRole.id));
    onSuccess(`Rol "${selectedRole.name}" eliminado exitosamente`);
    setIsDeleteModalOpen(false);
  };
  
  // Renderizar indicador de carga
  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }
  
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="p-4 border-b flex justify-between items-center flex-wrap gap-4">
        <h2 className="text-xl font-semibold text-gray-800">Roles</h2>
        
        <div className="flex items-center space-x-2">
          {/* Botón de recargar */}
          <button
            onClick={() => {
              setLoading(true);
              setTimeout(() => {
                setRoles(SAMPLE_ROLES);
                setLoading(false);
              }, 500);
            }}
            className="p-2 text-gray-600 hover:text-indigo-600 focus:outline-none"
            title="Recargar roles"
          >
            <RefreshCw className="h-5 w-5" />
          </button>
          
          {/* Botón de añadir rol */}
          {hasPermission('admin:create') && (
            <button
              onClick={handleAddRole}
              className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Plus className="mr-2 h-5 w-5" />
              Añadir Rol
            </button>
          )}
        </div>
      </div>
      
      {/* Descripción */}
      <div className="p-4 bg-gray-50 border-b">
        <p className="text-sm text-gray-600">
          Los roles definen los permisos que tienen los usuarios en el sistema. Cada rol puede tener diferentes niveles de acceso a las funcionalidades.
          Los roles del sistema no pueden ser eliminados.
        </p>
      </div>
      
      {/* Tabla de roles */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nombre
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Descripción
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tipo
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {roles.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                  No se encontraron roles
                </td>
              </tr>
            ) : (
              roles.map((role) => (
                <tr key={role.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{role.name}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-500">{role.description}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      role.isSystem ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {role.isSystem ? 'Sistema' : 'Personalizado'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      {hasPermission('admin:edit') && (
                        <button
                          onClick={() => handleEditRole(role)}
                          className="text-indigo-600 hover:text-indigo-900 focus:outline-none"
                          title="Editar rol"
                        >
                          <Edit className="h-5 w-5" />
                        </button>
                      )}
                      
                      {hasPermission('admin:delete') && !role.isSystem && (
                        <button
                          onClick={() => handleDeleteRole(role)}
                          className="text-red-600 hover:text-red-900 focus:outline-none"
                          title="Eliminar rol"
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
      
      {/* Modal para añadir rol */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Añadir Rol</h3>
              <button
                onClick={handleCancelAdd}
                className="text-gray-400 hover:text-gray-500 focus:outline-none"
              >
                <span className="sr-only">Cerrar</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Nombre <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleFormChange}
                    className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                      formErrors.name ? 'border-red-500' : ''
                    }`}
                  />
                  {formErrors.name && (
                    <p className="mt-1 text-sm text-red-500">{formErrors.name}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Descripción <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={3}
                    value={formData.description}
                    onChange={handleFormChange}
                    className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                      formErrors.description ? 'border-red-500' : ''
                    }`}
                  />
                  {formErrors.description && (
                    <p className="mt-1 text-sm text-red-500">{formErrors.description}</p>
                  )}
                </div>
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={handleCancelAdd}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleSaveRole}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Guardar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Modal para editar rol */}
      {isEditModalOpen && selectedRole && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Editar Rol</h3>
              <button
                onClick={handleCancelEdit}
                className="text-gray-400 hover:text-gray-500 focus:outline-none"
              >
                <span className="sr-only">Cerrar</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Nombre <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleFormChange}
                    className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                      formErrors.name ? 'border-red-500' : ''
                    }`}
                    disabled={selectedRole.isSystem}
                  />
                  {formErrors.name && (
                    <p className="mt-1 text-sm text-red-500">{formErrors.name}</p>
                  )}
                  {selectedRole.isSystem && (
                    <p className="mt-1 text-sm text-amber-600">Los roles del sistema no pueden cambiar de nombre</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Descripción <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={3}
                    value={formData.description}
                    onChange={handleFormChange}
                    className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                      formErrors.description ? 'border-red-500' : ''
                    }`}
                  />
                  {formErrors.description && (
                    <p className="mt-1 text-sm text-red-500">{formErrors.description}</p>
                  )}
                </div>
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleSaveRole}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Actualizar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Modal para confirmar eliminación */}
      {isDeleteModalOpen && selectedRole && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-center mb-4 text-red-500">
              <AlertTriangle className="h-12 w-12" />
            </div>
            
            <h3 className="text-lg font-medium text-gray-900 text-center mb-2">
              Eliminar Rol
            </h3>
            
            <p className="text-sm text-gray-500 text-center mb-6">
              ¿Estás seguro de que deseas eliminar el rol <strong>{selectedRole.name}</strong>?
              Esta acción no se puede deshacer.
            </p>
            
            <div className="flex justify-center space-x-4">
              <button
                type="button"
                onClick={handleCancelDelete}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RolesManagement;
