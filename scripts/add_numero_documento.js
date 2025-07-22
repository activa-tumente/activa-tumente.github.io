// Script para añadir la columna numero_documento a la tabla estudiantes
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function addNumeroDocumentoColumn() {
    console.log('🔧 Agregando columna numero_documento a la tabla estudiantes...\n');
    
    try {
        // Verificar si la columna ya existe
        const { data: columns, error: columnsError } = await supabase
            .rpc('get_table_columns', { table_name: 'estudiantes' })
            .catch(() => null);
        
        // Ejecutar el SQL para agregar la columna
        const { data, error } = await supabase.rpc('exec_sql', {
            sql: `
                -- Verificar y añadir la columna numero_documento
                DO $
                DECLARE
                    column_exists BOOLEAN;
                BEGIN
                    SELECT EXISTS (
                        SELECT 1
                        FROM information_schema.columns
                        WHERE table_name = 'estudiantes'
                        AND column_name = 'numero_documento'
                    ) INTO column_exists;
                    
                    IF column_exists THEN
                        RAISE NOTICE 'La columna numero_documento ya existe en la tabla estudiantes';
                    ELSE
                        -- Añadir la columna numero_documento a la tabla estudiantes
                        ALTER TABLE estudiantes
                        ADD COLUMN numero_documento VARCHAR(50);
                        
                        RAISE NOTICE 'Se ha añadido la columna numero_documento a la tabla estudiantes';
                    END IF;
                END $;
                
                -- Actualizar los registros existentes con el codigo_anonimizado como numero_documento temporal
                UPDATE estudiantes 
                SET numero_documento = codigo_anonimizado 
                WHERE numero_documento IS NULL;
                
                -- Hacer la columna NOT NULL después de actualizar los datos
                ALTER TABLE estudiantes 
                ALTER COLUMN numero_documento SET NOT NULL;
            `
        });
        
        if (error) {
            console.error('❌ Error al ejecutar SQL:', error.message);
            
            // Intentar método alternativo usando SQL directo
            console.log('🔄 Intentando método alternativo...');
            
            // Verificar si la columna existe
            const { data: checkColumn, error: checkError } = await supabase
                .from('information_schema.columns')
                .select('column_name')
                .eq('table_name', 'estudiantes')
                .eq('column_name', 'numero_documento');
            
            if (checkError) {
                console.log('⚠️ No se pudo verificar la existencia de la columna, procediendo...');
            } else if (checkColumn && checkColumn.length > 0) {
                console.log('✅ La columna numero_documento ya existe');
                return;
            }
            
            // Intentar agregar la columna usando ALTER TABLE directo
            console.log('🔧 Agregando columna numero_documento...');
            
            // Como no podemos ejecutar DDL directamente, vamos a actualizar los datos existentes
            console.log('📝 Actualizando datos existentes...');
            
            // Obtener todos los estudiantes
            const { data: estudiantes, error: estudiantesError } = await supabase
                .from('estudiantes')
                .select('*');
            
            if (estudiantesError) {
                console.error('❌ Error al obtener estudiantes:', estudiantesError.message);
                return;
            }
            
            console.log(`📊 Encontrados ${estudiantes.length} estudiantes`);
            
            // Generar números de documento basados en el código anonimizado
            for (const estudiante of estudiantes) {
                // Generar un número de documento único basado en el código anonimizado
                const numeroDocumento = estudiante.codigo_anonimizado.replace(/[^0-9]/g, '') || 
                                      Math.floor(Math.random() * 1000000000).toString();
                
                console.log(`📝 Estudiante: ${estudiante.nombre_estudiante || 'N/A'} ${estudiante.apellido_estudiante || 'N/A'} - Doc: ${numeroDocumento}`);
            }
            
            console.log('✅ Proceso completado. Nota: La columna numero_documento debe agregarse manualmente en Supabase Dashboard');
            console.log('💡 SQL para ejecutar en Supabase:');
            console.log('   ALTER TABLE estudiantes ADD COLUMN numero_documento VARCHAR(50);');
            console.log('   UPDATE estudiantes SET numero_documento = codigo_anonimizado WHERE numero_documento IS NULL;');
            console.log('   ALTER TABLE estudiantes ALTER COLUMN numero_documento SET NOT NULL;');
            
        } else {
            console.log('✅ Columna numero_documento agregada exitosamente');
        }
        
    } catch (error) {
        console.error('❌ Error inesperado:', error);
    }
}

async function verificarEstructura() {
    console.log('\n🔍 Verificando estructura actual de la tabla estudiantes...\n');
    
    try {
        // Obtener un estudiante de muestra para ver la estructura
        const { data: muestra, error } = await supabase
            .from('estudiantes')
            .select('*')
            .limit(1);
        
        if (error) {
            console.error('❌ Error al obtener muestra:', error.message);
            return;
        }
        
        if (muestra && muestra.length > 0) {
            console.log('📋 Estructura actual de estudiantes:');
            console.log('Columnas disponibles:', Object.keys(muestra[0]));
            console.log('\n📝 Ejemplo de registro:');
            console.log(JSON.stringify(muestra[0], null, 2));
        } else {
            console.log('⚠️ No hay estudiantes en la base de datos');
        }
        
    } catch (error) {
        console.error('❌ Error al verificar estructura:', error);
    }
}

async function main() {
    console.log('🚀 Iniciando proceso de actualización de base de datos...\n');
    
    await verificarEstructura();
    await addNumeroDocumentoColumn();
    
    console.log('\n🎉 Proceso completado');
}

main().catch(console.error);