# Arquitetura do CV CRM MCP Server

## 🏛️ Visão Geral

O sistema é dividido em 3 camadas principais:

1. **MCP Layer**: Interface com o protocolo MCP
2. **API Layer**: Cliente HTTP para CV CRM API
3. **Cache Layer**: Redis para persistência temporária

## 📐 Diagrama de Arquitetura

```
┌─────────────────────────────────────────────────────────┐
│                    MCP Client (Cursor)                   │
└───────────────────────┬─────────────────────────────────┘
                        │ MCP Protocol
                        ▼
┌─────────────────────────────────────────────────────────┐
│                   MCP Server (Next.js)                   │
│  ┌──────────────────────────────────────────────────┐  │
│  │              MCP Request Handler                  │  │
│  │  - Tools (cvcrm_criar_atendimento, etc)          │  │
│  │  - Resources (cvcrm://auth/status, etc)          │  │
│  └──────────────────────┬───────────────────────────┘  │
│                         │                               │
│  ┌──────────────────────▼───────────────────────────┐  │
│  │           Authentication Manager                  │  │
│  │  - Token Generation                               │  │
│  │  - Token Validation                               │  │
│  │  - Auto Renewal                                   │  │
│  └──────────────────────┬───────────────────────────┘  │
│                         │                               │
│  ┌──────────────────────▼───────────────────────────┐  │
│  │              CV CRM API Client                    │  │
│  │  - HTTP Request Builder                           │  │
│  │  - Response Parser                                │  │
│  │  - Error Handler                                  │  │
│  └──────────────────────┬───────────────────────────┘  │
└─────────────────────────┼───────────────────────────────┘
                          │
         ┌────────────────┼────────────────┐
         │                │                │
         ▼                ▼                ▼
    ┌────────┐      ┌─────────┐    ┌──────────┐
    │ Redis  │      │ CV CRM  │    │  Logs    │
    │ Cache  │      │   API   │    │ (pino)   │
    └────────┘      └─────────┘    └──────────┘
```

## 🔧 Componentes Principais

### 1. MCP Server (`src/lib/mcp/server.ts`)

**Responsabilidades:**
- Inicializar servidor MCP
- Registrar tools e resources
- Processar requisições MCP
- Retornar respostas formatadas

**Principais métodos:**
```typescript
class CVCRMMCPServer {
  async start(): Promise<void>
  async stop(): Promise<void>
  registerTools(): void
  registerResources(): void
  handleToolCall(name: string, args: any): Promise<any>
  handleResourceRead(uri: string): Promise<any>
}
```

### 2. Authentication Manager (`src/lib/cvcrm/auth.ts`)

**Responsabilidades:**
- Gerenciar fluxo de autenticação (2 etapas)
- Armazenar/recuperar tokens do Redis
- Validar expiração de tokens
- Renovar tokens automaticamente

**Principais métodos:**
```typescript
class CVCRMAuthManager {
  async authenticate(): Promise<string>
  async getToken(): Promise<string>
  async refreshToken(): Promise<string>
  async isTokenValid(): Promise<boolean>
  private async requestVerificationCode(): Promise<void>
  private async generateToken(code: string): Promise<string>
}
```

**Fluxo de Autenticação:**
```
1. Verificar token no Redis
   ├─ Se válido: retornar token
   └─ Se inválido/expirado:
      ├─ 1.1. POST /api/v1/cliente/codigo-verificacao
      ├─ 1.2. Aguardar/obter código (env ou input)
      ├─ 1.3. POST /api/v1/autenticacao/token
      └─ 1.4. Armazenar no Redis (TTL: 30min)
```

### 3. CV CRM API Client (`src/lib/cvcrm/client.ts`)

**Responsabilidades:**
- Fazer requisições HTTP para CV CRM API
- Injetar token de autenticação
- Tratar erros da API
- Parsear respostas

**Principais métodos:**
```typescript
class CVCRMClient {
  // Atendimentos
  async criarAtendimento(data: CriarAtendimentoInput): Promise<Atendimento>
  async listarAtendimentos(filtros: FiltrosAtendimento): Promise<Atendimento[]>
  async adicionarMensagem(id: string, mensagem: string): Promise<void>
  
  // Assistência Técnica
  async criarAssistencia(data: CriarAssistenciaInput): Promise<Assistencia>
  async listarAssistencias(filtros: FiltrosAssistencia): Promise<Assistencia[]>
  
  // Clientes
  async cadastrarCliente(data: CadastrarClienteInput): Promise<Cliente>
  async buscarClientes(filtros: FiltrosCliente): Promise<Cliente[]>
  
  // Reservas
  async criarReserva(data: CriarReservaInput): Promise<Reserva>
  async listarReservas(filtros: FiltrosReserva): Promise<Reserva[]>
  async informarVenda(id: string): Promise<void>
  
  // Comissões
  async listarComissoes(filtros: FiltrosComissao): Promise<Comissao[]>
  async alterarComissao(id: string, situacao: string): Promise<void>
  
  // Genéricos
  private async request<T>(endpoint: string, options: RequestOptions): Promise<T>
}
```

### 4. Redis Cache Manager (`src/lib/redis/cache.ts`)

**Responsabilidades:**
- Conexão com Redis
- Operações de cache (get, set, del)
- Gerenciar TTL
- Invalidação de cache

**Principais métodos:**
```typescript
class RedisCacheManager {
  async get<T>(key: string): Promise<T | null>
  async set(key: string, value: any, ttl?: number): Promise<void>
  async del(key: string): Promise<void>
  async exists(key: string): Promise<boolean>
  async flush(pattern: string): Promise<void>
}
```

**Padrões de Keys:**
```typescript
const CACHE_KEYS = {
  token: (dominio: string, usuario: string) => `cvcrm:token:${dominio}:${usuario}`,
  empreendimentos: () => `cvcrm:cache:empreendimentos`,
  workflows: (funcionalidade: string) => `cvcrm:cache:workflows:${funcionalidade}`,
  atendimentos: (filtros: string) => `cvcrm:cache:atendimentos:${filtros}`,
}
```

## 🔄 Fluxo de Requisição Completo

### Exemplo: Criar Atendimento

```
1. Cursor envia comando MCP
   │
   ▼
2. MCP Server recebe tool call: "cvcrm_criar_atendimento"
   │
   ▼
3. Validar argumentos do tool
   │
   ▼
4. Authentication Manager
   ├─ Verificar token no Redis
   └─ Se necessário, autenticar
   │
   ▼
5. CV CRM Client
   ├─ Montar request HTTP
   ├─ POST https://{dominio}.cvcrm.com.br/api/v1/relacionamento/atendimentos/cadastrar
   ├─ Headers: { Authorization: Bearer {token} }
   └─ Body: { assunto, descricao, clienteId, ... }
   │
   ▼
6. Processar resposta da API
   ├─ Se sucesso: retornar dados
   └─ Se erro: tratar e retornar erro formatado
   │
   ▼
7. MCP Server formata resposta
   │
   ▼
8. Cursor recebe resposta
```

## 📦 Estrutura de Diretórios Detalhada

```
src/
├── app/                          # Next.js App Router
│   ├── api/
│   │   └── mcp/
│   │       └── route.ts          # Endpoint HTTP para MCP (opcional)
│   ├── layout.tsx
│   └── page.tsx                  # Dashboard (opcional)
│
├── lib/
│   ├── cvcrm/                    # CV CRM Integration
│   │   ├── client.ts             # API Client principal
│   │   ├── auth.ts               # Authentication Manager
│   │   ├── endpoints/            # Endpoints organizados
│   │   │   ├── atendimentos.ts
│   │   │   ├── assistencias.ts
│   │   │   ├── clientes.ts
│   │   │   ├── reservas.ts
│   │   │   └── comissoes.ts
│   │   └── types.ts              # Types específicos do CV CRM
│   │
│   ├── mcp/                      # MCP Server
│   │   ├── server.ts             # MCP Server principal
│   │   ├── tools/                # Tools organizados
│   │   │   ├── atendimentos.ts
│   │   │   ├── assistencias.ts
│   │   │   ├── clientes.ts
│   │   │   ├── reservas.ts
│   │   │   └── comissoes.ts
│   │   ├── resources.ts          # Resources do MCP
│   │   └── types.ts              # Types do MCP
│   │
│   ├── redis/                    # Redis Integration
│   │   ├── client.ts             # Redis client
│   │   ├── cache.ts              # Cache Manager
│   │   └── keys.ts               # Cache key patterns
│   │
│   └── utils/                    # Utilitários
│       ├── logger.ts             # Logger (pino)
│       ├── errors.ts             # Error classes
│       └── validators.ts         # Validações
│
├── types/                        # TypeScript Types globais
│   ├── cvcrm.ts                  # Types da API CV CRM
│   ├── mcp.ts                    # Types do MCP
│   └── index.ts
│
└── config/                       # Configurações
    ├── cvcrm.ts                  # Config CV CRM
    ├── redis.ts                  # Config Redis
    └── mcp.ts                    # Config MCP
```

## 🔒 Segurança e Boas Práticas

### 1. Variáveis de Ambiente
- **NUNCA** commitar `.env`
- Usar `.env.example` como template
- Validar env vars no startup

### 2. Autenticação
- Tokens sempre no Redis, nunca em memória persistente
- TTL rigoroso nos tokens
- Renovação automática antes da expiração

### 3. Error Handling
- Try/catch em todas as operações async
- Logs estruturados com contexto
- Mensagens de erro user-friendly no MCP

### 4. Rate Limiting
- Implementar rate limiting nas chamadas à API
- Respeitar limites do CV CRM
- Queue para requisições em lote

## 📊 Monitoramento e Logs

### Estrutura de Logs (Pino)

```typescript
logger.info({ 
  type: 'mcp_tool_call',
  tool: 'cvcrm_criar_atendimento',
  userId: 'user123',
  duration: 234
}, 'Tool call executado com sucesso');

logger.error({
  type: 'api_error',
  endpoint: '/api/v1/relacionamento/atendimentos/cadastrar',
  status: 401,
  error: 'Token inválido'
}, 'Erro na chamada à API');
```

## 🧪 Testes

### Estrutura de Testes
```
tests/
├── unit/
│   ├── cvcrm/
│   ├── mcp/
│   └── redis/
├── integration/
│   └── api/
└── e2e/
    └── mcp-flow.test.ts
```

---

**Ver também:**
- [02-AUTHENTICATION.md](./02-AUTHENTICATION.md) - Detalhes de autenticação
- [03-API-ENDPOINTS.md](./03-API-ENDPOINTS.md) - Endpoints da API
- [04-MCP-TOOLS.md](./04-MCP-TOOLS.md) - Especificação dos tools

**Última atualização**: 2025-11-01

