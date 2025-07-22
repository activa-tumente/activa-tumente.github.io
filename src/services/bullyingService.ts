import { supabase } from '../lib/supabaseClient';

/**
 * Servicio para obtener y procesar datos relacionados con bullying
 */
export const bullyingService = {
  /**
   * Obtiene datos de distribución por roles para un grupo específico
   * @param groupId ID del grupo
   */
  async getRolesDistribution(groupId: string) {
    try {
      // Obtener respuestas del cuestionario relacionadas con roles de bullying
      const { data: respuestas, error } = await supabase
        .from('respuestas')
        .select(`
          estudiante_id,
          pregunta_id,
          valor
        `)
        .eq('grupo_id', groupId);

      if (error) throw error;

      // Obtener total de estudiantes en el grupo
      const { count: totalStudents, error: countError } = await supabase
        .from('estudiantes')
        .select('*', { count: 'exact', head: true })
        .eq('grupo_id', groupId);

      if (countError) throw countError;

      // Procesar datos para identificar roles
      // Esto es una simplificación - en un sistema real, la lógica sería más compleja
      // basada en algoritmos específicos para determinar roles
      
      // Contadores para cada rol
      let victims = 0;
      let bullies = 0;
      let bullyVictims = 0;
      
      // Mapeo de estudiantes a sus respuestas
      const studentResponses: Record<string, { victimScore: number, bullyScore: number }> = {};
      
      // Procesar respuestas
      respuestas?.forEach(respuesta => {
        // Inicializar si no existe
        if (!studentResponses[respuesta.estudiante_id]) {
          studentResponses[respuesta.estudiante_id] = { victimScore: 0, bullyScore: 0 };
        }
        
        // Preguntas 1-5 relacionadas con ser víctima (ejemplo)
        if (['00000000-0000-0000-0000-000000000001', 
             '00000000-0000-0000-0000-000000000002',
             '00000000-0000-0000-0000-000000000003',
             '00000000-0000-0000-0000-000000000004',
             '00000000-0000-0000-0000-000000000005'].includes(respuesta.pregunta_id)) {
          studentResponses[respuesta.estudiante_id].victimScore += parseInt(respuesta.valor);
        }
        
        // Preguntas 6-10 relacionadas con ser agresor (ejemplo)
        if (['00000000-0000-0000-0000-000000000006', 
             '00000000-0000-0000-0000-000000000007',
             '00000000-0000-0000-0000-000000000008',
             '00000000-0000-0000-0000-000000000009',
             '00000000-0000-0000-0000-000000000010'].includes(respuesta.pregunta_id)) {
          studentResponses[respuesta.estudiante_id].bullyScore += parseInt(respuesta.valor);
        }
      });
      
      // Clasificar estudiantes según sus puntuaciones
      Object.values(studentResponses).forEach(scores => {
        const highVictimScore = scores.victimScore > 7; // Umbral ejemplo
        const highBullyScore = scores.bullyScore > 7;  // Umbral ejemplo
        
        if (highVictimScore && highBullyScore) {
          bullyVictims++;
        } else if (highVictimScore) {
          victims++;
        } else if (highBullyScore) {
          bullies++;
        }
      });
      
      // Calcular observadores (resto de estudiantes)
      const observers = (totalStudents || 0) - victims - bullies - bullyVictims;
      
      return [
        { name: 'Víctimas', value: victims, color: '#FF6B6B' },
        { name: 'Agresores', value: bullies, color: '#FF9E40' },
        { name: 'Víctimas-Agresores', value: bullyVictims, color: '#9775FA' },
        { name: 'Observadores', value: observers, color: '#4DABF7' }
      ];
    } catch (error) {
      console.error('Error al obtener distribución por roles:', error);
      throw error;
    }
  },

  /**
   * Obtiene datos de tipos de agresión para un grupo específico
   * @param groupId ID del grupo
   */
  async getAggressionTypes(groupId: string) {
    try {
      // Obtener respuestas del cuestionario relacionadas con tipos de agresión
      const { data: respuestas, error } = await supabase
        .from('respuestas')
        .select(`
          pregunta_id,
          valor
        `)
        .eq('grupo_id', groupId);

      if (error) throw error;
      
      // Contadores para cada tipo de agresión
      let physical = 0;
      let verbal = 0;
      let social = 0;
      let cyber = 0;
      let total = 0;
      
      // Procesar respuestas
      respuestas?.forEach(respuesta => {
        const value = parseInt(respuesta.valor);
        
        // Preguntas relacionadas con agresión física (ejemplo)
        if (['00000000-0000-0000-0000-000000000011', 
             '00000000-0000-0000-0000-000000000012'].includes(respuesta.pregunta_id)) {
          physical += value;
          total += value;
        }
        
        // Preguntas relacionadas con agresión verbal (ejemplo)
        if (['00000000-0000-0000-0000-000000000013', 
             '00000000-0000-0000-0000-000000000014'].includes(respuesta.pregunta_id)) {
          verbal += value;
          total += value;
        }
        
        // Preguntas relacionadas con agresión social (ejemplo)
        if (['00000000-0000-0000-0000-000000000015', 
             '00000000-0000-0000-0000-000000000016'].includes(respuesta.pregunta_id)) {
          social += value;
          total += value;
        }
        
        // Preguntas relacionadas con ciberacoso (ejemplo)
        if (['00000000-0000-0000-0000-000000000017', 
             '00000000-0000-0000-0000-000000000018'].includes(respuesta.pregunta_id)) {
          cyber += value;
          total += value;
        }
      });
      
      // Calcular porcentajes
      const calculatePercentage = (value: number) => 
        total > 0 ? Math.round((value / total) * 100) : 0;
      
      return [
        { name: 'Físico', value: calculatePercentage(physical), color: '#FF8042' },
        { name: 'Verbal', value: calculatePercentage(verbal), color: '#0088FE' },
        { name: 'Social', value: calculatePercentage(social), color: '#FFBB28' },
        { name: 'Cibernético', value: calculatePercentage(cyber), color: '#00C49F' }
      ];
    } catch (error) {
      console.error('Error al obtener tipos de agresión:', error);
      throw error;
    }
  },

  /**
   * Obtiene datos históricos para comparativas temporales
   * @param groupId ID del grupo
   */
  async getHistoricalData(groupId: string) {
    try {
      // En un sistema real, esto obtendría datos de diferentes períodos
      // Para este ejemplo, generamos datos simulados
      
      // Obtener fecha actual
      const currentDate = new Date();
      
      // Generar fechas para los últimos 6 meses
      const months = [];
      for (let i = 5; i >= 0; i--) {
        const date = new Date(currentDate);
        date.setMonth(currentDate.getMonth() - i);
        months.push(date.toLocaleString('default', { month: 'short', year: 'numeric' }));
      }
      
      // Generar datos simulados con tendencia a la baja para bullying
      // y tendencia variable para victimización
      return {
        months,
        bullyingIndex: [0.42, 0.39, 0.35, 0.33, 0.30, 0.28],
        victimizationIndex: [0.38, 0.36, 0.37, 0.34, 0.35, 0.32]
      };
    } catch (error) {
      console.error('Error al obtener datos históricos:', error);
      throw error;
    }
  },

  /**
   * Obtiene datos de sociograma para un grupo específico
   * @param groupId ID del grupo
   */
  async getSociogramData(groupId: string) {
    try {
      // Obtener estudiantes del grupo
      const { data: estudiantes, error: estudiantesError } = await supabase
        .from('estudiantes')
        .select(`
          id,
          nombre_estudiante,
          apellido_estudiante
        `)
        .eq('grupo_id', groupId);

      if (estudiantesError) throw estudiantesError;
      
      // Obtener nominaciones (respuestas a preguntas sociométricas)
      const { data: nominaciones, error: nominacionesError } = await supabase
        .from('respuestas')
        .select(`
          estudiante_id,
          pregunta_id,
          valor
        `)
        .eq('grupo_id', groupId)
        .in('pregunta_id', [
          '00000000-0000-0000-0000-000000000019', // Pregunta de afinidad (ejemplo)
          '00000000-0000-0000-0000-000000000020'  // Pregunta de rechazo (ejemplo)
        ]);

      if (nominacionesError) throw nominacionesError;
      
      // Procesar datos para el sociograma
      // Esto es una simplificación - en un sistema real, la lógica sería más compleja
      
      // Mapeo de estudiantes
      const studentMap: Record<string, {
        connections: number,
        rejections: number,
        role: 'victim' | 'bully' | 'bully-victim' | 'observer'
      }> = {};
      
      // Inicializar mapa de estudiantes
      estudiantes?.forEach(estudiante => {
        studentMap[estudiante.id] = {
          connections: 0,
          rejections: 0,
          role: 'observer' // Rol por defecto
        };
      });
      
      // Procesar nominaciones
      nominaciones?.forEach(nominacion => {
        if (nominacion.pregunta_id === '00000000-0000-0000-0000-000000000019') {
          // Pregunta de afinidad
          if (studentMap[nominacion.valor]) {
            studentMap[nominacion.valor].connections++;
          }
        } else if (nominacion.pregunta_id === '00000000-0000-0000-0000-000000000020') {
          // Pregunta de rechazo
          if (studentMap[nominacion.valor]) {
            studentMap[nominacion.valor].rejections++;
          }
        }
      });
      
      // Determinar roles basados en conexiones y rechazos
      Object.keys(studentMap).forEach(studentId => {
        const student = studentMap[studentId];
        
        if (student.rejections > 5 && student.connections < 2) {
          student.role = 'victim';
        } else if (student.rejections > 5 && student.connections > 3) {
          student.role = 'bully';
        } else if (student.rejections > 3 && student.connections < 3) {
          student.role = 'bully-victim';
        }
      });
      
      // Crear nodos para el sociograma
      const nodes = estudiantes?.map(estudiante => ({
        id: estudiante.id,
        name: `${estudiante.nombre_estudiante} ${estudiante.apellido_estudiante}`,
        role: studentMap[estudiante.id].role,
        connections: studentMap[estudiante.id].connections,
        rejections: studentMap[estudiante.id].rejections
      })) || [];
      
      // Crear conexiones para el sociograma
      const connections: Array<{
        source: string,
        target: string,
        type: 'positive' | 'negative',
        strength: number
      }> = [];
      
      nominaciones?.forEach(nominacion => {
        if (nominacion.pregunta_id === '00000000-0000-0000-0000-000000000019') {
          // Conexión positiva (afinidad)
          connections.push({
            source: nominacion.estudiante_id,
            target: nominacion.valor,
            type: 'positive',
            strength: 2
          });
        } else if (nominacion.pregunta_id === '00000000-0000-0000-0000-000000000020') {
          // Conexión negativa (rechazo)
          connections.push({
            source: nominacion.estudiante_id,
            target: nominacion.valor,
            type: 'negative',
            strength: 2
          });
        }
      });
      
      return { nodes, connections };
    } catch (error) {
      console.error('Error al obtener datos del sociograma:', error);
      throw error;
    }
  },

  /**
   * Obtiene datos para el análisis individual de estudiantes
   * @param groupId ID del grupo
   */
  async getIndividualAnalysisData(groupId: string) {
    try {
      // Obtener estudiantes del grupo con sus datos
      const { data: estudiantes, error: estudiantesError } = await supabase
        .from('estudiantes')
        .select(`
          id,
          nombre_estudiante,
          apellido_estudiante,
          genero
        `)
        .eq('grupo_id', groupId);

      if (estudiantesError) throw estudiantesError;
      
      // Obtener respuestas para análisis
      const { data: respuestas, error: respuestasError } = await supabase
        .from('respuestas')
        .select(`
          estudiante_id,
          pregunta_id,
          valor
        `)
        .eq('grupo_id', groupId);

      if (respuestasError) throw respuestasError;
      
      // Procesar datos para análisis individual
      // Esto es una simplificación - en un sistema real, la lógica sería más compleja
      
      // Mapeo de estudiantes a sus puntuaciones
      const studentScores: Record<string, {
        victimScore: number,
        bullyScore: number,
        positiveConnections: number,
        negativeConnections: number
      }> = {};
      
      // Inicializar puntuaciones
      estudiantes?.forEach(estudiante => {
        studentScores[estudiante.id] = {
          victimScore: 0,
          bullyScore: 0,
          positiveConnections: 0,
          negativeConnections: 0
        };
      });
      
      // Procesar respuestas
      respuestas?.forEach(respuesta => {
        // Preguntas 1-5 relacionadas con ser víctima (ejemplo)
        if (['00000000-0000-0000-0000-000000000001', 
             '00000000-0000-0000-0000-000000000002',
             '00000000-0000-0000-0000-000000000003',
             '00000000-0000-0000-0000-000000000004',
             '00000000-0000-0000-0000-000000000005'].includes(respuesta.pregunta_id)) {
          if (studentScores[respuesta.estudiante_id]) {
            studentScores[respuesta.estudiante_id].victimScore += parseInt(respuesta.valor);
          }
        }
        
        // Preguntas 6-10 relacionadas con ser agresor (ejemplo)
        if (['00000000-0000-0000-0000-000000000006', 
             '00000000-0000-0000-0000-000000000007',
             '00000000-0000-0000-0000-000000000008',
             '00000000-0000-0000-0000-000000000009',
             '00000000-0000-0000-0000-000000000010'].includes(respuesta.pregunta_id)) {
          if (studentScores[respuesta.estudiante_id]) {
            studentScores[respuesta.estudiante_id].bullyScore += parseInt(respuesta.valor);
          }
        }
        
        // Pregunta de afinidad (ejemplo)
        if (respuesta.pregunta_id === '00000000-0000-0000-0000-000000000019') {
          if (studentScores[respuesta.valor]) {
            studentScores[respuesta.valor].positiveConnections++;
          }
        }
        
        // Pregunta de rechazo (ejemplo)
        if (respuesta.pregunta_id === '00000000-0000-0000-0000-000000000020') {
          if (studentScores[respuesta.valor]) {
            studentScores[respuesta.valor].negativeConnections++;
          }
        }
      });
      
      // Crear datos de estudiantes para análisis individual
      const students = estudiantes?.map(estudiante => {
        const scores = studentScores[estudiante.id];
        
        // Determinar rol
        let role: 'victim' | 'bully' | 'bully-victim' | 'observer' = 'observer';
        if (scores.victimScore > 7 && scores.bullyScore > 7) {
          role = 'bully-victim';
        } else if (scores.victimScore > 7) {
          role = 'victim';
        } else if (scores.bullyScore > 7) {
          role = 'bully';
        }
        
        // Determinar nivel de riesgo
        let riskLevel: 'high' | 'medium' | 'low' = 'low';
        if (role === 'bully-victim' || (role === 'victim' && scores.negativeConnections > 5)) {
          riskLevel = 'high';
        } else if (role === 'victim' || role === 'bully') {
          riskLevel = 'medium';
        }
        
        // Determinar estatus social
        let socialStatus: 'popular' | 'average' | 'rejected' | 'isolated' = 'average';
        if (scores.positiveConnections > 5) {
          socialStatus = 'popular';
        } else if (scores.negativeConnections > 5) {
          socialStatus = 'rejected';
        } else if (scores.positiveConnections < 2 && scores.negativeConnections < 2) {
          socialStatus = 'isolated';
        }
        
        // Generar observaciones y recomendaciones basadas en el perfil
        let observations = '';
        let recommendedActions: string[] = [];
        
        if (role === 'victim') {
          observations = `${estudiante.nombre_estudiante} muestra indicadores de victimización. `;
          if (socialStatus === 'rejected') {
            observations += 'Presenta un patrón de rechazo por parte de sus compañeros. ';
          } else if (socialStatus === 'isolated') {
            observations += 'Se encuentra socialmente aislado/a del grupo. ';
          }
          
          recommendedActions = [
            'Proporcionar apoyo psicológico individual',
            'Fortalecer su red de apoyo dentro del grupo',
            'Desarrollar habilidades de asertividad y autoestima'
          ];
        } else if (role === 'bully') {
          observations = `${estudiante.nombre_estudiante} muestra comportamientos agresivos hacia algunos compañeros. `;
          if (socialStatus === 'popular') {
            observations += 'Tiene influencia social que podría redirigirse positivamente. ';
          }
          
          recommendedActions = [
            'Intervención individual con enfoque en empatía',
            'Establecer consecuencias claras para comportamientos agresivos',
            'Involucrar a la familia en el proceso de intervención'
          ];
        } else if (role === 'bully-victim') {
          observations = `${estudiante.nombre_estudiante} presenta un perfil complejo, siendo tanto víctima como agresor/a. `;
          observations += 'Requiere atención especial por su mayor vulnerabilidad. ';
          
          recommendedActions = [
            'Apoyo psicológico especializado',
            'Desarrollar habilidades de regulación emocional',
            'Seguimiento cercano de su evolución'
          ];
        } else {
          observations = `${estudiante.nombre_estudiante} no presenta indicadores de bullying significativos. `;
          if (socialStatus === 'popular') {
            observations += 'Podría ser un/a líder positivo/a para intervenciones grupales. ';
            
            recommendedActions = [
              'Potenciar su rol como líder positivo',
              'Involucrarle en iniciativas de prevención del bullying'
            ];
          } else {
            recommendedActions = [
              'Sensibilizar sobre la importancia de no ser observador pasivo',
              'Desarrollar habilidades para intervenir de manera segura'
            ];
          }
        }
        
        return {
          id: estudiante.id,
          name: `${estudiante.nombre_estudiante} ${estudiante.apellido_estudiante}`,
          role,
          riskLevel,
          socialStatus,
          positiveConnections: scores.positiveConnections,
          negativeConnections: scores.negativeConnections,
          observations,
          recommendedActions
        };
      }) || [];
      
      return { students };
    } catch (error) {
      console.error('Error al obtener datos de análisis individual:', error);
      throw error;
    }
  }
};

export default bullyingService;
