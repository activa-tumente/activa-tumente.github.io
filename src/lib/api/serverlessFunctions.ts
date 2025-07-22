import { supabase } from '../supabase';

// Tipo para las opciones de las funciones
type FunctionOptions = {
  functionName: string;
  action: string;
  data: Record<string, any>;
  accessToken?: string;
};

/**
 * Invoca una función serverless en Supabase
 * @param options Opciones para la función
 * @returns Resultado de la función
 */
export const invokeServerlessFunction = async <T = any>({
  functionName,
  action,
  data,
  accessToken
}: FunctionOptions): Promise<T> => {
  try {
    let token = accessToken;

    // Si no se proporcionó un token, intentar obtenerlo de la sesión actual
    if (!token) {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        throw new Error('No hay sesión activa. Por favor, inicia sesión para usar esta función.');
      }

      token = session.access_token;
    }

    if (!token) {
      throw new Error('No se pudo obtener un token de acceso válido.');
    }

    // Determinar si estamos en desarrollo o producción
    const isDevelopment = import.meta.env.DEV;

    let result, error;

    if (isDevelopment) {
      // En desarrollo, usar fetch con el proxy configurado en vite.config.ts
      try {
        const response = await fetch(`/functions/v1/${functionName}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            action,
            ...data
          })
        });

        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status} ${response.statusText}`);
        }

        result = await response.json();
      } catch (fetchError) {
        error = { message: fetchError.message };
      }
    } else {
      // En producción, usar el cliente de Supabase
      const response = await supabase.functions.invoke(functionName, {
        body: JSON.stringify({
          action,
          ...data
        }),
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      result = response.data;
      error = response.error;
    }

    if (error) {
      throw new Error(`Error al invocar función serverless: ${error.message}`);
    }

    return result as T;
  } catch (error) {
    console.error(`Error en función serverless ${functionName}:`, error);
    throw error;
  }
};

// Función para obtener el token de acceso del contexto de autenticación
const getAccessToken = async (): Promise<string | undefined> => {
  try {
    // Intentar obtener el token de la sesión actual
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.access_token) {
      return session.access_token;
    }

    // Si no hay token en la sesión, intentar obtenerlo del localStorage
    const storedToken = localStorage.getItem('supabase.auth.token');
    if (storedToken) {
      try {
        const parsedToken = JSON.parse(storedToken);
        if (parsedToken.access_token) {
          return parsedToken.access_token;
        }
      } catch (e) {
        console.error('Error al parsear el token almacenado:', e);
      }
    }

    return undefined;
  } catch (error) {
    console.error('Error al obtener el token de acceso:', error);
    return undefined;
  }
};

// API para gestión de usuarios
export const userManagementApi = {
  // Crear un nuevo usuario
  createUser: async (userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: string;
  }) => {
    const accessToken = await getAccessToken();
    return invokeServerlessFunction({
      functionName: 'user-management',
      action: 'createUser',
      data: userData,
      accessToken
    });
  },

  // Actualizar un usuario existente
  updateUser: async (userId: string, userData: {
    email?: string;
    firstName?: string;
    lastName?: string;
    role?: string;
    active?: boolean;
  }) => {
    const accessToken = await getAccessToken();
    return invokeServerlessFunction({
      functionName: 'user-management',
      action: 'updateUser',
      data: {
        userId,
        ...userData
      },
      accessToken
    });
  },

  // Eliminar un usuario
  deleteUser: async (userId: string) => {
    const accessToken = await getAccessToken();
    return invokeServerlessFunction({
      functionName: 'user-management',
      action: 'deleteUser',
      data: { userId },
      accessToken
    });
  },

  // Asignar un rol a un usuario
  assignRole: async (userId: string, role: string) => {
    const accessToken = await getAccessToken();
    return invokeServerlessFunction({
      functionName: 'user-management',
      action: 'assignRole',
      data: { userId, role },
      accessToken
    });
  }
};

// API para gestión de roles y permisos
export const roleManagementApi = {
  // Crear un nuevo rol
  createRole: async (roleData: {
    name: string;
    description?: string;
  }) => {
    const accessToken = await getAccessToken();
    return invokeServerlessFunction({
      functionName: 'role-management',
      action: 'createRole',
      data: roleData,
      accessToken
    });
  },

  // Actualizar un rol existente
  updateRole: async (roleId: string, roleData: {
    name?: string;
    description?: string;
  }) => {
    const accessToken = await getAccessToken();
    return invokeServerlessFunction({
      functionName: 'role-management',
      action: 'updateRole',
      data: {
        roleId,
        ...roleData
      },
      accessToken
    });
  },

  // Eliminar un rol
  deleteRole: async (roleId: string) => {
    const accessToken = await getAccessToken();
    return invokeServerlessFunction({
      functionName: 'role-management',
      action: 'deleteRole',
      data: { roleId },
      accessToken
    });
  },

  // Asignar permisos a un rol
  assignPermissions: async (roleId: string, permissionIds: string[]) => {
    const accessToken = await getAccessToken();
    return invokeServerlessFunction({
      functionName: 'role-management',
      action: 'assignPermissions',
      data: { roleId, permissionIds },
      accessToken
    });
  },

  // Crear un nuevo módulo
  createModule: async (moduleData: {
    name: string;
    key: string;
    description?: string;
    icon?: string;
    order?: number;
  }) => {
    const accessToken = await getAccessToken();
    return invokeServerlessFunction({
      functionName: 'role-management',
      action: 'createModule',
      data: moduleData,
      accessToken
    });
  },

  // Actualizar un módulo existente
  updateModule: async (moduleId: string, moduleData: {
    name?: string;
    key?: string;
    description?: string;
    icon?: string;
    order?: number;
    active?: boolean;
  }) => {
    const accessToken = await getAccessToken();
    return invokeServerlessFunction({
      functionName: 'role-management',
      action: 'updateModule',
      data: {
        moduleId,
        ...moduleData
      },
      accessToken
    });
  },

  // Eliminar un módulo
  deleteModule: async (moduleId: string) => {
    const accessToken = await getAccessToken();
    return invokeServerlessFunction({
      functionName: 'role-management',
      action: 'deleteModule',
      data: { moduleId },
      accessToken
    });
  }
};
