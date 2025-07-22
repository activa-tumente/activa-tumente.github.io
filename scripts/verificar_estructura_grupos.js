// Script para verificar la estructura de la tabla grupos
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function verificarEstructuraGrupos() {
    console.log('🔍 Verificando estructura de la tabla grupos...\n');
    
    try {
        // Intentar obtener un grupo para ver la estructura
        const { data, error } = await supabase
            .from('grupos')
            .select('*')
            .limit(1);
        
        if (error) {
            console.log('❌ Error al acceder a la tabla grupos:', error.message);
            return;
        }
        
        if (data && data.length > 0) {
            console.log('📋 Estructura de la tabla grupos (basada en datos existentes):');
            const grupo = data[0];
            Object.keys(grupo).forEach(campo => {
                const valor = grupo[campo];
                const tipo = typeof valor;
                console.log(`   - ${campo}: ${tipo} (${valor})`);
            });
        } else {
            console.log('ℹ️  La tabla grupos existe pero está vacía');
            
            // Intentar insertar un grupo de prueba para ver qué campos son requeridos
            console.log('\n🧪 Probando inserción de grupo de prueba...');
            
            const { data: insertData, error: insertError } = await supabase
                .from('grupos')
                .insert({
                    nombre: 'TEST_GRUPO',
                    grado: 'TEST'
                })
                .select();
            
            if (insertError) {
                console.log('❌ Error en inserción de prueba:', insertError.message);
                console.log('💡 Esto nos ayuda a entender qué campos son requeridos');
            } else {
                console.log('✅ Grupo de prueba creado exitosamente');
                console.log('📋 Estructura detectada:');
                if (insertData && insertData.length > 0) {
                    Object.keys(insertData[0]).forEach(campo => {
                        console.log(`   - ${campo}: ${typeof insertData[0][campo]}`);
                    });
                }
                
                // Eliminar el grupo de prueba
                await supabase
                    .from('grupos')
                    .delete()
                    .eq('nombre', 'TEST_GRUPO');
                console.log('🗑️  Grupo de prueba eliminado');
            }
        }
        
    } catch (error) {
        console.log('❌ Error inesperado:', error.message);
    }
}

async function main() {
    await verificarEstructuraGrupos();
}

main().catch(console.error);