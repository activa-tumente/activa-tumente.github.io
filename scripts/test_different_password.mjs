// Script para probar la autenticación con una contraseña diferente
// Ejecutar con: node scripts/test_different_password.mjs

import { createClient } from '@supabase/supabase-js';

// Configuración
const SUPABASE_URL = 'https://eckuozleqbbcecaycmjt.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVja3VvemxlcWJiY2VjYXljbWp0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM3MjAwNjEsImV4cCI6MjA1OTI5NjA2MX0.S6KFjF2HYIArDSGeSu_iMXjgtaHivPPJdwRs60xB9_U';
const EMAIL = 'keinelust2008@gmail.com';

// Lista de contraseñas a probar
const passwords = [
  'Salome2021',
  'salome2021',
  'Salome2021!',
  'admin',
  'Admin',
  'Admin123',
  'admin123',
  'password',
  'Password123',
  'keinelust2008'
];

// Crear cliente de Supabase
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function testPassword(password) {
  try {
    console.log(`Probando contraseña: ${password}`);
    
    // Iniciar sesión
    const { data, error } = await supabase.auth.signInWithPassword({
      email: EMAIL,
      password: password,
    });
    
    if (error) {
      console.log(`❌ Error con contraseña "${password}": ${error.message}`);
      return false;
    }
    
    console.log(`✅ Inicio de sesión exitoso con contraseña: ${password}`);
    console.log('- Usuario:', data.user.email);
    console.log('- ID:', data.user.id);
    
    return true;
  } catch (error) {
    console.log(`❌ Error general con contraseña "${password}": ${error.message}`);
    return false;
  }
}

async function main() {
  console.log(`Probando autenticación para el usuario: ${EMAIL}`);
  console.log('Probando diferentes contraseñas...');
  
  let success = false;
  
  for (const password of passwords) {
    success = await testPassword(password);
    if (success) {
      console.log(`\n¡Contraseña correcta encontrada: ${password}!`);
      break;
    }
    // Pequeña pausa entre intentos para evitar rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  if (!success) {
    console.log('\nNo se pudo iniciar sesión con ninguna de las contraseñas probadas.');
    console.log('Recomendaciones:');
    console.log('1. Verifica que el usuario exista en Supabase');
    console.log('2. Restablece la contraseña desde la interfaz de administración de Supabase');
    console.log('3. Crea un nuevo usuario de prueba');
  }
}

main();
