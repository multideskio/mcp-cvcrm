/**
 * Cliente da API CV CRM
 * Consultar: docs/03-API-ENDPOINTS.md para lista completa de endpoints
 */
import { getAuthManager } from './auth';
import { CVCRM_CONSTANTS } from '@/config/cvcrm';
import { ExternalAPIError, NotFoundError, ValidationError } from '@/lib/utils/errors';
import { logger, logOperationError, logOperationSuccess } from '@/lib/utils/logger';
export class CVCRMClient {
    baseUrl;
    authManager = getAuthManager();
    constructor(dominio) {
        const domain = dominio || process.env.CVCRM_DOMINIO || '';
        this.baseUrl = `https://${domain}.cvcrm.com.br${CVCRM_CONSTANTS.API_BASE_PATH}`;
    }
    /**
     * Request genérico com autenticação (público para tools customizados)
     */
    async request(endpoint, options = {}) {
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
        }
        catch (error) {
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
    async handleError(response, endpoint) {
        const status = response.status;
        let message = `Erro na API: ${status}`;
        try {
            const data = await response.json();
            message = data.mensagem || data.message || message;
        }
        catch {
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
    async criarAtendimento(data) {
        const result = await this.request('/relacionamento/atendimentos/cadastrar', {
            method: 'POST',
            body: JSON.stringify(data),
        });
        logOperationSuccess('Criar atendimento', undefined, { id: result.id });
        return result;
    }
    /**
     * Lista atendimentos com filtros
     * GET /relacionamento/atendimentos
     */
    async listarAtendimentos(filtros = {}) {
        const params = new URLSearchParams(filtros);
        const result = await this.request(`/relacionamento/atendimentos?${params}`);
        logOperationSuccess('Listar atendimentos', undefined, { total: result.total });
        return result;
    }
    /**
     * Adiciona mensagem ao atendimento
     * POST /relacionamento/atendimentos/{id}/mensagem
     */
    async adicionarMensagemAtendimento(id, data) {
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
    async criarAssistencia(data) {
        const result = await this.request('/assistenciatecnica/assistencia', {
            method: 'POST',
            body: JSON.stringify(data),
        });
        logOperationSuccess('Criar assistência técnica', undefined, { id: result.id });
        return result;
    }
    /**
     * Lista assistências técnicas
     * GET /assistenciatecnica/assistencias
     */
    async listarAssistencias(filtros = {}) {
        const params = new URLSearchParams(filtros);
        const result = await this.request(`/assistenciatecnica/assistencias?${params}`);
        logOperationSuccess('Listar assistências', undefined, { total: result.total });
        return result;
    }
    /**
     * Adiciona visita à assistência
     * POST /assistenciatecnica/assistencia/{id}/visita
     */
    async adicionarVisita(id, data) {
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
    async cadastrarCliente(data) {
        const result = await this.request('/clientes', {
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
    async buscarClientes(filtros = {}) {
        const params = new URLSearchParams(filtros);
        const result = await this.request(`/clientes?${params}`);
        logOperationSuccess('Buscar clientes', undefined, { total: result.total });
        return result;
    }
    // ==================== RESERVAS ====================
    /**
     * Cria uma nova reserva
     * POST /reservas
     */
    async criarReserva(data) {
        const result = await this.request('/reservas', {
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
    async listarReservas(filtros = {}) {
        const params = new URLSearchParams(filtros);
        const result = await this.request(`/reservas?${params}`);
        logOperationSuccess('Listar reservas', undefined, { total: result.total });
        return result;
    }
    /**
     * Informa venda (altera situação para vendida)
     * POST /reservas/{id}/informar-venda
     */
    async informarVenda(id, data) {
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
    async processarDistrato(id, data) {
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
    async listarComissoes(filtros = {}) {
        const params = new URLSearchParams(filtros);
        const result = await this.request(`/comissoes?${params}`);
        logOperationSuccess('Listar comissões', undefined, { total: result.total });
        return result;
    }
    /**
     * Altera situação da comissão
     * POST /comissoes/{id}/alterar-situacao
     */
    async alterarSituacaoComissao(id, data) {
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
    async listarEmpreendimentos() {
        const response = await this.request('/empreendimentos');
        logOperationSuccess('Listar empreendimentos', undefined, {
            total: response.data.length,
        });
        return response.data;
    }
    /**
     * Lista workflows de uma funcionalidade
     * GET /workflows/{funcionalidade}
     */
    async listarWorkflows(funcionalidade) {
        const result = await this.request(`/workflows/${funcionalidade}`);
        logOperationSuccess('Listar workflows', undefined, { funcionalidade });
        return result;
    }
    /**
     * Lista estados
     * GET /localidades/estados
     */
    async listarEstados() {
        const response = await this.request('/localidades/estados');
        logOperationSuccess('Listar estados', undefined, {
            total: response.data.length,
        });
        return response.data;
    }
    /**
     * Lista cidades de um estado
     * GET /localidades/cidades?estadoId={id}
     */
    async listarCidades(estadoId) {
        const response = await this.request(`/localidades/cidades?estadoId=${estadoId}`);
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
let cvcrmClient = null;
export function getCVCRMClient() {
    if (!cvcrmClient) {
        cvcrmClient = new CVCRMClient();
    }
    return cvcrmClient;
}
//# sourceMappingURL=client.js.map