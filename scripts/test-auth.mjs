// Script para probar la autenticación con Supabase
// Ejecutar con: node scripts/test-auth.mjs

import { createClient } from '@supabase/supabase-js';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Obtener el directorio actual
const __dirname = dirname(fileURLToPath(import.meta.url));

// Cargar variables de entorno desde .env.local
dotenv.config({ path: resolve(__dirname, '../.env.local') });

// Configuración
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;
const EMAIL = 'keinelust2008@gmail.com';
const PASSWORD = 'Salome2021'; // Cambia esto a la contraseña que deseas probar

// Verificar que las variables de entorno estén definidas
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('Error: Variables de entorno de Supabase no definidas');
  process.exit(1);
}

console.log('Usando URL de Supabase:', SUPABASE_URL);

// Crear cliente de Supabase
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function main() {
  try {
    console.log('Intentando iniciar sesión...');
    
    // Iniciar sesión
    const { data, error } = await supabase.auth.signInWithPassword({
      email: EMAIL,
      password: PASSWORD,
    });
    
    if (error) {
      throw new Error(`Error de autenticación: ${error.message}`);
    }
    
    console.log('Inicio de sesión exitoso:');
    console.log('- Usuario:', data.user.email);
    console.log('- ID:', data.user.id);
    console.log('- Creado:', new Date(data.user.created_at).toLocaleString());
    
    // Obtener perfil
    const { data: profileData, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', data.user.id)
      .single();
    
    if (profileError) {
      console.warn(`Advertencia: No se pudo obtener el perfil: ${profileError.message}`);
    } else {
      console.log('\nPerfil de usuario:');
      console.log('- Nombre:', profileData.firstname, profileData.lastname);
      console.log('- Rol:', profileData.role);
      console.log('- Permisos:', profileData.permissions ? profileData.permissions.length : 0, 'permisos');
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

main();
