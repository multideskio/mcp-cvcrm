/**
 * API HTTP para tools individuais da Luna Nova
 * Rota: /api/luna/{tool}
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

type RouteParams = {
  params: {
    tool: string;
  };
};

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { tool } = params;
    const args = await request.json();

    logger.info({ tool, args }, 'Luna tool call via HTTP');

    let result: string;

    switch (tool) {
      case 'identificar-cliente':
        result = await handleIdentificarCliente(args);
        break;

      case 'consultar-parcelas':
        result = await handleConsultarParcelas(args);
        break;

      case 'gerar-boleto':
        result = await handleGerarBoleto(args);
        break;

      case 'criar-chamado':
        result = await handleCriarChamado(args);
        break;

      case 'consultar-chamados':
        result = await handleConsultarChamados(args);
        break;

      case 'listar-empreendimentos':
        result = await handleListarEmpreendimentos(args);
        break;

      default:
        return NextResponse.json(
          { error: `Unknown tool: ${tool}` },
          { status: 404 }
        );
    }

    // Parse resultado
    const data = JSON.parse(result);

    return NextResponse.json(data);
  } catch (error) {
    logOperationError(`Luna tool: ${params.tool}`, error);

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

