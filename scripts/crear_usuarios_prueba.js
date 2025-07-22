// Script para crear usuarios de prueba usando la API de Supabase
// Ejecutar con: node scripts/crear_usuarios_prueba.js

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Error: Variables de entorno no encontradas');
    console.error('Asegúrate de que VITE_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY estén configuradas en .env.local');
    process.exit(1);
}

// Crear cliente de Supabase con service role key
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

// Usuarios de prueba a crear
const usuariosPrueba = [
    {
        email: 'admin@example.com',
        password: 'admin123',
        firstname: 'Admin',
        lastname: 'Sistema',
        role: 'admin',
        permissions: [
            'admin:view', 'admin:edit', 'admin:create', 'admin:delete',
            'users:view', 'users:edit', 'users:create', 'users:delete',
            'students:view', 'students:edit', 'students:create', 'students:delete',
            'questionnaires:view', 'questionnaires:edit', 'questionnaires:create', 'questionnaires:delete',
            'reports:view', 'reports:generate',
            'dashboard:view'
        ]
    },
    {
        email: 'psicologo@example.com',
        password: 'psicologo123',
        firstname: 'Psicólogo',
        lastname: 'Escolar',
        role: 'teacher',
        permissions: [
            'students:view', 'students:edit',
            'questionnaires:view', 'questionnaires:create',
            'reports:view', 'reports:generate',
            'dashboard:view'
        ]
    },
    {
        email: 'estudiante@example.com',
        password: 'estudiante123',
        firstname: 'Estudiante',
        lastname: 'Prueba',
        role: 'student',
        permissions: [
            'questionnaires:view', 'questionnaires:respond'
        ]
    }
];

async function verificarUsuarioExiste(email) {
    try {
        const { data, error } = await supabase.auth.admin.listUsers();
        if (error) {
            console.error(`❌ Error al verificar usuario ${email}:`, error.message);
            return false;
        }
        
        const usuario = data.users.find(u => u.email === email);
        return usuario ? usuario : false;
    } catch (error) {
        console.error(`❌ Error al verificar usuario ${email}:`, error.message);
        return false;
    }
}

async function crearUsuario(usuarioData) {
    const { email, password, firstname, lastname, role, permissions } = usuarioData;
    
    console.log(`\n🔄 Procesando usuario: ${email}`);
    
    try {
        // Verificar si el usuario ya existe
        const usuarioExistente = await verificarUsuarioExiste(email);
        
        let userId;
        
        if (usuarioExistente) {
            console.log(`ℹ️  Usuario ${email} ya existe, actualizando...`);
            userId = usuarioExistente.id;
            
            // Actualizar contraseña
            const { error: updateError } = await supabase.auth.admin.updateUserById(
                userId,
                { password: password }
            );
            
            if (updateError) {
                console.error(`❌ Error al actualizar contraseña para ${email}:`, updateError.message);
                return false;
            }
        } else {
            console.log(`➕ Creando nuevo usuario: ${email}`);
            
            // Crear nuevo usuario
            const { data, error } = await supabase.auth.admin.createUser({
                email: email,
                password: password,
                email_confirm: true,
                user_metadata: {
                    firstname: firstname,
                    lastname: lastname,
                    role: role
                }
            });
            
            if (error) {
                console.error(`❌ Error al crear usuario ${email}:`, error.message);
                return false;
            }
            
            userId = data.user.id;
            console.log(`✅ Usuario ${email} creado exitosamente`);
        }
        
        // Verificar si el perfil existe
        const { data: perfilExistente, error: perfilError } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('user_id', userId)
            .single();
        
        if (perfilError && perfilError.code !== 'PGRST116') {
            console.error(`❌ Error al verificar perfil para ${email}:`, perfilError.message);
        }
        
        const perfilData = {
            user_id: userId,
            email: email,
            firstname: firstname,
            lastname: lastname,
            role: role,
            permissions: permissions,
            active: true
        };
        
        if (perfilExistente) {
            // Actualizar perfil existente
            const { error: updatePerfilError } = await supabase
                .from('user_profiles')
                .update(perfilData)
                .eq('user_id', userId);
            
            if (updatePerfilError) {
                console.error(`❌ Error al actualizar perfil para ${email}:`, updatePerfilError.message);
                return false;
            }
            
            console.log(`✅ Perfil actualizado para ${email}`);
        } else {
            // Crear nuevo perfil
            perfilData.id = userId;
            
            const { error: insertPerfilError } = await supabase
                .from('user_profiles')
                .insert(perfilData);
            
            if (insertPerfilError) {
                console.error(`❌ Error al crear perfil para ${email}:`, insertPerfilError.message);
                return false;
            }
            
            console.log(`✅ Perfil creado para ${email}`);
        }
        
        return true;
        
    } catch (error) {
        console.error(`❌ Error inesperado al procesar ${email}:`, error.message);
        return false;
    }
}

async function main() {
    console.log('🚀 Iniciando creación de usuarios de prueba...\n');
    
    let exitosos = 0;
    let fallidos = 0;
    
    for (const usuario of usuariosPrueba) {
        const resultado = await crearUsuario(usuario);
        if (resultado) {
            exitosos++;
        } else {
            fallidos++;
        }
    }
    
    console.log('\n📊 Resumen:');
    console.log(`✅ Usuarios procesados exitosamente: ${exitosos}`);
    console.log(`❌ Usuarios con errores: ${fallidos}`);
    
    if (exitosos > 0) {
        console.log('\n🎉 Credenciales de acceso:');
        usuariosPrueba.forEach(usuario => {
            console.log(`📧 ${usuario.email} / 🔑 ${usuario.password} (${usuario.role})`);
        });
    }
    
    console.log('\n✨ Proceso completado');
}

// Ejecutar el script
main().catch(error => {
    console.error('❌ Error fatal:', error);
    process.exit(1);
});