/**
 * MCP Tools para Atendimentos
 * Consultar: docs/04-MCP-TOOLS.md
 */

import { z } from 'zod';
import { getCVCRMClient } from '@/lib/cvcrm';
import type { MCPToolDefinition } from '@/types';

// ========== SCHEMAS ==========

export const criarAtendimentoSchema = z.object({
  assunto: z.string().min(5, 'Assunto deve ter no mínimo 5 caracteres'),
  descricao: z.string().min(10, 'Descrição deve ter no mínimo 10 caracteres'),
  clienteId: z.number().int().positive('ID do cliente deve ser um número positivo'),
  prioridade: z.enum(['baixa', 'media', 'alta']).optional(),
  tipoAtendimentoId: z.number().int().positive().optional(),
});

export const listarAtendimentosSchema = z.object({
  clienteId: z.number().int().positive().optional(),
  situacao: z.string().optional(),
  dataInicio: z.string().optional(),
  dataFim: z.string().optional(),
  page: z.number().int().positive().optional(),
  limit: z.number().int().positive().max(100).optional(),
});

// ========== TOOL DEFINITIONS ==========

export const criarAtendimentoTool: MCPToolDefinition = {
  name: 'cvcrm_criar_atendimento',
  description: 'Cadastra um novo atendimento no CV CRM',
  inputSchema: {
    type: 'object',
    properties: {
      assunto: {
        type: 'string',
        description: 'Assunto do atendimento',
      },
      descricao: {
        type: 'string',
        description: 'Descrição detalhada do atendimento',
      },
      clienteId: {
        type: 'number',
        description: 'ID do cliente',
      },
      prioridade: {
        type: 'string',
        enum: ['baixa', 'media', 'alta'],
        description: 'Prioridade do atendimento',
      },
      tipoAtendimentoId: {
        type: 'number',
        description: 'ID do tipo de atendimento',
      },
    },
    required: ['assunto', 'descricao', 'clienteId'],
  },
};

export const listarAtendimentosTool: MCPToolDefinition = {
  name: 'cvcrm_listar_atendimentos',
  description: 'Lista atendimentos com filtros opcionais',
  inputSchema: {
    type: 'object',
    properties: {
      clienteId: {
        type: 'number',
        description: 'Filtrar por ID do cliente',
      },
      situacao: {
        type: 'string',
        description: 'Filtrar por situação',
      },
      dataInicio: {
        type: 'string',
        description: 'Data início (YYYY-MM-DD)',
      },
      dataFim: {
        type: 'string',
        description: 'Data fim (YYYY-MM-DD)',
      },
      page: {
        type: 'number',
        description: 'Número da página (padrão: 1)',
      },
      limit: {
        type: 'number',
        description: 'Itens por página (padrão: 20, máx: 100)',
      },
    },
    required: [],
  },
};

// ========== HANDLERS ==========

export async function handleCriarAtendimento(args: unknown): Promise<string> {
  const client = getCVCRMClient();
  const validatedArgs = criarAtendimentoSchema.parse(args);

  const atendimento = await client.criarAtendimento(validatedArgs);

  return `✅ **Atendimento criado com sucesso!**

📋 **Detalhes:**
- **Protocolo:** ${atendimento.protocolo}
- **ID:** ${atendimento.id}
- **Situação:** ${atendimento.situacao}
- **Assunto:** ${atendimento.assunto}
- **Data:** ${new Date(atendimento.dataCriacao).toLocaleString('pt-BR')}

💡 O atendimento foi registrado e está disponível para acompanhamento.`;
}

export async function handleListarAtendimentos(args: unknown): Promise<string> {
  const client = getCVCRMClient();
  const validatedArgs = listarAtendimentosSchema.parse(args);

  const resultado = await client.listarAtendimentos(validatedArgs);

  if (resultado.data.length === 0) {
    return '📋 **Nenhum atendimento encontrado** com os filtros informados.';
  }

  const atendimentos = resultado.data
    .map(
      (atendimento, index) => `
${index + 1}. **${atendimento.protocolo}** - ${atendimento.assunto}
   - Cliente: ${atendimento.clienteNome || `ID ${atendimento.clienteId}`}
   - Situação: ${atendimento.situacao}
   - Prioridade: ${atendimento.prioridade}
   - Data: ${new Date(atendimento.dataCriacao).toLocaleDateString('pt-BR')}
`
    )
    .join('\n');

  return `📋 **Atendimentos Encontrados** (${resultado.total} total, página ${resultado.page}/${resultado.totalPages})
${atendimentos}

💡 Use cvcrm_criar_atendimento para criar um novo atendimento.`;
}

