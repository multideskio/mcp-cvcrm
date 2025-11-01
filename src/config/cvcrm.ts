import { z } from 'zod';

/**
 * Schema de validação para configuração do CV CRM
 */
const cvcrmConfigSchema = z.object({
  dominio: z
    .string()
    .min(1, 'Domínio é obrigatório')
    .describe('Domínio do cliente no CV CRM (sem .cvcrm.com.br)'),
  
  usuario: z
    .string()
    .email('E-mail inválido')
    .describe('E-mail do usuário para autenticação'),
  
  cpf: z
    .string()
    .regex(/^\d{11}$/, 'CPF deve ter 11 dígitos sem pontuação')
    .describe('CPF do usuário'),
  
  verificationCode: z
    .string()
    .optional()
    .describe('Código de verificação (opcional - para automação)'),
});

export type CVCRMConfig = z.infer<typeof cvcrmConfigSchema>;

/**
 * Carrega e valida configuração do CV CRM a partir de variáveis de ambiente
 */
export function loadCVCRMConfig(): CVCRMConfig {
  const config = {
    dominio: process.env.CVCRM_DOMINIO,
    usuario: process.env.CVCRM_USUARIO,
    cpf: process.env.CVCRM_CPF,
    verificationCode: process.env.CVCRM_VERIFICATION_CODE,
  };

  try {
    return cvcrmConfigSchema.parse(config);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const messages = error.errors.map(e => `${e.path.join('.')}: ${e.message}`);
      throw new Error(`Erro na configuração do CV CRM:\n${messages.join('\n')}`);
    }
    throw error;
  }
}

/**
 * Constantes do CV CRM
 */
export const CVCRM_CONSTANTS = {
  /** URL base da API (será completada com o domínio) */
  API_BASE_PATH: '/api/v1',
  
  /** TTL padrão do token em segundos (25 min - 5 min antes do expire) */
  TOKEN_TTL_SECONDS: 25 * 60,
  
  /** Timeout de requisições em ms */
  REQUEST_TIMEOUT_MS: 30000,
  
  /** Endpoints de autenticação */
  AUTH_ENDPOINTS: {
    VERIFICATION_CODE: '/cliente/codigo-verificacao',
    GENERATE_TOKEN: '/autenticacao/token',
  },
} as const;

