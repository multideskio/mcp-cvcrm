import { z } from 'zod';
/**
 * Schema de validação para configuração da aplicação
 */
const appConfigSchema = z.object({
    nodeEnv: z
        .enum(['development', 'production', 'test'])
        .default('development')
        .describe('Ambiente de execução'),
    logLevel: z
        .enum(['debug', 'info', 'warn', 'error'])
        .default('info')
        .describe('Nível de log'),
    port: z
        .number()
        .int()
        .positive()
        .default(3000)
        .describe('Porta do servidor Next.js'),
});
/**
 * Carrega e valida configuração da aplicação
 */
export function loadAppConfig() {
    const config = {
        nodeEnv: process.env.NODE_ENV,
        logLevel: process.env.LOG_LEVEL,
        port: process.env.PORT ? parseInt(process.env.PORT, 10) : 3000,
    };
    try {
        return appConfigSchema.parse(config);
    }
    catch (error) {
        if (error instanceof z.ZodError) {
            const messages = error.errors.map(e => `${e.path.join('.')}: ${e.message}`);
            throw new Error(`Erro na configuração da aplicação:\n${messages.join('\n')}`);
        }
        throw error;
    }
}
/**
 * Constantes da aplicação
 */
export const APP_CONSTANTS = {
    /** Nome da aplicação */
    NAME: 'CV CRM MCP Server',
    /** Versão da aplicação */
    VERSION: '1.0.0',
    /** Timeout padrão para operações */
    DEFAULT_TIMEOUT_MS: 30000,
    /** Tamanho padrão de página para listagens */
    DEFAULT_PAGE_SIZE: 20,
    /** Tamanho máximo de página */
    MAX_PAGE_SIZE: 100,
};
//# sourceMappingURL=app.js.map