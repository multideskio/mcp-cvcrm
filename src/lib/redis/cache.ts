/**
 * Cache Manager usando Redis
 * Consultar: docs/01-ARCHITECTURE.md - Cache Layer
 */

import { getRedisClient } from './client';
import { CacheError } from '@/lib/utils/errors';
import { logger, logOperationError, logOperationSuccess } from '@/lib/utils/logger';

export class RedisCacheManager {
  private redis = getRedisClient();

  /**
   * Obtém valor do cache
   */
  async get<T>(key: string): Promise<T | null> {
    try {
      const value = await this.redis.get<T>(key);
      
      if (value) {
        logger.debug({ key }, 'Cache hit');
      } else {
        logger.debug({ key }, 'Cache miss');
      }
      
      return value;
    } catch (error) {
      logOperationError(`Cache GET: ${key}`, error);
      throw new CacheError(`Erro ao ler cache: ${key}`);
    }
  }

  /**
   * Define valor no cache com TTL opcional
   */
  async set(key: string, value: unknown, ttl?: number): Promise<void> {
    try {
      if (ttl) {
        await this.redis.setex(key, ttl, value);
      } else {
        await this.redis.set(key, value);
      }

      logOperationSuccess(`Cache SET: ${key}`, undefined, { ttl });
    } catch (error) {
      logOperationError(`Cache SET: ${key}`, error);
      throw new CacheError(`Erro ao gravar cache: ${key}`);
    }
  }

  /**
   * Deleta valor do cache
   */
  async del(key: string): Promise<void> {
    try {
      await this.redis.del(key);
      logger.debug({ key }, 'Cache invalidado');
    } catch (error) {
      logOperationError(`Cache DEL: ${key}`, error);
      throw new CacheError(`Erro ao deletar cache: ${key}`);
    }
  }

  /**
   * Verifica se chave existe
   */
  async exists(key: string): Promise<boolean> {
    try {
      const exists = await this.redis.exists(key);
      return exists === 1;
    } catch (error) {
      logOperationError(`Cache EXISTS: ${key}`, error);
      return false;
    }
  }

  /**
   * Obtém TTL de uma chave (em segundos)
   */
  async ttl(key: string): Promise<number> {
    try {
      return await this.redis.ttl(key);
    } catch (error) {
      logOperationError(`Cache TTL: ${key}`, error);
      return -1;
    }
  }

  /**
   * Flush cache por pattern
   * ATENÇÃO: Pode ser lento em produção
   */
  async flush(pattern: string): Promise<void> {
    try {
      const keys = await this.redis.keys(pattern);
      
      if (keys.length > 0) {
        await this.redis.del(...keys);
        logger.info({ pattern, count: keys.length }, 'Cache flushed');
      }
    } catch (error) {
      logOperationError(`Cache FLUSH: ${pattern}`, error);
      throw new CacheError(`Erro ao limpar cache: ${pattern}`);
    }
  }

  /**
   * Incrementa valor numérico
   */
  async incr(key: string): Promise<number> {
    try {
      return await this.redis.incr(key);
    } catch (error) {
      logOperationError(`Cache INCR: ${key}`, error);
      throw new CacheError(`Erro ao incrementar: ${key}`);
    }
  }

  /**
   * Define valor com expiração automática
   */
  async setex(key: string, seconds: number, value: unknown): Promise<void> {
    return this.set(key, value, seconds);
  }

  /**
   * Obtém múltiplos valores
   */
  async mget<T>(keys: string[]): Promise<(T | null)[]> {
    try {
      if (keys.length === 0) {
        return [];
      }

      const values = await this.redis.mget(...keys) as (T | null)[];
      return values;
    } catch (error) {
      logOperationError('Cache MGET', error, { keys });
      throw new CacheError('Erro ao ler múltiplos valores do cache');
    }
  }

  /**
   * Define múltiplos valores
   */
  async mset(entries: Record<string, unknown>): Promise<void> {
    try {
      const keys = Object.keys(entries);
      if (keys.length === 0) {
        return;
      }

      // Upstash Redis não tem mset direto, fazer um por um
      await Promise.all(
        keys.map(key => this.redis.set(key, entries[key]))
      );

      logger.debug({ count: keys.length }, 'Cache MSET');
    } catch (error) {
      logOperationError('Cache MSET', error);
      throw new CacheError('Erro ao gravar múltiplos valores no cache');
    }
  }
}

/**
 * Instância singleton do cache manager
 */
let cacheManager: RedisCacheManager | null = null;

export function getCacheManager(): RedisCacheManager {
  if (!cacheManager) {
    cacheManager = new RedisCacheManager();
  }
  return cacheManager;
}

