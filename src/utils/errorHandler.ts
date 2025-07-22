/**
 * Sistema de manejo de errores para la aplicación BULL-S
 */

export interface AppError {
  code: string;
  message: string;
  details?: any;
  timestamp: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  component?: string;
  userId?: string;
}

export class ErrorHandler {
  private static errors: AppError[] = [];
  private static maxErrors = 100;

  /**
   * Registra un error en el sistema
   */
  static logError(
    code: string,
    message: string,
    details?: any,
    severity: AppError['severity'] = 'medium',
    component?: string
  ): AppError {
    const error: AppError = {
      code,
      message,
      details,
      timestamp: new Date().toISOString(),
      severity,
      component
    };

    // Agregar a la lista de errores
    this.errors.unshift(error);
    
    // Mantener solo los últimos errores
    if (this.errors.length > this.maxErrors) {
      this.errors = this.errors.slice(0, this.maxErrors);
    }

    // Log en consola según severidad
    switch (severity) {
      case 'critical':
        console.error(`🚨 CRÍTICO [${code}]:`, message, details);
        break;
      case 'high':
        console.error(`❌ ALTO [${code}]:`, message, details);
        break;
      case 'medium':
        console.warn(`⚠️ MEDIO [${code}]:`, message, details);
        break;
      case 'low':
        console.info(`ℹ️ BAJO [${code}]:`, message, details);
        break;
    }

    // Enviar a telemetría si está habilitada
    this.sendToTelemetry(error);

    return error;
  }

  /**
   * Maneja errores de Supabase
   */
  static handleSupabaseError(error: any, component: string = 'supabase'): AppError {
    const errorCode = error.code || 'SUPABASE_UNKNOWN';
    const errorMessage = error.message || 'Error desconocido de Supabase';
    
    let severity: AppError['severity'] = 'medium';
    let userMessage = 'Error en la base de datos';

    // Clasificar errores comunes de Supabase
    switch (errorCode) {
      case 'PGRST116':
        severity = 'high';
        userMessage = 'Error de permisos. Contacta al administrador.';
        break;
      case '42P01':
        severity = 'critical';
        userMessage = 'Error de configuración de base de datos.';
        break;
      case '42501':
        severity = 'high';
        userMessage = 'Permisos insuficientes para esta operación.';
        break;
      case '23505':
        severity = 'medium';
        userMessage = 'Ya existe un registro con estos datos.';
        break;
      case '23503':
        severity = 'medium';
        userMessage = 'Error de integridad de datos.';
        break;
      case 'PGRST301':
        severity = 'low';
        userMessage = 'No se encontraron datos.';
        break;
      default:
        severity = 'medium';
        userMessage = 'Error en la operación de base de datos.';
    }

    return this.logError(
      `SUPABASE_${errorCode}`,
      userMessage,
      {
        originalError: errorMessage,
        details: error.details,
        hint: error.hint
      },
      severity,
      component
    );
  }

  /**
   * Maneja errores de análisis sociométrico
   */
  static handleAnalysisError(error: any, analysisType: string = 'general'): AppError {
    const errorMessage = error.message || 'Error en análisis sociométrico';
    
    return this.logError(
      'ANALYSIS_ERROR',
      `Error en análisis ${analysisType}: ${errorMessage}`,
      {
        analysisType,
        originalError: error,
        stack: error.stack
      },
      'high',
      'sociometric-analysis'
    );
  }

  /**
   * Maneja errores de exportación
   */
  static handleExportError(error: any, format: string): AppError {
    return this.logError(
      'EXPORT_ERROR',
      `Error al exportar en formato ${format}`,
      {
        format,
        originalError: error.message,
        stack: error.stack
      },
      'medium',
      'export'
    );
  }

  /**
   * Maneja errores de autenticación
   */
  static handleAuthError(error: any): AppError {
    let severity: AppError['severity'] = 'medium';
    let userMessage = 'Error de autenticación';

    if (error.message?.includes('Invalid login credentials')) {
      userMessage = 'Credenciales incorrectas';
      severity = 'low';
    } else if (error.message?.includes('Email not confirmed')) {
      userMessage = 'Email no confirmado';
      severity = 'medium';
    } else if (error.message?.includes('Too many requests')) {
      userMessage = 'Demasiados intentos. Intenta más tarde.';
      severity = 'high';
    }

    return this.logError(
      'AUTH_ERROR',
      userMessage,
      {
        originalError: error.message,
        code: error.code
      },
      severity,
      'authentication'
    );
  }

  /**
   * Obtiene errores recientes
   */
  static getRecentErrors(limit: number = 10): AppError[] {
    return this.errors.slice(0, limit);
  }

  /**
   * Obtiene errores por severidad
   */
  static getErrorsBySeverity(severity: AppError['severity']): AppError[] {
    return this.errors.filter(error => error.severity === severity);
  }

  /**
   * Obtiene errores por componente
   */
  static getErrorsByComponent(component: string): AppError[] {
    return this.errors.filter(error => error.component === component);
  }

  /**
   * Limpia errores antiguos
   */
  static clearOldErrors(olderThanHours: number = 24): void {
    const cutoffTime = new Date(Date.now() - olderThanHours * 60 * 60 * 1000);
    this.errors = this.errors.filter(error => 
      new Date(error.timestamp) > cutoffTime
    );
  }

  /**
   * Obtiene estadísticas de errores
   */
  static getErrorStats(): {
    total: number;
    bySeverity: Record<AppError['severity'], number>;
    byComponent: Record<string, number>;
    recent: number; // últimas 24 horas
  } {
    const now = new Date();
    const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    const bySeverity: Record<AppError['severity'], number> = {
      low: 0,
      medium: 0,
      high: 0,
      critical: 0
    };

    const byComponent: Record<string, number> = {};
    let recent = 0;

    this.errors.forEach(error => {
      bySeverity[error.severity]++;
      
      if (error.component) {
        byComponent[error.component] = (byComponent[error.component] || 0) + 1;
      }

      if (new Date(error.timestamp) > last24h) {
        recent++;
      }
    });

    return {
      total: this.errors.length,
      bySeverity,
      byComponent,
      recent
    };
  }

  /**
   * Envía error a sistema de telemetría
   */
  private static sendToTelemetry(error: AppError): void {
    try {
      // En una implementación real, enviarías a un servicio de telemetría
      if (import.meta.env.VITE_ENABLE_TELEMETRY === 'true') {
        // Simular envío a telemetría
        console.debug('📊 Enviando error a telemetría:', error.code);
      }
    } catch (telemetryError) {
      console.warn('Error enviando a telemetría:', telemetryError);
    }
  }

  /**
   * Crea un mensaje de error amigable para el usuario
   */
  static createUserFriendlyMessage(error: AppError): string {
    const baseMessage = error.message;
    
    const suggestions: Record<string, string> = {
      'SUPABASE_': 'Verifica tu conexión a internet e intenta nuevamente.',
      'ANALYSIS_': 'Revisa los datos ingresados y vuelve a ejecutar el análisis.',
      'EXPORT_': 'Intenta exportar en un formato diferente o reduce el tamaño de los datos.',
      'AUTH_': 'Verifica tus credenciales e intenta iniciar sesión nuevamente.'
    };

    let suggestion = '';
    for (const [prefix, msg] of Object.entries(suggestions)) {
      if (error.code.startsWith(prefix)) {
        suggestion = ` ${msg}`;
        break;
      }
    }

    return `${baseMessage}${suggestion}`;
  }

  /**
   * Verifica si hay errores críticos recientes
   */
  static hasCriticalErrors(withinHours: number = 1): boolean {
    const cutoffTime = new Date(Date.now() - withinHours * 60 * 60 * 1000);
    return this.errors.some(error => 
      error.severity === 'critical' && 
      new Date(error.timestamp) > cutoffTime
    );
  }

  /**
   * Exporta errores para análisis
   */
  static exportErrors(): string {
    return JSON.stringify({
      exportDate: new Date().toISOString(),
      totalErrors: this.errors.length,
      errors: this.errors,
      stats: this.getErrorStats()
    }, null, 2);
  }
}

// Manejador global de errores no capturados
window.addEventListener('error', (event) => {
  ErrorHandler.logError(
    'UNCAUGHT_ERROR',
    event.message,
    {
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      stack: event.error?.stack
    },
    'high',
    'global'
  );
});

// Manejador de promesas rechazadas
window.addEventListener('unhandledrejection', (event) => {
  ErrorHandler.logError(
    'UNHANDLED_PROMISE_REJECTION',
    'Promesa rechazada no manejada',
    {
      reason: event.reason,
      promise: event.promise
    },
    'high',
    'global'
  );
});

export default ErrorHandler;