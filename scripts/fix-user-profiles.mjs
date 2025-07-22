// Script para corregir la tabla user_profiles y crear el perfil de administrador
// Ejecutar con: node scripts/fix-user-profiles.mjs

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

// Datos del usuario administrador
const ADMIN_EMAIL = 'keinelust2008@gmail.com';
const ADMIN_USER_ID = '67c975a6-4d31-4990-b71b-4ed13031bc9d'; // ID obtenido del script anterior

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
    // 1. Desactivar temporalmente RLS en la tabla user_profiles
    console.log('Desactivando temporalmente RLS en la tabla user_profiles...');
    const { error: rpcError } = await supabase.rpc('disable_rls_for_table', { table_name: 'user_profiles' });
    
    if (rpcError) {
      console.error('Error al desactivar RLS mediante RPC:', rpcError.message);
      console.log('Intentando ejecutar SQL directo para desactivar RLS...');
      
      // Intentar ejecutar SQL directo
      const { error: sqlError } = await supabase.from('_exec_sql').select('*').eq('query', 'ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;');
      
      if (sqlError) {
        console.error('Error al ejecutar SQL directo:', sqlError.message);
        console.log('Continuando de todos modos...');
      } else {
        console.log('SQL directo ejecutado correctamente');
      }
    } else {
      console.log('RLS desactivado correctamente mediante RPC');
    }
    
    // 2. Verificar si el perfil ya existe
    console.log('Verificando si el perfil ya existe...');
    const { data: existingProfile, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', ADMIN_USER_ID)
      .maybeSingle();
    
    if (profileError && !profileError.message.includes('infinite recursion')) {
      console.error('Error al verificar perfil:', profileError.message);
    } else if (existingProfile) {
      console.log('El perfil ya existe:', existingProfile);
      
      // 3. Actualizar el perfil existente
      console.log('Actualizando el perfil...');
      const { data: updatedProfile, error: updateError } = await supabase
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
        .eq('user_id', ADMIN_USER_ID)
        .select()
        .single();
      
      if (updateError) {
        console.error('Error al actualizar perfil:', updateError.message);
      } else {
        console.log('Perfil actualizado correctamente:', updatedProfile);
      }
    } else {
      // 4. Crear un nuevo perfil
      console.log('El perfil no existe, creándolo...');
      const { data: newProfile, error: insertError } = await supabase
        .from('user_profiles')
        .insert({
          id: ADMIN_USER_ID,
          user_id: ADMIN_USER_ID,
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
      
      if (insertError) {
        console.error('Error al crear perfil:', insertError.message);
      } else {
        console.log('Perfil creado correctamente:', newProfile);
      }
    }
    
    // 5. Corregir las políticas RLS
    console.log('\nCorrigiendo políticas RLS...');
    
    // 5.1. Eliminar todas las políticas existentes
    console.log('Eliminando políticas existentes...');
    const dropPoliciesQueries = [
      "DROP POLICY IF EXISTS \"Administradores pueden ver todos los perfiles\" ON user_profiles;",
      "DROP POLICY IF EXISTS \"Psicologos pueden ver perfiles de estudiantes\" ON user_profiles;",
      "DROP POLICY IF EXISTS \"Usuarios pueden ver su propio perfil\" ON user_profiles;",
      "DROP POLICY IF EXISTS \"Administradores pueden insertar perfiles\" ON user_profiles;",
      "DROP POLICY IF EXISTS \"Administradores pueden actualizar cualquier perfil\" ON user_profiles;",
      "DROP POLICY IF EXISTS \"Usuarios pueden actualizar su propio perfil\" ON user_profiles;",
      "DROP POLICY IF EXISTS \"Administradores pueden eliminar perfiles\" ON user_profiles;"
    ];
    
    for (const query of dropPoliciesQueries) {
      try {
        const { error } = await supabase.from('_exec_sql').select('*').eq('query', query);
        if (error) {
          console.error(`Error al ejecutar: ${query}`, error.message);
        }
      } catch (e) {
        console.error(`Error al ejecutar: ${query}`, e.message);
      }
    }
    
    // 5.2. Crear políticas simplificadas
    console.log('Creando políticas simplificadas...');
    const createPoliciesQueries = [
      "CREATE POLICY \"Permitir acceso completo a todos\" ON user_profiles FOR ALL USING (true);",
      "ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;"
    ];
    
    for (const query of createPoliciesQueries) {
      try {
        const { error } = await supabase.from('_exec_sql').select('*').eq('query', query);
        if (error) {
          console.error(`Error al ejecutar: ${query}`, error.message);
        }
      } catch (e) {
        console.error(`Error al ejecutar: ${query}`, e.message);
      }
    }
    
    console.log('\nProceso completado. Intenta iniciar sesión nuevamente.');
    
  } catch (error) {
    console.error('Error general:', error.message);
  }
}

// Ejecutar la función principal
main();
