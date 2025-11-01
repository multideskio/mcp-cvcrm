/**
 * Cliente Redis usando Upstash
 * Consultar: docs/02-AUTHENTICATION.md e docs/01-ARCHITECTURE.md
 */
import { Redis } from '@upstash/redis';
import { loadRedisConfig } from '@/config';
import { CacheError } from '@/lib/utils/errors';
import { logger, logOperationError } from '@/lib/utils/logger';
let redisClient = null;
/**
 * Obtém ou cria instância do cliente Redis
 */
export function getRedisClient() {
    if (!redisClient) {
        try {
            const config = loadRedisConfig();
            // Parse da URL do Redis
            const url = new URL(config.url);
            redisClient = new Redis({
                url: config.url,
                token: config.password || url.password || '',
                automaticDeserialization: true,
            });
            logger.info('Cliente Redis inicializado com sucesso');
        }
        catch (error) {
            logOperationError('Inicialização do Redis', error);
            throw new CacheError('Erro ao inicializar cliente Redis');
        }
    }
    return redisClient;
}
/**
 * Testa conexão com Redis
 */
export async function testRedisConnection() {
    try {
        const client = getRedisClient();
        await client.ping();
        logger.info('Conexão com Redis OK');
        return true;
    }
    catch (error) {
        logOperationError('Teste de conexão Redis', error);
        return false;
    }
}
/**
 * Fecha conexão com Redis (cleanup)
 */
export async function closeRedisConnection() {
    if (redisClient) {
        // Upstash Redis não precisa de close explícito
        redisClient = null;
        logger.info('Cliente Redis encerrado');
    }
}
//# sourceMappingURL=client.js.map