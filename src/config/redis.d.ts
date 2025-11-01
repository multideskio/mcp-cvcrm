import { z } from 'zod';
/**
 * Schema de validação para configuração do Redis
 */
declare const redisConfigSchema: z.ZodObject<{
    url: z.ZodString;
    password: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    url: string;
    password?: string | undefined;
}, {
    url: string;
    password?: string | undefined;
}>;
export type RedisConfig = z.infer<typeof redisConfigSchema>;
/**
 * Carrega e valida configuração do Redis a partir de variáveis de ambiente
 */
export declare function loadRedisConfig(): RedisConfig;
/**
 * Padrões de chaves do Redis para o CV CRM
 */
export declare const REDIS_KEYS: {
    /** Chave para armazenar token de autenticação */
    readonly token: (dominio: string, usuario: string) => string;
    /** Chave para armazenar código de verificação temporário */
    readonly verificationCode: (usuario: string) => string;
    /** Chave para cache de empreendimentos */
    readonly empreendimentos: () => string;
    /** Chave para cache de workflows */
    readonly workflows: (funcionalidade: string) => string;
    /** Chave para cache de estados */
    readonly estados: () => string;
    /** Chave para cache de cidades */
    readonly cidades: (estadoId: number) => string;
};
/**
 * TTL (Time To Live) padrões para cache
 */
export declare const REDIS_TTL: {
    /** Token de autenticação: 25 minutos (5 min antes do expire) */
    readonly TOKEN: number;
    /** Código de verificação: 5 minutos */
    readonly VERIFICATION_CODE: number;
    /** Dados de cadastro (empreendimentos, workflows): 1 hora */
    readonly CADASTRO: number;
    /** Dados geográficos (estados, cidades): 24 horas */
    readonly GEO: number;
};
export {};
//# sourceMappingURL=redis.d.ts.map