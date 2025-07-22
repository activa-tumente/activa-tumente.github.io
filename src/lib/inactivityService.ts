/**
 * Servicio optimizado para gestionar la inactividad del usuario y el cierre de sesión automático
 */

import { telemetryService, TelemetryEventType } from './telemetryService';

// Tipo para las opciones de configuración
export interface InactivityOptions {
  // Tiempo de inactividad en milisegundos antes del cierre de sesión
  timeout: number;
  // Tiempo en milisegundos antes de mostrar la advertencia
  warningTime: number;
  // Función a ejecutar cuando se detecta inactividad
  onInactive: () => void;
  // Función a ejecutar cuando se muestra la advertencia
  onWarning: () => void;
  // Eventos a monitorizar para detectar actividad
  events?: string[];
}

class InactivityService {
  private timeout: number = 30 * 60 * 1000; // 30 minutos por defecto
  private warningTime: number = 1 * 60 * 1000; // 1 minuto por defecto
  private timer: number | null = null;
  private warningTimer: number | null = null;
  private onInactive: (() => void) | null = null;
  private onWarning: (() => void) | null = null;
  private events: string[] = [
    'mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'
  ];
  private isEnabled: boolean = false;
  private lastActivity: number = Date.now();
  private boundResetTimer: () => void;
  private debounceTimeout: number | null = null;
  private throttleLastCall: number = 0;
  private throttleDelay: number = 200; // 200ms para throttle

  constructor() {
    // Crear una referencia a la función bind para poder eliminarla después
    this.boundResetTimer = this.resetTimer.bind(this);
  }

  /**
   * Inicializar el servicio de inactividad
   * @param options Opciones de configuración
   */
  initialize(options: InactivityOptions): void {
    // Detener primero si ya está inicializado
    if (this.isEnabled) {
      this.stop();
    }

    this.timeout = options.timeout;
    this.warningTime = options.warningTime;
    this.onInactive = options.onInactive;
    this.onWarning = options.onWarning;

    if (options.events && options.events.length > 0) {
      this.events = options.events;
    }

    this.start();

    telemetryService.trackEvent({
      type: TelemetryEventType.USER_ACTION,
      name: 'inactivity_service_initialized',
      timestamp: Date.now(),
      data: { timeout: this.timeout, warningTime: this.warningTime }
    });
  }

  /**
   * Iniciar la monitorización de inactividad
   */
  start(): void {
    if (this.isEnabled) {
      return;
    }

    this.isEnabled = true;
    this.lastActivity = Date.now();

    // Añadir listeners para eventos de actividad (con throttling)
    this.events.forEach(event => {
      window.addEventListener(event, this.boundResetTimer, { passive: true });
    });

    // Iniciar el temporizador
    this.resetTimer();

    telemetryService.trackEvent({
      type: TelemetryEventType.USER_ACTION,
      name: 'inactivity_monitoring_started',
      timestamp: Date.now()
    });
  }

  /**
   * Detener la monitorización de inactividad
   */
  stop(): void {
    if (!this.isEnabled) {
      return;
    }

    this.isEnabled = false;

    // Eliminar listeners
    this.events.forEach(event => {
      window.removeEventListener(event, this.boundResetTimer);
    });

    // Limpiar temporizadores
    this.clearTimers();

    telemetryService.trackEvent({
      type: TelemetryEventType.USER_ACTION,
      name: 'inactivity_monitoring_stopped',
      timestamp: Date.now()
    });
  }

  /**
   * Limpiar todos los temporizadores
   */
  private clearTimers(): void {
    if (this.timer !== null) {
      window.clearTimeout(this.timer);
      this.timer = null;
    }

    if (this.warningTimer !== null) {
      window.clearTimeout(this.warningTimer);
      this.warningTimer = null;
    }

    if (this.debounceTimeout !== null) {
      window.clearTimeout(this.debounceTimeout);
      this.debounceTimeout = null;
    }
  }

  /**
   * Reiniciar el temporizador de inactividad (con throttling)
   */
  resetTimer(): void {
    // Implementar throttling para evitar múltiples llamadas en eventos frecuentes
    const now = Date.now();
    if (now - this.throttleLastCall < this.throttleDelay) {
      return;
    }
    this.throttleLastCall = now;

    // Aplicar el reseteo con debounce
    if (this.debounceTimeout !== null) {
      window.clearTimeout(this.debounceTimeout);
    }

    this.debounceTimeout = window.setTimeout(() => this.doResetTimer(), 100);
  }

  /**
   * Implementación real del reseteo de temporizador (versión debounced)
   */
  private doResetTimer(): void {
    this.lastActivity = Date.now();

    // Limpiar temporizadores existentes
    if (this.timer !== null) {
      window.clearTimeout(this.timer);
      this.timer = null;
    }

    if (this.warningTimer !== null) {
      window.clearTimeout(this.warningTimer);
      this.warningTimer = null;
    }

    // Solo configurar nuevos temporizadores si el servicio está habilitado
    if (this.isEnabled) {
      // Configurar temporizador de advertencia
      const warningDelay = this.timeout - this.warningTime;
      if (warningDelay > 0) {
        this.warningTimer = window.setTimeout(() => {
          if (this.onWarning) {
            this.onWarning();
            telemetryService.trackEvent({
              type: TelemetryEventType.USER_ACTION,
              name: 'inactivity_warning_triggered',
              timestamp: Date.now(),
              data: { inactiveTime: Date.now() - this.lastActivity }
            });
          }
        }, warningDelay);
      }

      // Configurar temporizador de inactividad
      this.timer = window.setTimeout(() => {
        if (this.onInactive) {
          this.onInactive();
          telemetryService.trackEvent({
            type: TelemetryEventType.USER_ACTION,
            name: 'inactivity_logout_triggered',
            timestamp: Date.now(),
            data: { inactiveTime: Date.now() - this.lastActivity }
          });
        }
      }, this.timeout);
    }
  }

  /**
   * Obtener el tiempo restante antes del cierre de sesión
   * @returns Tiempo restante en milisegundos
   */
  getRemainingTime(): number {
    const elapsedTime = Date.now() - this.lastActivity;
    const remainingTime = Math.max(0, this.timeout - elapsedTime);
    return remainingTime;
  }

  /**
   * Verificar si el servicio está habilitado
   * @returns true si el servicio está habilitado
   */
  isActive(): boolean {
    return this.isEnabled;
  }

  /**
   * Extender la sesión manualmente (por ejemplo, después de una acción importante)
   */
  extendSession(): void {
    if (this.isEnabled) {
      this.lastActivity = Date.now();
      this.resetTimer();

      telemetryService.trackEvent({
        type: TelemetryEventType.USER_ACTION,
        name: 'inactivity_session_extended',
        timestamp: Date.now()
      });
    }
  }

  /**
   * Actualizar la configuración del servicio
   * @param options Opciones de configuración
   */
  updateConfig(options: Partial<InactivityOptions>): void {
    const wasEnabled = this.isEnabled;

    // Detener temporalmente si está activo
    if (wasEnabled) {
      this.stop();
    }

    // Actualizar configuración
    if (options.timeout !== undefined) {
      this.timeout = options.timeout;
    }

    if (options.warningTime !== undefined) {
      this.warningTime = options.warningTime;
    }

    if (options.onInactive !== undefined) {
      this.onInactive = options.onInactive;
    }

    if (options.onWarning !== undefined) {
      this.onWarning = options.onWarning;
    }

    if (options.events !== undefined && options.events.length > 0) {
      this.events = options.events;
    }

    // Reiniciar si estaba activo
    if (wasEnabled) {
      this.start();
    }

    telemetryService.trackEvent({
      type: TelemetryEventType.USER_ACTION,
      name: 'inactivity_config_updated',
      timestamp: Date.now(),
      data: {
        timeout: this.timeout,
        warningTime: this.warningTime,
        isEnabled: this.isEnabled
      }
    });
  }
}

// Exportar una instancia única del servicio
export const inactivityService = new InactivityService();

// Exportar la clase para casos donde se necesiten múltiples instancias
export default InactivityService;