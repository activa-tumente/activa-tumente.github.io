/**
 * Tipos de datos para análisis sociométrico BULL-S
 */

export interface EstudianteResponse {
    id: string;
    nombre: string;
    grupo_id: string;
    numero_documento?: string;
    edad?: number;
    genero?: 'M' | 'F';
}

export interface RespuestaSociometrica {
    estudiante_id: string;
    pregunta_id: string;
    respuesta: string | number;
    tipo_respuesta: 'eleccion' | 'rechazo' | 'agresion' | 'victimizacion';
    timestamp: string;
}

export interface RelacionSocial {
    origen_id: string;
    destino_id: string;
    tipo: 'eleccion' | 'rechazo' | 'agresion' | 'victimizacion';
    intensidad: number; // 1-5 scale
    reciproca: boolean;
}

export interface IndicesSociometricos {
    estudiante_id: string;
    popularidad: number; // 0-100
    rechazo: number; // 0-100
    aislamiento: number; // 0-100
    centralidad: number; // 0-100
    influencia_social: number; // 0-100
    estatus_social: 'popular' | 'promedio' | 'aislado' | 'rechazado' | 'controvertido';
    rol_bullying: 'agresor' | 'victima' | 'victima_provocador' | 'observador' | 'no_implicado';
    nivel_riesgo: 'bajo' | 'medio' | 'alto' | 'critico';
}

export interface ClusterSocial {
    id: string;
    nombre: string;
    miembros: string[]; // estudiante_ids
    densidad: number;
    cohesion: number;
    tipo: 'positivo' | 'neutro' | 'problematico';
}

export interface MetricasRed {
    densidad_general: number;
    reciprocidad: number;
    transitividad: number;
    modularidad: number;
    numero_clusters: number;
    estudiantes_aislados: number;
}

export interface AlertaSociometrica {
    id: string;
    estudiante_id: string;
    tipo: 'aislamiento' | 'rechazo_masivo' | 'agresor' | 'victima' | 'cluster_problematico' | 'polarizacion';
    severidad: 'bajo' | 'medio' | 'alto' | 'critico';
    descripcion: string;
    evidencia: string[];
    recomendaciones: string[];
    fecha_deteccion: string;
    fecha_seguimiento: string;
}

export interface SociogramNode {
    id: string;
    nombre: string;
    x?: number;
    y?: number;
    size: number;
    color: string;
    estatus: string;
    rol_bullying: string;
    indices: IndicesSociometricos;
}

export interface SociogramEdge {
    source: string;
    target: string;
    tipo: 'eleccion' | 'rechazo' | 'agresion';
    intensidad: number;
    reciproca: boolean;
    color: string;
    width: number;
}

export interface SociogramData {
    nodes: SociogramNode[];
    edges: SociogramEdge[];
    clusters: ClusterSocial[];
    metricas: MetricasRed;
}

export interface AnalisisSociometrico {
    grupo_id: string;
    fecha_analisis: string;
    estudiantes: EstudianteResponse[];
    relaciones: RelacionSocial[];
    indices_individuales: IndicesSociometricos[];
    clusters: ClusterSocial[];
    metricas_red: MetricasRed;
    alertas: AlertaSociometrica[];
    sociograma: SociogramData;
    resumen_ejecutivo: {
        total_estudiantes: number;
        tasa_respuesta: number;
        distribucion_estatus: Record<string, number>;
        distribucion_roles: Record<string, number>;
        alertas_criticas: number;
        recomendaciones_principales: string[];
    };
}

export interface RecomendacionIntervencion {
    tipo: 'individual' | 'grupal' | 'institucional';
    prioridad: 'baja' | 'media' | 'alta' | 'critica';
    descripcion: string;
    acciones_especificas: string[];
    recursos_necesarios: string[];
    tiempo_estimado: string;
    responsables: string[];
    indicadores_exito: string[];
}

export interface InformeSociometrico {
    analisis: AnalisisSociometrico;
    recomendaciones: RecomendacionIntervencion[];
    anexos: {
        datos_brutos: any;
        metodologia: string;
        referencias: string[];
    };
}