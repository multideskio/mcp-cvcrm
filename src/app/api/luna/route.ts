/**
 * API HTTP para Luna Nova Tools
 * Permite acesso via HTTP (para n8n, Typebot, etc)
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  handleIdentificarCliente,
  handleConsultarParcelas,
  handleGerarBoleto,
  handleCriarChamado,
  handleConsultarChamados,
  handleListarEmpreendimentos,
} from '@/lib/mcp/tools/luna';
import { logger, logOperationError } from '@/lib/utils/logger';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tool, arguments: args } = body;

    if (!tool) {
      return NextResponse.json(
        { error: 'Tool name is required' },
        { status: 400 }
      );
    }

    logger.info({ tool, args }, 'Luna API call');

    let result: string;

    switch (tool) {
      case 'luna_identificar_cliente':
        result = await handleIdentificarCliente(args);
        break;

      case 'luna_consultar_parcelas':
        result = await handleConsultarParcelas(args);
        break;

      case 'luna_gerar_segunda_via_boleto':
        result = await handleGerarBoleto(args);
        break;

      case 'luna_criar_chamado_assistencia':
        result = await handleCriarChamado(args);
        break;

      case 'luna_consultar_chamados':
        result = await handleConsultarChamados(args);
        break;

      case 'luna_listar_empreendimentos_disponiveis':
        result = await handleListarEmpreendimentos(args);
        break;

      default:
        return NextResponse.json(
          { error: `Unknown tool: ${tool}` },
          { status: 404 }
        );
    }

    // Parse resultado (que vem como JSON string)
    const data = JSON.parse(result);

    return NextResponse.json({
      success: true,
      tool,
      data,
    });
  } catch (error) {
    logOperationError('Luna API', error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// GET para listar tools disponíveis
export async function GET() {
  return NextResponse.json({
    tools: [
      {
        name: 'luna_identificar_cliente',
        description: 'Identifica cliente por CPF',
        method: 'POST',
        parameters: {
          cpf: 'string (11 dígitos)',
          nome: 'string (opcional)',
        },
      },
      {
        name: 'luna_consultar_parcelas',
        description: 'Consulta parcelas de pagamento',
        method: 'POST',
        parameters: {
          clienteId: 'number',
          unidadeId: 'number',
          situacao: 'string (opcional)',
        },
      },
      {
        name: 'luna_gerar_segunda_via_boleto',
        description: 'Gera segunda via de boleto',
        method: 'POST',
        parameters: {
          parcelaId: 'number',
          enviarEmail: 'boolean (opcional)',
        },
      },
      {
        name: 'luna_criar_chamado_assistencia',
        description: 'Abre chamado de assistência técnica',
        method: 'POST',
        parameters: {
          clienteId: 'number',
          unidadeId: 'number',
          descricaoProblema: 'string',
          localidade: 'string (opcional)',
          urgencia: 'string (opcional)',
          fotosBase64: 'array (opcional)',
        },
      },
      {
        name: 'luna_consultar_chamados',
        description: 'Lista chamados de assistência',
        method: 'POST',
        parameters: {
          clienteId: 'number',
          unidadeId: 'number (opcional)',
          situacao: 'string (opcional)',
        },
      },
      {
        name: 'luna_listar_empreendimentos_disponiveis',
        description: 'Lista empreendimentos disponíveis',
        method: 'POST',
        parameters: {
          cidade: 'string (opcional)',
          bairro: 'string (opcional)',
          valorMin: 'number (opcional)',
          valorMax: 'number (opcional)',
        },
      },
    ],
  });
}

