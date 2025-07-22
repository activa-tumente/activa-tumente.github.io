// Script simple para verificar las variables de entorno
// Ejecutar con: node scripts/simple-env-check.mjs

import { readFileSync } from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

// Obtener el directorio actual
const __dirname = dirname(fileURLToPath(import.meta.url));

// Ruta al archivo .env.local
const envPath = resolve(__dirname, '../.env.local');

console.log('Verificando archivo .env.local en:', envPath);

try {
  // Leer el archivo .env.local
  const content = readFileSync(envPath, 'utf8');
  
  console.log('Contenido del archivo .env.local:');
  console.log('-----------------------------------');
  console.log(content);
  console.log('-----------------------------------');
  
  // Contar líneas no vacías
  const lines = content.split('\n').filter(line => line.trim() !== '');
  console.log(`El archivo tiene ${lines.length} líneas no vacías`);
  
  // Buscar variables específicas
  const hasSupabaseUrl = content.includes('VITE_SUPABASE_URL=');
  const hasSupabaseKey = content.includes('VITE_SUPABASE_ANON_KEY=');
  
  console.log('VITE_SUPABASE_URL encontrada:', hasSupabaseUrl ? 'Sí' : 'No');
  console.log('VITE_SUPABASE_ANON_KEY encontrada:', hasSupabaseKey ? 'Sí' : 'No');
  
  // Extraer valores
  if (hasSupabaseUrl) {
    const urlMatch = content.match(/VITE_SUPABASE_URL=([^\n]+)/);
    if (urlMatch) {
      console.log('Valor de VITE_SUPABASE_URL:', urlMatch[1]);
    }
  }
  
  if (hasSupabaseKey) {
    const keyMatch = content.match(/VITE_SUPABASE_ANON_KEY=([^\n]+)/);
    if (keyMatch) {
      const key = keyMatch[1];
      console.log('Valor de VITE_SUPABASE_ANON_KEY:', key.substring(0, 20) + '...');
    }
  }
  
} catch (error) {
  console.error('Error al leer el archivo .env.local:', error.message);
}

// Verificar si las variables están disponibles en process.env
console.log('\nVerificando variables en process.env:');
console.log('VITE_SUPABASE_URL en process.env:', process.env.VITE_SUPABASE_URL ? 'Sí' : 'No');
console.log('VITE_SUPABASE_ANON_KEY en process.env:', process.env.VITE_SUPABASE_ANON_KEY ? 'Sí' : 'No');
