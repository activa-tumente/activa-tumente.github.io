// Script para probar directamente la autenticación con Supabase
// Ejecutar con: node scripts/direct-auth-test.mjs

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
const SUPABASE_ANON_KEY = extractVariable(envContent, 'VITE_SUPABASE_ANON_KEY');

console.log('SUPABASE_URL:', SUPABASE_URL);
console.log('SUPABASE_ANON_KEY:', SUPABASE_ANON_KEY ? SUPABASE_ANON_KEY.substring(0, 20) + '...' : 'No encontrada');

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('Error: No se pudieron extraer las variables de Supabase del archivo .env.local');
  process.exit(1);
}

// Credenciales para la prueba
const EMAIL = 'keinelust2008@gmail.com';
const PASSWORD = 'Salome2021';

// Crear cliente de Supabase
console.log('Creando cliente de Supabase...');
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Función principal
async function main() {
  try {
    console.log('Intentando iniciar sesión con:', EMAIL);
    
    // Iniciar sesión
    const { data, error } = await supabase.auth.signInWithPassword({
      email: EMAIL,
      password: PASSWORD,
    });
    
    if (error) {
      console.error('Error de autenticación:', error.message);
      return;
    }
    
    console.log('Inicio de sesión exitoso:');
    console.log('- Usuario:', data.user.email);
    console.log('- ID:', data.user.id);
    
    // Intentar obtener el perfil
    console.log('\nObteniendo perfil de usuario...');
    const { data: profileData, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', data.user.id)
      .single();
    
    if (profileError) {
      console.error('Error al obtener perfil:', profileError.message);
      
      // Verificar si el perfil existe
      console.log('\nVerificando si existe algún perfil...');
      const { data: anyProfiles, error: countError } = await supabase
        .from('user_profiles')
        .select('count(*)', { count: 'exact' });
      
      if (countError) {
        console.error('Error al contar perfiles:', countError.message);
      } else {
        console.log('Número total de perfiles:', anyProfiles[0]?.count || 0);
      }
      
      // Verificar si la tabla existe
      console.log('\nVerificando si la tabla user_profiles existe...');
      try {
        const { data: tableInfo, error: tableError } = await supabase
          .rpc('get_table_info', { table_name: 'user_profiles' });
        
        if (tableError) {
          console.error('Error al verificar tabla:', tableError.message);
        } else {
          console.log('Información de la tabla:', tableInfo);
        }
      } catch (e) {
        console.error('Error al llamar a RPC:', e.message);
      }
    } else {
      console.log('Perfil encontrado:');
      console.log('- Nombre:', profileData.firstname, profileData.lastname);
      console.log('- Rol:', profileData.role);
    }
    
  } catch (error) {
    console.error('Error general:', error.message);
  }
}

// Ejecutar la función principal
main();
