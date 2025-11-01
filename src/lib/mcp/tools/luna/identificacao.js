/**
 * MCP Tools - Identificação de Cliente
 */
import { z } from 'zod';
import { getCVCRMClient } from '@/lib/cvcrm';
// ========== SCHEMAS ==========
export const identificarClienteSchema = z.object({
    cpf: z.string().regex(/^\d{11}$/, 'CPF deve ter 11 dígitos'),
    nome: z.string().optional(),
});
// ========== TOOL DEFINITION ==========
export const identificarClienteTool = {
    name: 'luna_identificar_cliente',
    description: 'Identifica cliente por CPF e retorna dados + unidades vinculadas com segmentação (VIP/Econômico)',
    inputSchema: {
        type: 'object',
        properties: {
            cpf: {
                type: 'string',
                description: 'CPF do cliente (11 dígitos sem máscara)',
            },
            nome: {
                type: 'string',
                description: 'Nome do cliente (opcional, para validação)',
            },
        },
        required: ['cpf'],
    },
};
// ========== HANDLER ==========
export async function handleIdentificarCliente(args) {
    const client = getCVCRMClient();
    const { cpf, nome } = identificarClienteSchema.parse(args);
    // Buscar cliente por CPF
    const resultado = await client.buscarClientes({ cpf, limit: 1 });
    if (resultado.data.length === 0) {
        return JSON.stringify({
            encontrado: false,
            mensagem: 'Nenhum cliente encontrado com este CPF',
        });
    }
    const cliente = resultado.data[0];
    // Validar nome se fornecido
    if (nome && !cliente.nome.toLowerCase().includes(nome.toLowerCase())) {
        return JSON.stringify({
            encontrado: false,
            mensagem: 'CPF encontrado mas nome não confere',
        });
    }
    // Buscar unidades do cliente
    // Nota: Pode precisar de endpoint específico `/clientes/{id}/unidades`
    // Por enquanto, usar reservas como proxy
    const reservas = await client.listarReservas({ clienteId: cliente.id });
    const unidades = reservas.data.map((reserva) => ({
        id: reserva.unidadeId,
        numeroUnidade: `Unidade ${reserva.unidadeId}`,
        situacao: reserva.situacao,
        // Segmentação seria baseada em dados do empreendimento
        segmento: 'economico', // Placeholder - precisa lógica real
    }));
    // Determinar perfil
    const perfil = unidades.some((u) => u.segmento === 'alto_padrao') ? 'vip' : 'economico';
    return JSON.stringify({
        encontrado: true,
        cliente: {
            id: cliente.id,
            nome: cliente.nome,
            cpf: cliente.cpf,
            email: cliente.email,
            telefone: cliente.telefone || cliente.celular,
        },
        unidades,
        perfil,
    });
}
//# sourceMappingURL=identificacao.js.map