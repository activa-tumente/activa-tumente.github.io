// Script para crear directamente un usuario administrador en Supabase
// Ejecutar con: node scripts/direct-create-admin.mjs

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

// Obtener el directorio actual
const __dirname = dirname(fileURLToPath(import.meta.url));

// Leer el archivo .env.local manualmente
const envPath = resolve(__dirname, '../.env.local');
console.log('Leyendo archivo .env.local desde:', envPath);

let envContent;
try {
  envContent = readFileSync(envPath, 'utf8');
  console.log('Archivo .env.local leído correctamente');
} catch (error) {
  console.error('Error al leer .env.local:', error.message);
  process.exit(1);
}

// Extraer variables directamente del contenido
const extractVariable = (content, varName) => {
  const regex = new RegExp(`${varName}=([^\\n]+)`);
  const match = content.match(regex);
  return match ? match[1].trim() : null;
};

// Obtener variables de Supabase
const SUPABASE_URL = extractVariable(envContent, 'VITE_SUPABASE_URL');
const SUPABASE_SERVICE_KEY = extractVariable(envContent, 'SUPABASE_SERVICE_ROLE_KEY');

console.log('SUPABASE_URL:', SUPABASE_URL);
console.log('SUPABASE_SERVICE_KEY:', SUPABASE_SERVICE_KEY ? SUPABASE_SERVICE_KEY.substring(0, 20) + '...' : 'No encontrada');

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('Error: No se pudieron extraer las variables de Supabase del archivo .env.local');
  process.exit(1);
}

// Credenciales para el usuario administrador
const ADMIN_EMAIL = 'keinelust2008@gmail.com';
const ADMIN_PASSWORD = 'Salome2021';

// Crear cliente de Supabase con la clave de servicio
console.log('Creando cliente de Supabase con clave de servicio...');
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Función principal
async function main() {
  try {
    console.log('Verificando si el usuario ya existe...');
    
    // Buscar usuario por email
    const { data: authUser, error: authError } = await supabase.auth.admin.getUserByEmail(ADMIN_EMAIL);
    
    if (authError) {
      if (authError.message.includes('User not found')) {
        console.log('El usuario no existe, creándolo...');
        await createUser();
      } else {
        console.error('Error al buscar usuario:', authError.message);
      }
    } else {
      console.log('El usuario ya existe:', authUser.user.id);
      console.log('Actualizando contraseña...');
      
      // Actualizar contraseña
      const { error: updateError } = await supabase.auth.admin.updateUserById(
        authUser.user.id,
        { password: ADMIN_PASSWORD }
      );
      
      if (updateError) {
        console.error('Error al actualizar contraseña:', updateError.message);
      } else {
        console.log('Contraseña actualizada correctamente');
      }
      
      // Verificar si existe el perfil
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
          console.error('Error al buscar perfil:', profileError.message);
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
  } catch (error) {
    console.error('Error general:', error.message);
  }
}

// Función para crear un usuario
async function createUser() {
  try {
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
      console.error('Error al crear usuario:', error.message);
      return;
    }
    
    console.log('Usuario creado correctamente:', data.user.id);
    
    // Crear perfil para el usuario
    await createProfile(data.user.id);
    
  } catch (error) {
    console.error('Error al crear usuario:', error.message);
  }
}

// Función para crear un perfil
async function createProfile(userId) {
  try {
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
      console.error('Error al crear perfil:', error.message);
      return;
    }
    
    console.log('Perfil creado correctamente:', data);
    
  } catch (error) {
    console.error('Error al crear perfil:', error.message);
  }
}

// Función para actualizar un perfil
async function updateProfile(userId) {
  try {
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
      console.error('Error al actualizar perfil:', error.message);
      return;
    }
    
    console.log('Perfil actualizado correctamente:', data);
    
  } catch (error) {
    console.error('Error al actualizar perfil:', error.message);
  }
}

// Ejecutar la función principal
main();
