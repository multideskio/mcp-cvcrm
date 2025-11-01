# MCP Tools - Especificação

## 📚 Visão Geral

Os **tools** são as funções que o MCP Server expõe para o cliente (Cursor). Cada tool representa uma ação que pode ser executada na API do CV CRM.

## 🛠️ Lista de Tools

### Categoria: Atendimentos

#### `cvcrm_criar_atendimento`

**Descrição**: Cadastra um novo atendimento no CV CRM

**Parâmetros:**
```typescript
{
  assunto: {
    type: "string",
    description: "Assunto do atendimento",
    required: true
  },
  descricao: {
    type: "string",
    description: "Descrição detalhada do atendimento",
    required: true
  },
  clienteId: {
    type: "number",
    description: "ID do cliente",
    required: true
  },
  prioridade: {
    type: "string",
    enum: ["baixa", "media", "alta"],
    description: "Prioridade do atendimento",
    required: false
  }
}
```

**Retorno:**
```typescript
{
  id: number;
  protocolo: string;
  situacao: string;
  dataCriacao: string;
}
```

**Exemplo de uso:**
```
User: Crie um atendimento para o cliente ID 123 sobre problema no portão
AI: [chama cvcrm_criar_atendimento com os parâmetros]
Response: Atendimento criado com sucesso! Protocolo: ATD-2024-001
```

---

#### `cvcrm_listar_atendimentos`

**Descrição**: Lista atendimentos com filtros opcionais

**Parâmetros:**
```typescript
{
  clienteId: {
    type: "number",
    description: "Filtrar por ID do cliente",
    required: false
  },
  situacao: {
    type: "string",
    description: "Filtrar por situação",
    required: false
  },
  dataInicio: {
    type: "string",
    description: "Data início (YYYY-MM-DD)",
    required: false
  },
  dataFim: {
    type: "string",
    description: "Data fim (YYYY-MM-DD)",
    required: false
  },
  page: {
    type: "number",
    description: "Página (padrão: 1)",
    required: false
  },
  limit: {
    type: "number",
    description: "Itens por página (padrão: 20)",
    required: false
  }
}
```

---

### Categoria: Assistência Técnica

#### `cvcrm_criar_assistencia`

**Descrição**: Cria uma nova assistência técnica

**Parâmetros:**
```typescript
{
  unidadeId: {
    type: "number",
    description: "ID da unidade",
    required: true
  },
  descricao: {
    type: "string",
    description: "Descrição do problema",
    required: true
  },
  prioridade: {
    type: "string",
    enum: ["baixa", "media", "alta", "urgente"],
    description: "Prioridade da assistência",
    required: false
  },
  localidadeId: {
    type: "number",
    description: "ID da localidade (cômodo)",
    required: false
  }
}
```

---

#### `cvcrm_listar_assistencias`

**Descrição**: Lista assistências técnicas com filtros

**Parâmetros:** Similar ao listar atendimentos

---

### Categoria: Clientes

#### `cvcrm_cadastrar_cliente`

**Descrição**: Cadastra um novo cliente (pessoa física ou jurídica)

**Parâmetros:**
```typescript
{
  tipoPessoa: {
    type: "string",
    enum: ["fisica", "juridica"],
    description: "Tipo de pessoa",
    required: true
  },
  // Pessoa Física
  nome: {
    type: "string",
    description: "Nome completo",
    required: false // true se tipoPessoa = fisica
  },
  cpf: {
    type: "string",
    description: "CPF (11 dígitos)",
    required: false
  },
  // Pessoa Jurídica
  razaoSocial: {
    type: "string",
    description: "Razão social",
    required: false // true se tipoPessoa = juridica
  },
  cnpj: {
    type: "string",
    description: "CNPJ (14 dígitos)",
    required: false
  },
  // Comum
  email: {
    type: "string",
    description: "E-mail",
    required: true
  },
  telefone: {
    type: "string",
    description: "Telefone fixo",
    required: false
  },
  celular: {
    type: "string",
    description: "Celular",
    required: false
  }
}
```

---

#### `cvcrm_buscar_clientes`

**Descrição**: Busca clientes com filtros

**Parâmetros:**
```typescript
{
  nome: {
    type: "string",
    description: "Buscar por nome",
    required: false
  },
  cpf: {
    type: "string",
    description: "Buscar por CPF",
    required: false
  },
  cnpj: {
    type: "string",
    description: "Buscar por CNPJ",
    required: false
  },
  email: {
    type: "string",
    description: "Buscar por e-mail",
    required: false
  }
}
```

---

### Categoria: Reservas

#### `cvcrm_criar_reserva`

**Descrição**: Cria uma nova reserva de unidade

**Parâmetros:**
```typescript
{
  unidadeId: {
    type: "number",
    description: "ID da unidade a ser reservada",
    required: true
  },
  clienteIds: {
    type: "array",
    items: { type: "number" },
    description: "IDs dos clientes (compradores)",
    required: true
  },
  tabelaPrecoId: {
    type: "number",
    description: "ID da tabela de preço",
    required: true
  },
  dataReserva: {
    type: "string",
    description: "Data da reserva (ISO 8601)",
    required: true
  },
  corretorId: {
    type: "number",
    description: "ID do corretor",
    required: false
  }
}
```

---

#### `cvcrm_listar_reservas`

**Descrição**: Lista reservas com filtros

**Parâmetros:**
```typescript
{
  empreendimentoId: {
    type: "number",
    description: "Filtrar por empreendimento",
    required: false
  },
  clienteId: {
    type: "number",
    description: "Filtrar por cliente",
    required: false
  },
  situacao: {
    type: "string",
    description: "Filtrar por situação",
    required: false
  }
}
```

---

#### `cvcrm_informar_venda`

**Descrição**: Marca uma reserva como vendida

**Parâmetros:**
```typescript
{
  reservaId: {
    type: "number",
    description: "ID da reserva",
    required: true
  },
  dataVenda: {
    type: "string",
    description: "Data da venda (ISO 8601)",
    required: true
  },
  observacoes: {
    type: "string",
    description: "Observações sobre a venda",
    required: false
  }
}
```

---

### Categoria: Comissões

#### `cvcrm_listar_comissoes`

**Descrição**: Lista comissões com filtros

**Parâmetros:**
```typescript
{
  reservaId: {
    type: "number",
    description: "Filtrar por ID da reserva",
    required: false
  },
  corretorId: {
    type: "number",
    description: "Filtrar por ID do corretor",
    required: false
  },
  situacao: {
    type: "string",
    description: "Filtrar por situação",
    required: false
  }
}
```

---

### Categoria: Cadastros Gerais

#### `cvcrm_listar_empreendimentos`

**Descrição**: Lista todos os empreendimentos ativos

**Parâmetros:** Nenhum

**Retorno:**
```typescript
Array<{
  id: number;
  nome: string;
  codigo: string;
  situacao: string;
  cidade: string;
  estado: string;
}>
```

---

## 📋 Implementação dos Tools

### Estrutura de Arquivos

```
src/lib/mcp/tools/
├── atendimentos.ts
├── assistencias.ts
├── clientes.ts
├── reservas.ts
├── comissoes.ts
└── index.ts
```

### Exemplo: Implementação do Tool

**Arquivo**: `src/lib/mcp/tools/atendimentos.ts`

```typescript
import { CVCRMClient } from '@/lib/cvcrm/client';
import { z } from 'zod';

// Schema de validação
export const criarAtendimentoSchema = z.object({
  assunto: z.string().min(5, 'Assunto deve ter no mínimo 5 caracteres'),
  descricao: z.string().min(10, 'Descrição deve ter no mínimo 10 caracteres'),
  clienteId: z.number().int().positive(),
  prioridade: z.enum(['baixa', 'media', 'alta']).optional(),
  tipoAtendimentoId: z.number().int().positive().optional(),
});

export type CriarAtendimentoInput = z.infer<typeof criarAtendimentoSchema>;

// Tool definition
export const criarAtendimentoTool = {
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

// Handler
export async function handleCriarAtendimento(
  args: unknown,
  client: CVCRMClient
): Promise<string> {
  // Validar argumentos
  const validatedArgs = criarAtendimentoSchema.parse(args);

  // Chamar API
  const atendimento = await client.criarAtendimento(validatedArgs);

  // Retornar resposta formatada
  return `✅ Atendimento criado com sucesso!

📋 **Detalhes:**
- Protocolo: ${atendimento.protocolo}
- ID: ${atendimento.id}
- Situação: ${atendimento.situacao}
- Data: ${new Date(atendimento.dataCriacao).toLocaleString('pt-BR')}

O atendimento foi registrado e está disponível para acompanhamento.`;
}
```

### Registro dos Tools no MCP Server

**Arquivo**: `src/lib/mcp/server.ts`

```typescript
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { CVCRMClient } from '@/lib/cvcrm/client';
import * as atendimentosTools from './tools/atendimentos';
import * as assistenciasTools from './tools/assistencias';
// ... outros imports

export class CVCRMMCPServer {
  private server: Server;
  private client: CVCRMClient;

  constructor(client: CVCRMClient) {
    this.client = client;
    this.server = new Server(
      {
        name: 'cvcrm-mcp-server',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
          resources: {},
        },
      }
    );

    this.registerHandlers();
  }

  private registerHandlers() {
    // Listar tools disponíveis
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        atendimentosTools.criarAtendimentoTool,
        atendimentosTools.listarAtendimentosTool,
        assistenciasTools.criarAssistenciaTool,
        // ... outros tools
      ],
    }));

    // Executar tool
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        let result: string;

        switch (name) {
          case 'cvcrm_criar_atendimento':
            result = await atendimentosTools.handleCriarAtendimento(args, this.client);
            break;
          
          case 'cvcrm_listar_atendimentos':
            result = await atendimentosTools.handleListarAtendimentos(args, this.client);
            break;

          case 'cvcrm_criar_assistencia':
            result = await assistenciasTools.handleCriarAssistencia(args, this.client);
            break;

          // ... outros cases

          default:
            throw new Error(`Tool desconhecido: ${name}`);
        }

        return {
          content: [
            {
              type: 'text',
              text: result,
            },
          ],
        };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
        
        return {
          content: [
            {
              type: 'text',
              text: `❌ Erro ao executar ${name}: ${errorMessage}`,
            },
          ],
          isError: true,
        };
      }
    });
  }

  async start() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('CV CRM MCP Server iniciado');
  }
}
```

## 🎨 Formatação de Respostas

### Boas Práticas

1. **Usar emojis** para tornar as respostas mais amigáveis
2. **Formatar dados** de forma clara (listas, tabelas)
3. **Incluir contexto** (IDs, protocolos, datas)
4. **Mensagens de sucesso/erro** claras

### Exemplos de Respostas

**Sucesso:**
```
✅ Reserva criada com sucesso!

📋 **Detalhes da Reserva:**
- Número: RES-2024-0123
- Unidade: Apto 101 - Edifício Solar
- Cliente: João da Silva (ID: 456)
- Valor Total: R$ 450.000,00
- Data: 01/11/2025

💡 Próximos passos: Enviar documentos para assinatura
```

**Lista:**
```
📋 **Atendimentos Encontrados** (3 resultados)

1. **ATD-2024-001** - Problema no portão
   - Cliente: Maria Santos
   - Situação: Em andamento
   - Data: 30/10/2025

2. **ATD-2024-002** - Vazamento na piscina
   - Cliente: João Silva
   - Situação: Aguardando
   - Data: 31/10/2025

3. **ATD-2024-003** - Manutenção elevador
   - Cliente: Síndico
   - Situação: Resolvido
   - Data: 01/11/2025
```

**Erro:**
```
❌ Não foi possível criar o atendimento

**Motivo:** Cliente ID 999 não encontrado

💡 **Dica:** Verifique se o ID do cliente está correto usando o comando:
   cvcrm_buscar_clientes com o nome ou CPF
```

---

**Ver também:**
- [03-API-ENDPOINTS.md](./03-API-ENDPOINTS.md) - Endpoints da API
- [01-ARCHITECTURE.md](./01-ARCHITECTURE.md) - Arquitetura geral

**Última atualização**: 2025-11-01

