import { createClient } from '@supabase/supabase-js';

// Configuración de Supabase
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://eckuozleqbbcecaycmjt.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseKey) {
  console.error('❌ Error: No se ha proporcionado la clave anónima de Supabase.');
  console.error('Por favor, configura la variable de entorno VITE_SUPABASE_ANON_KEY o SUPABASE_ANON_KEY.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function verificarGuardadoRespuestas() {
  try {
    console.log('🔍 Verificando guardado de respuestas en Supabase...');

    // 1. Verificar la estructura de la tabla respuestas
    console.log('\n1️⃣ Verificando estructura de la tabla respuestas:');
    const { data: columns, error: columnsError } = await supabase
      .from('information_schema.columns')
      .select('column_name, data_type, is_nullable')
      .eq('table_name', 'respuestas')
      .order('ordinal_position');

    if (columnsError) {
      console.error('❌ Error al obtener la estructura de la tabla:', columnsError);
    } else if (columns && columns.length > 0) {
      console.table(columns);
    } else {
      console.log('⚠️ No se pudo obtener la estructura de la tabla respuestas');
    }

    // 2. Contar el número total de respuestas
    const { count, error: countError } = await supabase
      .from('respuestas')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      console.error('❌ Error al contar respuestas:', countError);
    } else {
      console.log(`\n2️⃣ Total de respuestas guardadas: ${count || 0}`);
    }

    // 3. Verificar respuestas por estudiante
    console.log('\n3️⃣ Respuestas por estudiante:');
    const { data: respuestasPorEstudiante, error: respuestasError } = await supabase
      .from('respuestas')
      .select(`
        estudiante_id,
        estudiantes!inner(nombre_estudiante, apellido_estudiante, grado)
      `);

    if (respuestasError) {
      console.error('❌ Error al obtener respuestas por estudiante:', respuestasError);
    } else if (respuestasPorEstudiante && respuestasPorEstudiante.length > 0) {
      // Agrupar respuestas por estudiante
      const agrupadas = respuestasPorEstudiante.reduce((acc, resp) => {
        const key = resp.estudiante_id;
        if (!acc[key]) {
          acc[key] = {
            estudiante: `${resp.estudiantes.nombre_estudiante} ${resp.estudiantes.apellido_estudiante}`,
            grado: resp.estudiantes.grado,
            total_respuestas: 0
          };
        }
        acc[key].total_respuestas++;
        return acc;
      }, {});
      
      console.table(Object.values(agrupadas));
    } else {
      console.log('⚠️ No se encontraron respuestas guardadas por ningún estudiante.');
    }

    // 4. Verificar últimas respuestas guardadas
    console.log('\n4️⃣ Últimas 10 respuestas guardadas:');
    const { data: ultimasRespuestas, error: ultimasError } = await supabase
      .from('respuestas')
      .select(`
        id,
        estudiante_id,
        pregunta_id,
        respuesta_texto,
        fecha_respuesta
      `)
      .order('fecha_respuesta', { ascending: false })
      .limit(10);

    if (ultimasError) {
      console.error('❌ Error al obtener últimas respuestas:', ultimasError);
    } else if (ultimasRespuestas && ultimasRespuestas.length > 0) {
      console.table(ultimasRespuestas);
    } else {
      console.log('⚠️ No se encontraron respuestas guardadas.');
    }

    // 5. Verificar estudiantes que han completado el cuestionario
    console.log('\n5️⃣ Estudiantes que han completado el cuestionario:');
    
    // Primero obtener el total de preguntas
    const { count: totalPreguntas, error: preguntasError } = await supabase
      .from('preguntas')
      .select('*', { count: 'exact', head: true });

    if (preguntasError) {
      console.error('❌ Error al contar preguntas:', preguntasError);
    } else {
      console.log(`Total de preguntas en el cuestionario: ${totalPreguntas || 0}`);
      
      // Obtener respuestas agrupadas por estudiante
      const { data: estudiantesRespuestas, error: estudiantesError } = await supabase
        .from('respuestas')
        .select(`
          estudiante_id,
          pregunta_id,
          estudiantes!inner(nombre_estudiante, apellido_estudiante, grado)
        `);

      if (estudiantesError) {
        console.error('❌ Error al obtener respuestas de estudiantes:', estudiantesError);
      } else if (estudiantesRespuestas && estudiantesRespuestas.length > 0) {
        // Agrupar por estudiante y contar preguntas únicas
        const estadoEstudiantes = estudiantesRespuestas.reduce((acc, resp) => {
          const key = resp.estudiante_id;
          if (!acc[key]) {
            acc[key] = {
              nombre_completo: `${resp.estudiantes.nombre_estudiante} ${resp.estudiantes.apellido_estudiante}`,
              grado: resp.estudiantes.grado,
              preguntas_respondidas: new Set(),
              total_preguntas: totalPreguntas || 0
            };
          }
          acc[key].preguntas_respondidas.add(resp.pregunta_id);
          return acc;
        }, {});

        // Convertir a array y calcular estado
        const resultado = Object.values(estadoEstudiantes).map(est => ({
          nombre_completo: est.nombre_completo,
          grado: est.grado,
          preguntas_respondidas: est.preguntas_respondidas.size,
          total_preguntas: est.total_preguntas,
          estado: est.preguntas_respondidas.size === est.total_preguntas ? 'Completo' :
                  est.preguntas_respondidas.size > 0 ? 'Parcial' : 'No iniciado'
        }));

        console.table(resultado);
      } else {
        console.log('⚠️ No se encontraron estudiantes que hayan completado el cuestionario.');
      }
    }

    console.log('\n✅ Verificación completada');

  } catch (error) {
    console.error('❌ Error inesperado:', error);
    process.exit(1);
  }
}

// Ejecutar la función principal
verificarGuardadoRespuestas()
  .then(() => {
    console.log('✅ Script completado exitosamente');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Error ejecutando script:', error);
    process.exit(1);
  });