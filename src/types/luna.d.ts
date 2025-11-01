/**
 * Types específicos para Luna Nova
 * Baseado em: docs/LUNA-NOVA-TOOLS-NEEDED.md
 */
export interface IdentificarClienteInput {
    cpf: string;
    nome?: string;
}
export interface UnidadeVinculada {
    id: number;
    empreendimentoId: number;
    empreendimentoNome: string;
    numeroUnidade: string;
    tipoUnidade: string;
    situacao: 'em_execucao' | 'entregue' | 'reserva';
    segmento: 'alto_padrao' | 'economico';
}
export interface ClienteIdentificado {
    cliente: {
        id: number;
        nome: string;
        cpf: string;
        email: string;
        telefone: string;
    };
    unidades: UnidadeVinculada[];
    perfil: 'vip' | 'economico';
}
export interface Parcela {
    id: number;
    numero: number;
    valor: number;
    valorCorrigido?: number;
    dataVencimento: string;
    dataPagamento?: string;
    situacao: 'paga' | 'em_aberto' | 'vencida';
    linkBoleto?: string;
}
export interface ResumoFinanceiro {
    totalPago: number;
    totalEmAberto: number;
    totalVencido: number;
    proximoVencimento?: string;
}
export interface ConsultarParcelasInput {
    clienteId: number;
    unidadeId: number;
    situacao?: 'todas' | 'em_aberto' | 'vencidas' | 'pagas';
}
export interface ConsultarParcelasOutput {
    parcelas: Parcela[];
    resumo: ResumoFinanceiro;
}
export interface GerarBoletoInput {
    parcelaId: number;
    enviarEmail?: boolean;
}
export interface GerarBoletoOutput {
    linkBoleto: string;
    valor: number;
    dataVencimento: string;
    codigoBarras: string;
    emailEnviado?: boolean;
}
export interface CriarChamadoAssistenciaInput {
    clienteId: number;
    unidadeId: number;
    descricaoProblema: string;
    localidade?: string;
    urgencia?: 'baixa' | 'media' | 'alta';
    fotosBase64?: string[];
}
export interface ChamadoAssistencia {
    id: number;
    protocolo: string;
    descricao: string;
    situacao: string;
    dataCriacao: string;
    dataVistoria?: string;
    parecerTecnico?: string;
    dataExecucaoReparo?: string;
}
export interface ConsultarChamadosInput {
    clienteId: number;
    unidadeId?: number;
    situacao?: string;
}
export interface EmpreendimentoDisponivel {
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
}
export interface ListarEmpreendimentosInput {
    cidade?: string;
    bairro?: string;
    tipoImovel?: string;
    valorMin?: number;
    valorMax?: number;
}
//# sourceMappingURL=luna.d.ts.map