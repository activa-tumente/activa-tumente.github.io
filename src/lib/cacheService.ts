/**
 * Servicio de caché optimizado para almacenar datos y reducir llamadas a la API
 */

// Tipo para los elementos en caché
interface CacheItem<T> {
  data: T;
  timestamp: number;
  expiry: number; // Tiempo de expiración en milisegundos
}

// Clase para gestionar el caché
class CacheService {
  private cache: Map<string, CacheItem<any>> = new Map();
  private defaultExpiry: number = 5 * 60 * 1000; // 5 minutos por defecto
  private maxCacheSize: number = 100; // Máximo número de elementos en caché
  private lastCleanup: number = Date.now(); // Último tiempo de limpieza
  private cleanupInterval: number = 10 * 60 * 1000; // Limpiar cada 10 minutos

  /**
   * Obtener un elemento del caché
   * @param key Clave del elemento
   * @returns El elemento si existe y no ha expirado, null en caso contrario
   */
  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    
    if (!item) {
      return null;
    }
    
    // Comprobar si el elemento ha expirado
    if (Date.now() > item.timestamp + item.expiry) {
      this.cache.delete(key);
      return null;
    }
    
    return item.data;
  }

  /**
   * Guardar un elemento en el caché
   * @param key Clave del elemento
   * @param data Datos a almacenar
   * @param expiry Tiempo de expiración en milisegundos (opcional)
   */
  set<T>(key: string, data: T, expiry: number = this.defaultExpiry): void {
    // Limpiar caché si es necesario antes de añadir un nuevo elemento
    this.checkAndCleanUp();
    
    // Si el caché está lleno, eliminar el elemento más antiguo
    if (this.cache.size >= this.maxCacheSize) {
      let oldestKey: string | null = null;
      let oldestTime = Infinity;
      
      for (const [k, item] of this.cache.entries()) {
        if (item.timestamp < oldestTime) {
          oldestTime = item.timestamp;
          oldestKey = k;
        }
      }
      
      if (oldestKey) {
        this.cache.delete(oldestKey);
      }
    }
    
    // Guardar el nuevo elemento
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      expiry
    });
  }

  /**
   * Eliminar un elemento del caché
   * @param key Clave del elemento
   */
  remove(key: string): void {
    this.cache.delete(key);
  }

  /**
   * Limpiar todo el caché
   */
  clear(): void {
    this.cache.clear();
    this.lastCleanup = Date.now();
  }

  /**
   * Limpiar elementos expirados del caché
   */
  cleanExpired(): void {
    const now = Date.now();
    
    for (const [key, item] of this.cache.entries()) {
      if (now > item.timestamp + item.expiry) {
        this.cache.delete(key);
      }
    }
    
    this.lastCleanup = now;
  }

  /**
   * Comprobar si es necesario limpiar el caché y hacerlo
   */
  private checkAndCleanUp(): void {
    const now = Date.now();
    
    // Si ha pasado suficiente tiempo desde la última limpieza
    if (now - this.lastCleanup > this.cleanupInterval) {
      this.cleanExpired();
    }
  }

  /**
   * Obtener un elemento del caché o ejecutar una función para obtenerlo
   * @param key Clave del elemento
   * @param fetchFn Función para obtener los datos si no están en caché
   * @param expiry Tiempo de expiración en milisegundos (opcional)
   * @returns Los datos del caché o los obtenidos por la función
   */
  async getOrFetch<T>(
    key: string,
    fetchFn: () => Promise<T>,
    expiry: number = this.defaultExpiry
  ): Promise<T> {
    // Intentar obtener del caché
    const cachedData = this.get<T>(key);
    
    if (cachedData !== null) {
      return cachedData;
    }
    
    // Si no está en caché, obtener los datos
    try {
      const data = await fetchFn();
      
      // Guardar en caché solo si no es null/undefined
      if (data !== null && data !== undefined) {
        this.set(key, data, expiry);
      }
      
      return data;
    } catch (error) {
      // Si hay un error, no guardar en caché y propagar el error
      throw error;
    }
  }

  /**
   * Establecer el tiempo de expiración por defecto
   * @param expiry Tiempo de expiración en milisegundos
   */
  setDefaultExpiry(expiry: number): void {
    this.defaultExpiry = expiry;
  }

  /**
   * Establecer el tamaño máximo del caché
   * @param size Tamaño máximo
   */
  setMaxSize(size: number): void {
    if (size < 1) {
      throw new Error('El tamaño máximo del caché debe ser al menos 1');
    }
    
    this.maxCacheSize = size;
    
    // Si el nuevo tamaño es menor que el tamaño actual, eliminar elementos
    if (this.cache.size > size) {
      const keysToRemove = [...this.cache.keys()].slice(0, this.cache.size - size);
      keysToRemove.forEach(key => this.cache.delete(key));
    }
  }

  /**
   * Verificar si una clave existe en el caché y no ha expirado
   * @param key Clave a verificar
   * @returns true si existe y no ha expirado
   */
  has(key: string): boolean {
    const item = this.cache.get(key);
    if (!item) return false;
    
    // Comprobar si ha expirado
    if (Date.now() > item.timestamp + item.expiry) {
      this.cache.delete(key);
      return false;
    }
    
    return true;
  }

  /**
   * Obtener estadísticas del caché
   * @returns Estadísticas del caché
   */
  getStats(): { 
    size: number; 
    activeItems: number; 
    oldestItem: number; 
    newestItem: number;
    averageAge: number;
  } {
    const now = Date.now();
    let activeItems = 0;
    let oldestTime = now;
    let newestTime = 0;
    let totalAge = 0;
    
    for (const item of this.cache.values()) {
      const expiryTime = item.timestamp + item.expiry;
      if (now <= expiryTime) {
        activeItems++;
        totalAge += now - item.timestamp;
        
        if (item.timestamp < oldestTime) {
          oldestTime = item.timestamp;
        }
        
        if (item.timestamp > newestTime) {
          newestTime = item.timestamp;
        }
      }
    }
    
    return {
      size: this.cache.size,
      activeItems,
      oldestItem: activeItems ? now - oldestTime : 0,
      newestItem: activeItems ? now - newestTime : 0,
      averageAge: activeItems ? totalAge / activeItems : 0
    };
  }
}

// Exportar una instancia única del servicio
export const cacheService = new CacheService();

// Exportar la clase para casos donde se necesiten múltiples instancias
export default CacheService;