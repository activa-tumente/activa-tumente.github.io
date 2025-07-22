import React, { useState, useEffect } from 'react';
import { RefreshCw, Check, X, Info } from 'lucide-react';
import { usePermissions } from '../../../lib/auth/PermissionsContext';
import { Permission } from '../../../types/user';
import { Module } from '../../../types/modules';

interface PermissionsMatrixProps {
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
}

// Tipos para la matriz de permisos
interface Role {
  id: string;
  name: string;
  description: string;
  isSystem: boolean;
  permissions: Permission[];
}

interface PermissionMap {
  [roleId: string]: {
    [moduleId: string]: Permission[];
  };
}

// Datos de ejemplo (en una implementación real, estos vendrían de la API)
const SAMPLE_ROLES: Role[] = [
  {
    id: '1',
    name: 'Administrador',
    description: 'Acceso completo a todas las funcionalidades del sistema',
    isSystem: true,
    permissions: [
      'admin:view', 'admin:edit', 'admin:create', 'admin:delete',
      'users:view', 'users:edit', 'users:create', 'users:delete',
      'students:view', 'students:edit', 'students:create', 'students:delete',
      'questionnaires:view', 'questionnaires:edit', 'questionnaires:create', 'questionnaires:delete',
      'reports:view', 'reports:generate'
    ]
  },
  {
    id: '2',
    name: 'Psicologo',
    description: 'Acceso a gestión de estudiantes, cuestionarios e informes',
    isSystem: true,
    permissions: [
      'students:view', 'students:edit', 'students:create',
      'questionnaires:view', 'questionnaires:edit', 'questionnaires:create',
      'reports:view', 'reports:generate'
    ]
  },
  {
    id: '3',
    name: 'Estudiante',
    description: 'Acceso limitado solo a cuestionarios asignados',
    isSystem: true,
    permissions: [
      'questionnaires:view'
    ]
  }
];

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

const PermissionsMatrix: React.FC<PermissionsMatrixProps> = ({ onSuccess, onError }) => {
  const { hasPermission } = usePermissions();
  
  // Estados
  const [roles, setRoles] = useState<Role[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [permissionMap, setPermissionMap] = useState<PermissionMap>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showTooltip, setShowTooltip] = useState<string | null>(null);
  
  // Cargar datos (simulado)
  useEffect(() => {
    // En una implementación real, esto sería una llamada a la API
    setLoading(true);
    setTimeout(() => {
      setRoles(SAMPLE_ROLES);
      setModules(SAMPLE_MODULES);
      
      // Inicializar el mapa de permisos
      const initialMap: PermissionMap = {};
      SAMPLE_ROLES.forEach(role => {
        initialMap[role.id] = {};
        SAMPLE_MODULES.forEach(module => {
          initialMap[role.id][module.id] = role.permissions.filter(
            permission => module.permissions.includes(permission)
          );
        });
      });
      
      setPermissionMap(initialMap);
      setLoading(false);
    }, 500);
  }, []);
  
  // Verificar si un permiso está asignado
  const hasAssignedPermission = (roleId: string, moduleId: string, permission: Permission): boolean => {
    return permissionMap[roleId]?.[moduleId]?.includes(permission) || false;
  };
  
  // Manejar cambio de permiso
  const handlePermissionChange = (roleId: string, moduleId: string, permission: Permission) => {
    setPermissionMap(prev => {
      const newMap = { ...prev };
      
      if (!newMap[roleId]) {
        newMap[roleId] = {};
      }
      
      if (!newMap[roleId][moduleId]) {
        newMap[roleId][moduleId] = [];
      }
      
      const permissions = [...newMap[roleId][moduleId]];
      const index = permissions.indexOf(permission);
      
      if (index === -1) {
        permissions.push(permission);
      } else {
        permissions.splice(index, 1);
      }
      
      newMap[roleId][moduleId] = permissions;
      return newMap;
    });
  };
  
  // Guardar cambios
  const handleSaveChanges = async () => {
    if (!hasPermission('admin:edit')) {
      onError('No tienes permisos para guardar cambios');
      return;
    }
    
    setSaving(true);
    
    try {
      // En una implementación real, esto sería una llamada a la API
      // Simular una operación asíncrona
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Actualizar los roles con los nuevos permisos
      const updatedRoles = roles.map(role => {
        const rolePermissions: Permission[] = [];
        
        // Recopilar todos los permisos asignados a este rol
        Object.entries(permissionMap[role.id] || {}).forEach(([moduleId, permissions]) => {
          rolePermissions.push(...permissions);
        });
        
        return {
          ...role,
          permissions: [...new Set(rolePermissions)] // Eliminar duplicados
        };
      });
      
      setRoles(updatedRoles);
      onSuccess('Permisos guardados exitosamente');
    } catch (error) {
      console.error('Error al guardar permisos:', error);
      onError('Error al guardar permisos');
    } finally {
      setSaving(false);
    }
  };
  
  // Manejar selección de todos los permisos de un módulo para un rol
  const handleSelectAllModulePermissions = (roleId: string, moduleId: string) => {
    const module = modules.find(m => m.id === moduleId);
    if (!module) return;
    
    setPermissionMap(prev => {
      const newMap = { ...prev };
      
      if (!newMap[roleId]) {
        newMap[roleId] = {};
      }
      
      newMap[roleId][moduleId] = [...module.permissions];
      return newMap;
    });
  };
  
  // Manejar deselección de todos los permisos de un módulo para un rol
  const handleDeselectAllModulePermissions = (roleId: string, moduleId: string) => {
    setPermissionMap(prev => {
      const newMap = { ...prev };
      
      if (!newMap[roleId]) {
        newMap[roleId] = {};
      }
      
      newMap[roleId][moduleId] = [];
      return newMap;
    });
  };
  
  return (
    <div className="bg-white rounded-md shadow-sm">
      {/* Cabecera */}
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <div className="flex items-center">
          <h3 className="text-lg font-medium text-gray-900">Matriz de Permisos</h3>
          <button
            className="ml-2 text-gray-500 hover:text-indigo-600 focus:outline-none"
            onMouseEnter={() => setShowTooltip('info')}
            onMouseLeave={() => setShowTooltip(null)}
          >
            <Info className="h-5 w-5" />
          </button>
          
          {showTooltip === 'info' && (
            <div className="absolute mt-2 ml-8 p-2 bg-gray-800 text-white text-xs rounded shadow-lg z-10 max-w-xs">
              Asigna permisos a cada rol seleccionando las casillas correspondientes. 
              Los cambios no se guardarán hasta que hagas clic en "Guardar Cambios".
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          {/* Botón de recargar */}
          <button
            onClick={() => {
              setLoading(true);
              setTimeout(() => {
                setRoles(SAMPLE_ROLES);
                setModules(SAMPLE_MODULES);
                
                // Reinicializar el mapa de permisos
                const initialMap: PermissionMap = {};
                SAMPLE_ROLES.forEach(role => {
                  initialMap[role.id] = {};
                  SAMPLE_MODULES.forEach(module => {
                    initialMap[role.id][module.id] = role.permissions.filter(
                      permission => module.permissions.includes(permission)
                    );
                  });
                });
                
                setPermissionMap(initialMap);
                setLoading(false);
              }, 500);
            }}
            className="p-2 text-gray-600 hover:text-indigo-600 focus:outline-none"
            title="Recargar permisos"
            disabled={loading || saving}
          >
            <RefreshCw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
          
          {/* Botón de guardar */}
          {hasPermission('admin:edit') && (
            <button
              onClick={handleSaveChanges}
              className={`flex items-center px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                saving 
                  ? 'bg-gray-400 text-white cursor-not-allowed' 
                  : 'bg-indigo-600 text-white hover:bg-indigo-700'
              }`}
              disabled={loading || saving}
            >
              {saving ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          )}
        </div>
      </div>
      
      {/* Matriz de permisos */}
      <div className="overflow-x-auto">
        {loading ? (
          <div className="p-8 text-center text-gray-500">
            Cargando matriz de permisos...
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky left-0 bg-gray-50 z-10">
                  Roles / Módulos
                </th>
                {modules.map(module => (
                  <th key={module.id} className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {module.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {roles.map(role => (
                <tr key={role.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap sticky left-0 bg-white z-10">
                    <div className="text-sm font-medium text-gray-900">{role.name}</div>
                  </td>
                  
                  {modules.map(module => (
                    <td key={`${role.id}-${module.id}`} className="px-6 py-4">
                      <div className="flex flex-col space-y-2">
                        {/* Acciones rápidas */}
                        <div className="flex justify-center space-x-2 mb-2">
                          <button
                            onClick={() => handleSelectAllModulePermissions(role.id, module.id)}
                            className="p-1 text-xs bg-green-100 text-green-800 rounded hover:bg-green-200 focus:outline-none"
                            title="Seleccionar todos"
                          >
                            <Check className="h-3 w-3" />
                          </button>
                          <button
                            onClick={() => handleDeselectAllModulePermissions(role.id, module.id)}
                            className="p-1 text-xs bg-red-100 text-red-800 rounded hover:bg-red-200 focus:outline-none"
                            title="Deseleccionar todos"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                        
                        {/* Permisos del módulo */}
                        <div className="grid grid-cols-2 gap-2">
                          {module.permissions.map(permission => (
                            <div key={permission} className="flex items-center">
                              <input
                                type="checkbox"
                                id={`${role.id}-${permission}`}
                                checked={hasAssignedPermission(role.id, module.id, permission)}
                                onChange={() => handlePermissionChange(role.id, module.id, permission)}
                                disabled={role.isSystem && !hasPermission('admin:edit')}
                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                              />
                              <label 
                                htmlFor={`${role.id}-${permission}`} 
                                className="ml-2 block text-xs text-gray-700"
                                title={permission}
                              >
                                {permission.split(':')[1]}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default PermissionsMatrix;
