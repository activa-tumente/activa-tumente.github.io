import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://eckuozleqbbcecaycmjt.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVja3VvemxlcWJiY2VjYXljbWp0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM3MjAwNjEsImV4cCI6MjA1OTI5NjA2MX0.S6KFjF2HYIArDSGeSu_iMXjgtaHivPPJdwRs60xB9_U'
);

async function verificarTablasAdmin() {
  try {
    console.log('🔍 Verificando tablas para el administrador...');

    // 1. Verificar tabla respuestas_cuestionario (que está causando 404)
    console.log('\n1️⃣ Verificando tabla respuestas_cuestionario:');
    const { data: respuestasCuestionario, error: errorRespuestasCuestionario } = await supabase
      .from('respuestas_cuestionario')
      .select('estudiante_id')
      .limit(1);

    if (errorRespuestasCuestionario) {
      console.error('❌ Error con respuestas_cuestionario:', errorRespuestasCuestionario.message);
      
      // Verificar si existe la tabla 'respuestas' en su lugar
      console.log('Verificando tabla alternativa "respuestas":');
      const { data: respuestas, error: errorRespuestas } = await supabase
        .from('respuestas')
        .select('estudiante_id')
        .limit(1);

      if (errorRespuestas) {
        console.error('❌ Error con respuestas:', errorRespuestas.message);
      } else {
        console.log('✅ Tabla "respuestas" existe y funciona');
        console.log('Datos de ejemplo:', respuestas);
      }
    } else {
      console.log('✅ Tabla respuestas_cuestionario existe');
    }

    // 2. Verificar tabla instituciones (que está causando 404)
    console.log('\n2️⃣ Verificando tabla instituciones:');
    const { data: instituciones, error: errorInstituciones } = await supabase
      .from('instituciones')
      .select('id')
      .limit(1);

    if (errorInstituciones) {
      console.error('❌ Error con instituciones:', errorInstituciones.message);
      
      // Verificar si existe la tabla 'instituciones_educativas' en su lugar
      console.log('Verificando tabla alternativa "instituciones_educativas":');
      const { data: institucionesEducativas, error: errorInstitucionesEducativas } = await supabase
        .from('instituciones_educativas')
        .select('id')
        .limit(1);

      if (errorInstitucionesEducativas) {
        console.error('❌ Error con instituciones_educativas:', errorInstitucionesEducativas.message);
      } else {
        console.log('✅ Tabla "instituciones_educativas" existe y funciona');
        console.log('Datos de ejemplo:', institucionesEducativas);
      }
    } else {
      console.log('✅ Tabla instituciones existe');
    }

    // 3. Listar todas las tablas disponibles
    console.log('\n3️⃣ Intentando listar todas las tablas disponibles:');
    
    // Probar algunas tablas conocidas
    const tablasConocidas = [
      'estudiantes',
      'grupos', 
      'preguntas',
      'respuestas',
      'instituciones_educativas',
      'cuestionarios',
      'opciones_respuesta'
    ];

    for (const tabla of tablasConocidas) {
      try {
        const { data, error } = await supabase
          .from(tabla)
          .select('*')
          .limit(1);

        if (error) {
          console.log(`❌ ${tabla}: ${error.message}`);
        } else {
          console.log(`✅ ${tabla}: Existe (${data?.length || 0} registros de ejemplo)`);
        }
      } catch (err) {
        console.log(`❌ ${tabla}: Error inesperado`);
      }
    }

    // 4. Verificar vistas que podrían existir
    console.log('\n4️⃣ Verificando vistas disponibles:');
    
    const vistasConocidas = [
      'vista_roles_bullying',
      'view_dashboard_bullying_indicators',
      'view_estudiantes_con_respuestas',
      'view_grupos_con_respuestas'
    ];

    for (const vista of vistasConocidas) {
      try {
        const { data, error } = await supabase
          .from(vista)
          .select('*')
          .limit(1);

        if (error) {
          console.log(`❌ ${vista}: ${error.message}`);
        } else {
          console.log(`✅ ${vista}: Existe (${data?.length || 0} registros de ejemplo)`);
        }
      } catch (err) {
        console.log(`❌ ${vista}: Error inesperado`);
      }
    }

    console.log('\n🎯 Resumen de problemas encontrados:');
    console.log('1. La tabla "respuestas_cuestionario" no existe');
    console.log('2. La tabla "instituciones" no existe');
    console.log('3. Probablemente se deben usar "respuestas" e "instituciones_educativas"');

  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

verificarTablasAdmin();