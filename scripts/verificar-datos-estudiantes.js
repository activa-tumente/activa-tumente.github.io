const { createClient } = require('@supabase/supabase-js');

// Configuración de Supabase
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://eckuozleqbbcecaycmjt.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseKey) {
  console.error('❌ Error: No se ha proporcionado la clave anónima de Supabase.');
  console.error('Por favor, configura la variable de entorno VITE_SUPABASE_ANON_KEY o SUPABASE_ANON_KEY.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Lista de estudiantes para verificar (muestra representativa)
const estudiantesParaVerificar = [
  { grado: '6B', documento: '1097122645', nombre: 'VICTORIA', apellido: 'AGUILAR BECERRA' },
  { grado: '6B', documento: '1221463877', nombre: 'JUAN JOSÉ', apellido: 'ALVAREZ MANTILLA' },
  { grado: '8A', documento: '1097113083', nombre: 'THANYA SOPHIE', apellido: 'ACEVEDO GRANADOS' },
  { grado: '8A', documento: '1097197548', nombre: 'MARIA ALEJANDRA', apellido: 'AMAYA MARTINEZ' },
  { grado: '8B', documento: '1188214165', nombre: 'DANIEL ESTEBAN', apellido: 'AREVALO BRAVO' },
  { grado: '8B', documento: '1097109535', nombre: 'THOMAS JOSE', apellido: 'BLANCO SAAVEDRA' }
];

async function verificarDatosEstudiantes() {
  try {
    console.log('🔍 Verificando datos de estudiantes en Supabase...');

    // 1. Verificar la estructura de la tabla estudiantes
    console.log('\n📊 Estructura de la tabla estudiantes:');
    const { data: columns, error: columnsError } = await supabase.rpc('exec_sql', {
      sql: `
        SELECT 
          column_name, 
          data_type, 
          is_nullable
        FROM 
          information_schema.columns
        WHERE 
          table_name = 'estudiantes'
        ORDER BY 
          ordinal_position;
      `
    });

    if (columnsError) {
      console.error('❌ Error al obtener la estructura de la tabla:', columnsError);
    } else {
      console.table(columns);
    }

    // 2. Contar el número total de estudiantes
    const { data: countData, error: countError } = await supabase
      .from('estudiantes')
      .select('id', { count: 'exact', head: true });

    if (countError) {
      console.error('❌ Error al contar estudiantes:', countError);
    } else {
      console.log(`\n📝 Total de estudiantes en la base de datos: ${countData.count || 0}`);
    }

    // 3. Obtener estadísticas por grado
    console.log('\n📊 Estudiantes por grado:');
    const { data: gradeStats, error: gradeError } = await supabase.rpc('exec_sql', {
      sql: `
        SELECT 
          g.nombre as grado,
          COUNT(e.id) as total_estudiantes
        FROM 
          grupos g
          LEFT JOIN estudiantes e ON g.id = e.grupo_id
        WHERE 
          g.institucion_educativa_id = '8a9ab6bb-4f0e-4eb9-905d-f16049464305'
        GROUP BY 
          g.id, g.nombre
        ORDER BY 
          g.nombre;
      `
    });

    if (gradeError) {
      console.error('❌ Error al obtener estadísticas por grado:', gradeError);
    } else {
      console.table(gradeStats);
    }

    // 4. Verificar estudiantes específicos
    console.log('\n🧪 Verificando estudiantes específicos:');
    
    for (const estudiante of estudiantesParaVerificar) {
      const { data, error } = await supabase
        .from('estudiantes')
        .select('id, nombre_estudiante, apellido_estudiante, numero_documento, grado')
        .eq('numero_documento', estudiante.documento)
        .single();
      
      if (error) {
        console.error(`❌ Error al verificar estudiante ${estudiante.nombre} ${estudiante.apellido}:`, error);
        console.log(`   ⚠️ El estudiante con documento ${estudiante.documento} NO existe en la base de datos`);
      } else if (data) {
        const nombreCoincide = data.nombre_estudiante.trim().toUpperCase() === estudiante.nombre.trim().toUpperCase();
        const apellidoCoincide = data.apellido_estudiante.trim().toUpperCase() === estudiante.apellido.trim().toUpperCase();
        const gradoCoincide = data.grado.trim().toUpperCase() === estudiante.grado.trim().toUpperCase();
        
        if (nombreCoincide && apellidoCoincide && gradoCoincide) {
          console.log(`✅ Estudiante verificado: ${data.nombre_estudiante} ${data.apellido_estudiante} (${data.grado}) - Doc: ${data.numero_documento}`);
        } else {
          console.log(`⚠️ Estudiante encontrado pero con datos diferentes:`);
          console.log(`   - Esperado: ${estudiante.nombre} ${estudiante.apellido} (${estudiante.grado})`);
          console.log(`   - Encontrado: ${data.nombre_estudiante} ${data.apellido_estudiante} (${data.grado})`);
        }
      } else {
        console.log(`❌ No se encontró el estudiante con documento ${estudiante.documento}`);
      }
    }

    // 5. Verificar si hay estudiantes sin grupo asignado
    const { data: sinGrupo, error: sinGrupoError } = await supabase
      .from('estudiantes')
      .select('id, nombre_estudiante, apellido_estudiante')
      .is('grupo_id', null);
    
    if (sinGrupoError) {
      console.error('❌ Error al verificar estudiantes sin grupo:', sinGrupoError);
    } else if (sinGrupo && sinGrupo.length > 0) {
      console.log(`\n⚠️ Se encontraron ${sinGrupo.length} estudiantes sin grupo asignado:`);
      console.table(sinGrupo);
    } else {
      console.log('\n✅ Todos los estudiantes tienen un grupo asignado');
    }

    // 6. Verificar si hay estudiantes sin número de documento
    const { data: sinDocumento, error: sinDocumentoError } = await supabase
      .from('estudiantes')
      .select('id, nombre_estudiante, apellido_estudiante')
      .is('numero_documento', null);
    
    if (sinDocumentoError) {
      console.error('❌ Error al verificar estudiantes sin documento:', sinDocumentoError);
    } else if (sinDocumento && sinDocumento.length > 0) {
      console.log(`\n⚠️ Se encontraron ${sinDocumento.length} estudiantes sin número de documento:`);
      console.table(sinDocumento);
    } else {
      console.log('\n✅ Todos los estudiantes tienen número de documento');
    }

    console.log('\n✅ Verificación completada');

  } catch (error) {
    console.error('❌ Error inesperado:', error);
    process.exit(1);
  }
}

// Ejecutar la función principal
verificarDatosEstudiantes()
  .then(() => {
    console.log('✅ Script completado exitosamente');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Error ejecutando script:', error);
    process.exit(1);
  });