/**
 * Authentication Manager para CV CRM
 * Consultar: docs/02-AUTHENTICATION.md para detalhes completos
 */
export declare class CVCRMAuthManager {
    private config;
    private cache;
    private baseUrl;
    private tokenKey;
    constructor();
    /**
     * Obtém token válido (cache ou novo)
     * Ver: docs/02-AUTHENTICATION.md
     */
    getToken(): Promise<string>;
    /**
     * Fluxo completo de autenticação (2 etapas)
     * Ver: docs/02-AUTHENTICATION.md - Fluxo de Autenticação
     */
    authenticate(): Promise<string>;
    /**
     * Solicita código de verificação
     * POST /api/v1/cliente/codigo-verificacao
     */
    private requestVerificationCode;
    /**
     * Obtém código de verificação
     * Prioridade: env var > input manual (futuro)
     */
    private getVerificationCode;
    /**
     * Gera token com o código de verificação
     * POST /api/v1/autenticacao/token
     */
    private generateToken;
    /**
     * Armazena token no Redis com TTL
     */
    private cacheToken;
    /**
     * Valida se token ainda é válido
     */
    isTokenValid(): Promise<boolean>;
    /**
     * Obtém TTL restante do token (em segundos)
     */
    getTokenTTL(): Promise<number>;
    /**
     * Força renovação do token
     */
    refreshToken(): Promise<string>;
    /**
     * Invalida token (logout)
     */
    invalidateToken(): Promise<void>;
    /**
     * Armazena código de verificação no cache (para webhook/polling)
     * Usado quando código é recebido externamente
     */
    storeVerificationCode(code: string): Promise<void>;
}
export declare function getAuthManager(): CVCRMAuthManager;
//# sourceMappingURL=auth.d.ts.map