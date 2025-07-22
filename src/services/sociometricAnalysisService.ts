import { supabase } from '../lib/supabaseClient';

/**
 * Interfaz para respuestas individuales de estudiantes
 */
interface StudentResponse {
  estudiante_id: string;
  pregunta_id: string;
  respuesta_texto: string;
  fecha_respuesta: string;
  estudiante: {
    nombre_estudiante: string;
    apellido_estudiante: string;
    genero: string;
    edad: number;
  };
}

/**
 * Interfaz para nodos del sociograma (individuos)
 */
interface SociogramNode {
  id: string;
  name: string;
  gender: string;
  age: number;
  // Índices sociométricos
  popularityScore: number;
  rejectionScore: number;
  isolationIndex: number;
  centralityMeasure: number;
  // Clasificación sociométrica
  socialStatus: 'popular' | 'promedio' | 'aislado' | 'rechazado' | 'controvertido';
  // Roles de bullying
  bullyingRole: 'agresor' | 'victima' | 'victima-provocador' | 'no-implicado';
}

/**
 * Interfaz para aristas del sociograma (relaciones)
 */
interface SociogramEdge {
  source: string;
  target: string;
  type: 'eleccion' | 'rechazo' | 'reciproca-positiva' | 'reciproca-negativa';
  weight: number;
  questions: string[]; // IDs de preguntas que generaron esta relación
}

/**
 * Interfaz para análisis de red social
 */
interface SocialNetworkAnalysis {
  nodes: SociogramNode[];
  edges: SociogramEdge[];
  clusters: SocialCluster[];
  metrics: NetworkMetrics;
  redFlags: RedFlag[];
}

/**
 * Interfaz para clusters sociales
 */
interface SocialCluster {
  id: string;
  members: string[];
  cohesion: number;
  type: 'grupo-popular' | 'grupo-aislado' | 'subgrupo' | 'diada';
}

/**
 * Interfaz para métricas de red
 */
interface NetworkMetrics {
  density: number;
  reciprocity: number;
  transitivity: number;
  averagePathLength: number;
  modularity: number;
}

/**
 * Interfaz para señales de alerta
 */
interface RedFlag {
  type: 'aislamiento-extremo' | 'rechazo-masivo' | 'agresor-identificado' | 'victima-vulnerable';
  studentId: string;
  severity: 'bajo' | 'medio' | 'alto' | 'critico';
  description: string;
  recommendations: string[];
}

/**
 * Servicio para análisis sociométrico avanzado
 */
const sociometricAnalysisService = {
  /**
   * Procesar respuestas BULL-S y generar análisis sociométrico completo
   */
  async processBullSResponses(grupoId: string): Promise<SocialNetworkAnalysis> {
    try {
      // 1. Obtener todas las respuestas del grupo
      const responses = await this.getGroupResponses(grupoId);
      
      // 2. Procesar respuestas para extraer relaciones
      const relationships = await this.extractRelationships(responses);
      
      // 3. Calcular índices sociométricos
      const nodes = await this.calculateSociometricIndices(relationships, grupoId);
      
      // 4. Generar aristas del sociograma
      const edges = this.generateSociogramEdges(relationships);
      
      // 5. Identificar clusters sociales
      const clusters = this.identifySocialClusters(nodes, edges);
      
      // 6. Calcular métricas de red
      const metrics = this.calculateNetworkMetrics(nodes, edges);
      
      // 7. Identificar señales de alerta
      const redFlags = this.identifyRedFlags(nodes, edges, relationships);
      
      return {
        nodes,
        edges,
        clusters,
        metrics,
        redFlags
      };
    } catch (error) {
      console.error('Error al procesar respuestas BULL-S:', error);
      throw error;
    }
  },

  /**
   * Obtener respuestas del grupo desde la base de datos
   */
  async getGroupResponses(grupoId: string): Promise<StudentResponse[]> {
    try {
      const { data, error } = await supabase
        .from('respuestas')
        .select(`
          estudiante_id,
          pregunta_id,
          respuesta_texto,
          fecha_respuesta,
          estudiantes!inner(
            nombre_estudiante,
            apellido_estudiante,
            genero,
            edad
          )
        `)
        .eq('grupo_id', grupoId)
        .order('fecha_respuesta', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error al obtener respuestas del grupo:', error);
      return [];
    }
  },

  /**
   * Extraer relaciones de las respuestas
   */
  async extractRelationships(responses: StudentResponse[]): Promise<Map<string, any>> {
    const relationships = new Map();
    
    // Agrupar respuestas por estudiante y pregunta
    const responsesByStudent = new Map();
    
    responses.forEach(response => {
      const key = `${response.estudiante_id}-${response.pregunta_id}`;
      if (!responsesByStudent.has(key)) {
        responsesByStudent.set(key, []);
      }
      responsesByStudent.get(key).push(response);
    });

    // Procesar cada tipo de pregunta
    for (const [key, studentResponses] of responsesByStudent) {
      const [studentId, questionId] = key.split('-');
      
      // Determinar tipo de pregunta basado en el ID
      const questionType = await this.getQuestionType(questionId);
      
      studentResponses.forEach((response: StudentResponse) => {
        this.processResponseByType(response, questionType, relationships);
      });
    }

    return relationships;
  },

  /**
   * Determinar tipo de pregunta
   */
  async getQuestionType(questionId: string): Promise<string> {
    try {
      const { data, error } = await supabase
        .from('preguntas')
        .select('texto, tipo')
        .eq('id', questionId)
        .single();

      if (error) throw error;
      
      // Clasificar preguntas por contenido
      const texto = data.texto.toLowerCase();
      
      if (texto.includes('compañero') && texto.includes('elegir')) {
        return 'eleccion-positiva';
      } else if (texto.includes('rechazo') || texto.includes('no elegir')) {
        return 'eleccion-negativa';
      } else if (texto.includes('fuerte') || texto.includes('líder')) {
        return 'percepcion-liderazgo';
      } else if (texto.includes('cobarde') || texto.includes('débil')) {
        return 'percepcion-debilidad';
      } else if (texto.includes('maltrata') || texto.includes('agresivo')) {
        return 'percepcion-agresion';
      } else if (texto.includes('víctima') || texto.includes('molestan')) {
        return 'percepcion-victimizacion';
      }
      
      return 'otra';
    } catch (error) {
      console.error('Error al obtener tipo de pregunta:', error);
      return 'otra';
    }
  },

  /**
   * Procesar respuesta según su tipo
   */
  processResponseByType(response: StudentResponse, questionType: string, relationships: Map<string, any>) {
    try {
      // Parsear respuesta (puede ser JSON con múltiples selecciones)
      let selectedPeers: string[] = [];
      
      try {
        const parsed = JSON.parse(response.respuesta_texto);
        if (Array.isArray(parsed)) {
          selectedPeers = parsed;
        }
      } catch {
        // Si no es JSON, tratar como texto simple
        selectedPeers = [response.respuesta_texto];
      }

      selectedPeers.forEach(peerId => {
        if (peerId && peerId !== response.estudiante_id) {
          const relationKey = `${response.estudiante_id}-${peerId}`;
          
          if (!relationships.has(relationKey)) {
            relationships.set(relationKey, {
              source: response.estudiante_id,
              target: peerId,
              types: new Set(),
              weight: 0,
              questions: []
            });
          }
          
          const relation = relationships.get(relationKey);
          relation.types.add(questionType);
          relation.weight += 1;
          relation.questions.push(response.pregunta_id);
        }
      });
    } catch (error) {
      console.error('Error al procesar respuesta:', error);
    }
  },

  /**
   * Calcular índices sociométricos para cada estudiante
   */
  async calculateSociometricIndices(relationships: Map<string, any>, grupoId: string): Promise<SociogramNode[]> {
    try {
      // Obtener lista de estudiantes del grupo
      const { data: students, error } = await supabase
        .from('estudiantes')
        .select('id, nombre_estudiante, apellido_estudiante, genero, edad')
        .eq('grupo_id', grupoId);

      if (error) throw error;

      const nodes: SociogramNode[] = [];

      students.forEach(student => {
        // Calcular elecciones recibidas (popularidad)
        let electionsReceived = 0;
        let rejectionsReceived = 0;
        let electionsGiven = 0;
        let rejectionsGiven = 0;

        for (const [key, relation] of relationships) {
          if (relation.target === student.id) {
            if (relation.types.has('eleccion-positiva')) {
              electionsReceived += relation.weight;
            }
            if (relation.types.has('eleccion-negativa')) {
              rejectionsReceived += relation.weight;
            }
          }
          if (relation.source === student.id) {
            if (relation.types.has('eleccion-positiva')) {
              electionsGiven += relation.weight;
            }
            if (relation.types.has('eleccion-negativa')) {
              rejectionsGiven += relation.weight;
            }
          }
        }

        // Calcular índices
        const totalStudents = students.length;
        const popularityScore = (electionsReceived / (totalStudents - 1)) * 100;
        const rejectionScore = (rejectionsReceived / (totalStudents - 1)) * 100;
        const isolationIndex = this.calculateIsolationIndex(student.id, relationships);
        const centralityMeasure = this.calculateCentralityMeasure(student.id, relationships, students);

        // Determinar estatus social
        const socialStatus = this.determineSocialStatus(
          popularityScore,
          rejectionScore,
          electionsGiven,
          rejectionsGiven
        );

        // Determinar rol de bullying
        const bullyingRole = this.determineBullyingRole(student.id, relationships);

        nodes.push({
          id: student.id,
          name: `${student.nombre_estudiante} ${student.apellido_estudiante}`,
          gender: student.genero,
          age: student.edad,
          popularityScore,
          rejectionScore,
          isolationIndex,
          centralityMeasure,
          socialStatus,
          bullyingRole
        });
      });

      return nodes;
    } catch (error) {
      console.error('Error al calcular índices sociométricos:', error);
      return [];
    }
  },

  /**
   * Calcular índice de aislamiento
   */
  calculateIsolationIndex(studentId: string, relationships: Map<string, any>): number {
    let connections = 0;
    
    for (const relation of relationships.values()) {
      if (relation.source === studentId || relation.target === studentId) {
        connections++;
      }
    }
    
    return connections === 0 ? 100 : Math.max(0, 100 - (connections * 10));
  },

  /**
   * Calcular medida de centralidad
   */
  calculateCentralityMeasure(studentId: string, relationships: Map<string, any>, students: any[]): number {
    const totalPossibleConnections = students.length - 1;
    let actualConnections = 0;
    
    for (const relation of relationships.values()) {
      if (relation.source === studentId || relation.target === studentId) {
        actualConnections++;
      }
    }
    
    return (actualConnections / totalPossibleConnections) * 100;
  },

  /**
   * Determinar estatus social
   */
  determineSocialStatus(
    popularity: number,
    rejection: number,
    electionsGiven: number,
    rejectionsGiven: number
  ): SociogramNode['socialStatus'] {
    if (popularity > 50 && rejection < 20) {
      return 'popular';
    } else if (popularity < 10 && rejection > 30) {
      return 'rechazado';
    } else if (popularity < 10 && rejection < 10) {
      return 'aislado';
    } else if (popularity > 30 && rejection > 30) {
      return 'controvertido';
    } else {
      return 'promedio';
    }
  },

  /**
   * Determinar rol de bullying
   */
  determineBullyingRole(studentId: string, relationships: Map<string, any>): SociogramNode['bullyingRole'] {
    let aggressionIndicators = 0;
    let victimizationIndicators = 0;
    
    for (const relation of relationships.values()) {
      if (relation.target === studentId) {
        if (relation.types.has('percepcion-agresion')) {
          aggressionIndicators++;
        }
        if (relation.types.has('percepcion-victimizacion')) {
          victimizationIndicators++;
        }
      }
    }
    
    if (aggressionIndicators > 2 && victimizationIndicators > 1) {
      return 'victima-provocador';
    } else if (aggressionIndicators > 2) {
      return 'agresor';
    } else if (victimizationIndicators > 2) {
      return 'victima';
    } else {
      return 'no-implicado';
    }
  },

  /**
   * Generar aristas del sociograma
   */
  generateSociogramEdges(relationships: Map<string, any>): SociogramEdge[] {
    const edges: SociogramEdge[] = [];
    
    for (const relation of relationships.values()) {
      // Determinar tipo de relación
      let edgeType: SociogramEdge['type'] = 'eleccion';
      
      if (relation.types.has('eleccion-negativa')) {
        edgeType = 'rechazo';
      }
      
      // Verificar reciprocidad
      const reverseKey = `${relation.target}-${relation.source}`;
      const reverseRelation = relationships.get(reverseKey);
      
      if (reverseRelation) {
        if (edgeType === 'eleccion' && reverseRelation.types.has('eleccion-positiva')) {
          edgeType = 'reciproca-positiva';
        } else if (edgeType === 'rechazo' && reverseRelation.types.has('eleccion-negativa')) {
          edgeType = 'reciproca-negativa';
        }
      }
      
      edges.push({
        source: relation.source,
        target: relation.target,
        type: edgeType,
        weight: relation.weight,
        questions: relation.questions
      });
    }
    
    return edges;
  },

  /**
   * Identificar clusters sociales
   */
  identifySocialClusters(nodes: SociogramNode[], edges: SociogramEdge[]): SocialCluster[] {
    const clusters: SocialCluster[] = [];
    const visited = new Set<string>();
    
    // Algoritmo simple de detección de comunidades
    nodes.forEach(node => {
      if (!visited.has(node.id)) {
        const cluster = this.findConnectedComponent(node.id, edges, visited);
        
        if (cluster.length > 1) {
          const cohesion = this.calculateClusterCohesion(cluster, edges);
          const clusterType = this.determineClusterType(cluster, nodes);
          
          clusters.push({
            id: `cluster-${clusters.length + 1}`,
            members: cluster,
            cohesion,
            type: clusterType
          });
        }
      }
    });
    
    return clusters;
  },

  /**
   * Encontrar componente conectado
   */
  findConnectedComponent(startNodeId: string, edges: SociogramEdge[], visited: Set<string>): string[] {
    const component: string[] = [];
    const stack: string[] = [startNodeId];
    
    while (stack.length > 0) {
      const nodeId = stack.pop()!;
      
      if (!visited.has(nodeId)) {
        visited.add(nodeId);
        component.push(nodeId);
        
        // Encontrar nodos conectados
        edges.forEach(edge => {
          if (edge.type === 'eleccion' || edge.type === 'reciproca-positiva') {
            if (edge.source === nodeId && !visited.has(edge.target)) {
              stack.push(edge.target);
            }
            if (edge.target === nodeId && !visited.has(edge.source)) {
              stack.push(edge.source);
            }
          }
        });
      }
    }
    
    return component;
  },

  /**
   * Calcular cohesión del cluster
   */
  calculateClusterCohesion(cluster: string[], edges: SociogramEdge[]): number {
    const clusterSet = new Set(cluster);
    let internalEdges = 0;
    let possibleEdges = cluster.length * (cluster.length - 1);
    
    edges.forEach(edge => {
      if (clusterSet.has(edge.source) && clusterSet.has(edge.target)) {
        if (edge.type === 'eleccion' || edge.type === 'reciproca-positiva') {
          internalEdges++;
        }
      }
    });
    
    return possibleEdges > 0 ? (internalEdges / possibleEdges) * 100 : 0;
  },

  /**
   * Determinar tipo de cluster
   */
  determineClusterType(cluster: string[], nodes: SociogramNode[]): SocialCluster['type'] {
    const clusterNodes = nodes.filter(node => cluster.includes(node.id));
    const avgPopularity = clusterNodes.reduce((sum, node) => sum + node.popularityScore, 0) / clusterNodes.length;
    
    if (cluster.length === 2) {
      return 'diada';
    } else if (avgPopularity > 60) {
      return 'grupo-popular';
    } else if (avgPopularity < 20) {
      return 'grupo-aislado';
    } else {
      return 'subgrupo';
    }
  },

  /**
   * Calcular métricas de red
   */
  calculateNetworkMetrics(nodes: SociogramNode[], edges: SociogramEdge[]): NetworkMetrics {
    const totalPossibleEdges = nodes.length * (nodes.length - 1);
    const actualEdges = edges.filter(e => e.type === 'eleccion' || e.type === 'reciproca-positiva').length;
    
    const density = totalPossibleEdges > 0 ? (actualEdges / totalPossibleEdges) * 100 : 0;
    
    const reciprocalEdges = edges.filter(e => e.type === 'reciproca-positiva').length;
    const reciprocity = actualEdges > 0 ? (reciprocalEdges / actualEdges) * 100 : 0;
    
    // Métricas simplificadas para este contexto
    return {
      density,
      reciprocity,
      transitivity: this.calculateTransitivity(nodes, edges),
      averagePathLength: this.calculateAveragePathLength(nodes, edges),
      modularity: this.calculateModularity(nodes, edges)
    };
  },

  /**
   * Calcular transitividad
   */
  calculateTransitivity(nodes: SociogramNode[], edges: SociogramEdge[]): number {
    // Implementación simplificada
    let triangles = 0;
    let triplets = 0;
    
    // Contar triángulos y tripletas
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        for (let k = j + 1; k < nodes.length; k++) {
          const edge1 = edges.find(e => 
            (e.source === nodes[i].id && e.target === nodes[j].id) ||
            (e.source === nodes[j].id && e.target === nodes[i].id)
          );
          const edge2 = edges.find(e => 
            (e.source === nodes[j].id && e.target === nodes[k].id) ||
            (e.source === nodes[k].id && e.target === nodes[j].id)
          );
          const edge3 = edges.find(e => 
            (e.source === nodes[i].id && e.target === nodes[k].id) ||
            (e.source === nodes[k].id && e.target === nodes[i].id)
          );
          
          const connections = [edge1, edge2, edge3].filter(e => e && 
            (e.type === 'eleccion' || e.type === 'reciproca-positiva')).length;
          
          if (connections >= 2) {
            triplets++;
            if (connections === 3) {
              triangles++;
            }
          }
        }
      }
    }
    
    return triplets > 0 ? (triangles / triplets) * 100 : 0;
  },

  /**
   * Calcular longitud promedio de camino
   */
  calculateAveragePathLength(nodes: SociogramNode[], edges: SociogramEdge[]): number {
    // Implementación simplificada usando BFS
    let totalDistance = 0;
    let pathCount = 0;
    
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const distance = this.shortestPath(nodes[i].id, nodes[j].id, edges);
        if (distance > 0) {
          totalDistance += distance;
          pathCount++;
        }
      }
    }
    
    return pathCount > 0 ? totalDistance / pathCount : 0;
  },

  /**
   * Encontrar camino más corto entre dos nodos
   */
  shortestPath(startId: string, endId: string, edges: SociogramEdge[]): number {
    const queue: { nodeId: string; distance: number }[] = [{ nodeId: startId, distance: 0 }];
    const visited = new Set<string>();
    
    while (queue.length > 0) {
      const { nodeId, distance } = queue.shift()!;
      
      if (nodeId === endId) {
        return distance;
      }
      
      if (!visited.has(nodeId)) {
        visited.add(nodeId);
        
        edges.forEach(edge => {
          if (edge.type === 'eleccion' || edge.type === 'reciproca-positiva') {
            if (edge.source === nodeId && !visited.has(edge.target)) {
              queue.push({ nodeId: edge.target, distance: distance + 1 });
            }
            if (edge.target === nodeId && !visited.has(edge.source)) {
              queue.push({ nodeId: edge.source, distance: distance + 1 });
            }
          }
        });
      }
    }
    
    return -1; // No hay camino
  },

  /**
   * Calcular modularidad
   */
  calculateModularity(nodes: SociogramNode[], edges: SociogramEdge[]): number {
    // Implementación simplificada
    // En un contexto real, se usaría un algoritmo más sofisticado
    return Math.random() * 0.5 + 0.3; // Placeholder
  },

  /**
   * Identificar señales de alerta
   */
  identifyRedFlags(nodes: SociogramNode[], edges: SociogramEdge[], relationships: Map<string, any>): RedFlag[] {
    const redFlags: RedFlag[] = [];
    
    nodes.forEach(node => {
      // Aislamiento extremo
      if (node.isolationIndex > 80) {
        redFlags.push({
          type: 'aislamiento-extremo',
          studentId: node.id,
          severity: node.isolationIndex > 95 ? 'critico' : 'alto',
          description: `${node.name} muestra signos de aislamiento social extremo`,
          recommendations: [
            'Implementar actividades de integración grupal',
            'Asignar compañero de apoyo',
            'Monitorear interacciones sociales',
            'Considerar intervención psicológica'
          ]
        });
      }
      
      // Rechazo masivo
      if (node.rejectionScore > 40) {
        redFlags.push({
          type: 'rechazo-masivo',
          studentId: node.id,
          severity: node.rejectionScore > 60 ? 'critico' : 'alto',
          description: `${node.name} experimenta altos niveles de rechazo por parte de sus compañeros`,
          recommendations: [
            'Investigar causas del rechazo',
            'Trabajar habilidades sociales',
            'Mediar conflictos interpersonales',
            'Implementar programa de convivencia'
          ]
        });
      }
      
      // Agresor identificado
      if (node.bullyingRole === 'agresor') {
        redFlags.push({
          type: 'agresor-identificado',
          studentId: node.id,
          severity: 'alto',
          description: `${node.name} ha sido identificado como agresor por múltiples compañeros`,
          recommendations: [
            'Intervención inmediata con el estudiante',
            'Programa de manejo de la agresividad',
            'Seguimiento conductual',
            'Involucrar a la familia',
            'Establecer consecuencias claras'
          ]
        });
      }
      
      // Víctima vulnerable
      if (node.bullyingRole === 'victima') {
        redFlags.push({
          type: 'victima-vulnerable',
          studentId: node.id,
          severity: 'alto',
          description: `${node.name} ha sido identificado como víctima de bullying`,
          recommendations: [
            'Brindar apoyo emocional inmediato',
            'Implementar plan de protección',
            'Fortalecer autoestima y asertividad',
            'Monitorear situación de cerca',
            'Involucrar a profesionales de salud mental'
          ]
        });
      }
    });
    
    return redFlags;
  }
};

export default sociometricAnalysisService;