/**
 * Cliente da API CV CRM
 * Consultar: docs/03-API-ENDPOINTS.md para lista completa de endpoints
 */
import type { CriarAtendimentoInput, Atendimento, FiltrosAtendimento, AdicionarMensagemInput, CriarAssistenciaInput, Assistencia, FiltrosAssistencia, AdicionarVisitaInput, CadastrarClienteInput, Cliente, FiltrosCliente, CriarReservaInput, Reserva, FiltrosReserva, InformarVendaInput, ProcessarDistratoInput, Comissao, FiltrosComissao, AlterarSituacaoComissaoInput, Empreendimento, Workflow, Estado, Cidade, PaginatedResponse } from '@/types';
export declare class CVCRMClient {
    private baseUrl;
    private authManager;
    constructor(dominio?: string);
    /**
     * Request genérico com autenticação (público para tools customizados)
     */
    request<T>(endpoint: string, options?: RequestInit): Promise<T>;
    /**
     * Tratamento de erros da API
     */
    private handleError;
    /**
     * Cadastra um novo atendimento
     * POST /relacionamento/atendimentos/cadastrar
     */
    criarAtendimento(data: CriarAtendimentoInput): Promise<Atendimento>;
    /**
     * Lista atendimentos com filtros
     * GET /relacionamento/atendimentos
     */
    listarAtendimentos(filtros?: FiltrosAtendimento): Promise<PaginatedResponse<Atendimento>>;
    /**
     * Adiciona mensagem ao atendimento
     * POST /relacionamento/atendimentos/{id}/mensagem
     */
    adicionarMensagemAtendimento(id: number, data: AdicionarMensagemInput): Promise<void>;
    /**
     * Cria uma nova assistência técnica
     * POST /assistenciatecnica/assistencia
     */
    criarAssistencia(data: CriarAssistenciaInput): Promise<Assistencia>;
    /**
     * Lista assistências técnicas
     * GET /assistenciatecnica/assistencias
     */
    listarAssistencias(filtros?: FiltrosAssistencia): Promise<PaginatedResponse<Assistencia>>;
    /**
     * Adiciona visita à assistência
     * POST /assistenciatecnica/assistencia/{id}/visita
     */
    adicionarVisita(id: number, data: AdicionarVisitaInput): Promise<void>;
    /**
     * Cadastra um novo cliente
     * POST /clientes
     */
    cadastrarCliente(data: CadastrarClienteInput): Promise<Cliente>;
    /**
     * Busca clientes
     * GET /clientes
     */
    buscarClientes(filtros?: FiltrosCliente): Promise<PaginatedResponse<Cliente>>;
    /**
     * Cria uma nova reserva
     * POST /reservas
     */
    criarReserva(data: CriarReservaInput): Promise<Reserva>;
    /**
     * Lista reservas
     * GET /reservas
     */
    listarReservas(filtros?: FiltrosReserva): Promise<PaginatedResponse<Reserva>>;
    /**
     * Informa venda (altera situação para vendida)
     * POST /reservas/{id}/informar-venda
     */
    informarVenda(id: number, data: InformarVendaInput): Promise<void>;
    /**
     * Processa distrato
     * POST /reservas/{id}/distrato
     */
    processarDistrato(id: number, data: ProcessarDistratoInput): Promise<void>;
    /**
     * Lista comissões
     * GET /comissoes
     */
    listarComissoes(filtros?: FiltrosComissao): Promise<PaginatedResponse<Comissao>>;
    /**
     * Altera situação da comissão
     * POST /comissoes/{id}/alterar-situacao
     */
    alterarSituacaoComissao(id: number, data: AlterarSituacaoComissaoInput): Promise<void>;
    /**
     * Lista empreendimentos
     * GET /empreendimentos
     */
    listarEmpreendimentos(): Promise<Empreendimento[]>;
    /**
     * Lista workflows de uma funcionalidade
     * GET /workflows/{funcionalidade}
     */
    listarWorkflows(funcionalidade: string): Promise<Workflow>;
    /**
     * Lista estados
     * GET /localidades/estados
     */
    listarEstados(): Promise<Estado[]>;
    /**
     * Lista cidades de um estado
     * GET /localidades/cidades?estadoId={id}
     */
    listarCidades(estadoId: number): Promise<Cidade[]>;
}
export declare function getCVCRMClient(): CVCRMClient;
//# sourceMappingURL=client.d.ts.map