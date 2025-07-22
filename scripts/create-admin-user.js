// Script para crear un usuario administrador en Supabase
// Ejecutar con: node scripts/create-admin-user.js

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Configuración
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const ADMIN_EMAIL = 'keinelust2008@gmail.com';
const ADMIN_PASSWORD = 'Salome2021'; // Cambia esto a la contraseña que deseas usar

// Crear cliente de Supabase con la clave de servicio
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function main() {
  try {
    console.log('Verificando si el usuario ya existe...');
    
    // Buscar usuario por email
    const { data: existingUsers, error: searchError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('email', ADMIN_EMAIL)
      .maybeSingle();
    
    if (searchError) {
      throw new Error(`Error al buscar usuario: ${searchError.message}`);
    }
    
    if (existingUsers) {
      console.log('El usuario ya existe en user_profiles:', existingUsers);
      
      // Verificar si existe en auth.users
      const { data: authUser, error: authError } = await supabase.auth.admin.getUserByEmail(ADMIN_EMAIL);
      
      if (authError) {
        console.log('El usuario no existe en auth.users, creándolo...');
        await createAuthUser();
      } else {
        console.log('El usuario ya existe en auth.users:', authUser);
        console.log('Actualizando la contraseña...');
        
        // Actualizar contraseña
        const { error: updateError } = await supabase.auth.admin.updateUserById(
          authUser.user.id,
          { password: ADMIN_PASSWORD }
        );
        
        if (updateError) {
          throw new Error(`Error al actualizar contraseña: ${updateError.message}`);
        }
        
        console.log('Contraseña actualizada correctamente');
      }
    } else {
      console.log('El usuario no existe, creándolo...');
      await createUser();
    }
    
    console.log('Proceso completado con éxito');
  } catch (error) {
    console.error('Error:', error.message);
  }
}

async function createAuthUser() {
  // Crear usuario en auth.users
  const { data, error } = await supabase.auth.admin.createUser({
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
    email_confirm: true,
    user_metadata: {
      firstName: 'Administrador',
      lastName: 'Sistema',
      role: 'Administrador'
    }
  });
  
  if (error) {
    throw new Error(`Error al crear usuario en auth: ${error.message}`);
  }
  
  console.log('Usuario creado en auth.users:', data.user);
  return data.user;
}

async function createUser() {
  // Crear usuario en auth.users
  const user = await createAuthUser();
  
  // Crear perfil en user_profiles
  const { data, error } = await supabase
    .from('user_profiles')
    .insert({
      id: user.id,
      user_id: user.id,
      email: ADMIN_EMAIL,
      firstname: 'Administrador',
      lastname: 'Sistema',
      role: 'Administrador',
      permissions: [
        "admin:view", "admin:edit", "admin:create", "admin:delete",
        "users:view", "users:edit", "users:create", "users:delete",
        "students:view", "students:edit", "students:create", "students:delete",
        "questionnaires:view", "questionnaires:edit", "questionnaires:create", "questionnaires:delete",
        "reports:view", "reports:generate"
      ],
      active: true
    })
    .select()
    .single();
  
  if (error) {
    throw new Error(`Error al crear perfil: ${error.message}`);
  }
  
  console.log('Perfil creado en user_profiles:', data);
}

main();
