/**
 * Procesador de datos sociométricos para evaluaciones BULL-S
 * Analiza respuestas de estudiantes y genera análisis completo de dinámicas sociales
 */

import {
  EstudianteResponse,
  RespuestaSociometrica,
  RelacionSocial,
  IndicesSociometricos,
  ClusterSocial,
  MetricasRed,
  AlertaSociometrica,
  SociogramData,
  SociogramNode,
  SociogramEdge,
  AnalisisSociometrico
} from '../types/sociometric';

export class SociometricDataProcessor {
  
  /**
   * Procesa datos brutos de evaluación BULL-S y genera análisis completo
   */
  static async processEvaluationData(
    estudiantes: EstudianteResponse[],
    respuestas: RespuestaSociometrica[],
    grupoId: string
  ): Promise<AnalisisSociometrico> {
    
    console.log(`🔄 Iniciando análisis sociométrico para grupo ${grupoId}`);
    console.log(`📊 Procesando ${estudiantes.length} estudiantes y ${respuestas.length} respuestas`);

    // 1. Construir matriz de relaciones sociales
    const relaciones = this.buildSocialRelations(estudiantes, respuestas);
    console.log(`🔗 Identificadas ${relaciones.length} relaciones sociales`);

    // 2. Calcular índices sociométricos individuales
    const indices = this.calculateSociometricIndices(estudiantes, relaciones);
    console.log(`📈 Calculados índices para ${indices.length} estudiantes`);

    // 3. Detectar clusters sociales
    const clusters = this.detectSocialClusters(estudiantes, relaciones);
    console.log(`👥 Identificados ${clusters.length} clusters sociales`);

    // 4. Calcular métricas de red
    const metricas = this.calculateNetworkMetrics(estudiantes, relaciones, clusters);
    console.log(`📊 Métricas de red calculadas - Densidad: ${metricas.densidad_general.toFixed(2)}%`);

    // 5. Generar alertas de riesgo
    const alertas = this.generateRiskAlerts(estudiantes, indices, clusters, relaciones);
    console.log(`🚨 Generadas ${alertas.length} alertas (${alertas.filter(a => a.severidad === 'critico').length} críticas)`);

    // 6. Crear datos para sociograma
    const sociograma = this.createSociogramData(estudiantes, relaciones, indices, clusters);
    console.log(`🎯 Sociograma creado con ${sociograma.nodes.length} nodos y ${sociograma.edges.length} conexiones`);

    // 7. Generar resumen ejecutivo
    const resumen = this.generateExecutiveSummary(estudiantes, indices, alertas);

    const analisis: AnalisisSociometrico = {
      grupo_id: grupoId,
      fecha_analisis: new Date().toISOString(),
      estudiantes,
      relaciones,
      indices_individuales: indices,
      clusters,
      metricas_red: metricas,
      alertas,
      sociograma,
      resumen_ejecutivo: resumen
    };

    console.log(`✅ Análisis sociométrico completado exitosamente`);
    return analisis;
  }

  /**
   * Construye relaciones sociales a partir de respuestas individuales
   */
  private static buildSocialRelations(
    estudiantes: EstudianteResponse[],
    respuestas: RespuestaSociometrica[]
  ): RelacionSocial[] {
    const relaciones: RelacionSocial[] = [];
    const relacionesMap = new Map<string, RelacionSocial>();

    // Procesar cada respuesta
    respuestas.forEach(respuesta => {
      if (typeof respuesta.respuesta === 'string' && respuesta.respuesta.includes(',')) {
        // Respuesta múltiple (ej: "est_1,est_3,est_5")
        const destinatarios = respuesta.respuesta.split(',').map(id => id.trim());
        
        destinatarios.forEach(destino_id => {
          if (destino_id && destino_id !== respuesta.estudiante_id) {
            const key = `${respuesta.estudiante_id}-${destino_id}-${respuesta.tipo_respuesta}`;
            
            if (!relacionesMap.has(key)) {
              relacionesMap.set(key, {
                origen_id: respuesta.estudiante_id,
                destino_id: destino_id,
                tipo: respuesta.tipo_respuesta,
                intensidad: 1,
                reciproca: false
              });
            } else {
              // Incrementar intensidad si ya existe
              relacionesMap.get(key)!.intensidad++;
            }
          }
        });
      } else if (typeof respuesta.respuesta === 'number' && respuesta.respuesta > 0) {
        // Respuesta numérica (escala de intensidad)
        const destino_id = this.findStudentByResponse(estudiantes, respuesta);
        if (destino_id && destino_id !== respuesta.estudiante_id) {
          const key = `${respuesta.estudiante_id}-${destino_id}-${respuesta.tipo_respuesta}`;
          
          relacionesMap.set(key, {
            origen_id: respuesta.estudiante_id,
            destino_id: destino_id,
            tipo: respuesta.tipo_respuesta,
            intensidad: respuesta.respuesta,
            reciproca: false
          });
        }
      }
    });

    // Convertir mapa a array y detectar reciprocidad
    relaciones.push(...relacionesMap.values());
    this.detectReciprocity(relaciones);

    return relaciones;
  }

  /**
   * Encuentra estudiante por respuesta (implementación simplificada)
   */
  private static findStudentByResponse(estudiantes: EstudianteResponse[], respuesta: RespuestaSociometrica): string | null {
    // Esta función debería implementar la lógica específica según el formato de respuestas
    // Por ahora, asumimos que la respuesta contiene directamente el ID del estudiante
    return null; // Placeholder
  }

  /**
   * Detecta reciprocidad en las relaciones
   */
  private static detectReciprocity(relaciones: RelacionSocial[]): void {
    const relacionesMap = new Map<string, RelacionSocial>();
    
    // Crear mapa para búsqueda rápida
    relaciones.forEach(rel => {
      const key = `${rel.origen_id}-${rel.destino_id}-${rel.tipo}`;
      relacionesMap.set(key, rel);
    });

    // Detectar reciprocidad
    relaciones.forEach(rel => {
      const reciprocaKey = `${rel.destino_id}-${rel.origen_id}-${rel.tipo}`;
      if (relacionesMap.has(reciprocaKey)) {
        rel.reciproca = true;
        relacionesMap.get(reciprocaKey)!.reciproca = true;
      }
    });
  }

  /**
   * Calcula índices sociométricos para cada estudiante
   */
  private static calculateSociometricIndices(
    estudiantes: EstudianteResponse[],
    relaciones: RelacionSocial[]
  ): IndicesSociometricos[] {
    return estudiantes.map(estudiante => {
      const id = estudiante.id;
      
      // Relaciones entrantes (recibidas)
      const relacionesEntrantes = relaciones.filter(r => r.destino_id === id);
      const eleccionesRecibidas = relacionesEntrantes.filter(r => r.tipo === 'eleccion');
      const rechazosRecibidos = relacionesEntrantes.filter(r => r.tipo === 'rechazo');
      const agresionesRecibidas = relacionesEntrantes.filter(r => r.tipo === 'agresion');

      // Relaciones salientes (emitidas)
      const relacionesSalientes = relaciones.filter(r => r.origen_id === id);
      const eleccionesEmitidas = relacionesSalientes.filter(r => r.tipo === 'eleccion');
      const rechazosEmitidos = relacionesSalientes.filter(r => r.tipo === 'rechazo');
      const agresionesEmitidas = relacionesSalientes.filter(r => r.tipo === 'agresion');

      // Cálculos básicos
      const totalEstudiantes = estudiantes.length - 1; // Excluir al propio estudiante
      const popularidad = (eleccionesRecibidas.length / totalEstudiantes) * 100;
      const rechazo = (rechazosRecibidos.length / totalEstudiantes) * 100;
      const aislamiento = this.calculateIsolationIndex(relacionesEntrantes, relacionesSalientes, totalEstudiantes);
      const centralidad = this.calculateCentralityIndex(relacionesEntrantes, relacionesSalientes, relaciones);
      const influencia = this.calculateInfluenceIndex(eleccionesRecibidas, agresionesEmitidas, totalEstudiantes);

      // Clasificaciones
      const estatus_social = this.classifySocialStatus(popularidad, rechazo, aislamiento);
      const rol_bullying = this.classifyBullyingRole(agresionesEmitidas, agresionesRecibidas, eleccionesRecibidas);
      const nivel_riesgo = this.assessRiskLevel(estatus_social, rol_bullying, rechazo, aislamiento);

      return {
        estudiante_id: id,
        popularidad: Math.round(popularidad * 100) / 100,
        rechazo: Math.round(rechazo * 100) / 100,
        aislamiento: Math.round(aislamiento * 100) / 100,
        centralidad: Math.round(centralidad * 100) / 100,
        influencia_social: Math.round(influencia * 100) / 100,
        estatus_social,
        rol_bullying,
        nivel_riesgo
      };
    });
  }

  /**
   * Calcula índice de aislamiento
   */
  private static calculateIsolationIndex(
    relacionesEntrantes: RelacionSocial[],
    relacionesSalientes: RelacionSocial[],
    totalEstudiantes: number
  ): number {
    const conexionesTotal = relacionesEntrantes.length + relacionesSalientes.length;
    const conexionesMaximas = totalEstudiantes * 2; // Máximo posible entrante + saliente
    return Math.max(0, 100 - (conexionesTotal / conexionesMaximas) * 100);
  }

  /**
   * Calcula índice de centralidad
   */
  private static calculateCentralityIndex(
    relacionesEntrantes: RelacionSocial[],
    relacionesSalientes: RelacionSocial[],
    todasRelaciones: RelacionSocial[]
  ): number {
    const conexionesDirectas = relacionesEntrantes.length + relacionesSalientes.length;
    const maxConexiones = Math.max(...todasRelaciones.reduce((acc, rel) => {
      acc[rel.origen_id] = (acc[rel.origen_id] || 0) + 1;
      acc[rel.destino_id] = (acc[rel.destino_id] || 0) + 1;
      return acc;
    }, {} as Record<string, number>));
    
    return maxConexiones > 0 ? (conexionesDirectas / maxConexiones) * 100 : 0;
  }

  /**
   * Calcula índice de influencia social
   */
  private static calculateInfluenceIndex(
    eleccionesRecibidas: RelacionSocial[],
    agresionesEmitidas: RelacionSocial[],
    totalEstudiantes: number
  ): number {
    const influenciaPositiva = (eleccionesRecibidas.length / totalEstudiantes) * 100;
    const influenciaNegativa = (agresionesEmitidas.length / totalEstudiantes) * 50; // Penalización
    return Math.max(0, influenciaPositiva - influenciaNegativa);
  }

  /**
   * Clasifica estatus social
   */
  private static classifySocialStatus(
    popularidad: number,
    rechazo: number,
    aislamiento: number
  ): 'popular' | 'promedio' | 'aislado' | 'rechazado' | 'controvertido' {
    if (popularidad > 60 && rechazo < 20) return 'popular';
    if (popularidad > 40 && rechazo > 40) return 'controvertido';
    if (rechazo > 50) return 'rechazado';
    if (aislamiento > 70) return 'aislado';
    return 'promedio';
  }

  /**
   * Clasifica rol en bullying
   */
  private static classifyBullyingRole(
    agresionesEmitidas: RelacionSocial[],
    agresionesRecibidas: RelacionSocial[],
    eleccionesRecibidas: RelacionSocial[]
  ): 'agresor' | 'victima' | 'victima_provocador' | 'observador' | 'no_implicado' {
    const esAgresor = agresionesEmitidas.length > 2;
    const esVictima = agresionesRecibidas.length > 2;
    const tieneInfluencia = eleccionesRecibidas.length > 3;

    if (esAgresor && esVictima) return 'victima_provocador';
    if (esAgresor) return 'agresor';
    if (esVictima) return 'victima';
    if (tieneInfluencia) return 'observador';
    return 'no_implicado';
  }

  /**
   * Evalúa nivel de riesgo
   */
  private static assessRiskLevel(
    estatus: string,
    rol: string,
    rechazo: number,
    aislamiento: number
  ): 'bajo' | 'medio' | 'alto' | 'critico' {
    if (rol === 'victima' && rechazo > 60) return 'critico';
    if (rol === 'agresor' || estatus === 'rechazado') return 'alto';
    if (estatus === 'aislado' || aislamiento > 60) return 'medio';
    return 'bajo';
  }

  /**
   * Detecta clusters sociales usando algoritmo de modularidad
   */
  private static detectSocialClusters(
    estudiantes: EstudianteResponse[],
    relaciones: RelacionSocial[]
  ): ClusterSocial[] {
    // Implementación simplificada de detección de clusters
    const clusters: ClusterSocial[] = [];
    const procesados = new Set<string>();

    estudiantes.forEach((estudiante, index) => {
      if (procesados.has(estudiante.id)) return;

      const cluster = this.buildClusterFromSeed(estudiante.id, estudiantes, relaciones, procesados);
      if (cluster.miembros.length > 1) {
        clusters.push({
          id: `cluster_${index + 1}`,
          nombre: `Grupo Social ${index + 1}`,
          miembros: cluster.miembros,
          densidad: cluster.densidad,
          cohesion: cluster.cohesion,
          tipo: cluster.tipo
        });
      }
    });

    return clusters;
  }

  /**
   * Construye cluster a partir de un estudiante semilla
   */
  private static buildClusterFromSeed(
    seedId: string,
    estudiantes: EstudianteResponse[],
    relaciones: RelacionSocial[],
    procesados: Set<string>
  ): { miembros: string[], densidad: number, cohesion: number, tipo: 'positivo' | 'neutro' | 'problematico' } {
    const miembros = new Set<string>([seedId]);
    const queue = [seedId];
    procesados.add(seedId);

    while (queue.length > 0) {
      const currentId = queue.shift()!;
      
      // Encontrar conexiones fuertes (elecciones mutuas)
      const conexiones = relaciones.filter(r => 
        (r.origen_id === currentId || r.destino_id === currentId) &&
        r.tipo === 'eleccion' &&
        r.reciproca &&
        r.intensidad >= 2
      );

      conexiones.forEach(rel => {
        const otherId = rel.origen_id === currentId ? rel.destino_id : rel.origen_id;
        if (!procesados.has(otherId)) {
          miembros.add(otherId);
          queue.push(otherId);
          procesados.add(otherId);
        }
      });
    }

    const miembrosArray = Array.from(miembros);
    const densidad = this.calculateClusterDensity(miembrosArray, relaciones);
    const cohesion = this.calculateClusterCohesion(miembrosArray, relaciones);
    const tipo = this.classifyClusterType(miembrosArray, relaciones);

    return { miembros: miembrosArray, densidad, cohesion, tipo };
  }

  /**
   * Calcula densidad del cluster
   */
  private static calculateClusterDensity(miembros: string[], relaciones: RelacionSocial[]): number {
    if (miembros.length < 2) return 0;

    const relacionesInternas = relaciones.filter(r =>
      miembros.includes(r.origen_id) && miembros.includes(r.destino_id)
    );

    const relacionesPosibles = miembros.length * (miembros.length - 1);
    return relacionesPosibles > 0 ? (relacionesInternas.length / relacionesPosibles) * 100 : 0;
  }

  /**
   * Calcula cohesión del cluster
   */
  private static calculateClusterCohesion(miembros: string[], relaciones: RelacionSocial[]): number {
    const relacionesPositivas = relaciones.filter(r =>
      miembros.includes(r.origen_id) && 
      miembros.includes(r.destino_id) &&
      r.tipo === 'eleccion'
    );

    const relacionesNegativas = relaciones.filter(r =>
      miembros.includes(r.origen_id) && 
      miembros.includes(r.destino_id) &&
      (r.tipo === 'rechazo' || r.tipo === 'agresion')
    );

    const totalRelaciones = relacionesPositivas.length + relacionesNegativas.length;
    if (totalRelaciones === 0) return 50; // Neutral

    return (relacionesPositivas.length / totalRelaciones) * 100;
  }

  /**
   * Clasifica tipo de cluster
   */
  private static classifyClusterType(
    miembros: string[], 
    relaciones: RelacionSocial[]
  ): 'positivo' | 'neutro' | 'problematico' {
    const agresionesInternas = relaciones.filter(r =>
      miembros.includes(r.origen_id) && 
      miembros.includes(r.destino_id) &&
      r.tipo === 'agresion'
    ).length;

    const relacionesTotal = relaciones.filter(r =>
      miembros.includes(r.origen_id) && miembros.includes(r.destino_id)
    ).length;

    if (relacionesTotal === 0) return 'neutro';
    
    const porcentajeAgresion = (agresionesInternas / relacionesTotal) * 100;
    
    if (porcentajeAgresion > 30) return 'problematico';
    if (porcentajeAgresion < 10) return 'positivo';
    return 'neutro';
  }

  /**
   * Calcula métricas generales de la red social
   */
  private static calculateNetworkMetrics(
    estudiantes: EstudianteResponse[],
    relaciones: RelacionSocial[],
    clusters: ClusterSocial[]
  ): MetricasRed {
    const totalEstudiantes = estudiantes.length;
    const relacionesPosibles = totalEstudiantes * (totalEstudiantes - 1);
    
    const densidad_general = relacionesPosibles > 0 ? (relaciones.length / relacionesPosibles) * 100 : 0;
    
    const relacionesReciprocas = relaciones.filter(r => r.reciproca).length;
    const reciprocidad = relaciones.length > 0 ? (relacionesReciprocas / relaciones.length) * 100 : 0;
    
    const transitividad = this.calculateTransitivity(estudiantes, relaciones);
    const modularidad = this.calculateModularity(estudiantes, relaciones, clusters);
    
    const estudiantesConectados = new Set([
      ...relaciones.map(r => r.origen_id),
      ...relaciones.map(r => r.destino_id)
    ]);
    const estudiantes_aislados = totalEstudiantes - estudiantesConectados.size;

    return {
      densidad_general: Math.round(densidad_general * 100) / 100,
      reciprocidad: Math.round(reciprocidad * 100) / 100,
      transitividad: Math.round(transitividad * 100) / 100,
      modularidad: Math.round(modularidad * 100) / 100,
      numero_clusters: clusters.length,
      estudiantes_aislados
    };
  }

  /**
   * Calcula transitividad de la red
   */
  private static calculateTransitivity(estudiantes: EstudianteResponse[], relaciones: RelacionSocial[]): number {
    let triangulos = 0;
    let triadas = 0;

    estudiantes.forEach(a => {
      estudiantes.forEach(b => {
        if (a.id === b.id) return;
        estudiantes.forEach(c => {
          if (c.id === a.id || c.id === b.id) return;
          
          const ab = relaciones.some(r => r.origen_id === a.id && r.destino_id === b.id);
          const bc = relaciones.some(r => r.origen_id === b.id && r.destino_id === c.id);
          const ac = relaciones.some(r => r.origen_id === a.id && r.destino_id === c.id);
          
          if (ab && bc) {
            triadas++;
            if (ac) triangulos++;
          }
        });
      });
    });

    return triadas > 0 ? (triangulos / triadas) * 100 : 0;
  }

  /**
   * Calcula modularidad de la red
   */
  private static calculateModularity(
    estudiantes: EstudianteResponse[],
    relaciones: RelacionSocial[],
    clusters: ClusterSocial[]
  ): number {
    // Implementación simplificada de modularidad
    const totalRelaciones = relaciones.length;
    if (totalRelaciones === 0) return 0;

    let modularidad = 0;
    
    clusters.forEach(cluster => {
      const relacionesInternas = relaciones.filter(r =>
        cluster.miembros.includes(r.origen_id) && cluster.miembros.includes(r.destino_id)
      ).length;
      
      const proporcionInterna = relacionesInternas / totalRelaciones;
      const proporcionEsperada = Math.pow(cluster.miembros.length / estudiantes.length, 2);
      
      modularidad += proporcionInterna - proporcionEsperada;
    });

    return Math.max(0, modularidad * 100);
  }

  /**
   * Genera alertas de riesgo basadas en el análisis
   */
  private static generateRiskAlerts(
    estudiantes: EstudianteResponse[],
    indices: IndicesSociometricos[],
    clusters: ClusterSocial[],
    relaciones: RelacionSocial[]
  ): AlertaSociometrica[] {
    const alertas: AlertaSociometrica[] = [];
    let alertaId = 1;

    // Alertas individuales
    indices.forEach(indice => {
      const estudiante = estudiantes.find(e => e.id === indice.estudiante_id);
      if (!estudiante) return;

      // Aislamiento extremo
      if (indice.aislamiento > 80) {
        alertas.push({
          id: `alerta_${alertaId++}`,
          estudiante_id: indice.estudiante_id,
          tipo: 'aislamiento',
          severidad: indice.aislamiento > 90 ? 'critico' : 'alto',
          descripcion: `${estudiante.nombre} presenta aislamiento social extremo (${indice.aislamiento.toFixed(1)}%)`,
          evidencia: [
            `Índice de aislamiento: ${indice.aislamiento.toFixed(1)}%`,
            `Pocas conexiones sociales establecidas`,
            `Baja participación en dinámicas grupales`
          ],
          recomendaciones: [
            'Implementar actividades de integración social dirigidas',
            'Asignar compañero de apoyo (buddy system)',
            'Desarrollar habilidades sociales mediante talleres específicos',
            'Monitoreo psicológico especializado'
          ],
          fecha_deteccion: new Date().toISOString(),
          fecha_seguimiento: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
        });
      }

      // Rechazo masivo
      if (indice.rechazo > 60) {
        alertas.push({
          id: `alerta_${alertaId++}`,
          estudiante_id: indice.estudiante_id,
          tipo: 'rechazo_masivo',
          severidad: indice.rechazo > 80 ? 'critico' : 'alto',
          descripcion: `${estudiante.nombre} experimenta rechazo social significativo (${indice.rechazo.toFixed(1)}%)`,
          evidencia: [
            `Índice de rechazo: ${indice.rechazo.toFixed(1)}%`,
            `Múltiples estudiantes expresan rechazo`,
            `Posible exclusión sistemática`
          ],
          recomendaciones: [
            'Intervención inmediata para prevenir victimización',
            'Trabajo con el grupo sobre inclusión y respeto',
            'Apoyo psicológico individual',
            'Revisión de dinámicas grupales problemáticas'
          ],
          fecha_deteccion: new Date().toISOString(),
          fecha_seguimiento: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString()
        });
      }

      // Agresor identificado
      if (indice.rol_bullying === 'agresor') {
        alertas.push({
          id: `alerta_${alertaId++}`,
          estudiante_id: indice.estudiante_id,
          tipo: 'agresor',
          severidad: 'alto',
          descripcion: `${estudiante.nombre} identificado como agresor en dinámicas de bullying`,
          evidencia: [
            `Rol de bullying: ${indice.rol_bullying}`,
            `Múltiples reportes de comportamiento agresivo`,
            `Patrón de intimidación hacia compañeros`
          ],
          recomendaciones: [
            'Intervención disciplinaria inmediata',
            'Programa de modificación de conducta',
            'Trabajo con familia sobre comportamiento agresivo',
            'Seguimiento psicológico especializado'
          ],
          fecha_deteccion: new Date().toISOString(),
          fecha_seguimiento: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString()
        });
      }

      // Víctima vulnerable
      if (indice.rol_bullying === 'victima' && indice.nivel_riesgo === 'critico') {
        alertas.push({
          id: `alerta_${alertaId++}`,
          estudiante_id: indice.estudiante_id,
          tipo: 'victima',
          severidad: 'critico',
          descripcion: `${estudiante.nombre} en situación crítica de victimización`,
          evidencia: [
            `Rol de bullying: ${indice.rol_bullying}`,
            `Nivel de riesgo: ${indice.nivel_riesgo}`,
            `Múltiples indicadores de victimización`
          ],
          recomendaciones: [
            'Protección inmediata y plan de seguridad',
            'Intervención con agresores identificados',
            'Apoyo psicológico intensivo',
            'Comunicación inmediata con familia'
          ],
          fecha_deteccion: new Date().toISOString(),
          fecha_seguimiento: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString()
        });
      }
    });

    // Alertas grupales
    clusters.forEach(cluster => {
      if (cluster.tipo === 'problematico') {
        alertas.push({
          id: `alerta_${alertaId++}`,
          estudiante_id: cluster.miembros[0], // Representante del cluster
          tipo: 'cluster_problematico',
          severidad: 'medio',
          descripcion: `Cluster social problemático detectado: ${cluster.nombre}`,
          evidencia: [
            `Tipo de cluster: ${cluster.tipo}`,
            `Miembros involucrados: ${cluster.miembros.length}`,
            `Cohesión baja: ${cluster.cohesion.toFixed(1)}%`
          ],
          recomendaciones: [
            'Reestructuración de dinámicas grupales',
            'Actividades de team building positivo',
            'Mediación de conflictos grupales',
            'Supervisión aumentada durante interacciones'
          ],
          fecha_deteccion: new Date().toISOString(),
          fecha_seguimiento: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString()
        });
      }
    });

    return alertas;
  }

  /**
   * Crea datos para visualización de sociograma
   */
  private static createSociogramData(
    estudiantes: EstudianteResponse[],
    relaciones: RelacionSocial[],
    indices: IndicesSociometricos[],
    clusters: ClusterSocial[]
  ): SociogramData {
    // Crear nodos
    const nodes: SociogramNode[] = estudiantes.map(estudiante => {
      const indice = indices.find(i => i.estudiante_id === estudiante.id)!;
      
      return {
        id: estudiante.id,
        nombre: estudiante.nombre,
        size: Math.max(10, indice.popularidad / 2), // Tamaño basado en popularidad
        color: this.getNodeColor(indice.estatus_social, indice.rol_bullying),
        estatus: indice.estatus_social,
        rol_bullying: indice.rol_bullying,
        indices: indice
      };
    });

    // Crear aristas
    const edges: SociogramEdge[] = relaciones.map(relacion => ({
      source: relacion.origen_id,
      target: relacion.destino_id,
      tipo: relacion.tipo,
      intensidad: relacion.intensidad,
      reciproca: relacion.reciproca,
      color: this.getEdgeColor(relacion.tipo),
      width: Math.max(1, relacion.intensidad)
    }));

    const metricas = this.calculateNetworkMetrics(estudiantes, relaciones, clusters);

    return {
      nodes,
      edges,
      clusters,
      metricas
    };
  }

  /**
   * Obtiene color del nodo según estatus y rol
   */
  private static getNodeColor(estatus: string, rol: string): string {
    if (rol === 'agresor') return '#ef4444'; // Rojo
    if (rol === 'victima') return '#f97316'; // Naranja
    if (estatus === 'popular') return '#22c55e'; // Verde
    if (estatus === 'aislado') return '#6b7280'; // Gris
    if (estatus === 'rechazado') return '#dc2626'; // Rojo oscuro
    return '#3b82f6'; // Azul por defecto
  }

  /**
   * Obtiene color de la arista según tipo de relación
   */
  private static getEdgeColor(tipo: string): string {
    switch (tipo) {
      case 'eleccion': return '#22c55e'; // Verde
      case 'rechazo': return '#ef4444'; // Rojo
      case 'agresion': return '#dc2626'; // Rojo oscuro
      default: return '#6b7280'; // Gris
    }
  }

  /**
   * Genera resumen ejecutivo del análisis
   */
  private static generateExecutiveSummary(
    estudiantes: EstudianteResponse[],
    indices: IndicesSociometricos[],
    alertas: AlertaSociometrica[]
  ) {
    const distribucionEstatus = indices.reduce((acc, indice) => {
      acc[indice.estatus_social] = (acc[indice.estatus_social] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const distribucionRoles = indices.reduce((acc, indice) => {
      acc[indice.rol_bullying] = (acc[indice.rol_bullying] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const alertasCriticas = alertas.filter(a => a.severidad === 'critico').length;

    const recomendacionesPrincipales = [
      'Implementar programa de prevención de bullying',
      'Fortalecer dinámicas de integración social',
      'Establecer sistema de monitoreo continuo',
      'Capacitar docentes en detección temprana',
      'Crear protocolos de intervención rápida'
    ];

    return {
      total_estudiantes: estudiantes.length,
      tasa_respuesta: 100, // Asumiendo respuesta completa
      distribucion_estatus: distribucionEstatus,
      distribucion_roles: distribucionRoles,
      alertas_criticas: alertasCriticas,
      recomendaciones_principales: recomendacionesPrincipales
    };
  }
}