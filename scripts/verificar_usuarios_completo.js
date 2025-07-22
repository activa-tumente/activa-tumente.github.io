// Script para verificar usuarios y perfiles creados
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function verificarUsuarios() {
    console.log('🔍 Verificando usuarios y perfiles...\n');
    
    const emailsVerificar = [
        'admin@example.com',
        'psicologo@example.com', 
        'estudiante@example.com',
        'keinelust2008@gmail.com'
    ];
    
    // Verificar usuarios en auth.users
    console.log('👥 Usuarios en auth.users:');
    const { data: users, error: usersError } = await supabase.auth.admin.listUsers();
    
    if (usersError) {
        console.error('❌ Error al obtener usuarios:', usersError.message);
        return;
    }
    
    const usuariosRelevantes = users.users.filter(user => 
        emailsVerificar.includes(user.email)
    );
    
    for (const user of usuariosRelevantes) {
        console.log(`📧 ${user.email}`);
        console.log(`   ID: ${user.id}`);
        console.log(`   Confirmado: ${user.email_confirmed_at ? '✅' : '❌'}`);
        console.log(`   Creado: ${new Date(user.created_at).toLocaleString()}`);
        console.log('');
    }
    
    // Verificar perfiles en user_profiles
    console.log('👤 Perfiles en user_profiles:');
    const { data: profiles, error: profilesError } = await supabase
        .from('user_profiles')
        .select('*')
        .in('email', emailsVerificar);
    
    if (profilesError) {
        console.error('❌ Error al obtener perfiles:', profilesError.message);
        return;
    }
    
    if (profiles.length === 0) {
        console.log('⚠️  No se encontraron perfiles');
        return;
    }
    
    for (const profile of profiles) {
        console.log(`👤 ${profile.email}`);
        console.log(`   Nombre: ${profile.firstname} ${profile.lastname}`);
        console.log(`   Rol: ${profile.role}`);
        console.log(`   Activo: ${profile.active ? '✅' : '❌'}`);
        console.log(`   Permisos: ${profile.permissions ? profile.permissions.length : 0} permisos`);
        console.log('');
    }
    
    // Verificar correspondencia entre usuarios y perfiles
    console.log('🔗 Verificación de correspondencia:');
    for (const user of usuariosRelevantes) {
        const profile = profiles.find(p => p.user_id === user.id || p.email === user.email);
        if (profile) {
            console.log(`✅ ${user.email} - Usuario y perfil vinculados correctamente`);
        } else {
            console.log(`❌ ${user.email} - Usuario sin perfil asociado`);
        }
    }
}

async function probarLogin() {
    console.log('\n🔐 Probando login con credenciales de prueba...\n');
    
    const credenciales = [
        { email: 'admin@example.com', password: 'admin123' },
        { email: 'psicologo@example.com', password: 'psicologo123' },
        { email: 'estudiante@example.com', password: 'estudiante123' }
    ];
    
    for (const cred of credenciales) {
        console.log(`🔑 Probando login: ${cred.email}`);
        
        const { data, error } = await supabase.auth.signInWithPassword({
            email: cred.email,
            password: cred.password
        });
        
        if (error) {
            console.log(`❌ Error: ${error.message}`);
        } else {
            console.log(`✅ Login exitoso - Usuario: ${data.user.email}`);
            
            // Cerrar sesión para la siguiente prueba
            await supabase.auth.signOut();
        }
        console.log('');
    }
}

async function main() {
    await verificarUsuarios();
    await probarLogin();
    console.log('✨ Verificación completada');
}

main().catch(console.error);