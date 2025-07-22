import React, { useState, useEffect } from 'react';
import { Edit, Trash2, Plus, RefreshCw, AlertTriangle, Check, X } from 'lucide-react';
import { usePermissions } from '../../../lib/auth/PermissionsContext';
import { Module, CreateModuleData } from '../../../types/modules';
import { Permission } from '../../../types/user';

interface ModulesManagementProps {
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
}

// Datos de ejemplo (en una implementación real, estos vendrían de la API)
const SAMPLE_MODULES: Module[] = [
  {
    id: '1',
    name: 'Administración',
    description: 'Módulo de administración del sistema',
    key: 'admin',
    permissions: ['admin:view', 'admin:edit', 'admin:create', 'admin:delete'],
    isSystem: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Usuarios',
    description: 'Gestión de usuarios del sistema',
    key: 'users',
    permissions: ['users:view', 'users:edit', 'users:create', 'users:delete'],
    isSystem: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '3',
    name: 'Estudiantes',
    description: 'Gestión de estudiantes',
    key: 'students',
    permissions: ['students:view', 'students:edit', 'students:create', 'students:delete'],
    isSystem: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '4',
    name: 'Cuestionarios',
    description: 'Gestión de cuestionarios',
    key: 'questionnaires',
    permissions: ['questionnaires:view', 'questionnaires:edit', 'questionnaires:create', 'questionnaires:delete'],
    isSystem: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '5',
    name: 'Informes',
    description: 'Generación de informes',
    key: 'reports',
    permissions: ['reports:view', 'reports:generate'],
    isSystem: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// Acciones disponibles para los permisos
const PERMISSION_ACTIONS = ['view', 'edit', 'create', 'delete', 'generate'];

const ModulesManagement: React.FC<ModulesManagementProps> = ({ onSuccess, onError }) => {
  const { hasPermission } = usePermissions();
  
  // Estados
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [formData, setFormData] = useState<CreateModuleData>({ 
    name: '', 
    description: '', 
    key: '',
    permissions: []
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  
  // Cargar módulos (simulado)
  useEffect(() => {
    // En una implementación real, esto sería una llamada a la API
    setLoading(true);
    setTimeout(() => {
      setModules(SAMPLE_MODULES);
      setLoading(false);
    }, 500);
  }, []);
  
  // Manejadores para modales
  const handleAddModule = () => {
    setFormData({ name: '', description: '', key: '', permissions: [] });
    setFormErrors({});
    setIsAddModalOpen(true);
  };
  
  const handleEditModule = (module: Module) => {
    setSelectedModule(module);
    setFormData({ 
      name: module.name, 
      description: module.description, 
      key: module.key,
      permissions: module.permissions
    });
    setFormErrors({});
    setIsEditModalOpen(true);
  };
  
  const handleDeleteModule = (module: Module) => {
    setSelectedModule(module);
    setIsDeleteModalOpen(true);
  };
  
  // Manejar cambios en el formulario
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Limpiar error
    if (formErrors[name]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  // Manejar cambios en los permisos
  const handlePermissionChange = (action: string) => {
    const permissionKey = `${formData.key}:${action}`;
    
    setFormData(prev => {
      const permissions = [...prev.permissions];
      const index = permissions.indexOf(permissionKey as Permission);
      
      if (index === -1) {
        permissions.push(permissionKey as Permission);
      } else {
        permissions.splice(index, 1);
      }
      
      return { ...prev, permissions };
    });
  };
  
  // Validar formulario
  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      errors.name = 'El nombre es obligatorio';
    }
    
    if (!formData.key.trim()) {
      errors.key = 'La clave es obligatoria';
    } else if (!/^[a-z][a-z0-9_]*$/.test(formData.key)) {
      errors.key = 'La clave debe comenzar con una letra minúscula y contener solo letras minúsculas, números y guiones bajos';
    }
    
    if (formData.permissions.length === 0) {
      errors.permissions = 'Debe seleccionar al menos un permiso';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Manejar envío del formulario
  const handleSubmit = () => {
    if (!validateForm()) return;
    
    // En una implementación real, esto sería una llamada a la API
    if (isAddModalOpen) {
      // Simular creación de módulo
      const newModule: Module = {
        id: Math.random().toString(36).substring(2, 9),
        name: formData.name,
        description: formData.description,
        key: formData.key,
        permissions: formData.permissions,
        isSystem: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      setModules(prev => [...prev, newModule]);
      setIsAddModalOpen(false);
      onSuccess(`Módulo "${formData.name}" creado exitosamente`);
    } else if (isEditModalOpen && selectedModule) {
      // Simular actualización de módulo
      setModules(prev => 
        prev.map(module => 
          module.id === selectedModule.id 
            ? { 
                ...module, 
                name: formData.name, 
                description: formData.description,
                key: formData.key,
                permissions: formData.permissions,
                updatedAt: new Date().toISOString()
              } 
            : module
        )
      );
      setIsEditModalOpen(false);
      onSuccess(`Módulo "${formData.name}" actualizado exitosamente`);
    }
  };
  
  // Manejar eliminación de módulo
  const handleConfirmDelete = () => {
    if (!selectedModule) return;
    
    // En una implementación real, esto sería una llamada a la API
    setModules(prev => prev.filter(module => module.id !== selectedModule.id));
    setIsDeleteModalOpen(false);
    onSuccess(`Módulo "${selectedModule.name}" eliminado exitosamente`);
  };
  
  return (
    <div className="bg-white rounded-md shadow-sm">
      {/* Cabecera */}
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Módulos del Sistema</h3>
        
        <div className="flex items-center space-x-2">
          {/* Botón de recargar */}
          <button
            onClick={() => {
              setLoading(true);
              setTimeout(() => {
                setModules(SAMPLE_MODULES);
                setLoading(false);
              }, 500);
            }}
            className="p-2 text-gray-600 hover:text-indigo-600 focus:outline-none"
            title="Recargar módulos"
          >
            <RefreshCw className="h-5 w-5" />
          </button>
          
          {/* Botón de añadir módulo */}
          {hasPermission('admin:create') && (
            <button
              onClick={handleAddModule}
              className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Plus className="mr-2 h-5 w-5" />
              Añadir Módulo
            </button>
          )}
        </div>
      </div>
      
      {/* Tabla de módulos */}
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
                Clave
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Permisos
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
            {loading ? (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                  Cargando módulos...
                </td>
              </tr>
            ) : modules.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                  No se encontraron módulos
                </td>
              </tr>
            ) : (
              modules.map((module) => (
                <tr key={module.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{module.name}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-500">{module.description}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{module.key}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {module.permissions.map(permission => (
                        <span 
                          key={permission} 
                          className="px-2 py-1 text-xs rounded-full bg-indigo-100 text-indigo-800"
                        >
                          {permission}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      module.isSystem ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {module.isSystem ? 'Sistema' : 'Personalizado'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      {hasPermission('admin:edit') && (
                        <button
                          onClick={() => handleEditModule(module)}
                          className="text-indigo-600 hover:text-indigo-900 focus:outline-none"
                          title="Editar módulo"
                        >
                          <Edit className="h-5 w-5" />
                        </button>
                      )}
                      
                      {hasPermission('admin:delete') && !module.isSystem && (
                        <button
                          onClick={() => handleDeleteModule(module)}
                          className="text-red-600 hover:text-red-900 focus:outline-none"
                          title="Eliminar módulo"
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
      
      {/* Modal para añadir/editar módulo */}
      {(isAddModalOpen || isEditModalOpen) && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-xl font-semibold text-gray-800">
                {isAddModalOpen ? 'Añadir Módulo' : 'Editar Módulo'}
              </h2>
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  setIsEditModalOpen(false);
                }}
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                {/* Nombre */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Nombre <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                      formErrors.name ? 'border-red-500' : ''
                    }`}
                  />
                  {formErrors.name && (
                    <p className="mt-1 text-sm text-red-500">{formErrors.name}</p>
                  )}
                </div>
                
                {/* Descripción */}
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Descripción
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={3}
                    value={formData.description}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
                
                {/* Clave */}
                <div>
                  <label htmlFor="key" className="block text-sm font-medium text-gray-700">
                    Clave <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="key"
                    name="key"
                    value={formData.key}
                    onChange={handleChange}
                    disabled={isEditModalOpen && selectedModule?.isSystem}
                    className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                      formErrors.key ? 'border-red-500' : ''
                    }`}
                  />
                  {formErrors.key && (
                    <p className="mt-1 text-sm text-red-500">{formErrors.key}</p>
                  )}
                  <p className="mt-1 text-xs text-gray-500">
                    La clave se utilizará como prefijo para los permisos (ej: "admin" generará permisos como "admin:view")
                  </p>
                </div>
                
                {/* Permisos */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Permisos <span className="text-red-500">*</span>
                  </label>
                  
                  <div className="space-y-2">
                    {PERMISSION_ACTIONS.map(action => {
                      const permissionKey = `${formData.key}:${action}`;
                      const isChecked = formData.permissions.includes(permissionKey as Permission);
                      
                      return (
                        <div key={action} className="flex items-center">
                          <input
                            type="checkbox"
                            id={`permission-${action}`}
                            checked={isChecked}
                            onChange={() => handlePermissionChange(action)}
                            disabled={!formData.key}
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                          />
                          <label htmlFor={`permission-${action}`} className="ml-2 block text-sm text-gray-700">
                            {permissionKey}
                          </label>
                        </div>
                      );
                    })}
                  </div>
                  
                  {formErrors.permissions && (
                    <p className="mt-1 text-sm text-red-500">{formErrors.permissions}</p>
                  )}
                </div>
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setIsEditModalOpen(false);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  {isAddModalOpen ? 'Crear' : 'Actualizar'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Modal de confirmación para eliminar */}
      {isDeleteModalOpen && selectedModule && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-gray-900">Confirmar eliminación</h3>
              </div>
            </div>
            
            <div className="mt-2">
              <p className="text-sm text-gray-500">
                ¿Estás seguro de que deseas eliminar el módulo "{selectedModule.name}"? Esta acción no se puede deshacer.
              </p>
            </div>
            
            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
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

export default ModulesManagement;
