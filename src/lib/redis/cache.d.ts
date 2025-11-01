/**
 * Cache Manager usando Redis
 * Consultar: docs/01-ARCHITECTURE.md - Cache Layer
 */
export declare class RedisCacheManager {
    private redis;
    /**
     * Obtém valor do cache
     */
    get<T>(key: string): Promise<T | null>;
    /**
     * Define valor no cache com TTL opcional
     */
    set(key: string, value: unknown, ttl?: number): Promise<void>;
    /**
     * Deleta valor do cache
     */
    del(key: string): Promise<void>;
    /**
     * Verifica se chave existe
     */
    exists(key: string): Promise<boolean>;
    /**
     * Obtém TTL de uma chave (em segundos)
     */
    ttl(key: string): Promise<number>;
    /**
     * Flush cache por pattern
     * ATENÇÃO: Pode ser lento em produção
     */
    flush(pattern: string): Promise<void>;
    /**
     * Incrementa valor numérico
     */
    incr(key: string): Promise<number>;
    /**
     * Define valor com expiração automática
     */
    setex(key: string, seconds: number, value: unknown): Promise<void>;
    /**
     * Obtém múltiplos valores
     */
    mget<T>(keys: string[]): Promise<(T | null)[]>;
    /**
     * Define múltiplos valores
     */
    mset(entries: Record<string, unknown>): Promise<void>;
}
export declare function getCacheManager(): RedisCacheManager;
//# sourceMappingURL=cache.d.ts.map