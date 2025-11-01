/**
 * Types para a API do CV CRM
 * Baseado na documentação: https://desenvolvedor.cvcrm.com.br/reference/cadastrocv-1
 */

// ========== COMUM ==========

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ========== ATENDIMENTOS ==========

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
  dataAtualizacao?: string;
  assunto: string;
  descricao: string;
  clienteId: number;
  clienteNome?: string;
  prioridade: string;
}

export interface FiltrosAtendimento extends PaginationParams {
  clienteId?: number;
  situacao?: string;
  dataInicio?: string;
  dataFim?: string;
}

export interface AdicionarMensagemInput {
  mensagem: string;
  anexos?: Array<{
    nome: string;
    base64: string;
    tipo: string;
  }>;
}

// ========== ASSISTÊNCIA TÉCNICA ==========

export interface CriarAssistenciaInput {
  unidadeId: number;
  descricao: string;
  localidadeId?: number;
  areaComumId?: number;
  itensManutencaoIds?: number[];
  prioridade?: 'baixa' | 'media' | 'alta' | 'urgente';
}

export interface Assistencia {
  id: number;
  protocolo: string;
  situacao: string;
  dataCriacao: string;
  dataAtualizacao?: string;
  unidadeId: number;
  descricao: string;
  prioridade: string;
}

export interface FiltrosAssistencia extends PaginationParams {
  unidadeId?: number;
  situacao?: string;
  dataInicio?: string;
  dataFim?: string;
  prioridade?: string;
}

export interface AdicionarVisitaInput {
  dataAgendada: string;
  equipeId?: number;
  observacoes?: string;
}

// ========== CLIENTES ==========

export interface CadastrarClienteInput {
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
  inscricaoEstadual?: string;
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

export interface Cliente {
  id: number;
  codigo: string;
  tipoPessoa: 'fisica' | 'juridica';
  nome: string;
  email: string;
  telefone?: string;
  celular?: string;
  cpf?: string;
  cnpj?: string;
  dataCadastro: string;
}

export interface FiltrosCliente extends PaginationParams {
  nome?: string;
  cpf?: string;
  cnpj?: string;
  email?: string;
}

// ========== RESERVAS ==========

export interface CriarReservaInput {
  unidadeId: number;
  clienteIds: number[];
  tabelaPrecoId: number;
  corretorId?: number;
  imobiliariaId?: number;
  dataReserva: string;
  observacoes?: string;
}

export interface Reserva {
  id: number;
  numero: string;
  situacao: string;
  dataReserva: string;
  dataCriacao: string;
  unidadeId: number;
  valorTotal: number;
  clienteIds: number[];
  corretorId?: number;
}

export interface FiltrosReserva extends PaginationParams {
  empreendimentoId?: number;
  unidadeId?: number;
  clienteId?: number;
  situacao?: string;
  dataInicio?: string;
  dataFim?: string;
}

export interface InformarVendaInput {
  dataVenda: string;
  observacoes?: string;
}

export interface ProcessarDistratoInput {
  motivo: string;
  dataDistrato: string;
  observacoes?: string;
}

// ========== COMISSÕES ==========

export interface Comissao {
  id: number;
  reservaId: number;
  corretorId: number;
  corretorNome: string;
  valor: number;
  percentual: number;
  situacao: string;
  dataPrevistaPagamento: string;
  dataPagamento?: string;
}

export interface FiltrosComissao extends PaginationParams {
  reservaId?: number;
  corretorId?: number;
  situacao?: string;
  dataInicio?: string;
  dataFim?: string;
}

export interface AlterarSituacaoComissaoInput {
  situacao: 'aprovada' | 'rejeitada' | 'paga';
  observacoes?: string;
}

// ========== CADASTROS GERAIS ==========

export interface Empreendimento {
  id: number;
  nome: string;
  codigo: string;
  situacao: string;
  endereco?: {
    cidade: string;
    estado: string;
    cep?: string;
  };
}

export interface Workflow {
  funcionalidade: string;
  situacoes: Array<{
    id: number;
    nome: string;
    ordem: number;
    cor?: string;
  }>;
}

export interface Estado {
  id: number;
  nome: string;
  sigla: string;
}

export interface Cidade {
  id: number;
  nome: string;
  estadoId: number;
  estadoNome?: string;
}

// ========== AUTENTICAÇÃO ==========

export interface SolicitarCodigoVerificacaoInput {
  email: string;
  cpf: string;
}

export interface SolicitarCodigoVerificacaoResponse {
  sucesso: boolean;
  mensagem: string;
  validadeMinutos: number;
}

export interface GerarTokenInput {
  email: string;
  codigo: string;
}

export interface GerarTokenResponse {
  token: string;
  tipo: 'Bearer';
  expiraEm: string;
}

// ========== ERRORS ==========

export interface CVCRMAPIError {
  status: number;
  mensagem: string;
  codigo?: string;
  detalhes?: unknown;
}

