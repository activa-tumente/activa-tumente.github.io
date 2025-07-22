// Script para crear estudiantes de los grados 8A y 8B de La Salle
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Lista de estudiantes del grado 8A
const estudiantes8A = [
    { documento: '1097113083', nombre: 'THANYA SOPHIE', apellido: 'ACEVEDO GRANADOS', edad: 13, grado: '8A' },
    { documento: '1097197548', nombre: 'MARIA ALEJANDRA', apellido: 'AMAYA MARTINEZ', edad: 13, grado: '8A' },
    { documento: '1124825116', nombre: 'LAUREN SOFIA', apellido: 'ANZOLA GONZALEZ', edad: 13, grado: '8A' },
    { documento: '1097787744', nombre: 'ANDRÉS GUSTAVO', apellido: 'BUSTAMANTE SEPULVEDA', edad: 14, grado: '8A' },
    { documento: '1097505483', nombre: 'MANUELA', apellido: 'CARO BARRERA', edad: 13, grado: '8A' },
    { documento: '1046708952', nombre: 'JUAN ANGEL', apellido: 'CARRASCAL DAZA', edad: 14, grado: '8A' },
    { documento: '1011213038', nombre: 'DANNA', apellido: 'CARVAJAL URIBE', edad: 13, grado: '8A' },
    { documento: '1014879888', nombre: 'JUAN JOSE', apellido: 'CASTAÑEDA PORRAS', edad: 13, grado: '8A' },
    { documento: '1099744366', nombre: 'SOFIA', apellido: 'CASTELLANOS WILCHES', edad: 14, grado: '8A' },
    { documento: '1097504256', nombre: 'MARIA ISABELLA', apellido: 'DAVILA LOPEZ', edad: 14, grado: '8A' },
    { documento: '1097787545', nombre: 'FABIAN EDUARDO', apellido: 'DIAZ BALCARCEL', edad: 14, grado: '8A' },
    { documento: '1097504567', nombre: 'LISETH GABRIELA', apellido: 'DIAZ NIÑO', edad: 13, grado: '8A' },
    { documento: '1098075012', nombre: 'ABIGAIL', apellido: 'GARCIA ALVAREZ', edad: 15, grado: '8A' },
    { documento: '1096703562', nombre: 'JAVIER ALEJANDRO', apellido: 'GOMEZ GONZALEZ', edad: 13, grado: '8A' },
    { documento: '1097505963', nombre: 'ALEJANDRO', apellido: 'GOMEZ TORRES', edad: 12, grado: '8A' },
    { documento: '1101624282', nombre: 'SALOME', apellido: 'HERNANDEZ VARGAS', edad: 13, grado: '8A' },
    { documento: '1022382221', nombre: 'JOSHUA JAVIER', apellido: 'MAYORGA SOPÓ', edad: 14, grado: '8A' },
    { documento: '1097503495', nombre: 'SANTIAGO IMAD', apellido: 'NAJM SASSINE', edad: 14, grado: '8A' },
    { documento: '1011105873', nombre: 'DANA', apellido: 'NAVARRETE LAGOS', edad: 13, grado: '8A' },
    { documento: '1030181390', nombre: 'TOMÁS ALEJANDRO', apellido: 'NOVA BECERRA', edad: 14, grado: '8A' },
    { documento: '1082966320', nombre: 'JUAN PABLO', apellido: 'PARADA ROMERO', edad: 14, grado: '8A' },
    { documento: '1098075935', nombre: 'MARIA JOSE', apellido: 'RIOS CACERES', edad: 14, grado: '8A' },
    { documento: '1098075606', nombre: 'JULIANA DE DIOS', apellido: 'RODRIGUEZ REYES', edad: 14, grado: '8A' },
    { documento: '1097114913', nombre: 'ISABELLA', apellido: 'ROMAN SERRANO', edad: 13, grado: '8A' },
    { documento: '1097504236', nombre: 'JUAN JOSE', apellido: 'SANCHEZ MURILLO', edad: 14, grado: '8A' },
    { documento: '1097112005', nombre: 'LAURA JOHANA', apellido: 'SANDOVAL SEPULVEDA', edad: 14, grado: '8A' },
    { documento: '1042860515', nombre: 'SUSANA ISABEL', apellido: 'SOTO TOVAR', edad: 14, grado: '8A' },
    { documento: '1142719203', nombre: 'LUKAS MATEO', apellido: 'URIBE HIGUITA', edad: 13, grado: '8A' },
    { documento: '1142718531', nombre: 'DANNA GABRIELA', apellido: 'VARGAS JAIMES', edad: 14, grado: '8A' },
    { documento: '1097505378', nombre: 'KEVIN SPENCER', apellido: 'VEGA ALDANA', edad: 13, grado: '8A' }
];

// Lista de estudiantes del grado 8B
const estudiantes8B = [
    { documento: '1188214165', nombre: 'DANIEL ESTEBAN', apellido: 'AREVALO BRAVO', edad: 14, grado: '8B' },
    { documento: '1097109535', nombre: 'THOMAS JOSE', apellido: 'BLANCO SAAVEDRA', edad: 14, grado: '8B' },
    { documento: '1096071330', nombre: 'SAUL ANDRES', apellido: 'BOBADILLA SANCHEZ', edad: 13, grado: '8B' },
    { documento: '1010843531', nombre: 'MATILDE ISABEL', apellido: 'BOHÓRQUEZ FORERO', edad: 13, grado: '8B' },
    { documento: '1095313087', nombre: 'SAMUEL ARTURO', apellido: 'CASTRO MARTINEZ', edad: 13, grado: '8B' },
    { documento: '1098750506', nombre: 'MARIA JOSE', apellido: 'DUARTE MORALES', edad: 13, grado: '8B' },
    { documento: '1097109128', nombre: 'SANTIAGO', apellido: 'ESPITIA GALVÁN', edad: 14, grado: '8B' },
    { documento: '1097787577', nombre: 'MARY', apellido: 'FORERO MENESES', edad: 14, grado: '8B' },
    { documento: '1097914859', nombre: 'JUAN JOSE', apellido: 'GOMEZ VEGA', edad: 14, grado: '8B' },
    { documento: '1101692231', nombre: 'ANDRES FELIPE', apellido: 'GONZALEZ ARGUELLO', edad: 13, grado: '8B' },
    { documento: '1027285487', nombre: 'MARIANA', apellido: 'LADINO GIRALDO', edad: 14, grado: '8B' },
    { documento: '1142719351', nombre: 'JOSEPH EMMANUEL', apellido: 'MANTILLA MENDEZ', edad: 13, grado: '8B' },
    { documento: '1097505777', nombre: 'STEBAN', apellido: 'MEJIA CORREDOR', edad: 12, grado: '8B' },
    { documento: '1097113800', nombre: 'DIEGO ALEJANDRO', apellido: 'ORTIZ LANDAZURI', edad: 13, grado: '8B' },
    { documento: '1097788675', nombre: 'ANDRES SEBASTIAN', apellido: 'PARDO ARAQUE', edad: 13, grado: '8B' },
    { documento: '1097114337', nombre: 'JOSE ALEJANDRO', apellido: 'PATIÑO CARDENAS', edad: 13, grado: '8B' },
    { documento: '1096070055', nombre: 'FELIPE', apellido: 'PEDRAZA ZAPATA', edad: 14, grado: '8B' },
    { documento: '1097788294', nombre: 'KIARA ALEJANDRA', apellido: 'PINEDA SANTOS', edad: 13, grado: '8B' },
    { documento: '1097504065', nombre: 'JUAN FELIPE', apellido: 'RANGEL RUEDA', edad: 14, grado: '8B' },
    { documento: '1100962480', nombre: 'MARIA SALOME', apellido: 'REYES ARDILA', edad: 14, grado: '8B' },
    { documento: '1097787185', nombre: 'SAMUEL FELIPE', apellido: 'RUEDA LOZANO', edad: 14, grado: '8B' },
    { documento: '1097503979', nombre: 'JUAN ANDRES', apellido: 'SALAZAR GONZALEZ', edad: 14, grado: '8B' },
    { documento: '1097788874', nombre: 'DAVID ALEJANDRO', apellido: 'SARMIENTO LEON', edad: 13, grado: '8B' },
    { documento: '1097503609', nombre: 'MARIA JOSE', apellido: 'SERRANO FLOREZ', edad: 14, grado: '8B' },
    { documento: '1097505011', nombre: 'RAFAEL SANTIAGO', apellido: 'VALERO RIVEROS', edad: 13, grado: '8B' },
    { documento: '1097787234', nombre: 'SERGIO AUGUSTO', apellido: 'VARGAS ARDILA', edad: 14, grado: '8B' },
    { documento: '1011327088', nombre: 'SAMUEL ALEJANDRO', apellido: 'VILLAMIZAR MARTINEZ', edad: 14, grado: '8B' },
    { documento: '750714', nombre: 'VALENTINA', apellido: 'VIQUEIRA MEJIA', edad: 14, grado: '8B' }
];

function generarCodigoAnonimizado(nombre, apellido) {
    const nombreCorto = nombre.substring(0, 3);
    const apellidoCorto = apellido.split(' ')[0].substring(0, 3);
    const timestamp = Date.now();
    return `${nombreCorto}${apellidoCorto}_${timestamp}`;
}

function determinarGenero(nombre) {
    const nombresFemeninos = [
        'THANYA', 'MARIA', 'LAUREN', 'MANUELA', 'DANNA', 'SOFIA', 'LISETH', 'ABIGAIL',
        'SALOME', 'DANA', 'ISABELLA', 'LAURA', 'SUSANA', 'KIARA', 'MARY', 'MARIANA',
        'MATILDE', 'JULIANA', 'VALENTINA'
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

async function crearGrupo(grado, institucionId) {
    console.log(`📚 Creando/verificando grupo ${grado}...\n`);
    
    // Verificar si ya existe
    const { data: grupoExistente, error: verificarError } = await supabase
        .from('grupos')
        .select('*')
        .eq('nombre', grado)
        .single();
    
    if (verificarError && verificarError.code !== 'PGRST116') {
        console.error(`❌ Error al verificar grupo ${grado}:`, verificarError.message);
        return null;
    }
    
    if (grupoExistente) {
        console.log(`✅ Grupo ${grado} ya existe - ID: ${grupoExistente.id}`);
        return grupoExistente.id;
    }
    
    // Crear nuevo grupo
    const { data: nuevoGrupo, error: crearError } = await supabase
        .from('grupos')
        .insert({
            nombre: grado,
            grado: grado,
            año_escolar: '2025',
            institucion_id: institucionId,
            fecha_creacion: new Date().toISOString(),
            fecha_actualizacion: new Date().toISOString()
        })
        .select()
        .single();
    
    if (crearError) {
        console.error(`❌ Error al crear grupo ${grado}:`, crearError.message);
        return null;
    }
    
    console.log(`✅ Grupo ${grado} creado - ID: ${nuevoGrupo.id}`);
    return nuevoGrupo.id;
}

async function crearEstudiantes(estudiantes, grupoId, grado, institucionId) {
    console.log(`\n➕ Creando estudiantes del grado ${grado}...\n`);
    
    let exitosos = 0;
    let errores = 0;
    
    for (const estudiante of estudiantes) {
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
    
    console.log(`\n📊 Resumen ${grado}:`);
    console.log(`✅ Estudiantes creados: ${exitosos}`);
    console.log(`❌ Errores: ${errores}`);
    
    return { exitosos, errores };
}

async function verificarResultados() {
    console.log('\n🔍 Verificando resultados finales...\n');
    
    // Verificar estudiantes 8A
    const { data: estudiantes8AFinales, error: error8A } = await supabase
        .from('estudiantes')
        .select('*')
        .eq('grado', '8A')
        .order('apellido_estudiante');
    
    if (error8A) {
        console.error('❌ Error al verificar estudiantes 8A:', error8A.message);
    } else {
        console.log(`📊 Total estudiantes 8A: ${estudiantes8AFinales.length}`);
        
        const masculinos8A = estudiantes8AFinales.filter(e => e.genero === 'Masculino').length;
        const femeninos8A = estudiantes8AFinales.filter(e => e.genero === 'Femenino').length;
        
        console.log(`👦 8A Masculinos: ${masculinos8A}`);
        console.log(`👧 8A Femeninos: ${femeninos8A}`);
    }
    
    // Verificar estudiantes 8B
    const { data: estudiantes8BFinales, error: error8B } = await supabase
        .from('estudiantes')
        .select('*')
        .eq('grado', '8B')
        .order('apellido_estudiante');
    
    if (error8B) {
        console.error('❌ Error al verificar estudiantes 8B:', error8B.message);
    } else {
        console.log(`📊 Total estudiantes 8B: ${estudiantes8BFinales.length}`);
        
        const masculinos8B = estudiantes8BFinales.filter(e => e.genero === 'Masculino').length;
        const femeninos8B = estudiantes8BFinales.filter(e => e.genero === 'Femenino').length;
        
        console.log(`👦 8B Masculinos: ${masculinos8B}`);
        console.log(`👧 8B Femeninos: ${femeninos8B}`);
    }
    
    // Total general
    const totalEstudiantes = (estudiantes8AFinales?.length || 0) + (estudiantes8BFinales?.length || 0);
    console.log(`\n📈 Total general: ${totalEstudiantes} estudiantes`);
}

async function main() {
    console.log('🚀 Iniciando creación de estudiantes 8A y 8B de La Salle...\n');
    
    try {
        // 1. Obtener ID de institución existente
        const institucionId = await obtenerInstitucionId();
        if (!institucionId) {
            console.error('❌ No se pudo obtener ID de institución');
            return;
        }
        
        // 2. Crear grupos 8A y 8B
        const grupo8AId = await crearGrupo('8A', institucionId);
        const grupo8BId = await crearGrupo('8B', institucionId);
        
        if (!grupo8AId || !grupo8BId) {
            console.error('❌ No se pudieron crear los grupos 8A y 8B');
            return;
        }
        
        // 3. Crear estudiantes 8A
        const resultado8A = await crearEstudiantes(estudiantes8A, grupo8AId, '8A', institucionId);
        
        // 4. Crear estudiantes 8B
        const resultado8B = await crearEstudiantes(estudiantes8B, grupo8BId, '8B', institucionId);
        
        // 5. Verificar resultados
        await verificarResultados();
        
        // 6. Resumen final
        const totalExitosos = resultado8A.exitosos + resultado8B.exitosos;
        const totalErrores = resultado8A.errores + resultado8B.errores;
        
        console.log('\n🎉 ¡Proceso completado!');
        console.log(`✅ Total estudiantes creados: ${totalExitosos}`);
        console.log(`❌ Total errores: ${totalErrores}`);
        console.log('✅ Institución La Salle configurada');
        console.log('✅ Grupos 8A y 8B creados');
        console.log('✅ Sistema actualizado y listo para usar');
        
    } catch (error) {
        console.error('❌ Error fatal:', error);
    }
}

main();