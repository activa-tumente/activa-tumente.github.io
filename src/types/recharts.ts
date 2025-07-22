// Tipos para los datos de gráficos
export interface ChartDataPoint {
  name: string;
  value: number;
  color?: string;
  [key: string]: any;
}

// Tipos para los datos de sociograma
export interface SociogramData {
  nodes: SociogramNode[];
  links: SociogramLink[];
}

export interface SociogramNode {
  id: string;
  name: string;
  group: string;
  status?: string;
  size?: number;
}

export interface SociogramLink {
  source: string;
  target: string;
  value: number;
  type?: string;
}

// Tipos para los datos de barras
export interface BarChartDataPoint {
  name: string;
  value: number;
  [key: string]: any;
}

// Tipos para los datos de factores de riesgo
export interface RiskFactor {
  name: string;
  value: number;
  category: string;
}

// Tipos para los datos de comparación
export interface ComparisonData {
  name: string;
  group: number;
  average: number;
}
