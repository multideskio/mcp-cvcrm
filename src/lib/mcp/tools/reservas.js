/**
 * MCP Tools para Reservas
 * Consultar: docs/04-MCP-TOOLS.md
 */
import { z } from 'zod';
import { getCVCRMClient } from '@/lib/cvcrm';
// ========== SCHEMAS ==========
export const criarReservaSchema = z.object({
    unidadeId: z.number().int().positive(),
    clienteIds: z.array(z.number().int().positive()).min(1),
    tabelaPrecoId: z.number().int().positive(),
    corretorId: z.number().int().positive().optional(),
    imobiliariaId: z.number().int().positive().optional(),
    dataReserva: z.string(),
    observacoes: z.string().optional(),
});
export const listarReservasSchema = z.object({
    empreendimentoId: z.number().int().positive().optional(),
    unidadeId: z.number().int().positive().optional(),
    clienteId: z.number().int().positive().optional(),
    situacao: z.string().optional(),
    dataInicio: z.string().optional(),
    dataFim: z.string().optional(),
    page: z.number().int().positive().optional(),
    limit: z.number().int().positive().max(100).optional(),
});
export const informarVendaSchema = z.object({
    reservaId: z.number().int().positive(),
    dataVenda: z.string(),
    observacoes: z.string().optional(),
});
// ========== TOOL DEFINITIONS ==========
export const criarReservaTool = {
    name: 'cvcrm_criar_reserva',
    description: 'Cria uma nova reserva de unidade no CV CRM',
    inputSchema: {
        type: 'object',
        properties: {
            unidadeId: {
                type: 'number',
                description: 'ID da unidade a ser reservada',
            },
            clienteIds: {
                type: 'array',
                items: { type: 'number' },
                description: 'IDs dos clientes (compradores)',
            },
            tabelaPrecoId: {
                type: 'number',
                description: 'ID da tabela de preço',
            },
            corretorId: {
                type: 'number',
                description: 'ID do corretor',
            },
            dataReserva: {
                type: 'string',
                description: 'Data da reserva (ISO 8601: YYYY-MM-DD ou YYYY-MM-DDTHH:mm:ss)',
            },
            observacoes: {
                type: 'string',
                description: 'Observações da reserva',
            },
        },
        required: ['unidadeId', 'clienteIds', 'tabelaPrecoId', 'dataReserva'],
    },
};
export const listarReservasTool = {
    name: 'cvcrm_listar_reservas',
    description: 'Lista reservas com filtros opcionais',
    inputSchema: {
        type: 'object',
        properties: {
            empreendimentoId: {
                type: 'number',
                description: 'Filtrar por empreendimento',
            },
            clienteId: {
                type: 'number',
                description: 'Filtrar por cliente',
            },
            situacao: {
                type: 'string',
                description: 'Filtrar por situação',
            },
        },
        required: [],
    },
};
export const informarVendaTool = {
    name: 'cvcrm_informar_venda',
    description: 'Marca uma reserva como vendida',
    inputSchema: {
        type: 'object',
        properties: {
            reservaId: {
                type: 'number',
                description: 'ID da reserva',
            },
            dataVenda: {
                type: 'string',
                description: 'Data da venda (ISO 8601)',
            },
            observacoes: {
                type: 'string',
                description: 'Observações sobre a venda',
            },
        },
        required: ['reservaId', 'dataVenda'],
    },
};
// ========== HANDLERS ==========
export async function handleCriarReserva(args) {
    const client = getCVCRMClient();
    const validatedArgs = criarReservaSchema.parse(args);
    const reserva = await client.criarReserva(validatedArgs);
    const valorFormatado = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(reserva.valorTotal);
    return `✅ **Reserva criada com sucesso!**

📋 **Detalhes da Reserva:**
- **Número:** ${reserva.numero}
- **ID:** ${reserva.id}
- **Situação:** ${reserva.situacao}
- **Unidade:** ID ${reserva.unidadeId}
- **Valor Total:** ${valorFormatado}
- **Data Reserva:** ${new Date(reserva.dataReserva).toLocaleDateString('pt-BR')}
- **Clientes:** ${reserva.clienteIds.length} cliente(s)

💡 **Próximos passos:** 
- Enviar documentos para assinatura
- Processar pagamentos
- Acompanhar workflow da reserva`;
}
export async function handleListarReservas(args) {
    const client = getCVCRMClient();
    const validatedArgs = listarReservasSchema.parse(args);
    const resultado = await client.listarReservas(validatedArgs);
    if (resultado.data.length === 0) {
        return '📋 **Nenhuma reserva encontrada** com os filtros informados.';
    }
    const reservas = resultado.data
        .map((reserva, index) => {
        const valorFormatado = new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(reserva.valorTotal);
        return `
${index + 1}. **${reserva.numero}** - ${reserva.situacao}
   - Unidade: ID ${reserva.unidadeId}
   - Valor: ${valorFormatado}
   - Data: ${new Date(reserva.dataReserva).toLocaleDateString('pt-BR')}
   - Clientes: ${reserva.clienteIds.length}
`;
    })
        .join('\n');
    return `📋 **Reservas Encontradas** (${resultado.total} total, página ${resultado.page}/${resultado.totalPages})
${reservas}

💡 Use cvcrm_informar_venda para marcar uma reserva como vendida.`;
}
export async function handleInformarVenda(args) {
    const client = getCVCRMClient();
    const validatedArgs = informarVendaSchema.parse(args);
    await client.informarVenda(validatedArgs.reservaId, {
        dataVenda: validatedArgs.dataVenda,
        observacoes: validatedArgs.observacoes,
    });
    return `✅ **Venda informada com sucesso!**

📋 **Detalhes:**
- **Reserva ID:** ${validatedArgs.reservaId}
- **Data da Venda:** ${new Date(validatedArgs.dataVenda).toLocaleDateString('pt-BR')}
${validatedArgs.observacoes ? `- **Observações:** ${validatedArgs.observacoes}` : ''}

💡 A reserva foi atualizada para o status de **vendida**.`;
}
//# sourceMappingURL=reservas.js.map