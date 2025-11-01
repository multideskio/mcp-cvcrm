/**
 * Classes de erro customizadas para a aplicação
 */

/**
 * Erro base da aplicação
 */
export class AppError extends Error {
  constructor(
    message: string,
    public code: string = 'APP_ERROR',
    public statusCode: number = 500,
    public details?: unknown
  ) {
    super(message);
    this.name = 'AppError';
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Erro de autenticação
 */
export class AuthenticationError extends AppError {
  constructor(message: string = 'Erro de autenticação', details?: unknown) {
    super(message, 'AUTH_ERROR', 401, details);
    this.name = 'AuthenticationError';
  }
}

/**
 * Erro de token inválido ou expirado
 */
export class TokenError extends AuthenticationError {
  constructor(message: string = 'Token inválido ou expirado', details?: unknown) {
    super(message, details);
    this.name = 'TokenError';
  }
}

/**
 * Erro de validação de dados
 */
export class ValidationError extends AppError {
  constructor(message: string = 'Dados inválidos', details?: unknown) {
    super(message, 'VALIDATION_ERROR', 422, details);
    this.name = 'ValidationError';
  }
}

/**
 * Erro de recurso não encontrado
 */
export class NotFoundError extends AppError {
  constructor(
    resource: string = 'Recurso',
    identifier?: string | number,
    details?: unknown
  ) {
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
  constructor(
    message: string = 'Erro na API externa',
    statusCode: number = 500,
    details?: unknown
  ) {
    super(message, 'EXTERNAL_API_ERROR', statusCode, details);
    this.name = 'ExternalAPIError';
  }
}

/**
 * Erro de cache/Redis
 */
export class CacheError extends AppError {
  constructor(message: string = 'Erro no cache', details?: unknown) {
    super(message, 'CACHE_ERROR', 500, details);
    this.name = 'CacheError';
  }
}

/**
 * Erro de rate limit
 */
export class RateLimitError extends AppError {
  constructor(message: string = 'Limite de requisições excedido', details?: unknown) {
    super(message, 'RATE_LIMIT', 429, details);
    this.name = 'RateLimitError';
  }
}

/**
 * Formata erro para resposta user-friendly
 */
export function formatErrorForUser(error: unknown): string {
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
export function isAuthError(error: unknown): error is AuthenticationError | TokenError {
  return error instanceof AuthenticationError || error instanceof TokenError;
}

/**
 * Verifica se erro é recuperável (pode tentar novamente)
 */
export function isRecoverableError(error: unknown): boolean {
  if (error instanceof AppError) {
    // Erros de rede, timeout, etc são recuperáveis
    return [500, 502, 503, 504].includes(error.statusCode);
  }
  return false;
}

