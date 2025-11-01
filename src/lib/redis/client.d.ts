/**
 * Cliente Redis usando Upstash
 * Consultar: docs/02-AUTHENTICATION.md e docs/01-ARCHITECTURE.md
 */
import { Redis } from '@upstash/redis';
/**
 * Obtém ou cria instância do cliente Redis
 */
export declare function getRedisClient(): Redis;
/**
 * Testa conexão com Redis
 */
export declare function testRedisConnection(): Promise<boolean>;
/**
 * Fecha conexão com Redis (cleanup)
 */
export declare function closeRedisConnection(): Promise<void>;
//# sourceMappingURL=client.d.ts.map