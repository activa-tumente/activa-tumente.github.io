import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://eckuozleqbbcecaycmjt.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVja3VvemxlcWJiY2VjYXljbWp0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM3MjAwNjEsImV4cCI6MjA1OTI5NjA2MX0.S6KFjF2HYIArDSGeSu_iMXjgtaHivPPJdwRs60xB9_U'
);

async function verificarSistemaCompleto() {
  try {
    console.log('🔍 VERIFICACIÓN COMPLETA DEL SISTEMA BULL-S');
    console.log('='.repeat(50));

    // 1. Verificar estructura de datos básica
    console.log('\n📊 ESTRUCTURA DE DATOS:');
    
    const [
      { count: instituciones },
      { count: grupos },
      { count: estudiantes },
      { count: preguntas },
      { count: respuestas }
    ] = await Promise.all([
      supabase.from('instituciones_educativas').select('*', { count: 'exact', head: true }),
      supabase.from('grupos').select('*', { count: 'exact', head: true }),
      supabase.from('estudiantes').select('*', { count: 'exact', head: true }),
      supabase.from('preguntas').select('*', { count: 'exact', head: true }),
      supabase.from('respuestas').select('*', { count: 'exact', head: true })
    ]);

    console.table({
      instituciones: instituciones || 0,
      grupos: grupos || 0,
      estudiantes: estudiantes || 0,
      preguntas: preguntas || 0,
      respuestas: respuestas || 0
    });

    // 2. Verificar distribución por grados
    console.log('\n👥 DISTRIBUCIÓN DE ESTUDIANTES POR GRADO:');
    const { data: distribucion } = await supabase
      .from('estudiantes')
      .select('grado')
      .then(({ data }) => {
        if (data) {
          const agrupado = data.reduce((acc, est) => {
            acc[est.grado] = (acc[est.grado] || 0) + 1;
            return acc;
          }, {});
          return { data: Object.entries(agrupado).map(([grado, cantidad]) => ({ grado, cantidad })) };
        }
        return { data: [] };
      });

    if (distribucion && distribucion.length > 0) {
      console.table(distribucion);
    }

    // 3. Verificar participación por grupo
    console.log('\n📝 PARTICIPACIÓN POR GRUPO:');
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

    const participacion = participacionGrupos?.map(grupo => {
      const totalEstudiantes = grupo.estudiantes?.length || 0;
      const estudiantesActivos = grupo.estudiantes?.filter(est => 
        est.respuestas && est.respuestas.length > 0
      ).length || 0;
      const porcentaje = totalEstudiantes > 0 ? 
        Math.round((estudiantesActivos / totalEstudiantes) * 100) : 0;

      return {
        grupo: grupo.nombre,
        grado: grupo.grado,
        totalEstudiantes,
        estudiantesActivos,
        porcentajeParticipacion: porcentaje
      };
    }) || [];

    console.table(participacion);

    // 4. Verificar datos para roles de bullying
    console.log('\n🎯 ANÁLISIS DE ROLES DE BULLYING:');
    
    // Obtener respuestas de preguntas de bullying
    const { data: respuestasBullying } = await supabase
      .from('respuestas')
      .select(`
        respuesta_texto,
        pregunta_id,
        preguntas(orden, texto)
      `)
      .in('pregunta_id', [
        'd2888d67-9878-4cdf-8a58-592c251c1cb6', // Pregunta 4: víctimas
        'dae67e87-db3e-4637-ace1-f1148f1d7d69'  // Pregunta 3: agresores
      ]);

    let agresores = 0;
    let victimas = 0;

    respuestasBullying?.forEach(respuesta => {
      try {
        const respuestaData = JSON.parse(respuesta.respuesta_texto);
        if (Array.isArray(respuestaData) && respuestaData.length > 0) {
          if (respuesta.preguntas?.orden === 3) {
            agresores += respuestaData.length;
          } else if (respuesta.preguntas?.orden === 4) {
            victimas += respuestaData.length;
          }
        }
      } catch (e) {
        // Ignorar respuestas no válidas
      }
    });

    const observadores = Math.max(0, (estudiantes || 0) - agresores - victimas);

    console.log('Roles identificados:');
    console.table({
      'Agresores': agresores,
      'Víctimas': victimas,
      'Observadores': observadores,
      'Total estudiantes': estudiantes || 0
    });

    // 5. Verificar datos sociométricos
    console.log('\n📈 ANÁLISIS SOCIOMÉTRICO:');
    
    const { data: respuestasSociometricas } = await supabase
      .from('respuestas')
      .select(`
        respuesta_texto,
        pregunta_id,
        estudiante_id,
        preguntas(orden, texto)
      `)
      .in('pregunta_id', [
        'd90ddd09-3878-4efc-9059-7279570157bc', // Pregunta 1: con quién te gusta estar más
        '47b56067-0c8c-4565-b645-80348852907f'  // Pregunta 2: con quién te gusta estar menos
      ]);

    const nominaciones = {};
    
    respuestasSociometricas?.forEach(respuesta => {
      try {
        const respuestaData = JSON.parse(respuesta.respuesta_texto);
        if (Array.isArray(respuestaData)) {
          respuestaData.forEach(estudianteId => {
            if (!nominaciones[estudianteId]) {
              nominaciones[estudianteId] = { positivas: 0, negativas: 0 };
            }
            
            if (respuesta.preguntas?.orden === 1) {
              nominaciones[estudianteId].positivas++;
            } else if (respuesta.preguntas?.orden === 2) {
              nominaciones[estudianteId].negativas++;
            }
          });
        }
      } catch (e) {
        // Ignorar respuestas no válidas
      }
    });

    let populares = 0;
    let aislados = 0;
    let rechazados = 0;
    let controvertidos = 0;
    let promedio = 0;

    Object.values(nominaciones).forEach((nom) => {
      const { positivas, negativas } = nom;
      
      if (positivas >= 3 && negativas <= 1) {
        populares++;
      } else if (positivas <= 1 && negativas <= 1) {
        aislados++;
      } else if (positivas <= 1 && negativas >= 3) {
        rechazados++;
      } else if (positivas >= 3 && negativas >= 3) {
        controvertidos++;
      } else {
        promedio++;
      }
    });

    console.log('Estatus sociométrico:');
    console.table({
      'Populares': populares,
      'Promedio': promedio,
      'Aislados': aislados,
      'Rechazados': rechazados,
      'Controvertidos': controvertidos
    });

    // 6. Verificar estudiantes más activos
    console.log('\n🏆 ESTUDIANTES MÁS ACTIVOS:');
    
    const { data: estudiantesActivos } = await supabase
      .from('estudiantes')
      .select(`
        id,
        nombre_estudiante,
        apellido_estudiante,
        grado,
        respuestas(id)
      `);

    const topEstudiantes = estudiantesActivos
      ?.map(est => ({
        nombre: `${est.nombre_estudiante} ${est.apellido_estudiante}`,
        grado: est.grado,
        respuestas: est.respuestas?.length || 0
      }))
      .filter(est => est.respuestas > 0)
      .sort((a, b) => b.respuestas - a.respuestas)
      .slice(0, 5);

    if (topEstudiantes && topEstudiantes.length > 0) {
      console.table(topEstudiantes);
    } else {
      console.log('No hay estudiantes con respuestas registradas');
    }

    // 7. Resumen para el dashboard
    console.log('\n🎯 RESUMEN PARA EL DASHBOARD:');
    
    const totalEstudiantesConRespuestas = estudiantesActivos?.filter(est => 
      est.respuestas && est.respuestas.length > 0
    ).length || 0;

    const porcentajeParticipacionGeneral = estudiantes > 0 ? 
      ((totalEstudiantesConRespuestas / estudiantes) * 100).toFixed(1) : 0;

    const dashboardData = {
      resumen: {
        totalInstituciones: instituciones || 0,
        totalGrupos: grupos || 0,
        totalEstudiantes: estudiantes || 0,
        totalRespuestas: respuestas || 0,
        estudiantesActivos: totalEstudiantesConRespuestas,
        porcentajeParticipacion: parseFloat(porcentajeParticipacionGeneral)
      },
      participacionPorGrupo: participacion,
      rolesBullying: {
        agresores: Math.round((agresores / (estudiantes || 1)) * 100),
        victimas: Math.round((victimas / (estudiantes || 1)) * 100),
        observadores: Math.round((observadores / (estudiantes || 1)) * 100)
      },
      estatusSociometrico: {
        populares: Math.round((populares / Math.max(Object.keys(nominaciones).length, 1)) * 100),
        promedio: Math.round((promedio / Math.max(Object.keys(nominaciones).length, 1)) * 100),
        aislados: Math.round((aislados / Math.max(Object.keys(nominaciones).length, 1)) * 100),
        rechazados: Math.round((rechazados / Math.max(Object.keys(nominaciones).length, 1)) * 100),
        controvertidos: Math.round((controvertidos / Math.max(Object.keys(nominaciones).length, 1)) * 100)
      },
      topEstudiantes: topEstudiantes?.slice(0, 3) || []
    };

    console.log('\nDatos estructurados para el dashboard:');
    console.log(JSON.stringify(dashboardData, null, 2));

    console.log('\n' + '='.repeat(50));
    console.log('✅ VERIFICACIÓN COMPLETADA');
    console.log('\n📋 ESTADO DEL SISTEMA:');
    console.log(`✅ Datos disponibles: ${instituciones} instituciones, ${grupos} grupos, ${estudiantes} estudiantes`);
    console.log(`✅ Respuestas registradas: ${respuestas} respuestas de ${totalEstudiantesConRespuestas} estudiantes`);
    console.log(`✅ Participación general: ${porcentajeParticipacionGeneral}%`);
    console.log(`✅ Dashboard listo con datos reales de Supabase`);

  } catch (error) {
    console.error('❌ Error en la verificación:', error);
    process.exit(1);
  }
}

// Ejecutar la verificación
verificarSistemaCompleto()
  .then(() => {
    console.log('\n🎉 Sistema verificado exitosamente');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Error ejecutando verificación:', error);
    process.exit(1);
  });