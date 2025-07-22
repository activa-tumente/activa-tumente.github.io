const { createClient } = require('@supabase/supabase-js');

// Configuración de Supabase
const supabaseUrl = 'https://eckuozleqbbcecaycmjt.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVja3VvemxlcWJiY2VjYXljbWp0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ5NzU5NzQsImV4cCI6MjA1MDU1MTk3NH0.Ej8nJJhYKJhJJhYKJhJJhYKJhJJhYKJhJJhYKJhJJhY';

const supabase = createClient(supabaseUrl, supabaseKey);

// ID de la institución Colegio La Salle
const INSTITUCION_ID = '8a9ab6bb-4f0e-4eb9-905d-f16049464305';

// Función para generar UUID v4
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// Datos completos de estudiantes - 83 estudiantes en total
const todosLosEstudiantes = [
  // Grado 6B - 25 estudiantes
  { grado: '6B', documento: '1097122645', nombre: 'VICTORIA', apellido: 'AGUILAR BECERRA', edad: 11 },
  { grado: '6B', documento: '1221463877', nombre: 'JUAN JOSÉ', apellido: 'ALVAREZ MANTILLA', edad: 12 },
  { grado: '6B', documento: '1097201651', nombre: 'MARIA PAULA', apellido: 'AMAYA MARTINEZ', edad: 11 },
  { grado: '6B', documento: '1099424867', nombre: 'SAMUEL CAMILO', apellido: 'ARIAS PALOMO', edad: 12 },
  { grado: '6B', documento: '1029523359', nombre: 'JUAN MANUEL', apellido: 'AVENDAÑO CANO', edad: 10 },
  { grado: '6B', documento: '1066883422', nombre: 'THALIANA', apellido: 'BALLESTEROS GARCIA', edad: 12 },
  { grado: '6B', documento: '1097121199', nombre: 'JOSE ALIRIO', apellido: 'CALDERON GRIMALDOS', edad: 11 },
  { grado: '6B', documento: '1097200716', nombre: 'DANIEL FELIPE', apellido: 'CARDONA PATERNINA', edad: 11 },
  { grado: '6B', documento: '1097121229', nombre: 'MIA', apellido: 'CARDOZO FABRE', edad: 11 },
  { grado: '6B', documento: '1096073026', nombre: 'MARIA PAULA', apellido: 'CARVAJAL CASTELLANOS', edad: 10 },
  { grado: '6B', documento: '1097789728', nombre: 'HECTOR MANUEL', apellido: 'FORERO MENESES', edad: 12 },
  { grado: '6B', documento: '1205964055', nombre: 'SANTIAGO ELIAS', apellido: 'GONZALEZ LARIOS', edad: 11 },
  { grado: '6B', documento: '1222118267', nombre: 'LUCIANA', apellido: 'GONZALEZ SILVA', edad: 11 },
  { grado: '6B', documento: '1097789761', nombre: 'ISABELA', apellido: 'LEON DIAZ', edad: 12 },
  { grado: '6B', documento: '1028875934', nombre: 'JUAN JOSE', apellido: 'MARTIN ARAQUE', edad: 11 },
  { grado: '6B', documento: '1097123049', nombre: 'ANNIE SOFIA', apellido: 'MENDEZ LOZADA', edad: 11 },
  { grado: '6B', documento: '1097790737', nombre: 'ISABELLA', apellido: 'MORENO MONTOYA', edad: 11 },
  { grado: '6B', documento: '1098077749', nombre: 'DAGO SAMUEL', apellido: 'NIÑO ORTIZ', edad: 11 },
  { grado: '6B', documento: '1030193561', nombre: 'VALERIA', apellido: 'ORTIZ PEREZ', edad: 11 },
  { grado: '6B', documento: '1014885370', nombre: 'RICARDO', apellido: 'PAEZ VALBUENA', edad: 11 },
  { grado: '6B', documento: '1097122694', nombre: 'JUAN GUILLERMO', apellido: 'RESTREPO VARGAS', edad: 11 },
  { grado: '6B', documento: '1097120696', nombre: 'LUIS ALEJANDRO', apellido: 'RODRIGUEZ PINTO', edad: 12 },
  { grado: '6B', documento: '1020229816', nombre: 'FELIX DAVID', apellido: 'SIERRA MIRANDA', edad: 12 },
  { grado: '6B', documento: '1222303739', nombre: 'MARIA FERNANDA', apellido: 'SUÁREZ AVAUNZA', edad: 11 },
  { grado: '6B', documento: '1097120107', nombre: 'JUAN PABLO', apellido: 'VECINO PEREZ', edad: 12 },
  
  // Grado 8A - 30 estudiantes
  { grado: '8A', documento: '1097113083', nombre: 'THANYA SOPHIE', apellido: 'ACEVEDO GRANADOS', edad: 13 },
  { grado: '8A', documento: '1097197548', nombre: 'MARIA ALEJANDRA', apellido: 'AMAYA MARTINEZ', edad: 13 },
  { grado: '8A', documento: '1124825116', nombre: 'LAUREN SOFIA', apellido: 'ANZOLA GONZALEZ', edad: 13 },
  { grado: '8A', documento: '1097787744', nombre: 'ANDRÉS GUSTAVO', apellido: 'BUSTAMANTE SEPULVEDA', edad: 14 },
  { grado: '8A', documento: '1097505483', nombre: 'MANUELA', apellido: 'CARO BARRERA', edad: 13 },
  { grado: '8A', documento: '1046708952', nombre: 'JUAN ANGEL', apellido: 'CARRASCAL DAZA', edad: 14 },
  { grado: '8A', documento: '1011213038', nombre: 'DANNA', apellido: 'CARVAJAL URIBE', edad: 13 },
  { grado: '8A', documento: '1014879888', nombre: 'JUAN JOSE', apellido: 'CASTAÑEDA PORRAS', edad: 13 },
  { grado: '8A', documento: '1099744366', nombre: 'SOFIA', apellido: 'CASTELLANOS WILCHES', edad: 14 },
  { grado: '8A', documento: '1097504256', nombre: 'MARIA ISABELLA', apellido: 'DAVILA LOPEZ', edad: 14 },
  { grado: '8A', documento: '1097787545', nombre: 'FABIAN EDUARDO', apellido: 'DIAZ BALCARCEL', edad: 14 },
  { grado: '8A', documento: '1097504567', nombre: 'LISETH GABRIELA', apellido: 'DIAZ NIÑO', edad: 13 },
  { grado: '8A', documento: '1098075012', nombre: 'ABIGAIL', apellido: 'GARCIA ALVAREZ', edad: 15 },
  { grado: '8A', documento: '1096703562', nombre: 'JAVIER ALEJANDRO', apellido: 'GOMEZ GONZALEZ', edad: 13 },
  { grado: '8A', documento: '1097505963', nombre: 'ALEJANDRO', apellido: 'GOMEZ TORRES', edad: 12 },
  { grado: '8A', documento: '1101624282', nombre: 'SALOME', apellido: 'HERNANDEZ VARGAS', edad: 13 },
  { grado: '8A', documento: '1022382221', nombre: 'JOSHUA JAVIER', apellido: 'MAYORGA SOPÓ', edad: 14 },
  { grado: '8A', documento: '1097503495', nombre: 'SANTIAGO IMAD', apellido: 'NAJM SASSINE', edad: 14 },
  { grado: '8A', documento: '1011105873', nombre: 'DANA', apellido: 'NAVARRETE LAGOS', edad: 13 },
  { grado: '8A', documento: '1030181390', nombre: 'TOMÁS ALEJANDRO', apellido: 'NOVA BECERRA', edad: 14 },
  { grado: '8A', documento: '1082966320', nombre: 'JUAN PABLO', apellido: 'PARADA ROMERO', edad: 14 },
  { grado: '8A', documento: '1098075935', nombre: 'MARIA JOSE', apellido: 'RIOS CACERES', edad: 14 },
  { grado: '8A', documento: '1098075606', nombre: 'JULIANA DE DIOS', apellido: 'RODRIGUEZ REYES', edad: 14 },
  { grado: '8A', documento: '1097114913', nombre: 'ISABELLA', apellido: 'ROMAN SERRANO', edad: 13 },
  { grado: '8A', documento: '1097504236', nombre: 'JUAN JOSE', apellido: 'SANCHEZ MURILLO', edad: 14 },
  { grado: '8A', documento: '1097112005', nombre: 'LAURA JOHANA', apellido: 'SANDOVAL SEPULVEDA', edad: 14 },
  { grado: '8A', documento: '1042860515', nombre: 'SUSANA ISABEL', apellido: 'SOTO TOVAR', edad: 14 },
  { grado: '8A', documento: '1142719203', nombre: 'LUKAS MATEO', apellido: 'URIBE HIGUITA', edad: 13 },
  { grado: '8A', documento: '1142718531', nombre: 'DANNA GABRIELA', apellido: 'VARGAS JAIMES', edad: 14 },
  { grado: '8A', documento: '1097505378', nombre: 'KEVIN SPENCER', apellido: 'VEGA ALDANA', edad: 13 },
  
  // Grado 8B - 28 estudiantes
  { grado: '8B', documento: '1188214165', nombre: 'DANIEL ESTEBAN', apellido: 'AREVALO BRAVO', edad: 14 },
  { grado: '8B', documento: '1097109535', nombre: 'THOMAS JOSE', apellido: 'BLANCO SAAVEDRA', edad: 14 },
  { grado: '8B', documento: '1096071330', nombre: 'SAUL ANDRES', apellido: 'BOBADILLA SANCHEZ', edad: 13 },
  { grado: '8B', documento: '1010843531', nombre: 'MATILDE ISABEL', apellido: 'BOHÓRQUEZ FORERO', edad: 13 },
  { grado: '8B', documento: '1095313087', nombre: 'SAMUEL ARTURO', apellido: 'CASTRO MARTINEZ', edad: 13 },
  { grado: '8B', documento: '1098750506', nombre: 'MARIA JOSE', apellido: 'DUARTE MORALES', edad: 13 },
  { grado: '8B', documento: '1097109128', nombre: 'SANTIAGO', apellido: 'ESPITIA GALVÁN', edad: 14 },
  { grado: '8B', documento: '1097787577', nombre: 'MARY', apellido: 'FORERO MENESES', edad: 14 },
  { grado: '8B', documento: '1097914859', nombre: 'JUAN JOSE', apellido: 'GOMEZ VEGA', edad: 14 },
  { grado: '8B', documento: '1101692231', nombre: 'ANDRES FELIPE', apellido: 'GONZALEZ ARGUELLO', edad: 13 },
  { grado: '8B', documento: '1027285487', nombre: 'MARIANA', apellido: 'LADINO GIRALDO', edad: 14 },
  { grado: '8B', documento: '1142719351', nombre: 'JOSEPH EMMANUEL', apellido: 'MANTILLA MENDEZ', edad: 13 },
  { grado: '8B', documento: '1097505777', nombre: 'STEBAN', apellido: 'MEJIA CORREDOR', edad: 12 },
  { grado: '8B', documento: '1097113800', nombre: 'DIEGO ALEJANDRO', apellido: 'ORTIZ LANDAZURI', edad: 13 },
  { grado: '8B', documento: '1097788675', nombre: 'ANDRES SEBASTIAN', apellido: 'PARDO ARAQUE', edad: 13 },
  { grado: '8B', documento: '1097114337', nombre: 'JOSE ALEJANDRO', apellido: 'PATIÑO CARDENAS', edad: 13 },
  { grado: '8B', documento: '1096070055', nombre: 'FELIPE', apellido: 'PEDRAZA ZAPATA', edad: 14 },
  { grado: '8B', documento: '1097788294', nombre: 'KIARA ALEJANDRA', apellido: 'PINEDA SANTOS', edad: 13 },
  { grado: '8B', documento: '1097504065', nombre: 'JUAN FELIPE', apellido: 'RANGEL RUEDA', edad: 14 },
  { grado: '8B', documento: '1100962480', nombre: 'MARIA SALOME', apellido: 'REYES ARDILA', edad: 14 },
  { grado: '8B', documento: '1097787185', nombre: 'SAMUEL FELIPE', apellido: 'RUEDA LOZANO', edad: 14 },
  { grado: '8B', documento: '1097503979', nombre: 'JUAN ANDRES', apellido: 'SALAZAR GONZALEZ', edad: 14 },
  { grado: '8B', documento: '1097788874', nombre: 'DAVID ALEJANDRO', apellido: 'SARMIENTO LEON', edad: 13 },
  { grado: '8B', documento: '1097503609', nombre: 'MARIA JOSE', apellido: 'SERRANO FLOREZ', edad: 14 },
  { grado: '8B', documento: '1097505011', nombre: 'RAFAEL SANTIAGO', apellido: 'VALERO RIVEROS', edad: 13 },
  { grado: '8B', documento: '1097787234', nombre: 'SERGIO AUGUSTO', apellido: 'VARGAS ARDILA', edad: 14 },
  { grado: '8B', documento: '1011327088', nombre: 'SAMUEL ALEJANDRO', apellido: 'VILLAMIZAR MARTINEZ', edad: 14 },
  { grado: '8B', documento: '750714', nombre: 'VALENTINA', apellido: 'VIQUEIRA MEJIA', edad: 14 }
];

// Función para crear grupos si no existen
async function crearGrupos() {
  console.log('Verificando y creando grupos...');
  
  const grados = ['6B', '8A', '8B'];
  const gruposCreados = [];
  
  for (const grado of grados) {
    try {
      // Verificar si el grupo ya existe
      const { data: grupoExistente, error: errorBusqueda } = await supabase
        .from('grupos')
        .select('*')
        .eq('nombre', grado)
        .eq('institucion_educativa_id', INSTITUCION_ID)
        .single();
      
      if (errorBusqueda && errorBusqueda.code !== 'PGRST116') {
        console.error(`Error buscando grupo ${grado}:`, errorBusqueda);
        continue;
      }
      
      if (grupoExistente) {
        console.log(`✓ Grupo ${grado} ya existe con ID: ${grupoExistente.id}`);
        gruposCreados.push(grupoExistente);
      } else {
        // Crear el grupo
        const nuevoGrupo = {
          id: generateUUID(),
          nombre: grado,
          institucion_educativa_id: INSTITUCION_ID,
          ano_escolar: '2024',
          fecha_creacion: new Date().toISOString(),
          fecha_actualizacion: new Date().toISOString()
        };
        
        const { data: grupoCreado, error: errorCreacion } = await supabase
          .from('grupos')
          .insert([nuevoGrupo])
          .select()
          .single();
        
        if (errorCreacion) {
          console.error(`Error creando grupo ${grado}:`, errorCreacion);
          continue;
        }
        
        console.log(`✓ Grupo ${grado} creado con ID: ${grupoCreado.id}`);
        gruposCreados.push(grupoCreado);
      }
    } catch (error) {
      console.error(`Error procesando grupo ${grado}:`, error);
    }
  }
  
  return gruposCreados;
}

// Función principal para insertar estudiantes
async function insertarEstudiantes() {
  try {
    console.log('🚀 Iniciando inserción de estudiantes reales del Colegio La Salle...');
    console.log(`📊 Total de estudiantes a insertar: ${todosLosEstudiantes.length}`);
    
    // Primero crear los grupos
    const grupos = await crearGrupos();
    
    if (grupos.length === 0) {
      console.error('❌ No se pudieron crear los grupos. Abortando inserción de estudiantes.');
      return;
    }
    
    // Crear un mapa de grado -> grupo_id
    const mapaGrupos = {};
    grupos.forEach(grupo => {
      mapaGrupos[grupo.nombre] = grupo.id;
    });
    
    console.log('📋 Mapa de grupos:', mapaGrupos);
    
    // Preparar datos de estudiantes para inserción
    const estudiantesParaInsertar = todosLosEstudiantes.map(estudiante => ({
      id: generateUUID(),
      nombre_estudiante: estudiante.nombre,
      apellido_estudiante: estudiante.apellido,
      numero_documento: estudiante.documento,
      edad: estudiante.edad,
      grado: estudiante.grado,
      grupo_id: mapaGrupos[estudiante.grado],
      institucion_educativa_id: INSTITUCION_ID,
      fecha_creacion: new Date().toISOString(),
      fecha_actualizacion: new Date().toISOString()
    }));
    
    console.log(`\n📝 Preparando inserción de ${estudiantesParaInsertar.length} estudiantes...`);
    
    // Insertar estudiantes uno por uno para mejor control de errores
    let estudiantesInsertados = 0;
    let errores = 0;
    
    for (const estudiante of estudiantesParaInsertar) {
      try {
        // Verificar si el estudiante ya existe
        const { data: existeEstudiante } = await supabase
          .from('estudiantes')
          .select('id')
          .eq('numero_documento', estudiante.numero_documento)
          .single();
        
        if (existeEstudiante) {
          console.log(`⚠️  Estudiante ya existe: ${estudiante.nombre_estudiante} ${estudiante.apellido_estudiante} (${estudiante.numero_documento})`);
          continue;
        }
        
        const { data, error } = await supabase
          .from('estudiantes')
          .insert([estudiante])
          .select();
        
        if (error) {
          console.error(`❌ Error insertando estudiante ${estudiante.nombre_estudiante} ${estudiante.apellido_estudiante}:`, error.message);
          errores++;
        } else {
          estudiantesInsertados++;
          console.log(`✅ Insertado: ${estudiante.nombre_estudiante} ${estudiante.apellido_estudiante} (${estudiante.grado}) - Doc: ${estudiante.numero_documento}`);
        }
      } catch (err) {
        console.error(`❌ Error inesperado insertando estudiante ${estudiante.nombre_estudiante}:`, err.message);
        errores++;
      }
    }
    
    console.log(`\n🎉 Proceso completado!`);
    console.log(`📊 Resumen:`);
    console.log(`   - Estudiantes insertados: ${estudiantesInsertados}/${todosLosEstudiantes.length}`);
    console.log(`   - Errores: ${errores}`);
    console.log(`   - Grupos creados/verificados: ${grupos.length}`);
    
    // Verificar inserción final
    const { data: totalEstudiantes } = await supabase
      .from('estudiantes')
      .select('id', { count: 'exact' })
      .eq('institucion_educativa_id', INSTITUCION_ID);
    
    console.log(`📈 Total de estudiantes en la base de datos: ${totalEstudiantes?.length || 0}`);
    
    // Mostrar resumen por grado
    for (const grado of ['6B', '8A', '8B']) {
      const { data: estudiantesGrado } = await supabase
        .from('estudiantes')
        .select('id', { count: 'exact' })
        .eq('grado', grado)
        .eq('institucion_educativa_id', INSTITUCION_ID);
      
      console.log(`   - ${grado}: ${estudiantesGrado?.length || 0} estudiantes`);
    }
    
  } catch (error) {
    console.error('❌ Error general en la inserción:', error);
  }
}

// Ejecutar el script
if (require.main === module) {
  insertarEstudiantes()
    .then(() => {
      console.log('\n✅ Script completado exitosamente');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Error ejecutando script:', error);
      process.exit(1);
    });
}

module.exports = { insertarEstudiantes, todosLosEstudiantes };