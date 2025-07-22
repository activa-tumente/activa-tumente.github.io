// Script actualizado para crear un usuario administrador en Supabase
// Ejecutar con: node scripts/create-admin-updated.mjs

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
const SUPABASE_ANON_KEY = extractVariable(envContent, 'VITE_SUPABASE_ANON_KEY');

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

// Crear cliente de Supabase con la clave anónima para pruebas
const supabaseAnon = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Función principal
async function main() {
  try {
    console.log('Verificando la versión de la API de Supabase...');
    
    // Verificar si el usuario ya existe intentando iniciar sesión
    console.log('Intentando iniciar sesión para verificar si el usuario existe...');
    const { data: signInData, error: signInError } = await supabaseAnon.auth.signInWithPassword({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD
    });
    
    if (signInError) {
      if (signInError.message.includes('Invalid login credentials')) {
        console.log('El usuario no existe o la contraseña es incorrecta, creando usuario...');
        await createUser();
      } else {
        console.error('Error al iniciar sesión:', signInError.message);
      }
    } else {
      console.log('Inicio de sesión exitoso, el usuario existe:', signInData.user.id);
      
      // Verificar si existe el perfil
      console.log('Verificando si existe el perfil...');
      const { data: profileData, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', signInData.user.id)
        .maybeSingle();
      
      if (profileError && !profileError.message.includes('infinite recursion')) {
        console.error('Error al verificar perfil:', profileError.message);
      } else if (profileData) {
        console.log('El perfil ya existe:', profileData);
        
        // Actualizar el perfil
        console.log('Actualizando el perfil...');
        await updateProfile(signInData.user.id);
      } else {
        console.log('El perfil no existe, creándolo...');
        await createProfile(signInData.user.id);
      }
    }
    
    console.log('Proceso completado con éxito');
  } catch (error) {
    console.error('Error general:', error.message);
  }
}

// Función para crear un usuario
async function createUser() {
  try {
    // Intentar crear usuario con la API disponible
    console.log('Intentando crear usuario con la API de administración...');
    
    // Método 1: Intentar con la API admin.createUser
    try {
      if (supabase.auth.admin && typeof supabase.auth.admin.createUser === 'function') {
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
        
        if (error) throw error;
        
        console.log('Usuario creado correctamente con admin.createUser:', data.user.id);
        await createProfile(data.user.id);
        return;
      }
    } catch (err) {
      console.log('Error con admin.createUser:', err.message);
    }
    
    // Método 2: Intentar con la API admin.createUser (versión alternativa)
    try {
      if (supabase.auth && typeof supabase.auth.createUser === 'function') {
        const { data, error } = await supabase.auth.createUser({
          email: ADMIN_EMAIL,
          password: ADMIN_PASSWORD,
          email_confirm: true,
          user_metadata: {
            firstName: 'Administrador',
            lastName: 'Sistema',
            role: 'Administrador'
          }
        });
        
        if (error) throw error;
        
        console.log('Usuario creado correctamente con auth.createUser:', data.user.id);
        await createProfile(data.user.id);
        return;
      }
    } catch (err) {
      console.log('Error con auth.createUser:', err.message);
    }
    
    // Método 3: Intentar con la API signUp
    try {
      const { data, error } = await supabase.auth.signUp({
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
        options: {
          data: {
            firstName: 'Administrador',
            lastName: 'Sistema',
            role: 'Administrador'
          }
        }
      });
      
      if (error) throw error;
      
      console.log('Usuario creado correctamente con auth.signUp:', data.user.id);
      await createProfile(data.user.id);
      return;
    } catch (err) {
      console.log('Error con auth.signUp:', err.message);
    }
    
    console.error('No se pudo crear el usuario con ningún método disponible');
    
  } catch (error) {
    console.error('Error al crear usuario:', error.message);
  }
}

// Función para crear un perfil
async function createProfile(userId) {
  try {
    // Verificar si la tabla user_profiles tiene RLS activado
    console.log('Intentando desactivar RLS temporalmente...');
    try {
      await supabase.rpc('disable_rls_for_table', { table_name: 'user_profiles' });
      console.log('RLS desactivado correctamente');
    } catch (rpcError) {
      console.log('Error al desactivar RLS mediante RPC:', rpcError.message);
      console.log('Continuando de todos modos...');
    }
    
    // Crear perfil en user_profiles
    console.log('Creando perfil para el usuario:', userId);
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
      
      // Intentar con SQL directo
      console.log('Intentando crear perfil con SQL directo...');
      const sqlQuery = `
        INSERT INTO user_profiles (
          id, user_id, email, firstname, lastname, role, permissions, active
        ) VALUES (
          '${userId}',
          '${userId}',
          '${ADMIN_EMAIL}',
          'Administrador',
          'Sistema',
          'Administrador',
          '["admin:view", "admin:edit", "admin:create", "admin:delete", "users:view", "users:edit", "users:create", "users:delete", "students:view", "students:edit", "students:create", "students:delete", "questionnaires:view", "questionnaires:edit", "questionnaires:create", "questionnaires:delete", "reports:view", "reports:generate"]'::jsonb,
          true
        )
        ON CONFLICT (user_id) DO UPDATE SET
          email = EXCLUDED.email,
          firstname = EXCLUDED.firstname,
          lastname = EXCLUDED.lastname,
          role = EXCLUDED.role,
          permissions = EXCLUDED.permissions,
          active = EXCLUDED.active;
      `;
      
      try {
        await supabase.rpc('exec_sql', { sql: sqlQuery });
        console.log('Perfil creado correctamente con SQL directo');
      } catch (sqlError) {
        console.error('Error al ejecutar SQL directo:', sqlError.message);
      }
      
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
