/**
 * MCP Tools - Financeiro (Parcelas e Boletos)
 */

import { z } from 'zod';
import { getCVCRMClient } from '@/lib/cvcrm';
import type { MCPToolDefinition } from '@/types';

// ========== SCHEMAS ==========

export const consultarParcelasSchema = z.object({
  clienteId: z.number().int().positive(),
  unidadeId: z.number().int().positive(),
  situacao: z.enum(['todas', 'em_aberto', 'vencidas', 'pagas']).optional(),
});

export const gerarBoletoSchema = z.object({
  parcelaId: z.number().int().positive(),
  enviarEmail: z.boolean().optional(),
});

// ========== TOOL DEFINITIONS ==========

export const consultarParcelasTool: MCPToolDefinition = {
  name: 'luna_consultar_parcelas',
  description: 'Consulta parcelas de pagamento de um cliente/unidade',
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
      situacao: {
        type: 'string',
        enum: ['todas', 'em_aberto', 'vencidas', 'pagas'],
        description: 'Filtrar por situação',
      },
    },
    required: ['clienteId', 'unidadeId'],
  },
};

export const gerarBoletoTool: MCPToolDefinition = {
  name: 'luna_gerar_segunda_via_boleto',
  description: 'Gera segunda via de boleto atualizado',
  inputSchema: {
    type: 'object',
    properties: {
      parcelaId: {
        type: 'number',
        description: 'ID da parcela',
      },
      enviarEmail: {
        type: 'boolean',
        description: 'Se deve enviar por email',
      },
    },
    required: ['parcelaId'],
  },
};

// ========== HANDLERS ==========

export async function handleConsultarParcelas(args: unknown): Promise<string> {
  const client = getCVCRMClient();
  const { clienteId, unidadeId, situacao } = consultarParcelasSchema.parse(args);

  // Buscar reserva da unidade
  const reservas = await client.listarReservas({
    clienteId,
    unidadeId,
    limit: 1,
  });

  if (reservas.data.length === 0) {
    return JSON.stringify({
      erro: 'Nenhuma reserva encontrada para este cliente/unidade',
    });
  }

  const reserva = reservas.data[0];

  // Consultar parcelas da reserva
  // Nota: Endpoint específico pode ser necessário
  // GET /reservas/{id}/parcelas
  const parcelas = await client.request<any>(
    `/reservas/${reserva.id}/parcelas`
  );

  // Filtrar por situação se especificado
  let parcelasFiltradas = parcelas;
  if (situacao && situacao !== 'todas') {
    parcelasFiltradas = parcelas.filter((p: any) => {
      if (situacao === 'em_aberto') return p.situacao === 'em_aberto';
      if (situacao === 'vencidas') return p.situacao === 'vencida';
      if (situacao === 'pagas') return p.situacao === 'paga';
      return true;
    });
  }

  // Calcular resumo
  const resumo = {
    totalPago: parcelas
      .filter((p: any) => p.situacao === 'paga')
      .reduce((sum: number, p: any) => sum + p.valor, 0),
    totalEmAberto: parcelas
      .filter((p: any) => p.situacao === 'em_aberto')
      .reduce((sum: number, p: any) => sum + p.valor, 0),
    totalVencido: parcelas
      .filter((p: any) => p.situacao === 'vencida')
      .reduce((sum: number, p: any) => sum + p.valor, 0),
  };

  return JSON.stringify({
    parcelas: parcelasFiltradas,
    resumo,
  });
}

export async function handleGerarBoleto(args: unknown): Promise<string> {
  const client = getCVCRMClient();
  const { parcelaId, enviarEmail } = gerarBoletoSchema.parse(args);

  // Gerar boleto
  // Nota: Endpoint específico necessário
  // POST /financeiro/boletos/segunda-via
  const boleto = await client.request<any>('/financeiro/boletos/segunda-via', {
    method: 'POST',
    body: JSON.stringify({
      parcelaId,
      enviarEmail: enviarEmail || false,
    }),
  });

  return JSON.stringify({
    linkBoleto: boleto.linkBoleto,
    valor: boleto.valor,
    dataVencimento: boleto.dataVencimento,
    codigoBarras: boleto.codigoBarras,
    emailEnviado: boleto.emailEnviado || false,
  });
}

