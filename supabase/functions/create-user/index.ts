// Función serverless para crear usuarios con roles
// Ruta: /create-user
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

interface CreateUserRequest {
  email: string
  password: string
  firstName: string
  lastName: string
  role: 'Administrador' | 'Psicologo' | 'Estudiante'
  institucion_id?: string
  estudiante_id?: string
}

serve(async (req) => {
  try {
    // Crear cliente de Supabase con la clave de servicio
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    // Verificar que la solicitud sea de un administrador
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'No se proporcionó token de autenticación' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user: adminUser }, error: authError } = await supabaseAdmin.auth.getUser(token)

    if (authError || !adminUser) {
      return new Response(
        JSON.stringify({ error: 'Token de autenticación inválido' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Verificar que el usuario sea administrador
    const { data: adminProfile, error: profileError } = await supabaseAdmin
      .from('user_profiles')
      .select('role, permissions')
      .eq('user_id', adminUser.id)
      .single()

    if (profileError || !adminProfile) {
      return new Response(
        JSON.stringify({ error: 'No se pudo verificar el perfil del administrador' }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      )
    }

    if (adminProfile.role !== 'Administrador' || 
        !adminProfile.permissions.includes('users:create')) {
      return new Response(
        JSON.stringify({ error: 'No tienes permisos para crear usuarios' }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Obtener datos del cuerpo de la solicitud
    const userData: CreateUserRequest = await req.json()

    // Validar datos
    if (!userData.email || !userData.password || !userData.firstName || 
        !userData.lastName || !userData.role) {
      return new Response(
        JSON.stringify({ error: 'Faltan datos requeridos' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // 1. Crear usuario en auth.users
    const { data: authData, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email: userData.email,
      password: userData.password,
      email_confirm: true,
      user_metadata: {
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: userData.role
      }
    })

    if (createError || !authData.user) {
      return new Response(
        JSON.stringify({ error: `Error al crear usuario: ${createError?.message}` }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // 2. Crear perfil en user_profiles
    const { data: roleData, error: roleError } = await supabaseAdmin
      .from('roles')
      .select('id')
      .eq('nombre', userData.role)
      .single()

    if (roleError) {
      return new Response(
        JSON.stringify({ error: `Error al obtener rol: ${roleError.message}` }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Obtener permisos del rol
    const { data: permissionsData, error: permissionsError } = await supabaseAdmin.rpc(
      'get_role_permissions',
      { role_id: roleData.id }
    )

    if (permissionsError) {
      return new Response(
        JSON.stringify({ error: `Error al obtener permisos: ${permissionsError.message}` }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Crear array de permisos
    const permissions = permissionsData.map((p: any) => p.permiso_completo)

    // Insertar perfil
    const { data: profileData, error: insertError } = await supabaseAdmin
      .from('user_profiles')
      .insert({
        id: authData.user.id,
        user_id: authData.user.id,
        email: userData.email,
        firstname: userData.firstName,
        lastname: userData.lastName,
        role: userData.role,
        permissions,
        active: true,
        institucion_id: userData.institucion_id || null,
        estudiante_id: userData.estudiante_id || null
      })
      .select()
      .single()

    if (insertError) {
      // Si falla la creación del perfil, eliminar el usuario de auth
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id)
      
      return new Response(
        JSON.stringify({ error: `Error al crear perfil: ${insertError.message}` }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ 
        message: 'Usuario creado exitosamente',
        user: {
          id: authData.user.id,
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          role: userData.role
        }
      }),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: `Error interno: ${error.message}` }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
})
