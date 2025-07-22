// Tipos para la gestión de módulos y permisos

import { Permission } from './user';

// Estructura de un módulo en la aplicación
export interface Module {
  id: string;
  name: string;
  description: string;
  key: string;
  permissions: Permission[];
  isSystem: boolean;
  createdAt: string;
  updatedAt: string;
}

// Datos para crear un nuevo módulo
export interface CreateModuleData {
  name: string;
  description: string;
  key: string;
  permissions: Permission[];
}

// Datos para actualizar un módulo existente
export interface UpdateModuleData {
  name?: string;
  description?: string;
  key?: string;
  permissions?: Permission[];
}

// Agrupación de módulos por categoría
export interface ModuleCategory {
  name: string;
  modules: Module[];
}

// Estructura para la matriz de permisos
export interface PermissionMatrixItem {
  roleId: string;
  roleName: string;
  moduleId: string;
  moduleName: string;
  permissions: Permission[];
}
