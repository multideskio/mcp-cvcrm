/**
 * Logger centralizado usando Pino
 */
import pino from 'pino';
import { loadAppConfig } from '@/config';
const config = loadAppConfig();
/**
 * Logger principal da aplicação
 */
export const logger = pino({
    level: config.logLevel,
    transport: config.nodeEnv === 'development'
        ? {
            target: 'pino-pretty',
            options: {
                colorize: true,
                translateTime: 'SYS:standard',
                ignore: 'pid,hostname',
            },
        }
        : undefined,
    formatters: {
        level: (label) => {
            return { level: label };
        },
    },
});
/**
 * Cria um logger filho com contexto específico
 */
export function createLogger(context) {
    return logger.child(context);
}
/**
 * Helper para log de início de operação
 */
export function logOperationStart(operation, details) {
    logger.info({
        operation,
        ...details,
        timestamp: new Date().toISOString(),
    }, `Iniciando: ${operation}`);
}
/**
 * Helper para log de sucesso de operação
 */
export function logOperationSuccess(operation, duration, details) {
    logger.info({
        operation,
        duration,
        ...details,
        timestamp: new Date().toISOString(),
    }, `Sucesso: ${operation}${duration ? ` (${duration}ms)` : ''}`);
}
/**
 * Helper para log de erro de operação
 */
export function logOperationError(operation, error, details) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : undefined;
    logger.error({
        operation,
        error: errorMessage,
        stack: errorStack,
        ...details,
        timestamp: new Date().toISOString(),
    }, `Erro: ${operation} - ${errorMessage}`);
}
//# sourceMappingURL=logger.js.map