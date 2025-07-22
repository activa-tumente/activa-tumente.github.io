// Script para crear un nuevo usuario de prueba
// Ejecutar con: node scripts/create_test_user.mjs

import { createClient } from '@supabase/supabase-js';

// Configuración
const SUPABASE_URL = 'https://eckuozleqbbcecaycmjt.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVja3VvemxlcWJiY2VjYXljbWp0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM3MjAwNjEsImV4cCI6MjA1OTI5NjA2MX0.S6KFjF2HYIArDSGeSu_iMXjgtaHivPPJdwRs60xB9_U';
const EMAIL = 'test@example.com';
const PASSWORD = 'test123';

// Crear cliente de Supabase
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function main() {
  try {
    console.log(`Intentando crear usuario de prueba: ${EMAIL}`);
    
    // Verificar si el usuario ya existe
    const { data: existingUser, error: checkError } = await supabase.auth.signInWithPassword({
      email: EMAIL,
      password: PASSWORD,
    });
    
    if (!checkError && existingUser) {
      console.log('El usuario ya existe y las credenciales son válidas.');
      console.log('- ID:', existingUser.user.id);
      
      // Verificar si el perfil existe
      const { data: profileData, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', existingUser.user.id)
        .single();
      
      if (profileError) {
        if (profileError.message.includes('No rows found')) {
          console.log('El perfil no existe, creándolo...');
          
          // Crear perfil
          const { data: newProfile, error: insertError } = await supabase
            .from('user_profiles')
            .insert({
              id: existingUser.user.id,
              user_id: existingUser.user.id,
              email: EMAIL,
              firstname: 'Usuario',
              lastname: 'Prueba',
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
        } else {
          console.error('Error al verificar perfil:', profileError.message);
        }
      } else {
        console.log('El perfil ya existe:', profileData);
      }
      
      return;
    }
    
    // Crear nuevo usuario
    const { data, error } = await supabase.auth.signUp({
      email: EMAIL,
      password: PASSWORD,
    });
    
    if (error) {
      console.error('Error al crear usuario:', error.message);
      return;
    }
    
    console.log('Usuario creado correctamente:');
    console.log('- Email:', EMAIL);
    console.log('- ID:', data.user.id);
    
    // Crear perfil para el usuario
    const { data: profileData, error: profileError } = await supabase
      .from('user_profiles')
      .insert({
        id: data.user.id,
        user_id: data.user.id,
        email: EMAIL,
        firstname: 'Usuario',
        lastname: 'Prueba',
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
    
    if (profileError) {
      console.error('Error al crear perfil:', profileError.message);
    } else {
      console.log('Perfil creado correctamente:', profileData);
    }
    
    console.log('\nPuedes iniciar sesión con:');
    console.log('- Email:', EMAIL);
    console.log('- Contraseña:', PASSWORD);
    
  } catch (error) {
    console.error('Error general:', error.message);
  }
}

main();
