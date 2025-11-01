/**
 * Authentication Manager para CV CRM
 * Consultar: docs/02-AUTHENTICATION.md para detalhes completos
 */
import { loadCVCRMConfig, CVCRM_CONSTANTS } from '@/config/cvcrm';
import { REDIS_KEYS, REDIS_TTL } from '@/config/redis';
import { getCacheManager } from '@/lib/redis';
import { AuthenticationError, TokenError, ExternalAPIError } from '@/lib/utils/errors';
import { logger, logOperationStart, logOperationSuccess, logOperationError } from '@/lib/utils/logger';
export class CVCRMAuthManager {
    config = loadCVCRMConfig();
    cache = getCacheManager();
    baseUrl;
    tokenKey;
    constructor() {
        this.baseUrl = `https://${this.config.dominio}.cvcrm.com.br${CVCRM_CONSTANTS.API_BASE_PATH}`;
        this.tokenKey = REDIS_KEYS.token(this.config.dominio, this.config.usuario);
    }
    /**
     * Obtém token válido (cache ou novo)
     * Ver: docs/02-AUTHENTICATION.md
     */
    async getToken() {
        try {
            // Verificar cache
            const cachedToken = await this.cache.get(this.tokenKey);
            if (cachedToken) {
                logger.info('Token recuperado do cache');
                return cachedToken;
            }
            // Autenticar
            logger.info('Token não encontrado no cache, autenticando...');
            return await this.authenticate();
        }
        catch (error) {
            logOperationError('Obtenção de token', error);
            throw error;
        }
    }
    /**
     * Fluxo completo de autenticação (2 etapas)
     * Ver: docs/02-AUTHENTICATION.md - Fluxo de Autenticação
     */
    async authenticate() {
        logOperationStart('Autenticação CV CRM');
        const startTime = Date.now();
        try {
            // Etapa 1: Solicitar código de verificação
            await this.requestVerificationCode();
            // Etapa 2: Obter código (env ou input)
            const code = await this.getVerificationCode();
            // Etapa 3: Gerar token com o código
            const token = await this.generateToken(code);
            // Etapa 4: Armazenar no Redis
            await this.cacheToken(token);
            const duration = Date.now() - startTime;
            logOperationSuccess('Autenticação CV CRM', duration);
            return token;
        }
        catch (error) {
            logOperationError('Autenticação CV CRM', error);
            if (error instanceof AuthenticationError) {
                throw error;
            }
            throw new AuthenticationError('Falha na autenticação CV CRM');
        }
    }
    /**
     * Solicita código de verificação
     * POST /api/v1/cliente/codigo-verificacao
     */
    async requestVerificationCode() {
        const url = `${this.baseUrl}${CVCRM_CONSTANTS.AUTH_ENDPOINTS.VERIFICATION_CODE}`;
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: this.config.usuario,
                    cpf: this.config.cpf,
                }),
            });
            if (!response.ok) {
                throw new ExternalAPIError(`Erro ao solicitar código: ${response.status}`, response.status);
            }
            const data = await response.json();
            if (!data.sucesso) {
                throw new AuthenticationError(data.mensagem || 'Erro ao solicitar código');
            }
            logger.info({ validadeMinutos: data.validadeMinutos }, 'Código de verificação solicitado com sucesso');
        }
        catch (error) {
            if (error instanceof AuthenticationError || error instanceof ExternalAPIError) {
                throw error;
            }
            throw new ExternalAPIError('Erro na requisição de código de verificação');
        }
    }
    /**
     * Obtém código de verificação
     * Prioridade: env var > input manual (futuro)
     */
    async getVerificationCode() {
        // Opção 1: Código fixo em env (para automação/dev)
        if (this.config.verificationCode) {
            logger.info('Usando código de verificação da configuração');
            return this.config.verificationCode;
        }
        // Opção 2: Tentar obter do cache (webhook/polling - futuro)
        const codeKey = REDIS_KEYS.verificationCode(this.config.usuario);
        const cachedCode = await this.cache.get(codeKey);
        if (cachedCode) {
            logger.info('Código de verificação obtido do cache');
            await this.cache.del(codeKey);
            return cachedCode;
        }
        // Se não encontrou, lançar erro pedindo configuração
        throw new AuthenticationError('Código de verificação necessário. Configure CVCRM_VERIFICATION_CODE ou implemente método de input.');
    }
    /**
     * Gera token com o código de verificação
     * POST /api/v1/autenticacao/token
     */
    async generateToken(code) {
        const url = `${this.baseUrl}${CVCRM_CONSTANTS.AUTH_ENDPOINTS.GENERATE_TOKEN}`;
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: this.config.usuario,
                    codigo: code,
                }),
            });
            if (!response.ok) {
                if (response.status === 401) {
                    throw new TokenError('Código de verificação inválido ou expirado');
                }
                throw new ExternalAPIError(`Erro ao gerar token: ${response.status}`, response.status);
            }
            const data = await response.json();
            if (!data.token) {
                throw new AuthenticationError('Token não retornado pela API');
            }
            logger.info({ expiraEm: data.expiraEm }, 'Token gerado com sucesso');
            return data.token;
        }
        catch (error) {
            if (error instanceof AuthenticationError || error instanceof ExternalAPIError) {
                throw error;
            }
            throw new ExternalAPIError('Erro na geração do token');
        }
    }
    /**
     * Armazena token no Redis com TTL
     */
    async cacheToken(token) {
        const ttl = CVCRM_CONSTANTS.TOKEN_TTL_SECONDS;
        await this.cache.setex(this.tokenKey, ttl, token);
        logger.info({ ttl }, 'Token armazenado no cache');
    }
    /**
     * Valida se token ainda é válido
     */
    async isTokenValid() {
        const ttl = await this.cache.ttl(this.tokenKey);
        return ttl > 0;
    }
    /**
     * Obtém TTL restante do token (em segundos)
     */
    async getTokenTTL() {
        return await this.cache.ttl(this.tokenKey);
    }
    /**
     * Força renovação do token
     */
    async refreshToken() {
        logger.info('Forçando renovação do token');
        await this.cache.del(this.tokenKey);
        return await this.authenticate();
    }
    /**
     * Invalida token (logout)
     */
    async invalidateToken() {
        await this.cache.del(this.tokenKey);
        logger.info('Token invalidado');
    }
    /**
     * Armazena código de verificação no cache (para webhook/polling)
     * Usado quando código é recebido externamente
     */
    async storeVerificationCode(code) {
        const codeKey = REDIS_KEYS.verificationCode(this.config.usuario);
        await this.cache.setex(codeKey, REDIS_TTL.VERIFICATION_CODE, code);
        logger.info('Código de verificação armazenado no cache');
    }
}
/**
 * Instância singleton do auth manager
 */
let authManager = null;
export function getAuthManager() {
    if (!authManager) {
        authManager = new CVCRMAuthManager();
    }
    return authManager;
}
//# sourceMappingURL=auth.js.map