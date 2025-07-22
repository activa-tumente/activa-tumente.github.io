// Script para verificar las variables de entorno
// Ejecutar con: node scripts/check-env.mjs

import { readFileSync } from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

// Obtener el directorio actual
const __dirname = dirname(fileURLToPath(import.meta.url));

// Leer el archivo .env.local manualmente
const envPath = resolve(__dirname, '../.env.local');
let envContent;

try {
  console.log('Intentando leer archivo en:', envPath);
  envContent = readFileSync(envPath, 'utf8');
  console.log('✅ Archivo .env.local encontrado');
  console.log('Contenido del archivo:');
  console.log(envContent);
} catch (error) {
  console.error('❌ Error: No se pudo leer el archivo .env.local');
  console.error('   Error:', error.message);
  console.error('   Asegúrate de que el archivo .env.local existe en la raíz del proyecto');
  console.error('   Puedes crear uno basado en .env.local.example');
  process.exit(1);
}

// Parsear las variables de entorno
const env = {};
console.log('Parseando variables de entorno...');
envContent.split('\n').forEach((line, index) => {
  console.log(`Línea ${index + 1}:`, line);
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    const key = match[1].trim();
    const value = match[2].trim();
    env[key] = value;
    console.log(`  - Variable encontrada: ${key} = ${value.substring(0, 10)}...`);
  } else {
    console.log(`  - No es una variable de entorno válida`);
  }
});

console.log('Variables encontradas:', Object.keys(env));

// Verificar variables de entorno requeridas
const requiredVars = [
  'VITE_SUPABASE_URL',
  'VITE_SUPABASE_ANON_KEY'
];

const missingVars = [];
for (const varName of requiredVars) {
  if (!env[varName]) {
    missingVars.push(varName);
  }
}

if (missingVars.length > 0) {
  console.error('❌ Error: Faltan las siguientes variables de entorno:');
  missingVars.forEach(varName => {
    console.error(`   - ${varName}`);
  });
  console.error('   Asegúrate de definirlas en tu archivo .env.local');
  process.exit(1);
}

// Mostrar información de las variables
console.log('✅ Variables de entorno encontradas:');
console.log(`   - VITE_SUPABASE_URL: ${env.VITE_SUPABASE_URL.substring(0, 20)}...`);
console.log(`   - VITE_SUPABASE_ANON_KEY: ${env.VITE_SUPABASE_ANON_KEY.substring(0, 10)}...`);

// Verificar variable de servicio (opcional para algunos scripts)
if (!env.SUPABASE_SERVICE_ROLE_KEY) {
  console.warn('⚠️ Advertencia: SUPABASE_SERVICE_ROLE_KEY no está definida');
  console.warn('   Esta variable es necesaria para los scripts de administración');
} else {
  console.log(`✅ SUPABASE_SERVICE_ROLE_KEY: ${env.SUPABASE_SERVICE_ROLE_KEY.substring(0, 10)}...`);
}

console.log('\n✅ Verificación de variables de entorno completada con éxito');
