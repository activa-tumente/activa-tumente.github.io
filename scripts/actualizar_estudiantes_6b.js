// Script para actualizar la lista de estudiantes del grado 6B
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Lista de estudiantes del grado 6B
const estudiantesNuevos = [
    { documento: '1097122645', nombre: 'VICTORIA', apellido: 'AGUILAR BECERRA', edad: 11, grado: '6B' },
    { documento: '1221463877', nombre: 'JUAN JOSÉ', apellido: 'ALVAREZ MANTILLA', edad: 12, grado: '6B' },
    { documento: '1097201651', nombre: 'MARIA PAULA', apellido: 'AMAYA MARTINEZ', edad: 11, grado: '6B' },
    { documento: '1099424867', nombre: 'SAMUEL CAMILO', apellido: 'ARIAS PALOMO', edad: 12, grado: '6B' },
    { documento: '1029523359', nombre: 'JUAN MANUEL', apellido: 'AVENDAÑO CANO', edad: 10, grado: '6B' },
    { documento: '1066883422', nombre: 'THALIANA', apellido: 'BALLESTEROS GARCIA', edad: 12, grado: '6B' },
    { documento: '1097121199', nombre: 'JOSE ALIRIO', apellido: 'CALDERON GRIMALDOS', edad: 11, grado: '6B' },
    { documento: '1097200716', nombre: 'DANIEL FELIPE', apellido: 'CARDONA PATERNINA', edad: 11, grado: '6B' },
    { documento: '1097121229', nombre: 'MIA', apellido: 'CARDOZO FABRE', edad: 11, grado: '6B' },
    { documento: '1096073026', nombre: 'MARIA PAULA', apellido: 'CARVAJAL CASTELLANOS', edad: 10, grado: '6B' },
    { documento: '1097789728', nombre: 'HECTOR MANUEL', apellido: 'FORERO MENESES', edad: 12, grado: '6B' },
    { documento: '1205964055', nombre: 'SANTIAGO ELIAS', apellido: 'GONZALEZ LARIOS', edad: 11, grado: '6B' },
    { documento: '1222118267', nombre: 'LUCIANA', apellido: 'GONZALEZ SILVA', edad: 11, grado: '6B' },
    { documento: '1097789761', nombre: 'ISABELA', apellido: 'LEON DIAZ', edad: 12, grado: '6B' },
    { documento: '1028875934', nombre: 'JUAN JOSE', apellido: 'MARTIN ARAQUE', edad: 11, grado: '6B' },
    { documento: '1097123049', nombre: 'ANNIE SOFIA', apellido: 'MENDEZ LOZADA', edad: 11, grado: '6B' },
    { documento: '1097790737', nombre: 'ISABELLA', apellido: 'MORENO MONTOYA', edad: 11, grado: '6B' },
    { documento: '1098077749', nombre: 'DAGO SAMUEL', apellido: 'NIÑO ORTIZ', edad: 11, grado: '6B' },
    { documento: '1030193561', nombre: 'VALERIA', apellido: 'ORTIZ PEREZ', edad: 11, grado: '6B' },
    { documento: '1014885370', nombre: 'RICARDO', apellido: 'PAEZ VALBUENA', edad: 11, grado: '6B' },
    { documento: '1097122694', nombre: 'JUAN GUILLERMO', apellido: 'RESTREPO VARGAS', edad: 11, grado: '6B' },
    { documento: '1097120696', nombre: 'LUIS ALEJANDRO', apellido: 'RODRIGUEZ PINTO', edad: 12, grado: '6B' },
    { documento: '1020229816', nombre: 'FELIX DAVID', apellido: 'SIERRA MIRANDA', edad: 12, grado: '6B' },
    { documento: '1222303739', nombre: 'MARIA FERNANDA', apellido: 'SUÁREZ AVAUNZA', edad: 11, grado: '6B' },
    { documento: '1097120107', nombre: 'JUAN PABLO', apellido: 'VECINO PEREZ', edad: 12, grado: '6B' }
];

async function verificarEstructuraTabla() {
    console.log('🔍 Verificando estructura de la tabla estudiantes...\n');
    
    // Verificar si la tabla estudiantes existe intentando hacer una consulta simple
    try {
        const { data, error } = await supabase
            .from('estudiantes')
            .select('*')
            .limit(1);
        
        if (error) {
            console.error('❌ Error al verificar tabla estudiantes:', error.message);
            return false;
        }
        
        console.log('✅ Tabla estudiantes encontrada y accesible');
        return true;
        
    } catch (error) {
        console.error('❌ Error al verificar tabla estudiantes:', error.message);
        return false;
    }
}

async function verificarGrupos() {
    console.log('\n🏫 Verificando grupos existentes...\n');
    
    const { data: grupos, error: gruposError } = await supabase
        .from('grupos')
        .select('*')
        .eq('nombre', '6B');
    
    if (gruposError) {
        console.error('❌ Error al verificar grupos:', gruposError.message);
        return null;
    }
    
    if (grupos.length === 0) {
        console.log('⚠️  Grupo 6B no encontrado. Necesita ser creado primero.');
        return null;
    }
    
    console.log(`✅ Grupo 6B encontrado - ID: ${grupos[0].id}`);
    return grupos[0];
}

async function eliminarEstudiantesExistentes() {
    console.log('\n🗑️  Eliminando estudiantes existentes...\n');
    
    // Primero verificar cuántos estudiantes hay
    const { data: estudiantesActuales, error: conteoError } = await supabase
        .from('estudiantes')
        .select('id, nombre, apellido, documento')
        .limit(100);
    
    if (conteoError) {
        console.error('❌ Error al contar estudiantes:', conteoError.message);
        return false;
    }
    
    console.log(`📊 Estudiantes actuales encontrados: ${estudiantesActuales.length}`);
    
    if (estudiantesActuales.length > 0) {
        // Mostrar algunos estudiantes que se van a eliminar
        console.log('👥 Algunos estudiantes que serán eliminados:');
        estudiantesActuales.slice(0, 5).forEach(est => {
            console.log(`   - ${est.nombre} ${est.apellido} (${est.documento})`);
        });
        
        if (estudiantesActuales.length > 5) {
            console.log(`   ... y ${estudiantesActuales.length - 5} más`);
        }
        
        // Eliminar todos los estudiantes
        const { error: eliminarError } = await supabase
            .from('estudiantes')
            .delete()
            .neq('id', '00000000-0000-0000-0000-000000000000'); // Eliminar todos
        
        if (eliminarError) {
            console.error('❌ Error al eliminar estudiantes:', eliminarError.message);
            return false;
        }
        
        console.log('✅ Estudiantes existentes eliminados exitosamente');
    } else {
        console.log('ℹ️  No hay estudiantes existentes para eliminar');
    }
    
    return true;
}

async function crearEstudiantesNuevos(grupoId) {
    console.log('\n➕ Creando nuevos estudiantes...\n');
    
    let exitosos = 0;
    let errores = 0;
    
    for (const estudiante of estudiantesNuevos) {
        try {
            const estudianteData = {
                documento: estudiante.documento,
                nombre: estudiante.nombre,
                apellido: estudiante.apellido,
                edad: estudiante.edad,
                grado: estudiante.grado,
                grupo_id: grupoId,
                activo: true,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            };
            
            const { error } = await supabase
                .from('estudiantes')
                .insert(estudianteData);
            
            if (error) {
                console.error(`❌ Error al crear ${estudiante.nombre} ${estudiante.apellido}:`, error.message);
                errores++;
            } else {
                console.log(`✅ ${estudiante.nombre} ${estudiante.apellido} creado exitosamente`);
                exitosos++;
            }
            
        } catch (error) {
            console.error(`❌ Error inesperado con ${estudiante.nombre} ${estudiante.apellido}:`, error.message);
            errores++;
        }
    }
    
    console.log(`\n📊 Resumen de creación:`);
    console.log(`✅ Estudiantes creados exitosamente: ${exitosos}`);
    console.log(`❌ Errores: ${errores}`);
    
    return exitosos > 0;
}

async function verificarResultado() {
    console.log('\n🔍 Verificando resultado final...\n');
    
    const { data: estudiantesFinales, error } = await supabase
        .from('estudiantes')
        .select('*')
        .eq('grado', '6B')
        .order('apellido');
    
    if (error) {
        console.error('❌ Error al verificar resultado:', error.message);
        return;
    }
    
    console.log(`📊 Total de estudiantes del grado 6B: ${estudiantesFinales.length}`);
    console.log('\n👥 Lista de estudiantes creados:');
    
    estudiantesFinales.forEach((est, index) => {
        console.log(`${(index + 1).toString().padStart(2, '0')}. ${est.nombre} ${est.apellido} - ${est.documento} (${est.edad} años)`);
    });
}

async function main() {
    console.log('🚀 Iniciando actualización de estudiantes del grado 6B...\n');
    
    // 1. Verificar estructura de la tabla
    const tablaExiste = await verificarEstructuraTabla();
    if (!tablaExiste) {
        console.error('❌ No se encontró la tabla de estudiantes');
        return;
    }
    
    // 2. Verificar que existe el grupo 6B
    const grupo6B = await verificarGrupos();
    if (!grupo6B) {
        console.error('❌ No se puede continuar sin el grupo 6B');
        return;
    }
    
    // 3. Eliminar estudiantes existentes
    const eliminacionExitosa = await eliminarEstudiantesExistentes();
    if (!eliminacionExitosa) {
        console.error('❌ Error en la eliminación de estudiantes');
        return;
    }
    
    // 4. Crear nuevos estudiantes
    const creacionExitosa = await crearEstudiantesNuevos(grupo6B.id);
    if (!creacionExitosa) {
        console.error('❌ Error en la creación de estudiantes');
        return;
    }
    
    // 5. Verificar resultado
    await verificarResultado();
    
    console.log('\n✨ Actualización de estudiantes completada exitosamente!');
}

main().catch(error => {
    console.error('❌ Error fatal:', error);
    process.exit(1);
});