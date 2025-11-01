/**
 * MCP Tools para Clientes
 * Consultar: docs/04-MCP-TOOLS.md
 */

import { z } from 'zod';
import { getCVCRMClient } from '@/lib/cvcrm';
import type { MCPToolDefinition } from '@/types';

// ========== SCHEMAS ==========

export const cadastrarClienteSchema = z.object({
  tipoPessoa: z.enum(['fisica', 'juridica']),
  nome: z.string().min(3).optional(),
  cpf: z.string().regex(/^\d{11}$/).optional(),
  razaoSocial: z.string().min(3).optional(),
  cnpj: z.string().regex(/^\d{14}$/).optional(),
  email: z.string().email('E-mail inválido'),
  telefone: z.string().optional(),
  celular: z.string().optional(),
});

export const buscarClientesSchema = z.object({
  nome: z.string().optional(),
  cpf: z.string().optional(),
  cnpj: z.string().optional(),
  email: z.string().optional(),
  page: z.number().int().positive().optional(),
  limit: z.number().int().positive().max(100).optional(),
});

// ========== TOOL DEFINITIONS ==========

export const cadastrarClienteTool: MCPToolDefinition = {
  name: 'cvcrm_cadastrar_cliente',
  description: 'Cadastra um novo cliente (pessoa física ou jurídica) no CV CRM',
  inputSchema: {
    type: 'object',
    properties: {
      tipoPessoa: {
        type: 'string',
        enum: ['fisica', 'juridica'],
        description: 'Tipo de pessoa',
      },
      nome: {
        type: 'string',
        description: 'Nome completo (obrigatório se pessoa física)',
      },
      cpf: {
        type: 'string',
        description: 'CPF com 11 dígitos (obrigatório se pessoa física)',
      },
      razaoSocial: {
        type: 'string',
        description: 'Razão social (obrigatório se pessoa jurídica)',
      },
      cnpj: {
        type: 'string',
        description: 'CNPJ com 14 dígitos (obrigatório se pessoa jurídica)',
      },
      email: {
        type: 'string',
        description: 'E-mail do cliente',
      },
      telefone: {
        type: 'string',
        description: 'Telefone fixo',
      },
      celular: {
        type: 'string',
        description: 'Celular',
      },
    },
    required: ['tipoPessoa', 'email'],
  },
};

export const buscarClientesTool: MCPToolDefinition = {
  name: 'cvcrm_buscar_clientes',
  description: 'Busca clientes no CV CRM por nome, CPF, CNPJ ou e-mail',
  inputSchema: {
    type: 'object',
    properties: {
      nome: {
        type: 'string',
        description: 'Buscar por nome',
      },
      cpf: {
        type: 'string',
        description: 'Buscar por CPF',
      },
      cnpj: {
        type: 'string',
        description: 'Buscar por CNPJ',
      },
      email: {
        type: 'string',
        description: 'Buscar por e-mail',
      },
      page: {
        type: 'number',
        description: 'Número da página',
      },
      limit: {
        type: 'number',
        description: 'Itens por página',
      },
    },
    required: [],
  },
};

// ========== HANDLERS ==========

export async function handleCadastrarCliente(args: unknown): Promise<string> {
  const client = getCVCRMClient();
  const validatedArgs = cadastrarClienteSchema.parse(args);

  const cliente = await client.cadastrarCliente(validatedArgs as any);

  const tipoPessoaLabel = validatedArgs.tipoPessoa === 'fisica' ? 'Pessoa Física' : 'Pessoa Jurídica';
  const documento = validatedArgs.tipoPessoa === 'fisica' 
    ? validatedArgs.cpf ? `CPF: ${validatedArgs.cpf}` : ''
    : validatedArgs.cnpj ? `CNPJ: ${validatedArgs.cnpj}` : '';

  return `✅ **Cliente cadastrado com sucesso!**

📋 **Detalhes:**
- **ID:** ${cliente.id}
- **Código:** ${cliente.codigo}
- **Nome:** ${cliente.nome}
- **Tipo:** ${tipoPessoaLabel}
${documento ? `- **Documento:** ${documento}` : ''}
- **E-mail:** ${cliente.email}
- **Data Cadastro:** ${new Date(cliente.dataCadastro).toLocaleString('pt-BR')}

💡 O cliente foi cadastrado e já pode ser usado em atendimentos, reservas e outros módulos.`;
}

export async function handleBuscarClientes(args: unknown): Promise<string> {
  const client = getCVCRMClient();
  const validatedArgs = buscarClientesSchema.parse(args);

  const resultado = await client.buscarClientes(validatedArgs);

  if (resultado.data.length === 0) {
    return '🔍 **Nenhum cliente encontrado** com os filtros informados.';
  }

  const clientes = resultado.data
    .map(
      (cliente, index) => `
${index + 1}. **${cliente.nome}** (Código: ${cliente.codigo})
   - ID: ${cliente.id}
   - Tipo: ${cliente.tipoPessoa === 'fisica' ? 'Pessoa Física' : 'Pessoa Jurídica'}
   - Documento: ${cliente.cpf || cliente.cnpj || 'Não informado'}
   - E-mail: ${cliente.email}
   - Telefone: ${cliente.celular || cliente.telefone || 'Não informado'}
`
    )
    .join('\n');

  return `🔍 **Clientes Encontrados** (${resultado.total} total, página ${resultado.page}/${resultado.totalPages})
${clientes}

💡 Use o ID do cliente para criar atendimentos ou reservas.`;
}

