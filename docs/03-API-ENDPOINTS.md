# API Endpoints CV CRM

## 📚 Referência

**Documentação oficial**: https://desenvolvedor.cvcrm.com.br/reference/cadastrocv-1

## 🔑 Autenticação

Todos os endpoints (exceto autenticação) requerem header:

```http
Authorization: Bearer {token}
```

## 📋 Endpoints Implementados

### 1. Atendimentos

#### 1.1 Cadastrar Atendimento
```http
POST /api/v1/relacionamento/atendimentos/cadastrar
```

**Request:**
```typescript
{
  assunto: string;
  descricao: string;
  clienteId: number;
  prioridade?: 'baixa' | 'media' | 'alta';
  tipoAtendimentoId?: number;
}
```

**Response:**
```typescript
{
  id: number;
  protocolo: string;
  situacao: string;
  dataCriacao: string;
}
```

#### 1.2 Listar Atendimentos
```http
GET /api/v1/relacionamento/atendimentos
```

**Query Params:**
```typescript
{
  clienteId?: number;
  situacao?: string;
  dataInicio?: string; // YYYY-MM-DD
  dataFim?: string;
  page?: number;
  limit?: number;
}
```

#### 1.3 Adicionar Mensagem
```http
POST /api/v1/relacionamento/atendimentos/{id}/mensagem
```

**Request:**
```typescript
{
  mensagem: string;
  anexos?: Array<{
    nome: string;
    base64: string;
    tipo: string;
  }>;
}
```

---

### 2. Assistência Técnica

#### 2.1 Criar Assistência Técnica
```http
POST /api/v1/assistenciatecnica/assistencia
```

**Request:**
```typescript
{
  unidadeId: number;
  descricao: string;
  localidadeId?: number;
  areaComumId?: number;
  itensManutencaoIds?: number[];
  prioridade?: 'baixa' | 'media' | 'alta' | 'urgente';
}
```

**Response:**
```typescript
{
  id: number;
  protocolo: string;
  situacao: string;
  dataCriacao: string;
}
```

#### 2.2 Listar Assistências
```http
GET /api/v1/assistenciatecnica/assistencias
```

**Query Params:**
```typescript
{
  unidadeId?: number;
  situacao?: string;
  dataInicio?: string;
  dataFim?: string;
  page?: number;
  limit?: number;
}
```

#### 2.3 Adicionar Visita
```http
POST /api/v1/assistenciatecnica/assistencia/{id}/visita
```

**Request:**
```typescript
{
  dataAgendada: string; // ISO 8601
  equipeId?: number;
  observacoes?: string;
}
```

---

### 3. Clientes

#### 3.1 Cadastrar Cliente
```http
POST /api/v1/clientes
```

**Request:**
```typescript
{
  tipoPessoa: 'fisica' | 'juridica';
  // Pessoa Física
  nome?: string;
  cpf?: string;
  rg?: string;
  dataNascimento?: string;
  // Pessoa Jurídica
  razaoSocial?: string;
  nomeFantasia?: string;
  cnpj?: string;
  // Comum
  email: string;
  telefone?: string;
  celular?: string;
  endereco?: {
    cep: string;
    logradouro: string;
    numero: string;
    complemento?: string;
    bairro: string;
    cidadeId: number;
    estadoId: number;
  };
}
```

**Response:**
```typescript
{
  id: number;
  codigo: string;
  nome: string;
  email: string;
}
```

#### 3.2 Buscar Clientes
```http
GET /api/v1/clientes
```

**Query Params:**
```typescript
{
  nome?: string;
  cpf?: string;
  cnpj?: string;
  email?: string;
  page?: number;
  limit?: number;
}
```

---

### 4. Reservas

#### 4.1 Criar Reserva
```http
POST /api/v1/reservas
```

**Request:**
```typescript
{
  unidadeId: number;
  clienteIds: number[];
  tabelaPrecoId: number;
  corretorId?: number;
  imobiliariaId?: number;
  dataReserva: string; // ISO 8601
  observacoes?: string;
}
```

**Response:**
```typescript
{
  id: number;
  numero: string;
  situacao: string;
  dataReserva: string;
  valorTotal: number;
}
```

#### 4.2 Listar Reservas
```http
GET /api/v1/reservas
```

**Query Params:**
```typescript
{
  empreendimentoId?: number;
  unidadeId?: number;
  clienteId?: number;
  situacao?: string;
  dataInicio?: string;
  dataFim?: string;
  page?: number;
  limit?: number;
}
```

#### 4.3 Informar Venda
```http
POST /api/v1/reservas/{id}/informar-venda
```

**Request:**
```typescript
{
  dataVenda: string; // ISO 8601
  observacoes?: string;
}
```

#### 4.4 Processar Distrato
```http
POST /api/v1/reservas/{id}/distrato
```

**Request:**
```typescript
{
  motivo: string;
  dataDistrato: string; // ISO 8601
  observacoes?: string;
}
```

---

### 5. Comissões

#### 5.1 Listar Comissões
```http
GET /api/v1/comissoes
```

**Query Params:**
```typescript
{
  reservaId?: number;
  corretorId?: number;
  situacao?: string;
  dataInicio?: string;
  dataFim?: string;
  page?: number;
  limit?: number;
}
```

**Response:**
```typescript
{
  data: Array<{
    id: number;
    reservaId: number;
    corretorId: number;
    valor: number;
    percentual: number;
    situacao: string;
    dataPrevistaPagamento: string;
  }>;
  total: number;
  page: number;
  limit: number;
}
```

#### 5.2 Alterar Situação da Comissão
```http
POST /api/v1/comissoes/{id}/alterar-situacao
```

**Request:**
```typescript
{
  situacao: 'aprovada' | 'rejeitada' | 'paga';
  observacoes?: string;
}
```

---

### 6. Cadastros Gerais

#### 6.1 Listar Empreendimentos
```http
GET /api/v1/empreendimentos
```

**Response:**
```typescript
{
  data: Array<{
    id: number;
    nome: string;
    codigo: string;
    situacao: string;
    cidade: string;
    estado: string;
  }>;
}
```

#### 6.2 Listar Workflows
```http
GET /api/v1/workflows/{funcionalidade}
```

**Funcionalidades disponíveis:**
- `atendimento`
- `assistencia_tecnica`
- `reserva`

**Response:**
```typescript
{
  funcionalidade: string;
  situacoes: Array<{
    id: number;
    nome: string;
    ordem: number;
    cor: string;
  }>;
}
```

#### 6.3 Listar Estados
```http
GET /api/v1/localidades/estados
```

#### 6.4 Listar Cidades
```http
GET /api/v1/localidades/cidades?estadoId={id}
```

---

## 🔧 Implementação: API Client

### Estrutura Base

**Arquivo**: `src/lib/cvcrm/client.ts`

```typescript
import { CVCRMAuthManager } from './auth';
import { logger } from '@/lib/utils/logger';

export class CVCRMClient {
  private baseUrl: string;
  private authManager: CVCRMAuthManager;

  constructor(dominio: string, authManager: CVCRMAuthManager) {
    this.baseUrl = `https://${dominio}.cvcrm.com.br/api/v1`;
    this.authManager = authManager;
  }

  /**
   * Request genérico com autenticação
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = await this.authManager.getToken();

    const url = `${this.baseUrl}${endpoint}`;
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await this.handleError(response);
      throw error;
    }

    return await response.json();
  }

  /**
   * Tratamento de erros da API
   */
  private async handleError(response: Response): Promise<Error> {
    const status = response.status;
    let message = `Erro na API: ${status}`;

    try {
      const data = await response.json();
      message = data.mensagem || data.message || message;
    } catch {
      // Ignorar erro de parse
    }

    logger.error({
      status,
      message,
      url: response.url,
    }, 'Erro na chamada à API CV CRM');

    // Erros específicos
    if (status === 401) {
      // Token inválido - tentar renovar
      await this.authManager.refreshToken();
      return new Error('Token expirado. Tente novamente.');
    }

    if (status === 404) {
      return new Error('Recurso não encontrado');
    }

    if (status === 422) {
      return new Error(`Dados inválidos: ${message}`);
    }

    return new Error(message);
  }

  // ===== ATENDIMENTOS =====

  async criarAtendimento(data: CriarAtendimentoInput): Promise<Atendimento> {
    return this.request('/relacionamento/atendimentos/cadastrar', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async listarAtendimentos(filtros: FiltrosAtendimento = {}): Promise<AtendimentoList> {
    const params = new URLSearchParams(filtros as any);
    return this.request(`/relacionamento/atendimentos?${params}`);
  }

  async adicionarMensagemAtendimento(
    id: number,
    mensagem: string
  ): Promise<void> {
    await this.request(`/relacionamento/atendimentos/${id}/mensagem`, {
      method: 'POST',
      body: JSON.stringify({ mensagem }),
    });
  }

  // ===== ASSISTÊNCIA TÉCNICA =====

  async criarAssistencia(data: CriarAssistenciaInput): Promise<Assistencia> {
    return this.request('/assistenciatecnica/assistencia', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async listarAssistencias(filtros: FiltrosAssistencia = {}): Promise<AssistenciaList> {
    const params = new URLSearchParams(filtros as any);
    return this.request(`/assistenciatecnica/assistencias?${params}`);
  }

  // ===== CLIENTES =====

  async cadastrarCliente(data: CadastrarClienteInput): Promise<Cliente> {
    return this.request('/clientes', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async buscarClientes(filtros: FiltrosCliente = {}): Promise<ClienteList> {
    const params = new URLSearchParams(filtros as any);
    return this.request(`/clientes?${params}`);
  }

  // ===== RESERVAS =====

  async criarReserva(data: CriarReservaInput): Promise<Reserva> {
    return this.request('/reservas', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async listarReservas(filtros: FiltrosReserva = {}): Promise<ReservaList> {
    const params = new URLSearchParams(filtros as any);
    return this.request(`/reservas?${params}`);
  }

  async informarVenda(id: number, data: InformarVendaInput): Promise<void> {
    await this.request(`/reservas/${id}/informar-venda`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // ===== COMISSÕES =====

  async listarComissoes(filtros: FiltrosComissao = {}): Promise<ComissaoList> {
    const params = new URLSearchParams(filtros as any);
    return this.request(`/comissoes?${params}`);
  }

  async alterarSituacaoComissao(
    id: number,
    data: AlterarSituacaoComissaoInput
  ): Promise<void> {
    await this.request(`/comissoes/${id}/alterar-situacao`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // ===== CADASTROS GERAIS =====

  async listarEmpreendimentos(): Promise<Empreendimento[]> {
    const response = await this.request<{ data: Empreendimento[] }>('/empreendimentos');
    return response.data;
  }

  async listarWorkflows(funcionalidade: string): Promise<Workflow> {
    return this.request(`/workflows/${funcionalidade}`);
  }

  async listarEstados(): Promise<Estado[]> {
    const response = await this.request<{ data: Estado[] }>('/localidades/estados');
    return response.data;
  }

  async listarCidades(estadoId: number): Promise<Cidade[]> {
    const response = await this.request<{ data: Cidade[] }>(`/localidades/cidades?estadoId=${estadoId}`);
    return response.data;
  }
}
```

## 📝 Types

**Arquivo**: `src/types/cvcrm.ts`

```typescript
// Atendimentos
export interface CriarAtendimentoInput {
  assunto: string;
  descricao: string;
  clienteId: number;
  prioridade?: 'baixa' | 'media' | 'alta';
  tipoAtendimentoId?: number;
}

export interface Atendimento {
  id: number;
  protocolo: string;
  situacao: string;
  dataCriacao: string;
  assunto: string;
  descricao: string;
}

// Assistência
export interface CriarAssistenciaInput {
  unidadeId: number;
  descricao: string;
  localidadeId?: number;
  areaComumId?: number;
  prioridade?: 'baixa' | 'media' | 'alta' | 'urgente';
}

export interface Assistencia {
  id: number;
  protocolo: string;
  situacao: string;
  dataCriacao: string;
}

// Clientes
export interface CadastrarClienteInput {
  tipoPessoa: 'fisica' | 'juridica';
  nome?: string;
  cpf?: string;
  razaoSocial?: string;
  cnpj?: string;
  email: string;
  telefone?: string;
  celular?: string;
}

export interface Cliente {
  id: number;
  codigo: string;
  nome: string;
  email: string;
}

// Reservas
export interface CriarReservaInput {
  unidadeId: number;
  clienteIds: number[];
  tabelaPrecoId: number;
  dataReserva: string;
}

export interface Reserva {
  id: number;
  numero: string;
  situacao: string;
  valorTotal: number;
}

// Outros types...
```

---

**Ver também:**
- [02-AUTHENTICATION.md](./02-AUTHENTICATION.md) - Sistema de autenticação
- [04-MCP-TOOLS.md](./04-MCP-TOOLS.md) - Como usar nos MCP Tools

**Última atualização**: 2025-11-01

