/**
 * Logger centralizado usando Pino
 */
import pino from 'pino';
/**
 * Logger principal da aplicação
 */
export declare const logger: pino.Logger<never, boolean>;
/**
 * Cria um logger filho com contexto específico
 */
export declare function createLogger(context: Record<string, unknown>): pino.Logger<never, boolean>;
/**
 * Helper para log de início de operação
 */
export declare function logOperationStart(operation: string, details?: Record<string, unknown>): void;
/**
 * Helper para log de sucesso de operação
 */
export declare function logOperationSuccess(operation: string, duration?: number, details?: Record<string, unknown>): void;
/**
 * Helper para log de erro de operação
 */
export declare function logOperationError(operation: string, error: Error | unknown, details?: Record<string, unknown>): void;
//# sourceMappingURL=logger.d.ts.map