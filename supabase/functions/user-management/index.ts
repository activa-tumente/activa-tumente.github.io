// Función serverless para gestión de usuarios
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Max-Age': '86400',
  'Access-Control-Allow-Credentials': 'true'
};

serve(async (req) => {
  // Manejar solicitudes OPTIONS para CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Crear un cliente Supabase con la clave de servicio
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Faltan variables de entorno para Supabase');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Obtener el token de autorización
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'No se proporcionó token de autorización' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verificar el token y obtener el usuario
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);

    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Token de autorización inválido' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Obtener los datos de la solicitud
    const { action, ...data } = await req.json();

    // Ejecutar la acción correspondiente
    let result;

    switch (action) {
      case 'createUser':
        // Crear un nuevo usuario
        const { email, password, firstName, lastName, role } = data;

        // Crear el usuario en auth.users
        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
          email,
          password,
          email_confirm: true,
          user_metadata: {
            firstName,
            lastName,
            role
          }
        });

        if (authError) {
          throw new Error(`Error al crear usuario en auth: ${authError.message}`);
        }

        // Llamar a la función SQL para crear el perfil del usuario
        const { data: userData, error: userProfileError } = await supabase.rpc(
          'create_user',
          {
            email,
            password: 'HASHED_IN_AUTH', // La contraseña ya está almacenada en auth.users
            first_name: firstName,
            last_name: lastName,
            role_name: role,
            admin_user_id: user.id
          }
        );

        if (userProfileError) {
          // Si hay un error, intentar eliminar el usuario creado en auth
          await supabase.auth.admin.deleteUser(authData.user.id);
          throw new Error(`Error al crear perfil de usuario: ${userProfileError.message}`);
        }

        result = { id: authData.user.id, email, role };
        break;

      case 'updateUser':
        // Actualizar un usuario existente
        const { userId, ...updateData } = data;

        // Actualizar el usuario en auth.users si es necesario
        if (updateData.email) {
          const { error: updateAuthError } = await supabase.auth.admin.updateUserById(
            userId,
            { email: updateData.email }
          );

          if (updateAuthError) {
            throw new Error(`Error al actualizar usuario en auth: ${updateAuthError.message}`);
          }
        }

        // Actualizar los metadatos del usuario si es necesario
        if (updateData.firstName || updateData.lastName || updateData.role) {
          const { data: currentUser, error: getUserError } = await supabase.auth.admin.getUserById(userId);

          if (getUserError) {
            throw new Error(`Error al obtener usuario: ${getUserError.message}`);
          }

          const currentMetadata = currentUser.user.user_metadata || {};
          const newMetadata = {
            ...currentMetadata,
            firstName: updateData.firstName || currentMetadata.firstName,
            lastName: updateData.lastName || currentMetadata.lastName,
            role: updateData.role || currentMetadata.role
          };

          const { error: updateMetadataError } = await supabase.auth.admin.updateUserById(
            userId,
            { user_metadata: newMetadata }
          );

          if (updateMetadataError) {
            throw new Error(`Error al actualizar metadatos: ${updateMetadataError.message}`);
          }
        }

        // Llamar a la función SQL para actualizar el perfil del usuario
        const { data: updateResult, error: updateError } = await supabase.rpc(
          'update_user',
          {
            target_user_id: userId,
            email: updateData.email,
            first_name: updateData.firstName,
            last_name: updateData.lastName,
            role_name: updateData.role,
            is_active: updateData.active,
            admin_user_id: user.id
          }
        );

        if (updateError) {
          throw new Error(`Error al actualizar perfil de usuario: ${updateError.message}`);
        }

        result = { success: updateResult };
        break;

      case 'deleteUser':
        // Eliminar un usuario
        const { userId: userToDelete } = data;

        // Llamar a la función SQL para desactivar el perfil del usuario
        const { data: deleteResult, error: deleteError } = await supabase.rpc(
          'delete_user',
          {
            target_user_id: userToDelete,
            admin_user_id: user.id
          }
        );

        if (deleteError) {
          throw new Error(`Error al desactivar perfil de usuario: ${deleteError.message}`);
        }

        // Eliminar el usuario de auth.users
        const { error: deleteAuthError } = await supabase.auth.admin.deleteUser(userToDelete);

        if (deleteAuthError) {
          throw new Error(`Error al eliminar usuario de auth: ${deleteAuthError.message}`);
        }

        result = { success: true };
        break;

      case 'assignRole':
        // Asignar un rol a un usuario
        const { userId: targetUser, role: newRole } = data;

        // Actualizar los metadatos del usuario
        const { data: userToUpdate, error: getUserError } = await supabase.auth.admin.getUserById(targetUser);

        if (getUserError) {
          throw new Error(`Error al obtener usuario: ${getUserError.message}`);
        }

        const currentMetadata = userToUpdate.user.user_metadata || {};
        const updatedMetadata = {
          ...currentMetadata,
          role: newRole
        };

        const { error: updateRoleError } = await supabase.auth.admin.updateUserById(
          targetUser,
          { user_metadata: updatedMetadata }
        );

        if (updateRoleError) {
          throw new Error(`Error al actualizar rol en metadatos: ${updateRoleError.message}`);
        }

        // Llamar a la función SQL para asignar el rol
        const { data: assignResult, error: assignError } = await supabase.rpc(
          'assign_role_to_user',
          {
            target_user_id: targetUser,
            role_name: newRole,
            admin_user_id: user.id
          }
        );

        if (assignError) {
          throw new Error(`Error al asignar rol: ${assignError.message}`);
        }

        result = { success: assignResult };
        break;

      default:
        return new Response(
          JSON.stringify({ error: 'Acción no válida' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
