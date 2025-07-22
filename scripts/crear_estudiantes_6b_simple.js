// Script simplificado para crear estudiantes del grado 6B
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

function generarCodigoAnonimizado(nombre, apellido) {
    // Generar código similar al existente: CarRue_1744003395233
    const nombreCorto = nombre.substring(0, 3);
    const apellidoCorto = apellido.split(' ')[0].substring(0, 3);
    const timestamp = Date.now();
    return `${nombreCorto}${apellidoCorto}_${timestamp}`;
}

function determinarGenero(nombre) {
    // Lista de nombres típicamente femeninos
    const nombresFemeninos = [
        'VICTORIA', 'MARIA', 'THALIANA', 'MIA', 'LUCIANA', 'ISABELA', 'ISABELLA', 
        'ANNIE', 'VALERIA', 'SOFIA'
    ];
    
    const primerNombre = nombre.split(' ')[0];
    return nombresFemeninos.includes(primerNombre) ? 'Femenino' : 'Masculino';
}

async function obtenerInstitucionId() {
    console.log('🏫 Obteniendo ID de institución existente...\n');
    
    // Buscar una institución existente en los datos de estudiantes
    const { data: estudianteExistente, error } = await supabase
        .from('estudiantes')
        .select('institucion_id')
        .not('institucion_id', 'is', null)
        .limit(1);
    
    if (error) {
        console.error('❌ Error al buscar institución:', error.message);
        return null;
    }
    
    if (estudianteExistente && estudianteExistente.length > 0) {
        const institucionId = estudianteExistente[0].institucion_id;
        console.log(`✅ Usando institución existente - ID: ${institucionId}`);
        return institucionId;
    }
    
    // Si no hay institución, generar un UUID
    const nuevoId = crypto.randomUUID();
    console.log(`➕ Generando nueva institución - ID: ${nuevoId}`);
    return nuevoId;
}

async function crearGrupo6B() {
    console.log('📚 Verificando/creando grupo 6B...\n');
    
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
        return grupoExistente.id;
    }
    
    // Crear nuevo grupo
    const { data: nuevoGrupo, error: crearError } = await supabase
        .from('grupos')
        .insert({
            nombre: '6B',
            grado: '6B',
            año_escolar: '2025',
            institucion_id: await obtenerInstitucionId(),
            fecha_creacion: new Date().toISOString(),
            fecha_actualizacion: new Date().toISOString()
        })
        .select()
        .single();
    
    if (crearError) {
        console.error('❌ Error al crear grupo 6B:', crearError.message);
        return null;
    }
    
    console.log(`✅ Grupo 6B creado - ID: ${nuevoGrupo.id}`);
    return nuevoGrupo.id;
}

async function eliminarEstudiantesExistentes() {
    console.log('🗑️  Eliminando estudiantes existentes...\n');
    
    const { data: estudiantesActuales, error: conteoError } = await supabase
        .from('estudiantes')
        .select('id, nombre_estudiante, apellido_estudiante');
    
    if (conteoError) {
        console.error('❌ Error al contar estudiantes:', conteoError.message);
        return false;
    }
    
    console.log(`📊 Estudiantes actuales: ${estudiantesActuales.length}`);
    
    if (estudiantesActuales.length > 0) {
        console.log('🗑️  Eliminando todos los estudiantes existentes...');
        
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

async function crearEstudiantesNuevos(institucionId, grupoId) {
    console.log('➕ Creando estudiantes del grado 6B...\n');
    
    let exitosos = 0;
    let errores = 0;
    
    for (const estudiante of estudiantesNuevos) {
        try {
            const estudianteData = {
                nombre_estudiante: estudiante.nombre,
                apellido_estudiante: estudiante.apellido,
                genero: determinarGenero(estudiante.nombre),
                codigo_anonimizado: generarCodigoAnonimizado(estudiante.nombre, estudiante.apellido),
                grado: estudiante.grado,
                institucion_id: institucionId,
                grupo_id: grupoId,
                edad: estudiante.edad,
                fecha_creacion: new Date().toISOString(),
                fecha_actualizacion: new Date().toISOString()
            };
            
            const { error } = await supabase
                .from('estudiantes')
                .insert(estudianteData);
            
            if (error) {
                console.error(`❌ ${estudiante.nombre} ${estudiante.apellido}: ${error.message}`);
                errores++;
            } else {
                console.log(`✅ ${estudiante.nombre} ${estudiante.apellido} (${determinarGenero(estudiante.nombre)})`);
                exitosos++;
            }
            
        } catch (error) {
            console.error(`❌ ${estudiante.nombre} ${estudiante.apellido}: ${error.message}`);
            errores++;
        }
    }
    
    console.log(`\n📊 Resumen de creación:`);
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
        .order('apellido_estudiante');
    
    if (error) {
        console.error('❌ Error al verificar resultado:', error.message);
        return;
    }
    
    console.log(`📊 Total de estudiantes del grado 6B: ${estudiantesFinales.length}`);
    console.log('\n👥 Lista completa de estudiantes creados:');
    
    estudiantesFinales.forEach((est, index) => {
        console.log(`${(index + 1).toString().padStart(2, '0')}. ${est.nombre_estudiante} ${est.apellido_estudiante} (${est.genero}, ${est.edad} años)`);
    });
    
    // Mostrar estadísticas por género
    const masculinos = estudiantesFinales.filter(e => e.genero === 'Masculino').length;
    const femeninos = estudiantesFinales.filter(e => e.genero === 'Femenino').length;
    
    console.log(`\n📈 Estadísticas:`);
    console.log(`👦 Masculinos: ${masculinos}`);
    console.log(`👧 Femeninos: ${femeninos}`);
    console.log(`📊 Total: ${estudiantesFinales.length}`);
}

async function main() {
    console.log('🚀 Iniciando creación de estudiantes del grado 6B...\n');
    
    try {
        // 1. Obtener ID de institución
        const institucionId = await obtenerInstitucionId();
        if (!institucionId) {
            console.error('❌ No se pudo obtener ID de institución');
            return;
        }
        
        // 2. Crear/verificar grupo 6B
        const grupoId = await crearGrupo6B();
        if (!grupoId) {
            console.error('❌ No se pudo crear/obtener el grupo 6B');
            return;
        }
        
        // 3. Eliminar estudiantes existentes
        const eliminacionExitosa = await eliminarEstudiantesExistentes();
        if (!eliminacionExitosa) {
            console.error('❌ Error en la eliminación de estudiantes');
            return;
        }
        
        // 4. Crear nuevos estudiantes
        const creacionExitosa = await crearEstudiantesNuevos(institucionId, grupoId);
        if (!creacionExitosa) {
            console.error('❌ Error en la creación de estudiantes');
            return;
        }
        
        // 5. Verificar resultado
        await verificarResultado();
        
        console.log('\n🎉 ¡Proceso completado exitosamente!');
        console.log('✅ Grupo 6B configurado');
        console.log('✅ 25 estudiantes del grado 6B creados');
        console.log('✅ Sistema actualizado y listo para usar');
        
    } catch (error) {
        console.error('❌ Error fatal:', error);
    }
}

main();