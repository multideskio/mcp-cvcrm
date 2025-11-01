/**
 * Cliente da API CV CRM
 * Consultar: docs/03-API-ENDPOINTS.md para lista completa de endpoints
 */

import { getAuthManager } from './auth';
import { CVCRM_CONSTANTS } from '@/config/cvcrm';
import { 
  ExternalAPIError, 
  NotFoundError,
  ValidationError 
} from '@/lib/utils/errors';
import { 
  logger, 
  logOperationError, 
  logOperationSuccess 
} from '@/lib/utils/logger';
import type {
  // Atendimentos
  CriarAtendimentoInput,
  Atendimento,
  FiltrosAtendimento,
  AdicionarMensagemInput,
  // Assistências
  CriarAssistenciaInput,
  Assistencia,
  FiltrosAssistencia,
  AdicionarVisitaInput,
  // Clientes
  CadastrarClienteInput,
  Cliente,
  FiltrosCliente,
  // Reservas
  CriarReservaInput,
  Reserva,
  FiltrosReserva,
  InformarVendaInput,
  ProcessarDistratoInput,
  // Comissões
  Comissao,
  FiltrosComissao,
  AlterarSituacaoComissaoInput,
  // Cadastros
  Empreendimento,
  Workflow,
  Estado,
  Cidade,
  PaginatedResponse,
} from '@/types';

export class CVCRMClient {
  private baseUrl: string;
  private authManager = getAuthManager();

  constructor(dominio?: string) {
    const domain = dominio || process.env.CVCRM_DOMINIO || '';
    this.baseUrl = `https://${domain}.cvcrm.com.br${CVCRM_CONSTANTS.API_BASE_PATH}`;
  }

  /**
   * Request genérico com autenticação (público para tools customizados)
   */
  async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = await this.authManager.getToken();
    const url = `${this.baseUrl}${endpoint}`;

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          ...options.headers,
        },
        signal: AbortSignal.timeout(CVCRM_CONSTANTS.REQUEST_TIMEOUT_MS),
      });

      if (!response.ok) {
        await this.handleError(response, endpoint);
      }

      return await response.json();
    } catch (error) {
      if (error instanceof ExternalAPIError) {
        throw error;
      }
      logOperationError(`API Request: ${endpoint}`, error);
      throw new ExternalAPIError(`Erro na requisição: ${endpoint}`);
    }
  }

  /**
   * Tratamento de erros da API
   */
  private async handleError(response: Response, endpoint: string): Promise<never> {
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
      endpoint,
      url: response.url,
    }, 'Erro na chamada à API CV CRM');

    // Erros específicos
    if (status === 401) {
      // Token inválido - tentar renovar uma vez
      await this.authManager.refreshToken();
      throw new ExternalAPIError('Token expirado. Tente novamente.', 401);
    }

    if (status === 404) {
      throw new NotFoundError('Recurso', endpoint);
    }

    if (status === 422) {
      throw new ValidationError(`Dados inválidos: ${message}`);
    }

    throw new ExternalAPIError(message, status);
  }

  // ==================== ATENDIMENTOS ====================

  /**
   * Cadastra um novo atendimento
   * POST /relacionamento/atendimentos/cadastrar
   */
  async criarAtendimento(data: CriarAtendimentoInput): Promise<Atendimento> {
    const result = await this.request<Atendimento>(
      '/relacionamento/atendimentos/cadastrar',
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    );
    logOperationSuccess('Criar atendimento', undefined, { id: result.id });
    return result;
  }

  /**
   * Lista atendimentos com filtros
   * GET /relacionamento/atendimentos
   */
  async listarAtendimentos(
    filtros: FiltrosAtendimento = {}
  ): Promise<PaginatedResponse<Atendimento>> {
    const params = new URLSearchParams(filtros as Record<string, string>);
    const result = await this.request<PaginatedResponse<Atendimento>>(
      `/relacionamento/atendimentos?${params}`
    );
    logOperationSuccess('Listar atendimentos', undefined, { total: result.total });
    return result;
  }

  /**
   * Adiciona mensagem ao atendimento
   * POST /relacionamento/atendimentos/{id}/mensagem
   */
  async adicionarMensagemAtendimento(
    id: number,
    data: AdicionarMensagemInput
  ): Promise<void> {
    await this.request(`/relacionamento/atendimentos/${id}/mensagem`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    logOperationSuccess('Adicionar mensagem ao atendimento', undefined, { id });
  }

  // ==================== ASSISTÊNCIA TÉCNICA ====================

  /**
   * Cria uma nova assistência técnica
   * POST /assistenciatecnica/assistencia
   */
  async criarAssistencia(data: CriarAssistenciaInput): Promise<Assistencia> {
    const result = await this.request<Assistencia>(
      '/assistenciatecnica/assistencia',
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    );
    logOperationSuccess('Criar assistência técnica', undefined, { id: result.id });
    return result;
  }

  /**
   * Lista assistências técnicas
   * GET /assistenciatecnica/assistencias
   */
  async listarAssistencias(
    filtros: FiltrosAssistencia = {}
  ): Promise<PaginatedResponse<Assistencia>> {
    const params = new URLSearchParams(filtros as Record<string, string>);
    const result = await this.request<PaginatedResponse<Assistencia>>(
      `/assistenciatecnica/assistencias?${params}`
    );
    logOperationSuccess('Listar assistências', undefined, { total: result.total });
    return result;
  }

  /**
   * Adiciona visita à assistência
   * POST /assistenciatecnica/assistencia/{id}/visita
   */
  async adicionarVisita(id: number, data: AdicionarVisitaInput): Promise<void> {
    await this.request(`/assistenciatecnica/assistencia/${id}/visita`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    logOperationSuccess('Adicionar visita', undefined, { assistenciaId: id });
  }

  // ==================== CLIENTES ====================

  /**
   * Cadastra um novo cliente
   * POST /clientes
   */
  async cadastrarCliente(data: CadastrarClienteInput): Promise<Cliente> {
    const result = await this.request<Cliente>('/clientes', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    logOperationSuccess('Cadastrar cliente', undefined, { id: result.id });
    return result;
  }

  /**
   * Busca clientes
   * GET /clientes
   */
  async buscarClientes(
    filtros: FiltrosCliente = {}
  ): Promise<PaginatedResponse<Cliente>> {
    const params = new URLSearchParams(filtros as Record<string, string>);
    const result = await this.request<PaginatedResponse<Cliente>>(
      `/clientes?${params}`
    );
    logOperationSuccess('Buscar clientes', undefined, { total: result.total });
    return result;
  }

  // ==================== RESERVAS ====================

  /**
   * Cria uma nova reserva
   * POST /reservas
   */
  async criarReserva(data: CriarReservaInput): Promise<Reserva> {
    const result = await this.request<Reserva>('/reservas', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    logOperationSuccess('Criar reserva', undefined, { id: result.id });
    return result;
  }

  /**
   * Lista reservas
   * GET /reservas
   */
  async listarReservas(
    filtros: FiltrosReserva = {}
  ): Promise<PaginatedResponse<Reserva>> {
    const params = new URLSearchParams(filtros as Record<string, string>);
    const result = await this.request<PaginatedResponse<Reserva>>(
      `/reservas?${params}`
    );
    logOperationSuccess('Listar reservas', undefined, { total: result.total });
    return result;
  }

  /**
   * Informa venda (altera situação para vendida)
   * POST /reservas/{id}/informar-venda
   */
  async informarVenda(id: number, data: InformarVendaInput): Promise<void> {
    await this.request(`/reservas/${id}/informar-venda`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    logOperationSuccess('Informar venda', undefined, { reservaId: id });
  }

  /**
   * Processa distrato
   * POST /reservas/{id}/distrato
   */
  async processarDistrato(id: number, data: ProcessarDistratoInput): Promise<void> {
    await this.request(`/reservas/${id}/distrato`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    logOperationSuccess('Processar distrato', undefined, { reservaId: id });
  }

  // ==================== COMISSÕES ====================

  /**
   * Lista comissões
   * GET /comissoes
   */
  async listarComissoes(
    filtros: FiltrosComissao = {}
  ): Promise<PaginatedResponse<Comissao>> {
    const params = new URLSearchParams(filtros as Record<string, string>);
    const result = await this.request<PaginatedResponse<Comissao>>(
      `/comissoes?${params}`
    );
    logOperationSuccess('Listar comissões', undefined, { total: result.total });
    return result;
  }

  /**
   * Altera situação da comissão
   * POST /comissoes/{id}/alterar-situacao
   */
  async alterarSituacaoComissao(
    id: number,
    data: AlterarSituacaoComissaoInput
  ): Promise<void> {
    await this.request(`/comissoes/${id}/alterar-situacao`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    logOperationSuccess('Alterar situação de comissão', undefined, {
      comissaoId: id,
      novaSituacao: data.situacao,
    });
  }

  // ==================== CADASTROS GERAIS ====================

  /**
   * Lista empreendimentos
   * GET /empreendimentos
   */
  async listarEmpreendimentos(): Promise<Empreendimento[]> {
    const response = await this.request<{ data: Empreendimento[] }>(
      '/empreendimentos'
    );
    logOperationSuccess('Listar empreendimentos', undefined, {
      total: response.data.length,
    });
    return response.data;
  }

  /**
   * Lista workflows de uma funcionalidade
   * GET /workflows/{funcionalidade}
   */
  async listarWorkflows(funcionalidade: string): Promise<Workflow> {
    const result = await this.request<Workflow>(`/workflows/${funcionalidade}`);
    logOperationSuccess('Listar workflows', undefined, { funcionalidade });
    return result;
  }

  /**
   * Lista estados
   * GET /localidades/estados
   */
  async listarEstados(): Promise<Estado[]> {
    const response = await this.request<{ data: Estado[] }>('/localidades/estados');
    logOperationSuccess('Listar estados', undefined, {
      total: response.data.length,
    });
    return response.data;
  }

  /**
   * Lista cidades de um estado
   * GET /localidades/cidades?estadoId={id}
   */
  async listarCidades(estadoId: number): Promise<Cidade[]> {
    const response = await this.request<{ data: Cidade[] }>(
      `/localidades/cidades?estadoId=${estadoId}`
    );
    logOperationSuccess('Listar cidades', undefined, {
      estadoId,
      total: response.data.length,
    });
    return response.data;
  }
}

/**
 * Instância singleton do cliente
 */
let cvcrmClient: CVCRMClient | null = null;

export function getCVCRMClient(): CVCRMClient {
  if (!cvcrmClient) {
    cvcrmClient = new CVCRMClient();
  }
  return cvcrmClient;
}

