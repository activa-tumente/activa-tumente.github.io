// Script para verificar qué tablas están disponibles en la base de datos
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function verificarTablas() {
    console.log('🔍 Verificando tablas disponibles en la base de datos...\n');
    
    // Lista de tablas que esperamos encontrar
    const tablasEsperadas = [
        'estudiantes',
        'grupos', 
        'instituciones',
        'user_profiles',
        'cuestionarios',
        'preguntas',
        'respuestas'
    ];
    
    const tablasEncontradas = [];
    const tablasNoEncontradas = [];
    
    for (const tabla of tablasEsperadas) {
        try {
            const { data, error } = await supabase
                .from(tabla)
                .select('*')
                .limit(1);
            
            if (error) {
                console.log(`❌ ${tabla}: ${error.message}`);
                tablasNoEncontradas.push(tabla);
            } else {
                console.log(`✅ ${tabla}: Accesible`);
                tablasEncontradas.push(tabla);
            }
        } catch (error) {
            console.log(`❌ ${tabla}: ${error.message}`);
            tablasNoEncontradas.push(tabla);
        }
    }
    
    console.log(`\n📊 Resumen:`);
    console.log(`✅ Tablas encontradas: ${tablasEncontradas.length}`);
    console.log(`❌ Tablas no encontradas: ${tablasNoEncontradas.length}`);
    
    if (tablasNoEncontradas.length > 0) {
        console.log(`\n⚠️  Tablas que necesitan ser creadas:`);
        tablasNoEncontradas.forEach(tabla => {
            console.log(`   - ${tabla}`);
        });
    }
    
    return { tablasEncontradas, tablasNoEncontradas };
}

async function verificarEstructuraEstudiantes() {
    console.log('\n🔍 Verificando estructura de la tabla estudiantes...\n');
    
    try {
        // Intentar obtener un estudiante para ver la estructura
        const { data, error } = await supabase
            .from('estudiantes')
            .select('*')
            .limit(1);
        
        if (error) {
            console.log('❌ No se puede acceder a la tabla estudiantes:', error.message);
            return;
        }
        
        if (data && data.length > 0) {
            console.log('📋 Estructura de la tabla estudiantes (basada en datos existentes):');
            const estudiante = data[0];
            Object.keys(estudiante).forEach(campo => {
                console.log(`   - ${campo}: ${typeof estudiante[campo]} (${estudiante[campo]})`);
            });
        } else {
            console.log('ℹ️  La tabla estudiantes existe pero está vacía');
        }
        
    } catch (error) {
        console.log('❌ Error al verificar estructura:', error.message);
    }
}

async function main() {
    const { tablasEncontradas, tablasNoEncontradas } = await verificarTablas();
    
    if (tablasEncontradas.includes('estudiantes')) {
        await verificarEstructuraEstudiantes();
    }
    
    console.log('\n💡 Recomendaciones:');
    
    if (tablasNoEncontradas.includes('instituciones')) {
        console.log('   - Crear tabla instituciones o usar una tabla alternativa');
    }
    
    if (tablasNoEncontradas.includes('grupos')) {
        console.log('   - Crear tabla grupos o usar una tabla alternativa');
    }
    
    if (tablasEncontradas.includes('estudiantes')) {
        console.log('   - La tabla estudiantes está disponible para agregar datos');
    }
}

main().catch(console.error);