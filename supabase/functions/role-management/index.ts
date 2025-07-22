// Función serverless para gestión de roles y permisos
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
      case 'createRole':
        // Crear un nuevo rol
        const { name, description } = data;

        // Llamar a la función SQL para crear el rol
        const { data: roleData, error: roleError } = await supabase.rpc(
          'create_role',
          {
            nombre: name,
            descripcion: description,
            admin_user_id: user.id
          }
        );

        if (roleError) {
          throw new Error(`Error al crear rol: ${roleError.message}`);
        }

        result = { id: roleData };
        break;

      case 'updateRole':
        // Actualizar un rol existente
        const { roleId, name: roleName, description: roleDescription } = data;

        // Llamar a la función SQL para actualizar el rol
        const { data: updateResult, error: updateError } = await supabase.rpc(
          'update_role',
          {
            role_id: roleId,
            nombre: roleName,
            descripcion: roleDescription,
            admin_user_id: user.id
          }
        );

        if (updateError) {
          throw new Error(`Error al actualizar rol: ${updateError.message}`);
        }

        result = { success: updateResult };
        break;

      case 'deleteRole':
        // Eliminar un rol
        const { roleId: roleToDelete } = data;

        // Llamar a la función SQL para eliminar el rol
        const { data: deleteResult, error: deleteError } = await supabase.rpc(
          'delete_role',
          {
            role_id: roleToDelete,
            admin_user_id: user.id
          }
        );

        if (deleteError) {
          throw new Error(`Error al eliminar rol: ${deleteError.message}`);
        }

        result = { success: deleteResult };
        break;

      case 'assignPermissions':
        // Asignar permisos a un rol
        const { roleId: targetRole, permissionIds } = data;

        // Llamar a la función SQL para asignar permisos
        const { data: assignResult, error: assignError } = await supabase.rpc(
          'assign_permissions_to_role',
          {
            role_id: targetRole,
            permission_ids: permissionIds,
            admin_user_id: user.id
          }
        );

        if (assignError) {
          throw new Error(`Error al asignar permisos: ${assignError.message}`);
        }

        result = { success: assignResult };
        break;

      case 'createModule':
        // Crear un nuevo módulo
        const { name: moduleName, key, description: moduleDescription, icon, order } = data;

        // Llamar a la función SQL para crear el módulo
        const { data: moduleData, error: moduleError } = await supabase.rpc(
          'create_module',
          {
            nombre: moduleName,
            clave: key,
            descripcion: moduleDescription,
            icono: icon,
            orden: order,
            admin_user_id: user.id
          }
        );

        if (moduleError) {
          throw new Error(`Error al crear módulo: ${moduleError.message}`);
        }

        result = { id: moduleData };
        break;

      case 'updateModule':
        // Actualizar un módulo existente
        const {
          moduleId,
          name: updatedModuleName,
          key: updatedKey,
          description: updatedDescription,
          icon: updatedIcon,
          order: updatedOrder,
          active
        } = data;

        // Llamar a la función SQL para actualizar el módulo
        const { data: updateModuleResult, error: updateModuleError } = await supabase.rpc(
          'update_module',
          {
            module_id: moduleId,
            nombre: updatedModuleName,
            clave: updatedKey,
            descripcion: updatedDescription,
            icono: updatedIcon,
            orden: updatedOrder,
            activo: active,
            admin_user_id: user.id
          }
        );

        if (updateModuleError) {
          throw new Error(`Error al actualizar módulo: ${updateModuleError.message}`);
        }

        result = { success: updateModuleResult };
        break;

      case 'deleteModule':
        // Eliminar un módulo
        const { moduleId: moduleToDelete } = data;

        // Llamar a la función SQL para eliminar el módulo
        const { data: deleteModuleResult, error: deleteModuleError } = await supabase.rpc(
          'delete_module',
          {
            module_id: moduleToDelete,
            admin_user_id: user.id
          }
        );

        if (deleteModuleError) {
          throw new Error(`Error al eliminar módulo: ${deleteModuleError.message}`);
        }

        result = { success: deleteModuleResult };
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
