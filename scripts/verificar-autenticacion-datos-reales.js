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

// Datos de prueba para verificar la autenticación
const estudiantesParaVerificar = [
  { grado: '6B', documento: '1097122645', nombre: 'VICTORIA AGUILAR BECERRA' },
  { grado: '8A', documento: '1097113083', nombre: 'THANYA SOPHIE ACEVEDO GRANADOS' },
  { grado: '8B', documento: '1188214165', nombre: 'DANIEL ESTEBAN AREVALO BRAVO' }
];

async function verificarAutenticacion() {
  try {
    console.log('🔍 Verificando autenticación con datos reales...');

    // 1. Verificar que los grupos existan
    console.log('\n📊 Verificando grupos:');
    const { data: grupos, error: gruposError } = await supabase
      .from('grupos')
      .select('id, nombre')
      .eq('institucion_educativa_id', '8a9ab6bb-4f0e-4eb9-905d-f16049464305')
      .in('nombre', ['6B', '8A', '8B']);

    if (gruposError) {
      console.error('❌ Error al verificar grupos:', gruposError);
      process.exit(1);
    }

    if (!grupos || grupos.length === 0) {
      console.error('❌ No se encontraron los grupos necesarios (6B, 8A, 8B)');
      console.log('Por favor, ejecuta el script de inserción de datos reales primero.');
      process.exit(1);
    }

    console.log('✅ Grupos encontrados:', grupos.map(g => g.nombre).join(', '));

    // 2. Verificar autenticación para cada estudiante de prueba
    console.log('\n🧪 Verificando autenticación para estudiantes de prueba:');

    for (const estudiante of estudiantesParaVerificar) {
      console.log(`\n🔐 Probando autenticación para: ${estudiante.nombre} (${estudiante.grado})`);

      // 2.1 Obtener el grupo correspondiente al grado
      const grupo = grupos.find(g => g.nombre === estudiante.grado);
      if (!grupo) {
        console.error(`❌ No se encontró el grupo ${estudiante.grado}`);
        continue;
      }

      console.log(`✅ Grupo encontrado: ${estudiante.grado} (ID: ${grupo.id})`);

      // 2.2 Buscar el estudiante por documento
      const { data: estudianteData, error: estudianteError } = await supabase
        .from('estudiantes')
        .select('id, nombre_estudiante, apellido_estudiante, numero_documento, grado, grupo_id')
        .eq('numero_documento', estudiante.documento)
        .single();

      if (estudianteError) {
        console.error(`❌ Error al buscar estudiante con documento ${estudiante.documento}:`, estudianteError);
        console.log('⚠️ Este estudiante no existe en la base de datos. Ejecuta el script de inserción de datos reales.');
        continue;
      }

      console.log(`✅ Estudiante encontrado: ${estudianteData.nombre_estudiante} ${estudianteData.apellido_estudiante}`);

      // 2.3 Verificar que el estudiante pertenezca al grupo correcto
      if (estudianteData.grupo_id !== grupo.id) {
        console.error(`❌ El estudiante no pertenece al grupo ${estudiante.grado}`);
        console.log(`   Grupo esperado: ${grupo.id}`);
        console.log(`   Grupo actual: ${estudianteData.grupo_id}`);
        continue;
      }

      console.log(`✅ El estudiante pertenece al grupo correcto: ${estudiante.grado}`);

      // 2.4 Simular autenticación (verificar que el documento coincida)
      if (estudianteData.numero_documento === estudiante.documento) {
        console.log(`✅ Autenticación exitosa: El documento coincide`);

        // 2.5 Simular creación de sesión
        const sessionData = {
          id: estudianteData.id,
          name: `${estudianteData.nombre_estudiante} ${estudianteData.apellido_estudiante}`,
          documento: estudianteData.numero_documento,
          grado: estudiante.grado,
          grupoId: grupo.id,
          role: 'student',
          loginTime: new Date().toISOString()
        };

        console.log(`✅ Sesión simulada creada correctamente:`, sessionData);
      } else {
        console.error(`❌ Error de autenticación: El documento no coincide`);
        console.log(`   Documento esperado: ${estudiante.documento}`);
        console.log(`   Documento actual: ${estudianteData.numero_documento}`);
      }
    }

    // 3. Verificar que todos los estudiantes tengan número de documento
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

    console.log('\n✅ Verificación de autenticación completada');

  } catch (error) {
    console.error('❌ Error inesperado:', error);
    process.exit(1);
  }
}

// Ejecutar la función principal
verificarAutenticacion()
  .then(() => {
    console.log('✅ Script completado exitosamente');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Error ejecutando script:', error);
    process.exit(1);
  });