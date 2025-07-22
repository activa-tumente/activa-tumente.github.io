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

async function verificarRespuestasGuardadas() {
  try {
    console.log('🔍 Verificando respuestas guardadas en Supabase...');

    // 1. Verificar la estructura de la tabla respuestas
    console.log('\n📊 Estructura de la tabla respuestas:');
    const { data: columns, error: columnsError } = await supabase.rpc('exec_sql', {
      sql: `
        SELECT 
          column_name, 
          data_type, 
          is_nullable
        FROM 
          information_schema.columns
        WHERE 
          table_name = 'respuestas'
        ORDER BY 
          ordinal_position;
      `
    });

    if (columnsError) {
      console.error('❌ Error al obtener la estructura de la tabla:', columnsError);
    } else {
      console.table(columns);
    }

    // 2. Contar el número total de respuestas
    const { data: countData, error: countError } = await supabase
      .from('respuestas')
      .select('id', { count: 'exact', head: true });

    if (countError) {
      console.error('❌ Error al contar respuestas:', countError);
    } else {
      console.log(`\n📝 Total de respuestas guardadas: ${countData.count || 0}`);
    }

    // 3. Obtener estadísticas por grupo
    console.log('\n📊 Respuestas por grupo:');
    const { data: groupStats, error: groupError } = await supabase.rpc('exec_sql', {
      sql: `
        SELECT 
          g.nombre as grupo,
          COUNT(DISTINCT r.estudiante_id) as estudiantes_respondieron,
          COUNT(DISTINCT e.id) as total_estudiantes,
          COUNT(r.id) as total_respuestas
        FROM 
          grupos g
          LEFT JOIN estudiantes e ON g.id = e.grupo_id
          LEFT JOIN respuestas r ON g.id = r.grupo_id AND e.id = r.estudiante_id
        GROUP BY 
          g.id, g.nombre
        ORDER BY 
          g.nombre;
      `
    });

    if (groupError) {
      console.error('❌ Error al obtener estadísticas por grupo:', groupError);
    } else {
      console.table(groupStats);
    }

    // 4. Obtener las últimas 5 respuestas guardadas
    console.log('\n📝 Últimas 5 respuestas guardadas:');
    const { data: latestResponses, error: latestError } = await supabase
      .from('respuestas')
      .select(`
        id,
        estudiante_id,
        grupo_id,
        pregunta_id,
        respuesta_texto,
        fecha_respuesta
      `)
      .order('fecha_respuesta', { ascending: false })
      .limit(5);

    if (latestError) {
      console.error('❌ Error al obtener las últimas respuestas:', latestError);
    } else {
      console.table(latestResponses);
    }

    // 5. Verificar estudiantes que han completado el cuestionario
    console.log('\n👨‍🎓 Estudiantes que han completado el cuestionario:');
    const { data: completedStudents, error: completedError } = await supabase.rpc('exec_sql', {
      sql: `
        WITH estudiantes_respuestas AS (
          SELECT 
            e.id as estudiante_id,
            e.nombre_estudiante || ' ' || e.apellido_estudiante as nombre_completo,
            g.nombre as grupo,
            COUNT(DISTINCT r.pregunta_id) as preguntas_respondidas
          FROM 
            estudiantes e
            JOIN grupos g ON e.grupo_id = g.id
            LEFT JOIN respuestas r ON e.id = r.estudiante_id
          GROUP BY 
            e.id, e.nombre_estudiante, e.apellido_estudiante, g.nombre
        )
        SELECT 
          nombre_completo,
          grupo,
          preguntas_respondidas,
          CASE 
            WHEN preguntas_respondidas > 0 THEN 'Sí'
            ELSE 'No'
          END as ha_respondido
        FROM 
          estudiantes_respuestas
        ORDER BY 
          grupo, preguntas_respondidas DESC, nombre_completo;
      `
    });

    if (completedError) {
      console.error('❌ Error al verificar estudiantes que han completado el cuestionario:', completedError);
    } else {
      console.table(completedStudents);
    }

    console.log('\n✅ Verificación completada');

  } catch (error) {
    console.error('❌ Error inesperado:', error);
    process.exit(1);
  }
}

// Ejecutar la función principal
verificarRespuestasGuardadas()
  .then(() => {
    console.log('✅ Script completado exitosamente');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Error ejecutando script:', error);
    process.exit(1);
  });