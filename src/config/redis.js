import { z } from 'zod';
/**
 * Schema de validação para configuração do Redis
 */
const redisConfigSchema = z.object({
    url: z
        .string()
        .url('URL do Redis inválida')
        .describe('URL de conexão do Redis'),
    password: z
        .string()
        .optional()
        .describe('Senha do Redis (opcional)'),
});
/**
 * Carrega e valida configuração do Redis a partir de variáveis de ambiente
 */
export function loadRedisConfig() {
    const config = {
        url: process.env.REDIS_URL || 'redis://localhost:6379',
        password: process.env.REDIS_PASSWORD,
    };
    try {
        return redisConfigSchema.parse(config);
    }
    catch (error) {
        if (error instanceof z.ZodError) {
            const messages = error.errors.map(e => `${e.path.join('.')}: ${e.message}`);
            throw new Error(`Erro na configuração do Redis:\n${messages.join('\n')}`);
        }
        throw error;
    }
}
/**
 * Padrões de chaves do Redis para o CV CRM
 */
export const REDIS_KEYS = {
    /** Chave para armazenar token de autenticação */
    token: (dominio, usuario) => `cvcrm:token:${dominio}:${usuario}`,
    /** Chave para armazenar código de verificação temporário */
    verificationCode: (usuario) => `cvcrm:code:${usuario}`,
    /** Chave para cache de empreendimentos */
    empreendimentos: () => `cvcrm:cache:empreendimentos`,
    /** Chave para cache de workflows */
    workflows: (funcionalidade) => `cvcrm:cache:workflows:${funcionalidade}`,
    /** Chave para cache de estados */
    estados: () => `cvcrm:cache:estados`,
    /** Chave para cache de cidades */
    cidades: (estadoId) => `cvcrm:cache:cidades:${estadoId}`,
};
/**
 * TTL (Time To Live) padrões para cache
 */
export const REDIS_TTL = {
    /** Token de autenticação: 25 minutos (5 min antes do expire) */
    TOKEN: 25 * 60,
    /** Código de verificação: 5 minutos */
    VERIFICATION_CODE: 5 * 60,
    /** Dados de cadastro (empreendimentos, workflows): 1 hora */
    CADASTRO: 60 * 60,
    /** Dados geográficos (estados, cidades): 24 horas */
    GEO: 24 * 60 * 60,
};
//# sourceMappingURL=redis.js.map