/**
 * Servicio de telemetría para monitorizar problemas de conexión y errores
 */

// Tipos de eventos de telemetría
export enum TelemetryEventType {
  ERROR = 'error',
  CONNECTION = 'connection',
  PERFORMANCE = 'performance',
  USER_ACTION = 'user_action',
  AUTH = 'auth',
  DIAGNOSTIC = 'diagnostic'
}

// Interfaz para eventos de telemetría
export interface TelemetryEvent {
  type: TelemetryEventType;
  name: string;
  timestamp: number;
  data?: any;
}

// Interfaz para eventos de error
export interface ErrorEvent extends TelemetryEvent {
  type: TelemetryEventType.ERROR;
  error: {
    message: string;
    stack?: string;
    code?: string;
  };
  context?: {
    component?: string;
    action?: string;
    [key: string]: any;
  };
}

// Interfaz para eventos de conexión
export interface ConnectionEvent extends TelemetryEvent {
  type: TelemetryEventType.CONNECTION;
  status: 'success' | 'failure' | 'timeout';
  duration: number;
  endpoint?: string;
}

// Interfaz para eventos de autenticación
export interface AuthEvent extends TelemetryEvent {
  type: TelemetryEventType.AUTH;
  action: 'login' | 'logout' | 'refresh' | 'signup' | 'password_reset';
  success: boolean;
  userId?: string;
  error?: string;
}

// Interfaz para eventos de diagnóstico
export interface DiagnosticEvent extends TelemetryEvent {
  type: TelemetryEventType.DIAGNOSTIC;
  category: 'auth' | 'database' | 'network' | 'app' | 'other';
  level: 'info' | 'warning' | 'error' | 'critical';
  details: any;
}

// Clase para gestionar la telemetría
class TelemetryService {
  private events: TelemetryEvent[] = [];
  private maxEvents: number = 100;
  private isEnabled: boolean = true;
  private consoleLogging: boolean = true;
  private serverEndpoint: string | null = null;

  /**
   * Registrar un evento de telemetría
   * @param event Evento a registrar
   */
  trackEvent(event: TelemetryEvent): void {
    if (!this.isEnabled) return;

    // Añadir el evento a la lista
    this.events.push({
      ...event,
      timestamp: event.timestamp || Date.now()
    });

    // Limitar el número de eventos almacenados
    if (this.events.length > this.maxEvents) {
      this.events.shift();
    }

    // Registrar en consola si está habilitado
    if (this.consoleLogging) {
      console.log(`[Telemetry] ${event.type}:${event.name}`, event.data || '');
    }

    // Enviar al servidor si hay un endpoint configurado
    this.sendToServer(event);
  }

  /**
   * Registrar un error
   * @param message Mensaje de error
   * @param error Objeto de error
   * @param context Contexto adicional
   */
  trackError(message: string, error: Error | any, context?: any): void {
    const errorEvent: ErrorEvent = {
      type: TelemetryEventType.ERROR,
      name: message,
      timestamp: Date.now(),
      error: {
        message: error?.message || String(error),
        stack: error?.stack,
        code: error?.code
      },
      context
    };

    this.trackEvent(errorEvent);
  }

  /**
   * Registrar un evento de conexión
   * @param status Estado de la conexión
   * @param duration Duración de la conexión en ms
   * @param endpoint Endpoint al que se conectó
   */
  trackConnection(status: 'success' | 'failure' | 'timeout', duration: number, endpoint?: string): void {
    const connectionEvent: ConnectionEvent = {
      type: TelemetryEventType.CONNECTION,
      name: `connection_${status}`,
      timestamp: Date.now(),
      status,
      duration,
      endpoint
    };

    this.trackEvent(connectionEvent);
  }

  /**
   * Registrar un evento de autenticación
   * @param action Acción de autenticación
   * @param success Si la acción fue exitosa
   * @param userId ID del usuario (opcional)
   * @param error Error si lo hubo (opcional)
   */
  trackAuth(action: 'login' | 'logout' | 'refresh' | 'signup' | 'password_reset', success: boolean, userId?: string, error?: string): void {
    const authEvent: AuthEvent = {
      type: TelemetryEventType.AUTH,
      name: `auth_${action}`,
      timestamp: Date.now(),
      action,
      success,
      userId,
      error
    };

    this.trackEvent(authEvent);
  }

  /**
   * Registrar un evento de diagnóstico
   * @param category Categoría del diagnóstico
   * @param level Nivel de importancia
   * @param name Nombre del evento
   * @param details Detalles adicionales
   */
  trackDiagnostic(category: 'auth' | 'database' | 'network' | 'app' | 'other', level: 'info' | 'warning' | 'error' | 'critical', name: string, details: any): void {
    const diagnosticEvent: DiagnosticEvent = {
      type: TelemetryEventType.DIAGNOSTIC,
      name: `diagnostic_${category}_${name}`,
      timestamp: Date.now(),
      category,
      level,
      details
    };

    this.trackEvent(diagnosticEvent);

    // Para diagnósticos críticos, también registrar como error para mayor visibilidad
    if (level === 'critical') {
      this.trackError(`Critical diagnostic: ${name}`, new Error(JSON.stringify(details)), { category });
    }
  }

  /**
   * Enviar un evento al servidor
   * @param event Evento a enviar
   */
  private async sendToServer(event: TelemetryEvent): Promise<void> {
    if (!this.serverEndpoint) return;

    try {
      // Implementación básica, en producción usar una cola y reintentos
      await fetch(this.serverEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(event),
        // No esperar respuesta para no bloquear
        keepalive: true
      });
    } catch (error) {
      // No registrar este error para evitar recursión
      if (this.consoleLogging) {
        console.error('[Telemetry] Error sending event to server:', error);
      }
    }
  }

  /**
   * Obtener todos los eventos registrados
   */
  getEvents(): TelemetryEvent[] {
    return [...this.events];
  }

  /**
   * Limpiar todos los eventos
   */
  clearEvents(): void {
    this.events = [];
  }

  /**
   * Habilitar o deshabilitar la telemetría
   */
  setEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
  }

  /**
   * Habilitar o deshabilitar el registro en consola
   */
  setConsoleLogging(enabled: boolean): void {
    this.consoleLogging = enabled;
  }

  /**
   * Configurar el endpoint del servidor
   */
  setServerEndpoint(endpoint: string | null): void {
    this.serverEndpoint = endpoint;
  }

  /**
   * Configurar el número máximo de eventos a almacenar
   */
  setMaxEvents(max: number): void {
    this.maxEvents = max;
  }

  /**
   * Obtener estadísticas de telemetría
   */
  getStats(): {
    totalEvents: number;
    errorCount: number;
    connectionCount: number;
    authCount: number;
    diagnosticCount: number;
    diagnosticsByLevel: { info: number; warning: number; error: number; critical: number };
    diagnosticsByCategory: { auth: number; database: number; network: number; app: number; other: number };
  } {
    let errorCount = 0;
    let connectionCount = 0;
    let authCount = 0;
    let diagnosticCount = 0;

    const diagnosticsByLevel = { info: 0, warning: 0, error: 0, critical: 0 };
    const diagnosticsByCategory = { auth: 0, database: 0, network: 0, app: 0, other: 0 };

    for (const event of this.events) {
      switch (event.type) {
        case TelemetryEventType.ERROR:
          errorCount++;
          break;
        case TelemetryEventType.CONNECTION:
          connectionCount++;
          break;
        case TelemetryEventType.AUTH:
          authCount++;
          break;
        case TelemetryEventType.DIAGNOSTIC:
          diagnosticCount++;
          const diagnosticEvent = event as DiagnosticEvent;
          diagnosticsByLevel[diagnosticEvent.level]++;
          diagnosticsByCategory[diagnosticEvent.category]++;
          break;
      }
    }

    return {
      totalEvents: this.events.length,
      errorCount,
      connectionCount,
      authCount,
      diagnosticCount,
      diagnosticsByLevel,
      diagnosticsByCategory
    };
  }
}

// Exportar una instancia única del servicio
export const telemetryService = new TelemetryService();

// Exportar la clase para casos donde se necesiten múltiples instancias
export default TelemetryService;
