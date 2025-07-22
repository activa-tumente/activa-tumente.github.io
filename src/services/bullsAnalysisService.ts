/**
 * BULL-S Sociometric Analysis Service
 * Comprehensive analysis of peer relationships and social dynamics
 */

import { supabase } from '../lib/supabaseClient';

// Core data interfaces for BULL-S analysis
export interface BullsResponse {
  id: string;
  estudiante_id: string;
  pregunta_id: string;
  respuesta: string;
  companeros_seleccionados?: string[];
  created_at: string;
}

export interface SociometricNode {
  id: string;
  name: string;
  fullName: string;
  age: number;
  gender: 'M' | 'F';
  grupo_id: string;
  // Sociometric indices
  popularityScore: number;
  rejectionScore: number;
  isolationLevel: number;
  centralityMeasure: number;
  // Status classification
  socialStatus: 'popular' | 'rejected' | 'isolated' | 'controversial' | 'average';
  // Risk indicators
  bullyingRisk: 'low' | 'medium' | 'high';
  victimizationRisk: 'low' | 'medium' | 'high';
}

export interface SociometricEdge {
  source: string;
  target: string;
  type: 'positive' | 'negative' | 'neutral';
  weight: number;
  reciprocal: boolean;
  questionType: string; // 'play_with', 'work_with', 'reject', 'aggressor', etc.
}

export interface SocialCluster {
  id: string;
  members: string[];
  cohesionScore: number;
  size: number;
  centralMember: string;
  isolatedMembers: string[];
}

export interface SociometricAnalysis {
  nodes: SociometricNode[];
  edges: SociometricEdge[];
  clusters: SocialCluster[];
  groupMetrics: {
    cohesionIndex: number;
    densityIndex: number;
    centralityDistribution: number;
    isolationRate: number;
    reciprocityRate: number;
  };
  riskIndicators: {
    highRiskStudents: string[];
    potentialVictims: string[];
    potentialAggressors: string[];
    isolatedStudents: string[];
    controversialStudents: string[];
  };
  recommendations: string[];
}

export interface BullsEvaluationData {
  grupo_id: string;
  grupo_nombre: string;
  institucion_id: string;
  estudiantes: Array<{
    id: string;
    nombre: string;
    apellido: string;
    edad: number;
    genero: 'M' | 'F';
  }>;
  respuestas: BullsResponse[];
  fecha_evaluacion: string;
}

class BullsAnalysisService {
  /**
   * Parse BULL-S evaluation data from various sources
   */
  async parseBullsData(grupoId: string): Promise<BullsEvaluationData | null> {
    try {
      // Get group information
      const { data: grupo, error: grupoError } = await supabase
        .from('grupos')
        .select(`
          id,
          nombre,
          institucion_id,
          estudiantes (
            id,
            nombre_estudiante,
            apellido_estudiante,
            edad,
            genero
          )
        `)
        .eq('id', grupoId)
        .single();

      if (grupoError) throw grupoError;

      // Get responses for this group's students
      const studentIds = grupo.estudiantes.map((e: any) => e.id);
      const { data: respuestas, error: respuestasError } = await supabase
        .from('respuestas')
        .select('*')
        .in('estudiante_id', studentIds);

      if (respuestasError && respuestasError.code !== '42P01') {
        throw respuestasError;
      }

      return {
        grupo_id: grupo.id,
        grupo_nombre: grupo.nombre,
        institucion_id: grupo.institucion_id,
        estudiantes: grupo.estudiantes.map((e: any) => ({
          id: e.id,
          nombre: e.nombre_estudiante,
          apellido: e.apellido_estudiante,
          edad: e.edad,
          genero: e.genero
        })),
        respuestas: respuestas || [],
        fecha_evaluacion: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error parsing BULL-S data:', error);
      return null;
    }
  }

  /**
   * Generate example BULL-S data for demonstration
   */
  generateExampleData(grupoId: string): BullsEvaluationData {
    const grupos = {
      '1': { nombre: '6B', estudiantes: 25 },
      '2': { nombre: '8A', estudiantes: 30 },
      '3': { nombre: '8B', estudiantes: 28 }
    };

    const grupo = grupos[grupoId as keyof typeof grupos] || grupos['1'];
    
    // Generate students
    const estudiantes = Array.from({ length: grupo.estudiantes }, (_, i) => ({
      id: `${grupoId}_student_${i + 1}`,
      nombre: `Estudiante${i + 1}`,
      apellido: `Apellido${i + 1}`,
      edad: grupoId === '1' ? 11 + (i % 2) : 13 + (i % 2),
      genero: (i % 2 === 0 ? 'M' : 'F') as 'M' | 'F'
    }));

    // Generate realistic responses
    const respuestas: BullsResponse[] = [];
    const questions = [
      'play_with', 'work_with', 'best_friend', 'reject', 'aggressor', 'victim'
    ];

    estudiantes.forEach(estudiante => {
      questions.forEach(question => {
        // Generate 2-3 peer selections per question
        const numSelections = Math.floor(Math.random() * 2) + 2;
        const selectedPeers = this.getRandomPeers(estudiante.id, estudiantes, numSelections);
        
        respuestas.push({
          id: `${estudiante.id}_${question}`,
          estudiante_id: estudiante.id,
          pregunta_id: question,
          respuesta: question,
          companeros_seleccionados: selectedPeers,
          created_at: new Date().toISOString()
        });
      });
    });

    return {
      grupo_id: grupoId,
      grupo_nombre: grupo.nombre,
      institucion_id: '1',
      estudiantes,
      respuestas,
      fecha_evaluacion: new Date().toISOString()
    };
  }

  private getRandomPeers(excludeId: string, estudiantes: any[], count: number): string[] {
    const available = estudiantes.filter(e => e.id !== excludeId);
    const selected = [];
    
    for (let i = 0; i < Math.min(count, available.length); i++) {
      const randomIndex = Math.floor(Math.random() * available.length);
      selected.push(available[randomIndex].id);
      available.splice(randomIndex, 1);
    }
    
    return selected;
  }

  /**
   * Process sociometric data to create network analysis
   */
  async processSociometricData(data: BullsEvaluationData): Promise<SociometricAnalysis> {
    const nodes = this.createSociometricNodes(data);
    const edges = this.createSociometricEdges(data);
    
    // Calculate sociometric indices
    this.calculateSociometricIndices(nodes, edges);
    
    // Identify social clusters
    const clusters = this.identifySocialClusters(nodes, edges);
    
    // Calculate group metrics
    const groupMetrics = this.calculateGroupMetrics(nodes, edges);
    
    // Identify risk indicators
    const riskIndicators = this.identifyRiskIndicators(nodes, edges);
    
    // Generate recommendations
    const recommendations = this.generateRecommendations(nodes, edges, riskIndicators);

    return {
      nodes,
      edges,
      clusters,
      groupMetrics,
      riskIndicators,
      recommendations
    };
  }

  private createSociometricNodes(data: BullsEvaluationData): SociometricNode[] {
    return data.estudiantes.map(estudiante => ({
      id: estudiante.id,
      name: estudiante.nombre,
      fullName: `${estudiante.nombre} ${estudiante.apellido}`,
      age: estudiante.edad,
      gender: estudiante.genero,
      grupo_id: data.grupo_id,
      popularityScore: 0,
      rejectionScore: 0,
      isolationLevel: 0,
      centralityMeasure: 0,
      socialStatus: 'average' as const,
      bullyingRisk: 'low' as const,
      victimizationRisk: 'low' as const
    }));
  }

  private createSociometricEdges(data: BullsEvaluationData): SociometricEdge[] {
    const edges: SociometricEdge[] = [];
    
    data.respuestas.forEach(respuesta => {
      if (!respuesta.companeros_seleccionados) return;
      
      const edgeType = this.getEdgeType(respuesta.pregunta_id);
      const weight = this.getEdgeWeight(respuesta.pregunta_id);
      
      respuesta.companeros_seleccionados.forEach(targetId => {
        edges.push({
          source: respuesta.estudiante_id,
          target: targetId,
          type: edgeType,
          weight,
          reciprocal: false, // Will be calculated later
          questionType: respuesta.pregunta_id
        });
      });
    });

    // Calculate reciprocal relationships
    this.calculateReciprocity(edges);
    
    return edges;
  }

  private getEdgeType(questionId: string): 'positive' | 'negative' | 'neutral' {
    const positiveQuestions = ['play_with', 'work_with', 'best_friend'];
    const negativeQuestions = ['reject', 'aggressor'];
    
    if (positiveQuestions.includes(questionId)) return 'positive';
    if (negativeQuestions.includes(questionId)) return 'negative';
    return 'neutral';
  }

  private getEdgeWeight(questionId: string): number {
    const weights: { [key: string]: number } = {
      'best_friend': 3,
      'play_with': 2,
      'work_with': 2,
      'reject': -2,
      'aggressor': -3,
      'victim': 1
    };
    
    return weights[questionId] || 1;
  }

  private calculateReciprocity(edges: SociometricEdge[]): void {
    edges.forEach(edge => {
      const reciprocalEdge = edges.find(e => 
        e.source === edge.target && 
        e.target === edge.source && 
        e.questionType === edge.questionType
      );
      
      if (reciprocalEdge) {
        edge.reciprocal = true;
        reciprocalEdge.reciprocal = true;
      }
    });
  }

  private calculateSociometricIndices(nodes: SociometricNode[], edges: SociometricEdge[]): void {
    nodes.forEach(node => {
      // Calculate popularity (positive incoming edges)
      const positiveIncoming = edges.filter(e => 
        e.target === node.id && e.type === 'positive'
      );
      node.popularityScore = positiveIncoming.reduce((sum, e) => sum + e.weight, 0);
      
      // Calculate rejection (negative incoming edges)
      const negativeIncoming = edges.filter(e => 
        e.target === node.id && e.type === 'negative'
      );
      node.rejectionScore = Math.abs(negativeIncoming.reduce((sum, e) => sum + e.weight, 0));
      
      // Calculate isolation (lack of connections)
      const totalConnections = edges.filter(e => 
        e.source === node.id || e.target === node.id
      ).length;
      node.isolationLevel = Math.max(0, 10 - totalConnections);
      
      // Calculate centrality (total connections weighted)
      const outgoing = edges.filter(e => e.source === node.id);
      const incoming = edges.filter(e => e.target === node.id);
      node.centralityMeasure = (outgoing.length + incoming.length) / 2;
      
      // Determine social status
      node.socialStatus = this.determineSocialStatus(node);
      
      // Assess risks
      node.bullyingRisk = this.assessBullyingRisk(node, edges);
      node.victimizationRisk = this.assessVictimizationRisk(node, edges);
    });
  }

  private determineSocialStatus(node: SociometricNode): SociometricNode['socialStatus'] {
    const { popularityScore, rejectionScore, isolationLevel } = node;
    
    if (popularityScore >= 6 && rejectionScore <= 2) return 'popular';
    if (rejectionScore >= 4 && popularityScore <= 2) return 'rejected';
    if (isolationLevel >= 7) return 'isolated';
    if (popularityScore >= 4 && rejectionScore >= 4) return 'controversial';
    return 'average';
  }

  private assessBullyingRisk(node: SociometricNode, edges: SociometricEdge[]): 'low' | 'medium' | 'high' {
    const aggressorMentions = edges.filter(e => 
      e.target === node.id && e.questionType === 'aggressor'
    ).length;
    
    const highPopularity = node.popularityScore >= 6;
    const highRejection = node.rejectionScore >= 4;
    
    if (aggressorMentions >= 3 || (highPopularity && highRejection)) return 'high';
    if (aggressorMentions >= 1 || highRejection) return 'medium';
    return 'low';
  }

  private assessVictimizationRisk(node: SociometricNode, edges: SociometricEdge[]): 'low' | 'medium' | 'high' {
    const victimMentions = edges.filter(e => 
      e.target === node.id && e.questionType === 'victim'
    ).length;
    
    const highIsolation = node.isolationLevel >= 6;
    const highRejection = node.rejectionScore >= 4;
    
    if (victimMentions >= 3 || (highIsolation && highRejection)) return 'high';
    if (victimMentions >= 1 || highIsolation || highRejection) return 'medium';
    return 'low';
  }

  private identifySocialClusters(nodes: SociometricNode[], edges: SociometricEdge[]): SocialCluster[] {
    const clusters: SocialCluster[] = [];
    const visited = new Set<string>();
    
    nodes.forEach(node => {
      if (visited.has(node.id)) return;
      
      const cluster = this.findConnectedComponent(node.id, nodes, edges, visited);
      if (cluster.length >= 3) { // Minimum cluster size
        const cohesionScore = this.calculateClusterCohesion(cluster, edges);
        const centralMember = this.findCentralMember(cluster, edges);
        const isolatedMembers = cluster.filter(id => 
          nodes.find(n => n.id === id)?.isolationLevel >= 5
        );
        
        clusters.push({
          id: `cluster_${clusters.length + 1}`,
          members: cluster,
          cohesionScore,
          size: cluster.length,
          centralMember,
          isolatedMembers
        });
      }
    });
    
    return clusters;
  }

  private findConnectedComponent(
    startId: string, 
    nodes: SociometricNode[], 
    edges: SociometricEdge[], 
    visited: Set<string>
  ): string[] {
    const component: string[] = [];
    const queue = [startId];
    
    while (queue.length > 0) {
      const currentId = queue.shift()!;
      if (visited.has(currentId)) continue;
      
      visited.add(currentId);
      component.push(currentId);
      
      // Find connected nodes (positive relationships only)
      const connections = edges.filter(e => 
        (e.source === currentId || e.target === currentId) && 
        e.type === 'positive' && 
        e.weight >= 2
      );
      
      connections.forEach(edge => {
        const connectedId = edge.source === currentId ? edge.target : edge.source;
        if (!visited.has(connectedId)) {
          queue.push(connectedId);
        }
      });
    }
    
    return component;
  }

  private calculateClusterCohesion(cluster: string[], edges: SociometricEdge[]): number {
    if (cluster.length < 2) return 0;
    
    const possibleConnections = cluster.length * (cluster.length - 1);
    const actualConnections = edges.filter(e => 
      cluster.includes(e.source) && 
      cluster.includes(e.target) && 
      e.type === 'positive'
    ).length;
    
    return (actualConnections / possibleConnections) * 100;
  }

  private findCentralMember(cluster: string[], edges: SociometricEdge[]): string {
    let maxConnections = 0;
    let centralMember = cluster[0];
    
    cluster.forEach(memberId => {
      const connections = edges.filter(e => 
        (e.source === memberId || e.target === memberId) && 
        cluster.includes(e.source) && 
        cluster.includes(e.target) && 
        e.type === 'positive'
      ).length;
      
      if (connections > maxConnections) {
        maxConnections = connections;
        centralMember = memberId;
      }
    });
    
    return centralMember;
  }

  private calculateGroupMetrics(nodes: SociometricNode[], edges: SociometricEdge[]) {
    const totalNodes = nodes.length;
    const positiveEdges = edges.filter(e => e.type === 'positive');
    const reciprocalEdges = edges.filter(e => e.reciprocal);
    
    // Cohesion index (average positive connections per student)
    const cohesionIndex = (positiveEdges.length / totalNodes) * 10;
    
    // Density index (actual connections / possible connections)
    const possibleConnections = totalNodes * (totalNodes - 1);
    const densityIndex = (edges.length / possibleConnections) * 100;
    
    // Centrality distribution (variance in centrality scores)
    const centralityScores = nodes.map(n => n.centralityMeasure);
    const meanCentrality = centralityScores.reduce((a, b) => a + b, 0) / totalNodes;
    const centralityVariance = centralityScores.reduce((sum, score) => 
      sum + Math.pow(score - meanCentrality, 2), 0) / totalNodes;
    const centralityDistribution = Math.sqrt(centralityVariance);
    
    // Isolation rate
    const isolatedStudents = nodes.filter(n => n.isolationLevel >= 6).length;
    const isolationRate = (isolatedStudents / totalNodes) * 100;
    
    // Reciprocity rate
    const reciprocityRate = (reciprocalEdges.length / edges.length) * 100;
    
    return {
      cohesionIndex: Math.round(cohesionIndex),
      densityIndex: Math.round(densityIndex),
      centralityDistribution: Math.round(centralityDistribution),
      isolationRate: Math.round(isolationRate),
      reciprocityRate: Math.round(reciprocityRate)
    };
  }

  private identifyRiskIndicators(nodes: SociometricNode[], edges: SociometricEdge[]) {
    return {
      highRiskStudents: nodes
        .filter(n => n.bullyingRisk === 'high' || n.victimizationRisk === 'high')
        .map(n => n.id),
      potentialVictims: nodes
        .filter(n => n.victimizationRisk === 'high' || n.socialStatus === 'rejected')
        .map(n => n.id),
      potentialAggressors: nodes
        .filter(n => n.bullyingRisk === 'high')
        .map(n => n.id),
      isolatedStudents: nodes
        .filter(n => n.socialStatus === 'isolated')
        .map(n => n.id),
      controversialStudents: nodes
        .filter(n => n.socialStatus === 'controversial')
        .map(n => n.id)
    };
  }

  private generateRecommendations(
    nodes: SociometricNode[], 
    edges: SociometricEdge[], 
    riskIndicators: any
  ): string[] {
    const recommendations: string[] = [];
    
    // High-risk students
    if (riskIndicators.highRiskStudents.length > 0) {
      recommendations.push(
        `Atención inmediata requerida para ${riskIndicators.highRiskStudents.length} estudiante(s) de alto riesgo`
      );
    }
    
    // Isolated students
    if (riskIndicators.isolatedStudents.length > 0) {
      recommendations.push(
        `Implementar actividades de integración para ${riskIndicators.isolatedStudents.length} estudiante(s) aislado(s)`
      );
    }
    
    // Potential victims
    if (riskIndicators.potentialVictims.length > 0) {
      recommendations.push(
        `Monitoreo cercano y apoyo para ${riskIndicators.potentialVictims.length} potencial(es) víctima(s)`
      );
    }
    
    // Group cohesion
    const avgCohesion = nodes.reduce((sum, n) => sum + n.centralityMeasure, 0) / nodes.length;
    if (avgCohesion < 3) {
      recommendations.push('Implementar actividades grupales para mejorar la cohesión social');
    }
    
    // Reciprocity
    const reciprocalConnections = edges.filter(e => e.reciprocal).length;
    const reciprocityRate = (reciprocalConnections / edges.length) * 100;
    if (reciprocityRate < 40) {
      recommendations.push('Fomentar actividades que promuevan relaciones recíprocas');
    }
    
    return recommendations;
  }

  /**
   * Generate comprehensive analysis report
   */
  async generateAnalysisReport(analysis: SociometricAnalysis, data: BullsEvaluationData): Promise<string> {
    const report = `
# Análisis Sociométrico BULL-S
## Grupo: ${data.grupo_nombre}
## Fecha: ${new Date(data.fecha_evaluacion).toLocaleDateString('es-ES')}

### Resumen Ejecutivo
- **Total de estudiantes**: ${data.estudiantes.length}
- **Respuestas analizadas**: ${data.respuestas.length}
- **Índice de cohesión grupal**: ${analysis.groupMetrics.cohesionIndex}%
- **Tasa de aislamiento**: ${analysis.groupMetrics.isolationRate}%

### Indicadores de Riesgo
- **Estudiantes de alto riesgo**: ${analysis.riskIndicators.highRiskStudents.length}
- **Potenciales víctimas**: ${analysis.riskIndicators.potentialVictims.length}
- **Potenciales agresores**: ${analysis.riskIndicators.potentialAggressors.length}
- **Estudiantes aislados**: ${analysis.riskIndicators.isolatedStudents.length}

### Análisis de Red Social
- **Densidad de la red**: ${analysis.groupMetrics.densityIndex}%
- **Tasa de reciprocidad**: ${analysis.groupMetrics.reciprocityRate}%
- **Clusters sociales identificados**: ${analysis.clusters.length}

### Recomendaciones
${analysis.recommendations.map(rec => `- ${rec}`).join('\n')}

### Estudiantes que Requieren Atención Especial
${analysis.nodes
  .filter(n => n.bullyingRisk === 'high' || n.victimizationRisk === 'high')
  .map(n => `- ${n.fullName}: ${n.socialStatus} (Riesgo: ${n.bullyingRisk}/${n.victimizationRisk})`)
  .join('\n')}
`;

    return report;
  }

  /**
   * Export analysis data to informe directory
   */
  async exportAnalysisData(analysis: SociometricAnalysis, data: BullsEvaluationData): Promise<void> {
    try {
      const timestamp = new Date().toISOString().split('T')[0];
      const filename = `analisis_sociometrico_${data.grupo_nombre}_${timestamp}`;
      
      // Generate report
      const report = await this.generateAnalysisReport(analysis, data);
      
      // Export JSON data
      const jsonData = {
        metadata: {
          grupo: data.grupo_nombre,
          fecha: data.fecha_evaluacion,
          total_estudiantes: data.estudiantes.length
        },
        analysis,
        raw_data: data
      };
      
      console.log('📊 Análisis sociométrico completado');
      console.log('📁 Datos exportados:', {
        report: `${filename}.md`,
        data: `${filename}.json`,
        nodes: analysis.nodes.length,
        edges: analysis.edges.length,
        clusters: analysis.clusters.length
      });
      
      // In a real implementation, these would be written to files
      // For now, we'll store them in memory or localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem(`bulls_analysis_${data.grupo_id}`, JSON.stringify(jsonData));
        localStorage.setItem(`bulls_report_${data.grupo_id}`, report);
      }
      
    } catch (error) {
      console.error('Error exporting analysis data:', error);
    }
  }
}

export default new BullsAnalysisService();