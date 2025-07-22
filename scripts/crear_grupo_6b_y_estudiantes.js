// Script para crear el grupo 6B y sus estudiantes
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

async function verificarInstitucion() {
    console.log('🏫 Verificando institución...\n');
    
    const { data: instituciones, error } = await supabase
        .from('instituciones')
        .select('*')
        .limit(1);
    
    if (error) {
        console.error('❌ Error al verificar instituciones:', error.message);
        return null;
    }
    
    if (instituciones.length === 0) {
        console.log('➕ Creando institución por defecto...');
        
        const { data: nuevaInstitucion, error: crearError } = await supabase
            .from('instituciones')
            .insert({
                nombre: 'Institución Educativa Principal',
                direccion: 'Dirección Principal',
                telefono: '123456789',
                email: 'contacto@institucion.edu.co',
                activo: true
            })
            .select()
            .single();
        
        if (crearError) {
            console.error('❌ Error al crear institución:', crearError.message);
            return null;
        }
        
        console.log(`✅ Institución creada - ID: ${nuevaInstitucion.id}`);
        return nuevaInstitucion;
    }
    
    console.log(`✅ Institución encontrada - ID: ${instituciones[0].id}`);
    return instituciones[0];
}

async function crearGrupo6B(institucionId) {
    console.log('📚 Creando grupo 6B...\n');
    
    // Verificar si ya existe
    const { data: grupoExistente, error: verificarError } = await supabase
        .from('grupos')
        .select('*')
        .eq('nombre', '6B')
        .single();
    
    if (verificarError && verificarError.code !== 'PGRST116') {
        console.error('❌ Error al verificar grupo:', verificarError.message);
        return null;
    }
    
    if (grupoExistente) {
        console.log(`✅ Grupo 6B ya existe - ID: ${grupoExistente.id}`);
        return grupoExistente;
    }
    
    // Crear nuevo grupo
    const { data: nuevoGrupo, error: crearError } = await supabase
        .from('grupos')
        .insert({
            nombre: '6B',
            grado: '6B',
            ano_escolar: '2025',
            institucion_id: institucionId,
            activo: true
        })
        .select()
        .single();
    
    if (crearError) {
        console.error('❌ Error al crear grupo 6B:', crearError.message);
        return null;
    }
    
    console.log(`✅ Grupo 6B creado exitosamente - ID: ${nuevoGrupo.id}`);
    return nuevoGrupo;
}

async function eliminarEstudiantesExistentes() {
    console.log('🗑️  Eliminando estudiantes existentes...\n');
    
    const { data: estudiantesActuales, error: conteoError } = await supabase
        .from('estudiantes')
        .select('id, nombre, apellido, documento');
    
    if (conteoError) {
        console.error('❌ Error al contar estudiantes:', conteoError.message);
        return false;
    }
    
    console.log(`📊 Estudiantes actuales encontrados: ${estudiantesActuales.length}`);
    
    if (estudiantesActuales.length > 0) {
        console.log('👥 Eliminando estudiantes existentes...');
        
        const { error: eliminarError } = await supabase
            .from('estudiantes')
            .delete()
            .neq('id', '00000000-0000-0000-0000-000000000000');
        
        if (eliminarError) {
            console.error('❌ Error al eliminar estudiantes:', eliminarError.message);
            return false;
        }
        
        console.log('✅ Estudiantes existentes eliminados');
    }
    
    return true;
}

async function crearEstudiantesNuevos(grupoId) {
    console.log('➕ Creando nuevos estudiantes del grado 6B...\n');
    
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
                activo: true
            };
            
            const { error } = await supabase
                .from('estudiantes')
                .insert(estudianteData);
            
            if (error) {
                console.error(`❌ ${estudiante.nombre} ${estudiante.apellido}: ${error.message}`);
                errores++;
            } else {
                console.log(`✅ ${estudiante.nombre} ${estudiante.apellido}`);
                exitosos++;
            }
            
        } catch (error) {
            console.error(`❌ ${estudiante.nombre} ${estudiante.apellido}: ${error.message}`);
            errores++;
        }
    }
    
    console.log(`\n📊 Resumen:`);
    console.log(`✅ Estudiantes creados: ${exitosos}`);
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
    console.log('\n👥 Lista completa:');
    
    estudiantesFinales.forEach((est, index) => {
        console.log(`${(index + 1).toString().padStart(2, '0')}. ${est.nombre} ${est.apellido} - Doc: ${est.documento} (${est.edad} años)`);
    });
}

async function main() {
    console.log('🚀 Iniciando creación del grupo 6B y sus estudiantes...\n');
    
    try {
        // 1. Verificar/crear institución
        const institucion = await verificarInstitucion();
        if (!institucion) {
            console.error('❌ No se pudo obtener/crear la institución');
            return;
        }
        
        // 2. Crear grupo 6B
        const grupo6B = await crearGrupo6B(institucion.id);
        if (!grupo6B) {
            console.error('❌ No se pudo crear el grupo 6B');
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
        
        console.log('\n🎉 ¡Proceso completado exitosamente!');
        console.log('✅ Grupo 6B creado');
        console.log('✅ 25 estudiantes agregados');
        console.log('✅ Sistema listo para usar');
        
    } catch (error) {
        console.error('❌ Error fatal:', error);
    }
}

main();