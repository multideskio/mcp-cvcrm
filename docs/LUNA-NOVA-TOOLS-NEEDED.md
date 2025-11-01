# 🌙 Luna Nova - MCP Tools Necessários

**Baseado em:** docs/Luna Nova.md  
**Agente:** Luna Nova - Assistente Virtual para Construtora/Imobiliária  
**Objetivo:** Atendimento multicanal (WhatsApp) automatizado

---

## 📊 Visão Geral

A Luna Nova é um agente de atendimento que precisa gerenciar 5 áreas principais:

1. **Identificação e Autenticação**
2. **Comercial / Vendas**
3. **Financeiro**
4. **Cadastro**
5. **Assistência Técnica**

---

## 🔐 1. IDENTIFICAÇÃO E AUTENTICAÇÃO

### Tools Necessários

#### `luna_identificar_cliente`
**Descrição:** Identifica cliente por CPF e retorna dados básicos + unidades vinculadas

**Input:**
```typescript
{
  cpf: string;          // CPF do cliente (11 dígitos)
  nome?: string;        // Nome completo (opcional para validação)
}
```

**Output:**
```typescript
{
  cliente: {
    id: number;
    nome: string;
    cpf: string;
    email: string;
    telefone: string;
  };
  unidades: Array<{
    id: number;
    empreendimentoId: number;
    empreendimentoNome: string;
    numeroUnidade: string;
    tipoUnidade: string;
    situacao: string;  // "em_execucao", "entregue", "reserva"
    segmento: string;  // "alto_padrao", "economico"
  }>;
}
```

**API CV CRM:** `GET /clientes?cpf={cpf}`

---

## 💼 2. COMERCIAL / VENDAS

### Tools Necessários

#### `luna_listar_empreendimentos_disponiveis`
**Descrição:** Lista empreendimentos com unidades disponíveis para venda

**Input:**
```typescript
{
  cidade?: string;
  bairro?: string;
  tipoImovel?: string;  // "apartamento", "casa", "comercial"
  valorMin?: number;
  valorMax?: number;
}
```

**Output:**
```typescript
Array<{
  id: number;
  nome: string;
  descricao: string;
  endereco: string;
  cidade: string;
  bairro: string;
  unidadesDisponiveis: number;
  valorMinimo: number;
  valorMaximo: number;
  linkCatalogo?: string;
  linkPlantaBaixa?: string;
  fotosUrl?: string[];
}>
```

**API CV CRM:** `GET /empreendimentos?situacao=ativo`

---

#### `luna_listar_unidades_disponiveis`
**Descrição:** Lista unidades disponíveis de um empreendimento

**Input:**
```typescript
{
  empreendimentoId: number;
  tipologia?: string;  // "2 quartos", "3 quartos", etc
  andar?: number;
}
```

**Output:**
```typescript
Array<{
  id: number;
  numero: string;
  bloco?: string;
  andar: number;
  tipologia: string;
  area: number;
  vagas: number;
  valorVenda: number;
  tabelaPrecoId: number;
  disponivel: boolean;
}>
```

**API CV CRM:** `GET /empreendimentos/{id}/unidades?disponivel=true`

---

#### `luna_simular_financiamento`
**Descrição:** Simula condições de financiamento para uma unidade

**Input:**
```typescript
{
  unidadeId: number;
  entrada?: number;
  parcelasEntrada?: number;
  tipoFinanciamento?: string;  // "proprio", "bancario", "misto"
}
```

**Output:**
```typescript
{
  valorTotal: number;
  entrada: {
    valor: number;
    parcelas: number;
    valorParcela: number;
  };
  financiamento: {
    valor: number;
    tipo: string;
    parcelas: number;
    valorParcela: number;
    taxaJuros?: number;
  };
  observacoes: string;
}
```

**API CV CRM:** Endpoint customizado ou cálculo local

---

#### `luna_criar_lead`
**Descrição:** Cria lead/interesse comercial no CRM

**Input:**
```typescript
{
  nome: string;
  cpf?: string;
  email: string;
  telefone: string;
  empreendimentoId?: number;
  unidadeId?: number;
  interesse: string;
  origem: string;  // "whatsapp_luna"
}
```

**Output:**
```typescript
{
  leadId: number;
  protocolo: string;
  mensagem: string;
}
```

**API CV CRM:** `POST /clientes` ou endpoint de leads

---

## 💰 3. FINANCEIRO

### Tools Necessários

#### `luna_consultar_parcelas`
**Descrição:** Consulta parcelas de um cliente/unidade

**Input:**
```typescript
{
  clienteId: number;
  unidadeId: number;
  situacao?: string;  // "todas", "em_aberto", "vencidas", "pagas"
}
```

**Output:**
```typescript
{
  parcelas: Array<{
    id: number;
    numero: number;
    valor: number;
    valorCorrigido?: number;
    dataVencimento: string;
    dataPagamento?: string;
    situacao: string;  // "paga", "em_aberto", "vencida"
    linkBoleto?: string;
  }>;
  resumo: {
    totalPago: number;
    totalEmAberto: number;
    totalVencido: number;
    proximoVencimento?: string;
  };
}
```

**API CV CRM:** Endpoint customizado de financeiro

---

#### `luna_gerar_segunda_via_boleto`
**Descrição:** Gera segunda via de boleto atualizado

**Input:**
```typescript
{
  parcelaId: number;
  enviarEmail?: boolean;
}
```

**Output:**
```typescript
{
  linkBoleto: string;
  valor: number;
  dataVencimento: string;
  codigoBarras: string;
  emailEnviado?: boolean;
}
```

**API CV CRM:** Endpoint de geração de boletos

---

#### `luna_consultar_extrato_financeiro`
**Descrição:** Retorna extrato completo do cliente

**Input:**
```typescript
{
  clienteId: number;
  unidadeId: number;
  dataInicio?: string;
  dataFim?: string;
}
```

**Output:**
```typescript
{
  linkPortalCliente: string;  // URL para baixar extrato
  resumo: {
    valorTotal: number;
    valorPago: number;
    saldo: number;
  };
  ultimosPagamentos: Array<{
    data: string;
    valor: number;
    descricao: string;
  }>;
}
```

**API CV CRM:** Endpoint de extrato

---

#### `luna_solicitar_negociacao`
**Descrição:** Registra solicitação de negociação de dívida

**Input:**
```typescript
{
  clienteId: number;
  unidadeId: number;
  parcelasIds: number[];
  motivoSolicitacao: string;
}
```

**Output:**
```typescript
{
  solicitacaoId: number;
  protocolo: string;
  mensagem: string;
  proximosPassos: string;
}
```

**API CV CRM:** `POST /financeiro/solicitacao-negociacao`

---

#### `luna_verificar_status_pagamento`
**Descrição:** Verifica se pagamento foi compensado

**Input:**
```typescript
{
  parcelaId: number;
}
```

**Output:**
```typescript
{
  situacao: string;  // "pago", "em_processamento", "em_aberto"
  dataPagamento?: string;
  valorPago?: number;
  formaPagamento?: string;
}
```

**API CV CRM:** `GET /financeiro/parcelas/{id}/status`

---

## 👤 4. CADASTRO

### Tools Necessários

#### `luna_consultar_dados_cadastrais`
**Descrição:** Retorna dados cadastrais atuais do cliente

**Input:**
```typescript
{
  clienteId: number;
}
```

**Output:**
```typescript
{
  nome: string;
  cpf: string;
  rg: string;
  dataNascimento: string;
  estadoCivil: string;
  email: string;
  telefone: string;
  celular: string;
  endereco: {
    cep: string;
    logradouro: string;
    numero: string;
    complemento: string;
    bairro: string;
    cidade: string;
    estado: string;
  };
  dependentes?: Array<{
    nome: string;
    cpf: string;
    parentesco: string;
  }>;
}
```

**API CV CRM:** `GET /clientes/{id}`

---

#### `luna_atualizar_dados_simples`
**Descrição:** Atualiza dados básicos (telefone, email, endereço)

**Input:**
```typescript
{
  clienteId: number;
  campo: string;  // "telefone", "email", "endereco"
  novoValor: any;
  validacaoCPF: string;  // CPF para confirmar identidade
  validacaoDataNascimento: string;
}
```

**Output:**
```typescript
{
  sucesso: boolean;
  mensagem: string;
  dadoAtualizado: {
    campo: string;
    valorAnterior: string;
    valorNovo: string;
  };
}
```

**API CV CRM:** `PUT /clientes/{id}`

---

#### `luna_solicitar_alteracao_dados_sensiveis`
**Descrição:** Registra solicitação de alteração de dados sensíveis (titularidade, documentos)

**Input:**
```typescript
{
  clienteId: number;
  tipoAlteracao: string;  // "titularidade", "estado_civil", "documentos"
  descricao: string;
  documentosAnexados?: string[];
}
```

**Output:**
```typescript
{
  solicitacaoId: number;
  protocolo: string;
  mensagem: string;
  orientacoes: string;  // Como enviar documentos
}
```

**API CV CRM:** `POST /clientes/solicitacao-alteracao`

---

## 🔧 5. ASSISTÊNCIA TÉCNICA

### Tools Necessários

#### `luna_criar_chamado_assistencia`
**Descrição:** Abre novo chamado de assistência técnica

**Input:**
```typescript
{
  clienteId: number;
  unidadeId: number;
  descricaoProblema: string;
  localidade?: string;  // "cozinha", "banheiro", "sala"
  urgencia?: string;    // "baixa", "media", "alta"
  fotosBase64?: string[];
}
```

**Output:**
```typescript
{
  chamadoId: number;
  protocolo: string;
  situacao: string;
  mensagemCliente: string;
  proximosPassos: string;
}
```

**API CV CRM:** `POST /assistenciatecnica/assistencia`

---

#### `luna_consultar_chamados`
**Descrição:** Lista chamados do cliente

**Input:**
```typescript
{
  clienteId: number;
  unidadeId?: number;
  situacao?: string;  // "aberto", "em_andamento", "aguardando_vistoria", "concluido"
}
```

**Output:**
```typescript
Array<{
  id: number;
  protocolo: string;
  descricao: string;
  situacao: string;
  dataCriacao: string;
  dataVistoria?: string;
  parecerTecnico?: string;
  dataExecucaoReparo?: string;
}>
```

**API CV CRM:** `GET /assistenciatecnica/assistencias?clienteId={id}`

---

#### `luna_consultar_datas_disponiveis_vistoria`
**Descrição:** Retorna datas disponíveis para agendamento de vistoria

**Input:**
```typescript
{
  chamadoId: number;
  empreendimentoId: number;
}
```

**Output:**
```typescript
{
  datasDisponiveis: Array<{
    data: string;
    horarios: string[];
  }>;
}
```

**API CV CRM:** Endpoint customizado de agenda

---

#### `luna_agendar_vistoria`
**Descrição:** Agenda vistoria para um chamado

**Input:**
```typescript
{
  chamadoId: number;
  data: string;
  horario: string;
  responsavelPresente: string;  // Nome de quem estará presente
}
```

**Output:**
```typescript
{
  agendamentoId: number;
  confirmacao: string;
  dataHora: string;
  orientacoes: string;
}
```

**API CV CRM:** `POST /assistenciatecnica/assistencia/{id}/visita`

---

#### `luna_consultar_status_chamado`
**Descrição:** Consulta status detalhado de um chamado

**Input:**
```typescript
{
  chamadoId: number;
  protocolo?: string;
}
```

**Output:**
```typescript
{
  id: number;
  protocolo: string;
  situacao: string;
  historico: Array<{
    data: string;
    acao: string;
    descricao: string;
  }>;
  vistoria?: {
    data: string;
    tecnico: string;
    parecer: string;
  };
  reparo?: {
    dataAgendada: string;
    situacao: string;
  };
}
```

**API CV CRM:** `GET /assistenciatecnica/assistencias/{id}`

---

## 📝 6. ATENDIMENTO GERAL

### Tools Necessários

#### `luna_criar_atendimento_geral`
**Descrição:** Cria atendimento genérico para assuntos diversos

**Input:**
```typescript
{
  clienteId: number;
  assunto: string;
  categoria: string;  // "reclamacao", "sugestao", "duvida", "elogio", "outro"
  descricao: string;
  urgencia?: string;
}
```

**Output:**
```typescript
{
  atendimentoId: number;
  protocolo: string;
  mensagem: string;
}
```

**API CV CRM:** `POST /relacionamento/atendimentos/cadastrar`

---

#### `luna_transferir_para_humano`
**Descrição:** Registra transferência para atendente humano

**Input:**
```typescript
{
  clienteId: number;
  departamento: string;  // "comercial", "financeiro", "assistencia", "cadastro"
  motivoTransferencia: string;
  contexto: string;  // Resumo da conversa até aqui
}
```

**Output:**
```typescript
{
  filaId: number;
  posicaoFila: number;
  tempoEstimado: string;
  mensagemCliente: string;
}
```

**API CV CRM:** Endpoint customizado de filas

---

## 📊 7. RECURSOS (RESOURCES)

### Resources Necessários

#### `luna://cliente/{cpf}/resumo`
**Descrição:** Resumo completo do cliente (todas as áreas)

**Output:**
```typescript
{
  cliente: {...};
  unidades: [...];
  financeiro: {
    situacao: string;
    proximoVencimento: string;
    totalEmAberto: number;
  };
  chamadosAbertos: number;
  ultimasInteracoes: [...];
}
```

---

#### `luna://empreendimentos/catalogo`
**Descrição:** Catálogo completo de empreendimentos

---

#### `luna://faqs/{categoria}`
**Descrição:** Perguntas frequentes por categoria

---

## 🎯 RESUMO DOS TOOLS NECESSÁRIOS

### Total: **23 Tools + 3 Resources**

#### Por Categoria:

1. **Identificação:** 1 tool
2. **Comercial:** 4 tools
3. **Financeiro:** 5 tools
4. **Cadastro:** 3 tools
5. **Assistência Técnica:** 5 tools
6. **Atendimento Geral:** 2 tools
7. **Utilitários:** 3 tools
8. **Resources:** 3 resources

---

## 📋 PRÓXIMOS PASSOS

### Fase 1: Essenciais (MVP)
- [x] `luna_identificar_cliente`
- [ ] `luna_consultar_parcelas`
- [ ] `luna_gerar_segunda_via_boleto`
- [ ] `luna_criar_chamado_assistencia`
- [ ] `luna_consultar_chamados`
- [ ] `luna_listar_empreendimentos_disponiveis`

### Fase 2: Expansão
- [ ] Todos os tools de Financeiro
- [ ] Todos os tools de Cadastro
- [ ] Agendamento de vistorias
- [ ] Simulação de financiamento

### Fase 3: Avançado
- [ ] Resources completos
- [ ] Integração com WhatsApp
- [ ] Notificações automáticas
- [ ] Dashboard de métricas

---

## 🔗 Integrações Necessárias

### API CV CRM
- Clientes
- Empreendimentos/Unidades
- Financeiro/Parcelas
- Assistência Técnica
- Atendimentos

### Serviços Externos
- WhatsApp Business API (Twilio/Meta)
- Geração de boletos
- Armazenamento de arquivos (S3/Cloudinary)
- Agenda/Calendário

---

## 📝 Notas Importantes

1. **Segurança:** Sempre validar CPF + outro dado antes de exibir informações sensíveis
2. **Logs:** Registrar todas as interações no CRM
3. **Escalamento:** Critérios claros para transferir para humano
4. **Emojis:** Luna usa emojis para ser mais amigável
5. **Tom:** Cordial, empática, clara (conforme perfil do cliente)

---

**Documento baseado em:** docs/Luna Nova.md  
**Criado em:** 2025-11-01  
**Versão:** 1.0

