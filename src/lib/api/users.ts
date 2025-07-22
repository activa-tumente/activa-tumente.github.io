import { supabase, handleSupabaseError } from '../supabase';
import { User, CreateUserData, UpdateUserData, DEFAULT_ROLE_PERMISSIONS } from '../../types/user';

/**
 * Obtiene todos los usuarios
 * @returns Lista de usuarios
 */
export const getUsers = async (): Promise<User[]> => {
  try {
    console.log('Obteniendo usuarios desde Supabase...');

    // Intentar obtener el usuario actual para verificar la autenticación
    const { data: sessionData } = await supabase.auth.getSession();
    console.log('Sesión actual:', sessionData?.session ? 'Autenticado' : 'No autenticado');

    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .order('fecha_creacion', { ascending: false });

    if (error) {
      console.error('Error al obtener usuarios:', error);
      handleSupabaseError(error);
    }

    // Transformar los datos de la estructura de la tabla a la estructura de la aplicación
    const adaptedData = (data || []).map(profile => ({
      id: profile.id,
      user_id: profile.user_id,
      email: profile.email || 'usuario@example.com',
      firstName: profile.firstname || 'Usuario',
      lastName: profile.lastname || 'Sistema',
      role: profile.role,
      permissions: profile.permissions || [],
      active: profile.active !== undefined ? profile.active : true,
      institucion_id: profile.institucion_id,
      estudiante_id: profile.estudiante_id,
      createdAt: profile.fecha_creacion,
      updatedAt: profile.fecha_actualizacion
    }));

    return adaptedData;
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    throw error;
  }
};

/**
 * Obtiene un usuario por su ID
 * @param userId ID del usuario
 * @returns Datos del usuario
 */
export const getUserById = async (userId: string): Promise<User | null> => {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) handleSupabaseError(error);

    // Transformar los datos de la estructura de la tabla a la estructura de la aplicación
    if (!data) return null;

    return {
      id: data.id,
      user_id: data.user_id,
      email: data.email || 'usuario@example.com',
      firstName: data.firstname || 'Usuario',
      lastName: data.lastname || 'Sistema',
      role: data.role,
      permissions: data.permissions || [],
      active: data.active !== undefined ? data.active : true,
      institucion_id: data.institucion_id,
      estudiante_id: data.estudiante_id,
      createdAt: data.fecha_creacion,
      updatedAt: data.fecha_actualizacion
    };
  } catch (error) {
    console.error(`Error al obtener usuario ${userId}:`, error);
    throw error;
  }
};

/**
 * Crea un nuevo usuario
 * @param userData Datos del nuevo usuario
 * @returns El usuario creado
 */
export const createUser = async (userData: CreateUserData): Promise<User> => {
  try {
    // 1. Crear el usuario en auth usando la API de registro normal
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
      options: {
        data: {
          firstName: userData.firstName,
          lastName: userData.lastName,
          role: userData.role,
          permissions: userData.permissions || DEFAULT_ROLE_PERMISSIONS[userData.role]
        }
      }
    });

    if (authError) handleSupabaseError(authError);
    if (!authData.user) throw new Error('No se pudo crear el usuario');

    // 2. Crear el perfil del usuario
    const { data: profileData, error: profileError } = await supabase
      .from('user_profiles')
      .insert({
        id: authData.user.id,
        user_id: authData.user.id,
        role: userData.role,
        email: userData.email,
        firstname: userData.firstName,
        lastname: userData.lastName,
        permissions: userData.permissions || DEFAULT_ROLE_PERMISSIONS[userData.role],
        active: true,
        institucion_id: userData.institucion_id || null,
        estudiante_id: userData.estudiante_id || null
      })
      .select()
      .single();

    if (profileError) handleSupabaseError(profileError);

    // Transformar los datos de la estructura de la tabla a la estructura de la aplicación
    if (!profileData) throw new Error('No se pudo crear el perfil del usuario');

    return {
      id: profileData.id,
      user_id: profileData.user_id,
      email: profileData.email || userData.email,
      firstName: profileData.firstname || userData.firstName,
      lastName: profileData.lastname || userData.lastName,
      role: profileData.role,
      permissions: profileData.permissions || userData.permissions || DEFAULT_ROLE_PERMISSIONS[userData.role],
      active: profileData.active !== undefined ? profileData.active : true,
      institucion_id: profileData.institucion_id,
      estudiante_id: profileData.estudiante_id,
      createdAt: profileData.fecha_creacion,
      updatedAt: profileData.fecha_actualizacion
    };
  } catch (error) {
    console.error('Error al crear usuario:', error);
    throw error;
  }
};

/**
 * Actualiza un usuario existente
 * @param userId ID del usuario a actualizar
 * @param userData Datos a actualizar
 * @returns El usuario actualizado
 */
export const updateUser = async (userId: string, userData: UpdateUserData): Promise<User> => {
  try {
    // 1. Actualizar metadatos en auth si es necesario
    // Nota: No podemos actualizar los metadatos de otros usuarios desde el cliente
    // Esta funcionalidad requeriría una función serverless o un endpoint de backend
    // Por ahora, solo actualizamos el perfil en la base de datos

    // 2. Actualizar el perfil del usuario
    const { data, error } = await supabase
      .from('user_profiles')
      .update({
        ...(userData.role && { role: userData.role }),
        ...(userData.email && { email: userData.email }),
        ...(userData.firstName && { firstname: userData.firstName }),
        ...(userData.lastName && { lastname: userData.lastName }),
        ...(userData.permissions && { permissions: userData.permissions }),
        ...(userData.active !== undefined && { active: userData.active }),
        ...(userData.institucion_id !== undefined && { institucion_id: userData.institucion_id }),
        ...(userData.estudiante_id !== undefined && { estudiante_id: userData.estudiante_id }),
        fecha_actualizacion: new Date().toISOString()
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) handleSupabaseError(error);

    // Transformar los datos de la estructura de la tabla a la estructura de la aplicación
    if (!data) throw new Error(`No se pudo actualizar el usuario ${userId}`);

    return {
      id: data.id,
      user_id: data.user_id,
      email: data.email || 'usuario@example.com',
      firstName: data.firstname || 'Usuario',
      lastName: data.lastname || 'Sistema',
      role: data.role,
      permissions: data.permissions || [],
      active: data.active !== undefined ? data.active : true,
      institucion_id: data.institucion_id,
      estudiante_id: data.estudiante_id,
      createdAt: data.fecha_creacion,
      updatedAt: data.fecha_actualizacion
    };
  } catch (error) {
    console.error(`Error al actualizar usuario ${userId}:`, error);
    throw error;
  }
};

/**
 * Elimina un usuario
 * @param userId ID del usuario a eliminar
 * @returns true si se eliminó correctamente
 */
export const deleteUser = async (userId: string): Promise<boolean> => {
  try {
    // 1. No podemos eliminar usuarios desde el cliente
    // Esta funcionalidad requeriría una función serverless o un endpoint de backend
    // Por ahora, solo marcamos el usuario como inactivo en la base de datos

    // Marcar el usuario como inactivo
    const { error: updateError } = await supabase
      .from('user_profiles')
      .update({ active: false })
      .eq('id', userId);

    if (updateError) handleSupabaseError(updateError);

    // 2. Eliminar el perfil del usuario (esto debería ser automático con ON DELETE CASCADE)
    const { error: profileError } = await supabase
      .from('user_profiles')
      .delete()
      .eq('id', userId);

    if (profileError) handleSupabaseError(profileError);

    return true;
  } catch (error) {
    console.error(`Error al eliminar usuario ${userId}:`, error);
    throw error;
  }
};

/**
 * Cambia la contraseña de un usuario
 * @param userId ID del usuario
 * @param newPassword Nueva contraseña
 * @returns true si se cambió correctamente
 */
export const changeUserPassword = async (userId: string, newPassword: string): Promise<boolean> => {
  try {
    // No podemos cambiar la contraseña de otros usuarios desde el cliente
    // Esta funcionalidad requeriría una función serverless o un endpoint de backend
    // Por ahora, devolvemos un error
    throw new Error('No se puede cambiar la contraseña desde el cliente. Contacte al administrador del sistema.');
  } catch (error) {
    console.error(`Error al cambiar contraseña del usuario ${userId}:`, error);
    throw error;
  }
};

/**
 * Verifica si un usuario tiene un permiso específico
 * @param user Usuario a verificar
 * @param permission Permiso requerido
 * @returns true si tiene el permiso
 */
export const hasPermission = (user: User | null, permission: string): boolean => {
  if (!user) return false;
  // Manejar el caso en que los permisos no estén definidos
  return user.permissions ? user.permissions.includes(permission as any) : false;
};

// Exportar el servicio de usuarios
export const usersApi = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  changeUserPassword,
  hasPermission
};
