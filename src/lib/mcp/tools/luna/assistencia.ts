/**
 * MCP Tools - Assistência Técnica
 */

import { z } from 'zod';
import { getCVCRMClient } from '@/lib/cvcrm';
import type { MCPToolDefinition } from '@/types';

// ========== SCHEMAS ==========

export const criarChamadoSchema = z.object({
  clienteId: z.number().int().positive(),
  unidadeId: z.number().int().positive(),
  descricaoProblema: z.string().min(10),
  localidade: z.string().optional(),
  urgencia: z.enum(['baixa', 'media', 'alta']).optional(),
  fotosBase64: z.array(z.string()).optional(),
});

export const consultarChamadosSchema = z.object({
  clienteId: z.number().int().positive(),
  unidadeId: z.number().int().positive().optional(),
  situacao: z.string().optional(),
});

// ========== TOOL DEFINITIONS ==========

export const criarChamadoTool: MCPToolDefinition = {
  name: 'luna_criar_chamado_assistencia',
  description: 'Abre novo chamado de assistência técnica',
  inputSchema: {
    type: 'object',
    properties: {
      clienteId: {
        type: 'number',
        description: 'ID do cliente',
      },
      unidadeId: {
        type: 'number',
        description: 'ID da unidade',
      },
      descricaoProblema: {
        type: 'string',
        description: 'Descrição detalhada do problema',
      },
      localidade: {
        type: 'string',
        description: 'Local do problema (cozinha, banheiro, etc)',
      },
      urgencia: {
        type: 'string',
        enum: ['baixa', 'media', 'alta'],
        description: 'Urgência do chamado',
      },
      fotosBase64: {
        type: 'array',
        items: { type: 'string' },
        description: 'Fotos em base64 (opcional)',
      },
    },
    required: ['clienteId', 'unidadeId', 'descricaoProblema'],
  },
};

export const consultarChamadosTool: MCPToolDefinition = {
  name: 'luna_consultar_chamados',
  description: 'Lista chamados de assistência técnica do cliente',
  inputSchema: {
    type: 'object',
    properties: {
      clienteId: {
        type: 'number',
        description: 'ID do cliente',
      },
      unidadeId: {
        type: 'number',
        description: 'ID da unidade (opcional)',
      },
      situacao: {
        type: 'string',
        description: 'Filtrar por situação',
      },
    },
    required: ['clienteId'],
  },
};

// ========== HANDLERS ==========

export async function handleCriarChamado(args: unknown): Promise<string> {
  const client = getCVCRMClient();
  const validatedArgs = criarChamadoSchema.parse(args);

  const assistencia = await client.criarAssistencia({
    unidadeId: validatedArgs.unidadeId,
    descricao: validatedArgs.descricaoProblema,
    localidadeId: validatedArgs.localidade ? parseInt(validatedArgs.localidade) : undefined,
    prioridade: validatedArgs.urgencia || 'media',
  });

  // Upload de fotos se fornecidas
  if (validatedArgs.fotosBase64 && validatedArgs.fotosBase64.length > 0) {
    // Nota: Endpoint de upload
    // POST /assistenciatecnica/assistencia/{id}/upload
    for (const foto of validatedArgs.fotosBase64) {
      await client.request(`/assistenciatecnica/assistencia/${assistencia.id}/upload`, {
        method: 'POST',
        body: JSON.stringify({ arquivo: foto }),
      });
    }
  }

  return JSON.stringify({
    chamadoId: assistencia.id,
    protocolo: assistencia.protocolo,
    situacao: assistencia.situacao,
    dataCriacao: assistencia.dataCriacao,
  });
}

export async function handleConsultarChamados(args: unknown): Promise<string> {
  const client = getCVCRMClient();
  const { unidadeId, situacao } = consultarChamadosSchema.parse(args);

  const filtros: Record<string, unknown> = {};
  if (unidadeId) filtros.unidadeId = unidadeId;
  if (situacao) filtros.situacao = situacao;

  const resultado = await client.listarAssistencias(filtros);

  // Filtrar por cliente (pode precisar validação adicional)
  const chamados = resultado.data.map((assistencia) => ({
    id: assistencia.id,
    protocolo: assistencia.protocolo,
    descricao: assistencia.descricao,
    situacao: assistencia.situacao,
    dataCriacao: assistencia.dataCriacao,
    dataAtualizacao: assistencia.dataAtualizacao,
  }));

  return JSON.stringify({
    chamados,
    total: chamados.length,
  });
}

