// Tipos para la gestión de usuarios

// Roles disponibles en la aplicación
export type UserRole = 'Administrador' | 'Psicologo' | 'Estudiante';

// Permisos disponibles en la aplicación
export type Permission =
  | 'admin:view'
  | 'admin:edit'
  | 'admin:create'
  | 'admin:delete'
  | 'users:view'
  | 'users:edit'
  | 'users:create'
  | 'users:delete'
  | 'students:view'
  | 'students:edit'
  | 'students:create'
  | 'students:delete'
  | 'questionnaires:view'
  | 'questionnaires:edit'
  | 'questionnaires:create'
  | 'questionnaires:delete'
  | 'reports:view'
  | 'reports:generate';

// Estructura de un usuario en la aplicación
export interface User {
  id: string;
  user_id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  permissions: Permission[];
  active: boolean;
  institucion_id?: string | null;
  estudiante_id?: string | null;
  createdAt: string; // Mapeo de fecha_creacion
  updatedAt: string; // Mapeo de fecha_actualizacion
}

// Datos para crear un nuevo usuario
export interface CreateUserData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  permissions?: Permission[];
  institucion_id?: string | null;
  estudiante_id?: string | null;
}

// Datos para actualizar un usuario existente
export interface UpdateUserData {
  email?: string;
  firstName?: string;
  lastName?: string;
  role?: UserRole;
  permissions?: Permission[];
  active?: boolean;
  institucion_id?: string | null;
  estudiante_id?: string | null;
}

// Mapeo de roles a permisos por defecto
export const DEFAULT_ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  Administrador: [
    'admin:view', 'admin:edit', 'admin:create', 'admin:delete',
    'users:view', 'users:edit', 'users:create', 'users:delete',
    'students:view', 'students:edit', 'students:create', 'students:delete',
    'questionnaires:view', 'questionnaires:edit', 'questionnaires:create', 'questionnaires:delete',
    'reports:view', 'reports:generate'
  ],
  Psicologo: [
    'students:view', 'students:edit', 'students:create',
    'questionnaires:view', 'questionnaires:edit', 'questionnaires:create',
    'reports:view', 'reports:generate'
  ],
  Estudiante: [
    'questionnaires:view'
  ]
};
