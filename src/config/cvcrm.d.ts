import { z } from 'zod';
/**
 * Schema de validação para configuração do CV CRM
 */
declare const cvcrmConfigSchema: z.ZodObject<{
    dominio: z.ZodString;
    usuario: z.ZodString;
    cpf: z.ZodString;
    verificationCode: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    cpf: string;
    dominio: string;
    usuario: string;
    verificationCode?: string | undefined;
}, {
    cpf: string;
    dominio: string;
    usuario: string;
    verificationCode?: string | undefined;
}>;
export type CVCRMConfig = z.infer<typeof cvcrmConfigSchema>;
/**
 * Carrega e valida configuração do CV CRM a partir de variáveis de ambiente
 */
export declare function loadCVCRMConfig(): CVCRMConfig;
/**
 * Constantes do CV CRM
 */
export declare const CVCRM_CONSTANTS: {
    /** URL base da API (será completada com o domínio) */
    readonly API_BASE_PATH: "/api/v1";
    /** TTL padrão do token em segundos (25 min - 5 min antes do expire) */
    readonly TOKEN_TTL_SECONDS: number;
    /** Timeout de requisições em ms */
    readonly REQUEST_TIMEOUT_MS: 30000;
    /** Endpoints de autenticação */
    readonly AUTH_ENDPOINTS: {
        readonly VERIFICATION_CODE: "/cliente/codigo-verificacao";
        readonly GENERATE_TOKEN: "/autenticacao/token";
    };
};
export {};
//# sourceMappingURL=cvcrm.d.ts.map