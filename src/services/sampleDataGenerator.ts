/**
 * Generador de datos de muestra para análisis sociométrico BULL-S
 * Basado en casos reales del Colegio La SALLE - Grupos 6A y 6B
 */

import {
  EstudianteResponse,
  RespuestaSociometrica
} from '../types/sociometric';

export class SampleDataGenerator {
  
  /**
   * Genera datos de muestra basados en estudiantes reales
   */
  static generateSampleData(grupoId: string = 'grupo_6ab'): {
    estudiantes: EstudianteResponse[];
    respuestas: RespuestaSociometrica[];
  } {
    
    const estudiantes = this.generateStudentData(grupoId);
    const respuestas = this.generateSociometricResponses(estudiantes);
    
    console.log(`📊 Datos de muestra generados:`);
    console.log(`👥 ${estudiantes.length} estudiantes`);
    console.log(`📝 ${respuestas.length} respuestas sociométricas`);
    
    return { estudiantes, respuestas };
  }

  /**
   * Genera datos de estudiantes basados en casos reales
   */
  private static generateStudentData(grupoId: string): EstudianteResponse[] {
    return [
      // Estudiantes con patrones identificados previamente
      {
        id: 'est_001',
        nombre: 'Raffaella Barrios',
        grupo_id: grupoId,
        numero_documento: '1001',
        edad: 11,
        genero: 'F'
      },
      {
        id: 'est_002',
        nombre: 'Paulina Bermúdez',
        grupo_id: grupoId,
        numero_documento: '1002',
        edad: 11,
        genero: 'F'
      },
      {
        id: 'est_003',
        nombre: 'Isabella León',
        grupo_id: grupoId,
        numero_documento: '1003',
        edad: 12,
        genero: 'F'
      },
      {
        id: 'est_004',
        nombre: 'María Paula Amaya',
        grupo_id: grupoId,
        numero_documento: '1004',
        edad: 11,
        genero: 'F'
      },
      {
        id: 'est_005',
        nombre: 'Santiago Rodríguez',
        grupo_id: grupoId,
        numero_documento: '1005',
        edad: 12,
        genero: 'M'
      },
      {
        id: 'est_006',
        nombre: 'Andrés Felipe García',
        grupo_id: grupoId,
        numero_documento: '1006',
        edad: 11,
        genero: 'M'
      },
      {
        id: 'est_007',
        nombre: 'Valentina Morales',
        grupo_id: grupoId,
        numero_documento: '1007',
        edad: 11,
        genero: 'F'
      },
      {
        id: 'est_008',
        nombre: 'Diego Alejandro Ruiz',
        grupo_id: grupoId,
        numero_documento: '1008',
        edad: 12,
        genero: 'M'
      },
      {
        id: 'est_009',
        nombre: 'Sofía Martínez',
        grupo_id: grupoId,
        numero_documento: '1009',
        edad: 11,
        genero: 'F'
      },
      {
        id: 'est_010',
        nombre: 'Juan Pablo Herrera',
        grupo_id: grupoId,
        numero_documento: '1010',
        edad: 12,
        genero: 'M'
      },
      {
        id: 'est_011',
        nombre: 'Camila Andrea López',
        grupo_id: grupoId,
        numero_documento: '1011',
        edad: 11,
        genero: 'F'
      },
      {
        id: 'est_012',
        nombre: 'Mateo Sánchez',
        grupo_id: grupoId,
        numero_documento: '1012',
        edad: 11,
        genero: 'M'
      },
      {
        id: 'est_013',
        nombre: 'Ana Lucía Torres',
        grupo_id: grupoId,
        numero_documento: '1013',
        edad: 12,
        genero: 'F'
      },
      {
        id: 'est_014',
        nombre: 'Carlos Eduardo Jiménez',
        grupo_id: grupoId,
        numero_documento: '1014',
        edad: 11,
        genero: 'M'
      },
      {
        id: 'est_015',
        nombre: 'Mariana Castillo',
        grupo_id: grupoId,
        numero_documento: '1015',
        edad: 11,
        genero: 'F'
      },
      {
        id: 'est_016',
        nombre: 'Sebastián Vargas',
        grupo_id: grupoId,
        numero_documento: '1016',
        edad: 12,
        genero: 'M'
      },
      {
        id: 'est_017',
        nombre: 'Gabriela Ramírez',
        grupo_id: grupoId,
        numero_documento: '1017',
        edad: 11,
        genero: 'F'
      },
      {
        id: 'est_018',
        nombre: 'Nicolás Peña',
        grupo_id: grupoId,
        numero_documento: '1018',
        edad: 11,
        genero: 'M'
      },
      {
        id: 'est_019',
        nombre: 'Laura Daniela Cruz',
        grupo_id: grupoId,
        numero_documento: '1019',
        edad: 12,
        genero: 'F'
      },
      {
        id: 'est_020',
        nombre: 'Alejandro Mendoza',
        grupo_id: grupoId,
        numero_documento: '1020',
        edad: 11,
        genero: 'M'
      }
    ];
  }

  /**
   * Genera respuestas sociométricas realistas basadas en patrones conocidos
   */
  private static generateSociometricResponses(estudiantes: EstudianteResponse[]): RespuestaSociometrica[] {
    const respuestas: RespuestaSociometrica[] = [];
    const timestamp = new Date().toISOString();

    // Patrones específicos basados en análisis previo
    const patrones = {
      // Raffaella Barrios - Estudiante popular, líder positivo
      'est_001': {
        elecciones_emitidas: ['est_007', 'est_009', 'est_011'], // Elige a otras niñas populares
        rechazos_emitidos: ['est_003'], // Rechaza a Isabella (agresora)
        agresiones_emitidas: [], // No es agresiva
        victimizacion_reportada: []
      },
      
      // Paulina Bermúdez - Víctima vulnerable, alto rechazo
      'est_002': {
        elecciones_emitidas: ['est_001'], // Solo elige a Raffaella
        rechazos_emitidos: ['est_003', 'est_008'], // Rechaza a agresores
        agresiones_emitidas: [],
        victimizacion_reportada: ['est_003', 'est_008', 'est_016'] // Reporta múltiples agresores
      },
      
      // Isabella León - Agresora identificada, controvertida
      'est_003': {
        elecciones_emitidas: ['est_016', 'est_008'], // Elige a otros agresores
        rechazos_emitidos: ['est_002', 'est_004'], // Rechaza a víctimas
        agresiones_emitidas: ['est_002', 'est_004', 'est_012'], // Agrede a múltiples estudiantes
        victimizacion_reportada: []
      },
      
      // María Paula Amaya - Estudiante aislado, riesgo medio
      'est_004': {
        elecciones_emitidas: ['est_001'], // Solo una elección
        rechazos_emitidos: ['est_003'],
        agresiones_emitidas: [],
        victimizacion_reportada: ['est_003'] // Víctima de Isabella
      },
      
      // Santiago Rodríguez - Líder masculino positivo
      'est_005': {
        elecciones_emitidas: ['est_006', 'est_010', 'est_012'],
        rechazos_emitidos: ['est_008'],
        agresiones_emitidas: [],
        victimizacion_reportada: []
      },
      
      // Andrés Felipe García - Estudiante promedio
      'est_006': {
        elecciones_emitidas: ['est_005', 'est_010'],
        rechazos_emitidos: ['est_016'],
        agresiones_emitidas: [],
        victimizacion_reportada: []
      },
      
      // Valentina Morales - Popular entre niñas
      'est_007': {
        elecciones_emitidas: ['est_001', 'est_009', 'est_011'],
        rechazos_emitidos: ['est_003'],
        agresiones_emitidas: [],
        victimizacion_reportada: []
      },
      
      // Diego Alejandro Ruiz - Agresor secundario
      'est_008': {
        elecciones_emitidas: ['est_003', 'est_016'], // Elige a otros agresores
        rechazos_emitidos: ['est_002', 'est_004'],
        agresiones_emitidas: ['est_002', 'est_012'], // Agrede a víctimas
        victimizacion_reportada: []
      },
      
      // Sofía Martínez - Estudiante popular
      'est_009': {
        elecciones_emitidas: ['est_001', 'est_007', 'est_011'],
        rechazos_emitidos: ['est_008'],
        agresiones_emitidas: [],
        victimizacion_reportada: []
      },
      
      // Juan Pablo Herrera - Líder masculino
      'est_010': {
        elecciones_emitidas: ['est_005', 'est_006', 'est_014'],
        rechazos_emitidos: ['est_016'],
        agresiones_emitidas: [],
        victimizacion_reportada: []
      }
    };

    // Generar respuestas para estudiantes con patrones definidos
    Object.entries(patrones).forEach(([estudianteId, patron]) => {
      // Elecciones positivas
      patron.elecciones_emitidas.forEach((destinoId, index) => {
        respuestas.push({
          estudiante_id: estudianteId,
          pregunta_id: 'p_eleccion_1',
          respuesta: destinoId,
          tipo_respuesta: 'eleccion',
          timestamp
        });
      });

      // Rechazos
      patron.rechazos_emitidos.forEach((destinoId, index) => {
        respuestas.push({
          estudiante_id: estudianteId,
          pregunta_id: 'p_rechazo_1',
          respuesta: destinoId,
          tipo_respuesta: 'rechazo',
          timestamp
        });
      });

      // Agresiones emitidas
      patron.agresiones_emitidas.forEach((destinoId, index) => {
        respuestas.push({
          estudiante_id: estudianteId,
          pregunta_id: 'p_agresion_1',
          respuesta: destinoId,
          tipo_respuesta: 'agresion',
          timestamp
        });
      });

      // Victimización reportada
      patron.victimizacion_reportada.forEach((origenId, index) => {
        respuestas.push({
          estudiante_id: estudianteId,
          pregunta_id: 'p_victimizacion_1',
          respuesta: origenId,
          tipo_respuesta: 'victimizacion',
          timestamp
        });
      });
    });

    // Generar respuestas para estudiantes restantes (patrones aleatorios pero realistas)
    const estudiantesRestantes = estudiantes.filter(e => !patrones[e.id as keyof typeof patrones]);
    
    estudiantesRestantes.forEach(estudiante => {
      const otrosEstudiantes = estudiantes.filter(e => e.id !== estudiante.id);
      
      // Elecciones (2-3 por estudiante)
      const numElecciones = Math.floor(Math.random() * 2) + 2;
      const elegidos = this.selectRandomStudents(otrosEstudiantes, numElecciones);
      
      elegidos.forEach(elegido => {
        respuestas.push({
          estudiante_id: estudiante.id,
          pregunta_id: 'p_eleccion_1',
          respuesta: elegido.id,
          tipo_respuesta: 'eleccion',
          timestamp
        });
      });

      // Rechazos (0-2 por estudiante)
      const numRechazos = Math.floor(Math.random() * 3);
      if (numRechazos > 0) {
        const rechazados = this.selectRandomStudents(
          otrosEstudiantes.filter(e => !elegidos.includes(e)), 
          numRechazos
        );
        
        rechazados.forEach(rechazado => {
          respuestas.push({
            estudiante_id: estudiante.id,
            pregunta_id: 'p_rechazo_1',
            respuesta: rechazado.id,
            tipo_respuesta: 'rechazo',
            timestamp
          });
        });
      }

      // Agresiones (probabilidad baja para estudiantes normales)
      if (Math.random() < 0.2) { // 20% probabilidad
        const victima = this.selectRandomStudents(otrosEstudiantes, 1)[0];
        respuestas.push({
          estudiante_id: estudiante.id,
          pregunta_id: 'p_agresion_1',
          respuesta: victima.id,
          tipo_respuesta: 'agresion',
          timestamp
        });
      }

      // Victimización (probabilidad baja)
      if (Math.random() < 0.15) { // 15% probabilidad
        const agresor = this.selectRandomStudents(otrosEstudiantes, 1)[0];
        respuestas.push({
          estudiante_id: estudiante.id,
          pregunta_id: 'p_victimizacion_1',
          respuesta: agresor.id,
          tipo_respuesta: 'victimizacion',
          timestamp
        });
      }
    });

    // Agregar reciprocidad realista
    this.addReciprocalResponses(respuestas, estudiantes, timestamp);

    return respuestas;
  }

  /**
   * Selecciona estudiantes aleatorios
   */
  private static selectRandomStudents(estudiantes: EstudianteResponse[], count: number): EstudianteResponse[] {
    const shuffled = [...estudiantes].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(count, estudiantes.length));
  }

  /**
   * Agrega respuestas recíprocas para mayor realismo
   */
  private static addReciprocalResponses(
    respuestas: RespuestaSociometrica[],
    estudiantes: EstudianteResponse[],
    timestamp: string
  ): void {
    const elecciones = respuestas.filter(r => r.tipo_respuesta === 'eleccion');
    
    // Agregar reciprocidad en ~40% de las elecciones
    elecciones.forEach(eleccion => {
      if (Math.random() < 0.4) { // 40% probabilidad de reciprocidad
        const yaExisteReciproca = respuestas.some(r =>
          r.estudiante_id === eleccion.respuesta &&
          r.respuesta === eleccion.estudiante_id &&
          r.tipo_respuesta === 'eleccion'
        );

        if (!yaExisteReciproca) {
          respuestas.push({
            estudiante_id: eleccion.respuesta as string,
            pregunta_id: 'p_eleccion_1',
            respuesta: eleccion.estudiante_id,
            tipo_respuesta: 'eleccion',
            timestamp
          });
        }
      }
    });
  }

  /**
   * Genera datos específicos para casos de prueba
   */
  static generateTestCaseData(): {
    estudiantes: EstudianteResponse[];
    respuestas: RespuestaSociometrica[];
  } {
    const estudiantes: EstudianteResponse[] = [
      {
        id: 'test_001',
        nombre: 'Estudiante Popular',
        grupo_id: 'test_group',
        edad: 11,
        genero: 'F'
      },
      {
        id: 'test_002',
        nombre: 'Estudiante Víctima',
        grupo_id: 'test_group',
        edad: 11,
        genero: 'M'
      },
      {
        id: 'test_003',
        nombre: 'Estudiante Agresor',
        grupo_id: 'test_group',
        edad: 12,
        genero: 'M'
      },
      {
        id: 'test_004',
        nombre: 'Estudiante Aislado',
        grupo_id: 'test_group',
        edad: 11,
        genero: 'F'
      },
      {
        id: 'test_005',
        nombre: 'Estudiante Promedio',
        grupo_id: 'test_group',
        edad: 11,
        genero: 'M'
      }
    ];

    const respuestas: RespuestaSociometrica[] = [
      // Estudiante Popular recibe muchas elecciones
      { estudiante_id: 'test_002', pregunta_id: 'p1', respuesta: 'test_001', tipo_respuesta: 'eleccion', timestamp: new Date().toISOString() },
      { estudiante_id: 'test_005', pregunta_id: 'p1', respuesta: 'test_001', tipo_respuesta: 'eleccion', timestamp: new Date().toISOString() },
      
      // Estudiante Víctima recibe agresiones
      { estudiante_id: 'test_003', pregunta_id: 'p2', respuesta: 'test_002', tipo_respuesta: 'agresion', timestamp: new Date().toISOString() },
      { estudiante_id: 'test_002', pregunta_id: 'p3', respuesta: 'test_003', tipo_respuesta: 'victimizacion', timestamp: new Date().toISOString() },
      
      // Estudiante Agresor emite agresiones
      { estudiante_id: 'test_003', pregunta_id: 'p2', respuesta: 'test_002', tipo_respuesta: 'agresion', timestamp: new Date().toISOString() },
      { estudiante_id: 'test_003', pregunta_id: 'p2', respuesta: 'test_004', tipo_respuesta: 'agresion', timestamp: new Date().toISOString() },
      
      // Estudiante Aislado - pocas conexiones
      { estudiante_id: 'test_004', pregunta_id: 'p1', respuesta: 'test_001', tipo_respuesta: 'eleccion', timestamp: new Date().toISOString() },
      
      // Estudiante Promedio - conexiones normales
      { estudiante_id: 'test_005', pregunta_id: 'p1', respuesta: 'test_001', tipo_respuesta: 'eleccion', timestamp: new Date().toISOString() },
      { estudiante_id: 'test_001', pregunta_id: 'p1', respuesta: 'test_005', tipo_respuesta: 'eleccion', timestamp: new Date().toISOString() }
    ];

    return { estudiantes, respuestas };
  }

  /**
   * Genera datos con patrones específicos para testing
   */
  static generatePatternData(pattern: 'high_bullying' | 'isolated_group' | 'cohesive_group'): {
    estudiantes: EstudianteResponse[];
    respuestas: RespuestaSociometrica[];
  } {
    switch (pattern) {
      case 'high_bullying':
        return this.generateHighBullyingPattern();
      case 'isolated_group':
        return this.generateIsolatedGroupPattern();
      case 'cohesive_group':
        return this.generateCohesiveGroupPattern();
      default:
        return this.generateSampleData();
    }
  }

  private static generateHighBullyingPattern(): { estudiantes: EstudianteResponse[]; respuestas: RespuestaSociometrica[] } {
    // Implementar patrón de alto bullying
    return this.generateTestCaseData();
  }

  private static generateIsolatedGroupPattern(): { estudiantes: EstudianteResponse[]; respuestas: RespuestaSociometrica[] } {
    // Implementar patrón de grupo aislado
    return this.generateTestCaseData();
  }

  private static generateCohesiveGroupPattern(): { estudiantes: EstudianteResponse[]; respuestas: RespuestaSociometrica[] } {
    // Implementar patrón de grupo cohesivo
    return this.generateTestCaseData();
  }
}