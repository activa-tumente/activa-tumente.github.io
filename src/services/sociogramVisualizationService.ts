/**
 * Servicio para visualización de sociogramas
 */

/**
 * Configuración para visualización del sociograma
 */
interface SociogramConfig {
  width: number;
  height: number;
  nodeRadius: number;
  linkDistance: number;
  charge: number;
  colors: {
    popular: string;
    promedio: string;
    aislado: string;
    rechazado: string;
    controvertido: string;
  };
  edgeColors: {
    eleccion: string;
    rechazo: string;
    reciprocaPositiva: string;
    reciprocaNegativa: string;
  };
  intensityColors: {
    bajo: string;
    medio: string;
    alto: string;
  };
}

/**
 * Nodo del sociograma
 */
interface SociogramNode {
  id: string;
  name: string;
  x: number;
  y: number;
  size: number;
  color: string;
  type: 'student' | 'teacher';
  metrics: {
    popularity: number;
    rejection: number;
    influence: number;
  };
}

/**
 * Arista del sociograma
 */
interface SociogramEdge {
  source: string;
  target: string;
  weight: number;
  type: 'positive' | 'negative' | 'neutral';
  color: string;
  width: number;
}

/**
 * Cluster social
 */
interface SocialCluster {
  id: string;
  nodes: string[];
  color: string;
  label: string;
  cohesion: number;
}

/**
 * Datos para exportación del sociograma
 */
interface SociogramExportData {
  nodes: SociogramNode[];
  edges: SociogramEdge[];
  clusters: SocialCluster[];
  config: SociogramConfig;
  metadata: {
    generatedAt: string;
    groupId: string;
    totalNodes: number;
    totalEdges: number;
  };
}

/**
 * Servicio para visualización de sociogramas
 */
class SociogramVisualizationService {
  
  /**
   * Configuración por defecto
   */
  private defaultConfig: SociogramConfig = {
    width: 1000,
    height: 700,
    nodeRadius: 20,
    linkDistance: 100,
    charge: -300,
    colors: {
      popular: '#4CAF50',
      promedio: '#2196F3',
      aislado: '#FF9800',
      rechazado: '#F44336',
      controvertido: '#9C27B0'
    },
    edgeColors: {
      eleccion: '#4CAF50',
      rechazo: '#F44336',
      reciprocaPositiva: '#8BC34A',
      reciprocaNegativa: '#E91E63'
    },
    intensityColors: {
      bajo: '#E0E0E0',
      medio: '#9E9E9E',
      alto: '#424242'
    }
  };

  /**
   * Genera datos del sociograma básicos
   */
  generateSociogramData(): SociogramExportData {
    const nodes: SociogramNode[] = [];
    const edges: SociogramEdge[] = [];
    const clusters: SocialCluster[] = [];

    return {
      nodes,
      edges,
      clusters,
      config: this.defaultConfig,
      metadata: {
        generatedAt: new Date().toISOString(),
        groupId: 'default',
        totalNodes: nodes.length,
        totalEdges: edges.length
      }
    };
  }

  /**
   * Exporta el sociograma como SVG
   */
  exportAsSVG(data: SociogramExportData): string {
    return `<svg width="${data.config.width}" height="${data.config.height}" xmlns="http://www.w3.org/2000/svg"></svg>`;
  }

  /**
   * Calcula métricas básicas
   */
  calculateMetrics(data: SociogramExportData) {
    return {
      density: 0,
      averageDegree: 0,
      clusteringCoefficient: 0,
      centralityMeasures: []
    };
  }
}

export default new SociogramVisualizationService();
export type { SociogramConfig, SociogramNode, SociogramEdge, SocialCluster, SociogramExportData };
