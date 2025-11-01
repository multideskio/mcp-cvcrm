/**
 * Cache Manager usando Redis
 * Consultar: docs/01-ARCHITECTURE.md - Cache Layer
 */
import { getRedisClient } from './client';
import { CacheError } from '@/lib/utils/errors';
import { logger, logOperationError, logOperationSuccess } from '@/lib/utils/logger';
export class RedisCacheManager {
    redis = getRedisClient();
    /**
     * Obtém valor do cache
     */
    async get(key) {
        try {
            const value = await this.redis.get(key);
            if (value) {
                logger.debug({ key }, 'Cache hit');
            }
            else {
                logger.debug({ key }, 'Cache miss');
            }
            return value;
        }
        catch (error) {
            logOperationError(`Cache GET: ${key}`, error);
            throw new CacheError(`Erro ao ler cache: ${key}`);
        }
    }
    /**
     * Define valor no cache com TTL opcional
     */
    async set(key, value, ttl) {
        try {
            if (ttl) {
                await this.redis.setex(key, ttl, value);
            }
            else {
                await this.redis.set(key, value);
            }
            logOperationSuccess(`Cache SET: ${key}`, undefined, { ttl });
        }
        catch (error) {
            logOperationError(`Cache SET: ${key}`, error);
            throw new CacheError(`Erro ao gravar cache: ${key}`);
        }
    }
    /**
     * Deleta valor do cache
     */
    async del(key) {
        try {
            await this.redis.del(key);
            logger.debug({ key }, 'Cache invalidado');
        }
        catch (error) {
            logOperationError(`Cache DEL: ${key}`, error);
            throw new CacheError(`Erro ao deletar cache: ${key}`);
        }
    }
    /**
     * Verifica se chave existe
     */
    async exists(key) {
        try {
            const exists = await this.redis.exists(key);
            return exists === 1;
        }
        catch (error) {
            logOperationError(`Cache EXISTS: ${key}`, error);
            return false;
        }
    }
    /**
     * Obtém TTL de uma chave (em segundos)
     */
    async ttl(key) {
        try {
            return await this.redis.ttl(key);
        }
        catch (error) {
            logOperationError(`Cache TTL: ${key}`, error);
            return -1;
        }
    }
    /**
     * Flush cache por pattern
     * ATENÇÃO: Pode ser lento em produção
     */
    async flush(pattern) {
        try {
            const keys = await this.redis.keys(pattern);
            if (keys.length > 0) {
                await this.redis.del(...keys);
                logger.info({ pattern, count: keys.length }, 'Cache flushed');
            }
        }
        catch (error) {
            logOperationError(`Cache FLUSH: ${pattern}`, error);
            throw new CacheError(`Erro ao limpar cache: ${pattern}`);
        }
    }
    /**
     * Incrementa valor numérico
     */
    async incr(key) {
        try {
            return await this.redis.incr(key);
        }
        catch (error) {
            logOperationError(`Cache INCR: ${key}`, error);
            throw new CacheError(`Erro ao incrementar: ${key}`);
        }
    }
    /**
     * Define valor com expiração automática
     */
    async setex(key, seconds, value) {
        return this.set(key, value, seconds);
    }
    /**
     * Obtém múltiplos valores
     */
    async mget(keys) {
        try {
            if (keys.length === 0) {
                return [];
            }
            const values = await this.redis.mget(...keys);
            return values;
        }
        catch (error) {
            logOperationError('Cache MGET', error, { keys });
            throw new CacheError('Erro ao ler múltiplos valores do cache');
        }
    }
    /**
     * Define múltiplos valores
     */
    async mset(entries) {
        try {
            const keys = Object.keys(entries);
            if (keys.length === 0) {
                return;
            }
            // Upstash Redis não tem mset direto, fazer um por um
            await Promise.all(keys.map(key => this.redis.set(key, entries[key])));
            logger.debug({ count: keys.length }, 'Cache MSET');
        }
        catch (error) {
            logOperationError('Cache MSET', error);
            throw new CacheError('Erro ao gravar múltiplos valores no cache');
        }
    }
}
/**
 * Instância singleton do cache manager
 */
let cacheManager = null;
export function getCacheManager() {
    if (!cacheManager) {
        cacheManager = new RedisCacheManager();
    }
    return cacheManager;
}
//# sourceMappingURL=cache.js.map