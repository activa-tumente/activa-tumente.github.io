// Script para probar la autenticación directamente con Supabase
// Ejecutar con: node scripts/test_auth_directly.mjs

import { createClient } from '@supabase/supabase-js';

// Configuración
const SUPABASE_URL = 'https://eckuozleqbbcecaycmjt.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVja3VvemxlcWJiY2VjYXljbWp0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM3MjAwNjEsImV4cCI6MjA1OTI5NjA2MX0.S6KFjF2HYIArDSGeSu_iMXjgtaHivPPJdwRs60xB9_U';
const EMAIL = 'keinelust2008@gmail.com';
const PASSWORD = 'Salome2021';

// Crear cliente de Supabase
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

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
    console.log('- Creado:', new Date(data.user.created_at).toLocaleString());
    
    // Obtener perfil
    const { data: profileData, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', data.user.id)
      .single();
    
    if (profileError) {
      console.error('Error al obtener perfil:', profileError.message);
    } else {
      console.log('\nPerfil de usuario:');
      console.log('- Nombre:', profileData.firstname, profileData.lastname);
      console.log('- Rol:', profileData.role);
    }
    
  } catch (error) {
    console.error('Error general:', error.message);
  }
}

main();
