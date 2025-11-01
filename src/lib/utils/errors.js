/**
 * Classes de erro customizadas para a aplicação
 */
/**
 * Erro base da aplicação
 */
export class AppError extends Error {
    code;
    statusCode;
    details;
    constructor(message, code = 'APP_ERROR', statusCode = 500, details) {
        super(message);
        this.code = code;
        this.statusCode = statusCode;
        this.details = details;
        this.name = 'AppError';
        Error.captureStackTrace(this, this.constructor);
    }
}
/**
 * Erro de autenticação
 */
export class AuthenticationError extends AppError {
    constructor(message = 'Erro de autenticação', details) {
        super(message, 'AUTH_ERROR', 401, details);
        this.name = 'AuthenticationError';
    }
}
/**
 * Erro de token inválido ou expirado
 */
export class TokenError extends AuthenticationError {
    constructor(message = 'Token inválido ou expirado', details) {
        super(message, details);
        this.name = 'TokenError';
    }
}
/**
 * Erro de validação de dados
 */
export class ValidationError extends AppError {
    constructor(message = 'Dados inválidos', details) {
        super(message, 'VALIDATION_ERROR', 422, details);
        this.name = 'ValidationError';
    }
}
/**
 * Erro de recurso não encontrado
 */
export class NotFoundError extends AppError {
    constructor(resource = 'Recurso', identifier, details) {
        const message = identifier
            ? `${resource} '${identifier}' não encontrado`
            : `${resource} não encontrado`;
        super(message, 'NOT_FOUND', 404, details);
        this.name = 'NotFoundError';
    }
}
/**
 * Erro de API externa (CV CRM)
 */
export class ExternalAPIError extends AppError {
    constructor(message = 'Erro na API externa', statusCode = 500, details) {
        super(message, 'EXTERNAL_API_ERROR', statusCode, details);
        this.name = 'ExternalAPIError';
    }
}
/**
 * Erro de cache/Redis
 */
export class CacheError extends AppError {
    constructor(message = 'Erro no cache', details) {
        super(message, 'CACHE_ERROR', 500, details);
        this.name = 'CacheError';
    }
}
/**
 * Erro de rate limit
 */
export class RateLimitError extends AppError {
    constructor(message = 'Limite de requisições excedido', details) {
        super(message, 'RATE_LIMIT', 429, details);
        this.name = 'RateLimitError';
    }
}
/**
 * Formata erro para resposta user-friendly
 */
export function formatErrorForUser(error) {
    if (error instanceof AppError) {
        return error.message;
    }
    if (error instanceof Error) {
        return error.message;
    }
    return 'Ocorreu um erro inesperado. Tente novamente.';
}
/**
 * Verifica se erro é de autenticação
 */
export function isAuthError(error) {
    return error instanceof AuthenticationError || error instanceof TokenError;
}
/**
 * Verifica se erro é recuperável (pode tentar novamente)
 */
export function isRecoverableError(error) {
    if (error instanceof AppError) {
        // Erros de rede, timeout, etc são recuperáveis
        return [500, 502, 503, 504].includes(error.statusCode);
    }
    return false;
}
//# sourceMappingURL=errors.js.map