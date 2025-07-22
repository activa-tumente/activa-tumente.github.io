// Script para probar la conexión a Supabase
// Ejecutar con: node scripts/test-connection.mjs

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
const SUPABASE_ANON_KEY = env.VITE_SUPABASE_ANON_KEY;

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
    console.log('Probando conexión a Supabase...');
    
    // Probar una consulta simple
    const { data, error } = await supabase
      .from('user_profiles')
      .select('count(*)')
      .limit(1);
    
    if (error) {
      throw new Error(`Error al conectar con Supabase: ${error.message}`);
    }
    
    console.log('✅ Conexión exitosa a Supabase');
    console.log('Datos recibidos:', data);
    
    // Probar autenticación anónima
    const { data: authData, error: authError } = await supabase.auth.getSession();
    
    if (authError) {
      console.warn(`⚠️ Advertencia en autenticación: ${authError.message}`);
    } else {
      console.log('✅ API de autenticación funcionando correctamente');
      console.log('Sesión actual:', authData.session ? 'Activa' : 'Ninguna');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

main();
