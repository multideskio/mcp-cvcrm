import { z } from 'zod';
/**
 * Schema de validação para configuração da aplicação
 */
declare const appConfigSchema: z.ZodObject<{
    nodeEnv: z.ZodDefault<z.ZodEnum<["development", "production", "test"]>>;
    logLevel: z.ZodDefault<z.ZodEnum<["debug", "info", "warn", "error"]>>;
    port: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    nodeEnv: "development" | "production" | "test";
    logLevel: "error" | "warn" | "info" | "debug";
    port: number;
}, {
    nodeEnv?: "development" | "production" | "test" | undefined;
    logLevel?: "error" | "warn" | "info" | "debug" | undefined;
    port?: number | undefined;
}>;
export type AppConfig = z.infer<typeof appConfigSchema>;
/**
 * Carrega e valida configuração da aplicação
 */
export declare function loadAppConfig(): AppConfig;
/**
 * Constantes da aplicação
 */
export declare const APP_CONSTANTS: {
    /** Nome da aplicação */
    readonly NAME: "CV CRM MCP Server";
    /** Versão da aplicação */
    readonly VERSION: "1.0.0";
    /** Timeout padrão para operações */
    readonly DEFAULT_TIMEOUT_MS: 30000;
    /** Tamanho padrão de página para listagens */
    readonly DEFAULT_PAGE_SIZE: 20;
    /** Tamanho máximo de página */
    readonly MAX_PAGE_SIZE: 100;
};
export {};
//# sourceMappingURL=app.d.ts.map