/**
 * MCP Tools - Comercial (Empreendimentos e Vendas)
 */

import { z } from 'zod';
import { getCVCRMClient } from '@/lib/cvcrm';
import type { MCPToolDefinition } from '@/types';

// ========== SCHEMAS ==========

export const listarEmpreendimentosSchema = z.object({
  cidade: z.string().optional(),
  bairro: z.string().optional(),
  tipoImovel: z.string().optional(),
  valorMin: z.number().optional(),
  valorMax: z.number().optional(),
});

// ========== TOOL DEFINITION ==========

export const listarEmpreendimentosTool: MCPToolDefinition = {
  name: 'luna_listar_empreendimentos_disponiveis',
  description: 'Lista empreendimentos com unidades disponíveis para venda',
  inputSchema: {
    type: 'object',
    properties: {
      cidade: {
        type: 'string',
        description: 'Filtrar por cidade',
      },
      bairro: {
        type: 'string',
        description: 'Filtrar por bairro',
      },
      tipoImovel: {
        type: 'string',
        description: 'Tipo de imóvel (apartamento, casa, comercial)',
      },
      valorMin: {
        type: 'number',
        description: 'Valor mínimo',
      },
      valorMax: {
        type: 'number',
        description: 'Valor máximo',
      },
    },
    required: [],
  },
};

// ========== HANDLER ==========

export async function handleListarEmpreendimentos(args: unknown): Promise<string> {
  const client = getCVCRMClient();
  const filtros = listarEmpreendimentosSchema.parse(args);

  const empreendimentos = await client.listarEmpreendimentos();

  // Filtrar empreendimentos
  let empreendimentosFiltrados = empreendimentos;

  if (filtros.cidade) {
    empreendimentosFiltrados = empreendimentosFiltrados.filter((emp) =>
      emp.endereco?.cidade?.toLowerCase().includes(filtros.cidade!.toLowerCase())
    );
  }

  // Buscar unidades disponíveis para cada empreendimento
  const empreendimentosComDetalhes = await Promise.all(
    empreendimentosFiltrados.map(async (emp) => {
      // Buscar unidades disponíveis
      // Nota: Endpoint pode ser GET /empreendimentos/{id}/unidades?disponivel=true
      try {
        const unidades = await client.request<Array<{ valorVenda?: number }>>(
          `/empreendimentos/${emp.id}/unidades?disponivel=true`
        );

        const valores = unidades.map((u) => u.valorVenda || 0).filter((v) => v > 0);
        const valorMinimo = valores.length > 0 ? Math.min(...valores) : 0;
        const valorMaximo = valores.length > 0 ? Math.max(...valores) : 0;

        // Aplicar filtros de valor
        if (filtros.valorMin && valorMaximo < filtros.valorMin) return null;
        if (filtros.valorMax && valorMinimo > filtros.valorMax) return null;

        return {
          id: emp.id,
          nome: emp.nome,
          codigo: emp.codigo,
          situacao: emp.situacao,
          cidade: emp.endereco?.cidade || '',
          estado: emp.endereco?.estado || '',
          unidadesDisponiveis: unidades.length,
          valorMinimo,
          valorMaximo,
        };
      } catch (error) {
        // Se endpoint não existir, retornar sem detalhes de unidades
        return {
          id: emp.id,
          nome: emp.nome,
          codigo: emp.codigo,
          situacao: emp.situacao,
          cidade: emp.endereco?.cidade || '',
          estado: emp.endereco?.estado || '',
          unidadesDisponiveis: 0,
          valorMinimo: 0,
          valorMaximo: 0,
        };
      }
    })
  );

  const resultado = empreendimentosComDetalhes.filter((emp) => emp !== null);

  return JSON.stringify({
    empreendimentos: resultado,
    total: resultado.length,
  });
}

