// Script para verificar la estructura de la base de datos
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function verificarEstructura() {
    console.log('🔍 Verificando estructura de la base de datos...\n');
    
    // Verificar usuarios creados
    console.log('👥 Usuarios en auth.users:');
    const { data: users, error: usersError } = await supabase.auth.admin.listUsers();
    if (usersError) {
        console.error('❌ Error:', usersError.message);
    } else {
        users.users.forEach(user => {
            console.log(`📧 ${user.email} - ID: ${user.id}`);
        });
    }
    
    // Verificar restricciones de rol
    console.log('\n🔒 Verificando restricciones de rol...');
    const { data: constraints, error: constraintsError } = await supabase
        .rpc('get_table_constraints', { table_name: 'user_profiles' })
        .catch(() => null);
    
    // Intentar obtener información de la tabla user_profiles
    console.log('\n📋 Estructura de user_profiles:');
    const { data: profiles, error: profilesError } = await supabase
        .from('user_profiles')
        .select('*')
        .limit(1);
    
    if (profilesError) {
        console.error('❌ Error al acceder a user_profiles:', profilesError.message);
    }
    
    // Verificar qué roles existen actualmente
    console.log('\n🎭 Roles existentes en user_profiles:');
    const { data: existingRoles, error: rolesError } = await supabase
        .from('user_profiles')
        .select('role')
        .not('role', 'is', null);
    
    if (rolesError) {
        console.error('❌ Error al obtener roles:', rolesError.message);
    } else {
        const uniqueRoles = [...new Set(existingRoles.map(r => r.role))];
        console.log('Roles encontrados:', uniqueRoles);
    }
}

verificarEstructura().catch(console.error);