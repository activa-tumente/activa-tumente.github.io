/**
 * Configuración principal de la aplicación BULL-S
 */

export const APP_CONFIG = {
  // Información de la aplicación
  name: 'BULL-S Analysis Platform',
  version: '2.0.0',
  description: 'Sistema de Análisis Sociométrico para Detección de Bullying',
  
  // Configuración de análisis
  analysis: {
    defaultGroupId: 'grupo_6ab_lasalle',
    enableSampleData: true,
    maxStudentsPerGroup: 50,
    minResponseRate: 0.7, // 70% mínimo de respuestas válidas
    alertThresholds: {
      critical: 0.8,
      high: 0.6,
      medium: 0.4,
      low: 0.2
    }
  },

  // Configuración de exportación
  export: {
    maxFileSize: 10 * 1024 * 1024, // 10MB
    supportedFormats: ['pdf', 'csv', 'json', 'html'],
    defaultFormat: 'html',
    includeRawData: false
  },

  // Configuración de UI
  ui: {
    theme: 'light',
    language: 'es',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '24h',
    itemsPerPage: 20,
    animationDuration: 300
  },

  // Configuración de notificaciones
  notifications: {
    enabled: true,
    timeout: 5000,
    position: 'top-right',
    maxVisible: 5
  },

  // Configuración de telemetría
  telemetry: {
    enabled: true,
    endpoint: '/api/telemetry',
    batchSize: 10,
    flushInterval: 30000 // 30 segundos
  },

  // Configuración de seguridad
  security: {
    sessionTimeout: 8 * 60 * 60 * 1000, // 8 horas
    maxLoginAttempts: 5,
    passwordMinLength: 8,
    enableTwoFactor: false
  },

  // URLs y endpoints
  api: {
    baseUrl: import.meta.env.VITE_API_BASE_URL || '/api',
    timeout: 30000,
    retryAttempts: 3,
    retryDelay: 1000
  },

  // Configuración de Supabase
  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL || '',
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
    enableRealtime: true,
    enableAuth: true
  },

  // Configuración de desarrollo
  development: {
    enableDebugMode: import.meta.env.DEV,
    logLevel: import.meta.env.VITE_LOG_LEVEL || 'info',
    showPerformanceMetrics: false,
    enableHotReload: true
  },

  // Configuración de características
  features: {
    enableRealTimeStats: true,
    enableAdvancedFilters: true,
    enableBulkExport: true,
    enableNotifications: true,
    enableTelemetry: true,
    enableSampleDataGeneration: true
  },

  // Configuración de límites
  limits: {
    maxStudentsPerAnalysis: 100,
    maxGroupsPerInstitution: 20,
    maxAnalysisHistoryDays: 365,
    maxExportFileSize: 50 * 1024 * 1024, // 50MB
    maxConcurrentAnalysis: 3
  },

  // Configuración de cache
  cache: {
    enableClientCache: true,
    defaultTTL: 5 * 60 * 1000, // 5 minutos
    maxCacheSize: 100 * 1024 * 1024, // 100MB
    enablePersistentCache: true
  },

  // Configuración de métricas sociométricas
  sociometric: {
    popularityThreshold: 70,
    rejectionThreshold: 30,
    isolationThreshold: 20,
    densityThreshold: 40,
    reciprocityThreshold: 50,
    clusterMinSize: 3,
    clusterMaxSize: 8
  },

  // Configuración de roles de bullying
  bullying: {
    aggressorThreshold: 60,
    victimThreshold: 40,
    observerThreshold: 30,
    enableAutomaticClassification: true,
    requireManualValidation: true
  },

  // Configuración de alertas
  alerts: {
    enableRealTimeAlerts: true,
    criticalAlertThreshold: 0.8,
    highAlertThreshold: 0.6,
    mediumAlertThreshold: 0.4,
    autoEscalationEnabled: true,
    notificationChannels: ['email', 'dashboard', 'system']
  },

  // Configuración de reportes
  reports: {
    enableScheduledReports: true,
    defaultReportFormat: 'html',
    includeRecommendations: true,
    includeGraphics: true,
    enableComparison: true,
    retentionDays: 90
  }
};

// Configuración específica por entorno
export const getEnvironmentConfig = () => {
  const env = import.meta.env.MODE || 'development';
  
  const envConfigs = {
    development: {
      ...APP_CONFIG,
      development: {
        ...APP_CONFIG.development,
        enableDebugMode: true,
        logLevel: 'debug',
        showPerformanceMetrics: true
      },
      api: {
        ...APP_CONFIG.api,
        timeout: 60000 // Mayor timeout en desarrollo
      }
    },
    
    production: {
      ...APP_CONFIG,
      development: {
        ...APP_CONFIG.development,
        enableDebugMode: false,
        logLevel: 'error',
        showPerformanceMetrics: false
      },
      telemetry: {
        ...APP_CONFIG.telemetry,
        enabled: true
      },
      security: {
        ...APP_CONFIG.security,
        enableTwoFactor: true
      }
    },
    
    test: {
      ...APP_CONFIG,
      analysis: {
        ...APP_CONFIG.analysis,
        enableSampleData: true
      },
      telemetry: {
        ...APP_CONFIG.telemetry,
        enabled: false
      },
      notifications: {
        ...APP_CONFIG.notifications,
        enabled: false
      }
    }
  };

  return envConfigs[env as keyof typeof envConfigs] || envConfigs.development;
};

export default APP_CONFIG;