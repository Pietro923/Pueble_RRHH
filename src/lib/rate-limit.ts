// /lib/rate-limit.ts

interface RateLimitOptions {
    interval: number;        // Intervalo en milisegundos
    tokensPerInterval: number;  // Número de tokens (solicitudes) permitidos por intervalo
    uniqueTokenPerInterval: number; // Número máximo de tokens únicos a trackear
  }
  
  interface RateLimitInfo {
    tokens: number;
    lastRefill: number;
  }
  
  export class RateLimit {
    private tokenBuckets: Map<string, RateLimitInfo>;
    private interval: number;
    private tokensPerInterval: number;
    private maxSize: number;
  
    constructor(options: RateLimitOptions) {
      this.tokenBuckets = new Map();
      this.interval = options.interval;
      this.tokensPerInterval = options.tokensPerInterval;
      this.maxSize = options.uniqueTokenPerInterval;
    }
  
    /**
     * Limpia los tokens antiguos para evitar fugas de memoria
     */
    private cleanup(): void {
      const now = Date.now();
      const keys = Array.from(this.tokenBuckets.keys());
      
      keys.forEach(key => {
        const info = this.tokenBuckets.get(key);
        if (info && now - info.lastRefill > this.interval) {
          this.tokenBuckets.delete(key);
        }
      });
    }
  
    /**
     * Reabastece los tokens basado en el tiempo transcurrido
     */
    private refillTokens(info: RateLimitInfo, now: number): void {
      const timePassed = now - info.lastRefill;
      const intervalsPassedFloat = timePassed / this.interval;
      const intervalsPassedInt = Math.floor(intervalsPassedFloat);
      
      if (intervalsPassedInt > 0) {
        // Reabastece completamente si ha pasado más de un intervalo
        if (intervalsPassedInt >= 1) {
          info.tokens = this.tokensPerInterval;
        } else {
          // Añade tokens proporcionales al tiempo transcurrido
          const tokensToAdd = intervalsPassedInt * this.tokensPerInterval;
          info.tokens = Math.min(this.tokensPerInterval, info.tokens + tokensToAdd);
        }
        info.lastRefill = now;
      }
    }
  
    /**
     * Verifica si una solicitud puede proceder
     * @param tokens Número de tokens a consumir
     * @param key Identificador único para el rate limiting
     * @returns Promise que se resuelve si hay tokens disponibles, se rechaza si no
     */
    async check(tokens: number = 1, key: string): Promise<boolean> {
      // Validación de entrada
      if (tokens <= 0) {
        throw new Error('El número de tokens debe ser positivo');
      }
  
      if (typeof key !== 'string' || !key) {
        throw new Error('Se requiere una key válida');
      }
  
      const now = Date.now();
  
      // Limpia tokens antiguos si el mapa es muy grande
      if (this.tokenBuckets.size >= this.maxSize) {
        this.cleanup();
      }
  
      // Obtiene o inicializa el bucket para esta key
      let info = this.tokenBuckets.get(key);
      if (!info) {
        info = {
          tokens: this.tokensPerInterval,
          lastRefill: now
        };
        this.tokenBuckets.set(key, info);
      } else {
        // Actualiza los tokens disponibles
        this.refillTokens(info, now);
      }
  
      // Verifica si hay suficientes tokens
      if (info.tokens >= tokens) {
        info.tokens -= tokens;
        return true;
      }
  
      // Calcula tiempo hasta el siguiente token disponible
      const timeUntilNextRefill = this.interval - (now - info.lastRefill);
      const waitTime = Math.ceil(timeUntilNextRefill / 1000); // Convertir a segundos
  
      throw new Error(`Rate limit excedido. Por favor espera ${waitTime} segundos.`);
    }
  
    /**
     * Obtiene el estado actual del rate limit para una key
     */
    getTokensRemaining(key: string): number {
      const info = this.tokenBuckets.get(key);
      if (!info) {
        return this.tokensPerInterval;
      }
      this.refillTokens(info, Date.now());
      return info.tokens;
    }
  }
  
  /**
   * Factory function para crear una instancia de RateLimit
   */
  export function rateLimit(options: RateLimitOptions): RateLimit {
    return new RateLimit(options);
  }
  
  // Exporta también los tipos
  export type { RateLimitOptions };