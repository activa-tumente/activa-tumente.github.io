import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://eckuozleqbbcecaycmjt.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVja3VvemxlcWJiY2VjYXljbWp0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM3MjAwNjEsImV4cCI6MjA1OTI5NjA2MX0.S6KFjF2HYIArDSGeSu_iMXjgtaHivPPJdwRs60xB9_U'
);

async function verificarDatosDashboard() {
  try {
    console.log('📊 Verificando datos disponibles para el dashboard...');

    // 1. Resumen general de datos
    console.log('\n1️⃣ Resumen general:');
    
    const [
      { count: totalInstituciones },
      { count: totalGrupos },
      { count: totalEstudiantes },
      { count: totalRespuestas },
      { count: totalPreguntas }
    ] = await Promise.all([
      supabase.from('instituciones_educativas').select('*', { count: 'exact', head: true }),
      supabase.from('grupos').select('*', { count: 'exact', head: true }),
      supabase.from('estudiantes').select('*', { count: 'exact', head: true }),
      supabase.from('respuestas').select('*', { count: 'exact', head: true }),
      supabase.from('preguntas').select('*', { count: 'exact', head: true })
    ]);

    console.table({
      'Instituciones': totalInstituciones || 0,
      'Grupos': totalGrupos || 0,
      'Estudiantes': totalEstudiantes || 0,
      'Respuestas': totalRespuestas || 0,
      'Preguntas': totalPreguntas || 0
    });

    // 2. Análisis por institución
    console.log('\n2️⃣ Datos por institución:');
    const { data: instituciones } = await supabase
      .from('instituciones_educativas')
      .select(`
        id,
        nombre,
        grupos(
          id,
          nombre,
          grado,
          estudiantes(id)
        )
      `);

    instituciones?.forEach(inst => {
      const totalGruposInst = inst.grupos?.length || 0;
      const totalEstudiantesInst = inst.grupos?.reduce((sum, grupo) => sum + (grupo.estudiantes?.length || 0), 0) || 0;
      
      console.log(`📍 ${inst.nombre}:`);
      console.log(`   - Grupos: ${totalGruposInst}`);
      console.log(`   - Estudiantes: ${totalEstudiantesInst}`);
    });

    // 3. Análisis de participación por grupo
    console.log('\n3️⃣ Participación por grupo:');
    const { data: participacionGrupos } = await supabase
      .from('grupos')
      .select(`
        id,
        nombre,
        grado,
        estudiantes(
          id,
          nombre_estudiante,
          apellido_estudiante,
          respuestas(id)
        )
      `);

    participacionGrupos?.forEach(grupo => {
      const totalEstudiantes = grupo.estudiantes?.length || 0;
      const estudiantesConRespuestas = grupo.estudiantes?.filter(est => 
        est.respuestas && est.respuestas.length > 0
      ).length || 0;
      const porcentajeParticipacion = totalEstudiantes > 0 ? 
        ((estudiantesConRespuestas / totalEstudiantes) * 100).toFixed(1) : 0;

      console.log(`📚 Grupo ${grupo.nombre} (${grupo.grado}):`);
      console.log(`   - Total estudiantes: ${totalEstudiantes}`);
      console.log(`   - Con respuestas: ${estudiantesConRespuestas}`);
      console.log(`   - Participación: ${porcentajeParticipacion}%`);
    });

    // 4. Análisis de respuestas por pregunta
    console.log('\n4️⃣ Distribución de respuestas por pregunta:');
    const { data: respuestasPorPregunta } = await supabase
      .from('respuestas')
      .select(`
        pregunta_id,
        preguntas(orden, texto)
      `);

    // Agrupar respuestas por pregunta
    const distribucion = {};
    respuestasPorPregunta?.forEach(resp => {
      const preguntaId = resp.pregunta_id;
      if (!distribucion[preguntaId]) {
        distribucion[preguntaId] = {
          orden: resp.preguntas?.orden || 0,
          texto: resp.preguntas?.texto || 'Sin texto',
          count: 0
        };
      }
      distribucion[preguntaId].count++;
    });

    // Mostrar las 5 preguntas con más respuestas
    const topPreguntas = Object.values(distribucion)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    topPreguntas.forEach(pregunta => {
      console.log(`❓ Pregunta ${pregunta.orden}: ${pregunta.count} respuestas`);
      console.log(`   "${pregunta.texto.substring(0, 60)}..."`);
    });

    // 5. Estudiantes más activos
    console.log('\n5️⃣ Estudiantes más activos:');
    const { data: estudiantesActivos } = await supabase
      .from('estudiantes')
      .select(`
        id,
        nombre_estudiante,
        apellido_estudiante,
        grado,
        respuestas(id)
      `);

    const estudiantesConConteo = estudiantesActivos
      ?.map(est => ({
        nombre: `${est.nombre_estudiante} ${est.apellido_estudiante}`,
        grado: est.grado,
        respuestas: est.respuestas?.length || 0
      }))
      .filter(est => est.respuestas > 0)
      .sort((a, b) => b.respuestas - a.respuestas)
      .slice(0, 5);

    estudiantesConConteo?.forEach((est, index) => {
      console.log(`🏆 ${index + 1}. ${est.nombre} (${est.grado}): ${est.respuestas} respuestas`);
    });

    // 6. Métricas para el dashboard
    console.log('\n6️⃣ Métricas clave para el dashboard:');
    
    const totalEstudiantesConRespuestas = estudiantesActivos?.filter(est => 
      est.respuestas && est.respuestas.length > 0
    ).length || 0;

    const porcentajeParticipacionGeneral = totalEstudiantes > 0 ? 
      ((totalEstudiantesConRespuestas / totalEstudiantes) * 100).toFixed(1) : 0;

    const promedioRespuestasPorEstudiante = totalEstudiantesConRespuestas > 0 ?
      (totalRespuestas / totalEstudiantesConRespuestas).toFixed(1) : 0;

    console.log(`📈 Participación general: ${porcentajeParticipacionGeneral}%`);
    console.log(`📊 Estudiantes activos: ${totalEstudiantesConRespuestas}/${totalEstudiantes}`);
    console.log(`📝 Promedio respuestas por estudiante: ${promedioRespuestasPorEstudiante}`);
    console.log(`🎯 Completitud del cuestionario: ${((totalRespuestas / (totalEstudiantes * totalPreguntas)) * 100).toFixed(1)}%`);

    // 7. Datos estructurados para el dashboard
    console.log('\n7️⃣ Estructura de datos para el dashboard:');
    
    const dashboardData = {
      resumen: {
        totalInstituciones: totalInstituciones || 0,
        totalGrupos: totalGrupos || 0,
        totalEstudiantes: totalEstudiantes || 0,
        totalRespuestas: totalRespuestas || 0,
        estudiantesActivos: totalEstudiantesConRespuestas,
        porcentajeParticipacion: parseFloat(porcentajeParticipacionGeneral)
      },
      participacionPorGrupo: participacionGrupos?.map(grupo => ({
        grupo: grupo.nombre,
        grado: grupo.grado,
        totalEstudiantes: grupo.estudiantes?.length || 0,
        estudiantesActivos: grupo.estudiantes?.filter(est => 
          est.respuestas && est.respuestas.length > 0
        ).length || 0
      })),
      topEstudiantes: estudiantesConConteo?.slice(0, 3),
      distribucionRespuestas: topPreguntas.slice(0, 3)
    };

    console.log('Datos estructurados:', JSON.stringify(dashboardData, null, 2));

    console.log('\n✅ Verificación completada - Datos listos para el dashboard');

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

verificarDatosDashboard();