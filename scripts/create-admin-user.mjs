// Script para crear un usuario administrador en Supabase
// Ejecutar con: node scripts/create-admin-user.mjs

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

// Obtener el directorio actual
const __dirname = dirname(fileURLToPath(import.meta.url));

// Leer el archivo .env.local manualmente
const envPath = resolve(__dirname, '../.env.local');
const envContent = readFileSync(envPath, 'utf8');

// Parsear las variables de entorno
const env = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    const key = match[1].trim();
    const value = match[2].trim();
    env[key] = value;
  }
});

// Configuración
const SUPABASE_URL = env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = env.SUPABASE_SERVICE_ROLE_KEY;
const ADMIN_EMAIL = 'keinelust2008@gmail.com';
const ADMIN_PASSWORD = 'Salome2021'; // Cambia esto a la contraseña que deseas usar

// Verificar que las variables de entorno estén definidas
if (!SUPABASE_URL) {
  console.error('Error: VITE_SUPABASE_URL no está definida');
  process.exit(1);
}

if (!SUPABASE_SERVICE_KEY) {
  console.error('Error: SUPABASE_SERVICE_ROLE_KEY no está definida');
  console.error('Asegúrate de que esta variable esté en tu archivo .env.local');
  process.exit(1);
}

console.log('Usando URL de Supabase:', SUPABASE_URL);

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
    
    // Buscar usuario por email en auth.users
    const { data: authUser, error: authError } = await supabase.auth.admin.getUserByEmail(ADMIN_EMAIL);
    
    if (authError) {
      if (authError.message.includes('User not found')) {
        console.log('El usuario no existe en auth.users, creándolo...');
        await createAuthUser();
      } else {
        throw new Error(`Error al buscar usuario en auth: ${authError.message}`);
      }
    } else {
      console.log('El usuario ya existe en auth.users:', authUser.user.id);
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
      
      // Verificar si existe en user_profiles
      const { data: profileData, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', authUser.user.id)
        .single();
      
      if (profileError) {
        if (profileError.message.includes('No rows found')) {
          console.log('El perfil no existe, creándolo...');
          await createProfile(authUser.user.id);
        } else {
          throw new Error(`Error al buscar perfil: ${profileError.message}`);
        }
      } else {
        console.log('El perfil ya existe:', profileData);
        
        // Actualizar el perfil si es necesario
        if (profileData.role !== 'Administrador') {
          console.log('Actualizando el rol a Administrador...');
          await updateProfile(authUser.user.id);
        }
      }
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
  
  console.log('Usuario creado en auth.users:', data.user.id);
  
  // Crear perfil para el usuario
  await createProfile(data.user.id);
  
  return data.user;
}

async function createProfile(userId) {
  // Crear perfil en user_profiles
  const { data, error } = await supabase
    .from('user_profiles')
    .insert({
      id: userId,
      user_id: userId,
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

async function updateProfile(userId) {
  // Actualizar perfil en user_profiles
  const { data, error } = await supabase
    .from('user_profiles')
    .update({
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
    .eq('user_id', userId)
    .select()
    .single();
  
  if (error) {
    throw new Error(`Error al actualizar perfil: ${error.message}`);
  }
  
  console.log('Perfil actualizado en user_profiles:', data);
}

main();
