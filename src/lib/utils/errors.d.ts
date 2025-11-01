/**
 * Classes de erro customizadas para a aplicação
 */
/**
 * Erro base da aplicação
 */
export declare class AppError extends Error {
    code: string;
    statusCode: number;
    details?: unknown | undefined;
    constructor(message: string, code?: string, statusCode?: number, details?: unknown | undefined);
}
/**
 * Erro de autenticação
 */
export declare class AuthenticationError extends AppError {
    constructor(message?: string, details?: unknown);
}
/**
 * Erro de token inválido ou expirado
 */
export declare class TokenError extends AuthenticationError {
    constructor(message?: string, details?: unknown);
}
/**
 * Erro de validação de dados
 */
export declare class ValidationError extends AppError {
    constructor(message?: string, details?: unknown);
}
/**
 * Erro de recurso não encontrado
 */
export declare class NotFoundError extends AppError {
    constructor(resource?: string, identifier?: string | number, details?: unknown);
}
/**
 * Erro de API externa (CV CRM)
 */
export declare class ExternalAPIError extends AppError {
    constructor(message?: string, statusCode?: number, details?: unknown);
}
/**
 * Erro de cache/Redis
 */
export declare class CacheError extends AppError {
    constructor(message?: string, details?: unknown);
}
/**
 * Erro de rate limit
 */
export declare class RateLimitError extends AppError {
    constructor(message?: string, details?: unknown);
}
/**
 * Formata erro para resposta user-friendly
 */
export declare function formatErrorForUser(error: unknown): string;
/**
 * Verifica se erro é de autenticação
 */
export declare function isAuthError(error: unknown): error is AuthenticationError | TokenError;
/**
 * Verifica se erro é recuperável (pode tentar novamente)
 */
export declare function isRecoverableError(error: unknown): boolean;
//# sourceMappingURL=errors.d.ts.map