/**
 * MCP Tools para Reservas
 * Consultar: docs/04-MCP-TOOLS.md
 */
import { z } from 'zod';
import type { MCPToolDefinition } from '@/types';
export declare const criarReservaSchema: z.ZodObject<{
    unidadeId: z.ZodNumber;
    clienteIds: z.ZodArray<z.ZodNumber, "many">;
    tabelaPrecoId: z.ZodNumber;
    corretorId: z.ZodOptional<z.ZodNumber>;
    imobiliariaId: z.ZodOptional<z.ZodNumber>;
    dataReserva: z.ZodString;
    observacoes: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    unidadeId: number;
    clienteIds: number[];
    tabelaPrecoId: number;
    dataReserva: string;
    corretorId?: number | undefined;
    imobiliariaId?: number | undefined;
    observacoes?: string | undefined;
}, {
    unidadeId: number;
    clienteIds: number[];
    tabelaPrecoId: number;
    dataReserva: string;
    corretorId?: number | undefined;
    imobiliariaId?: number | undefined;
    observacoes?: string | undefined;
}>;
export declare const listarReservasSchema: z.ZodObject<{
    empreendimentoId: z.ZodOptional<z.ZodNumber>;
    unidadeId: z.ZodOptional<z.ZodNumber>;
    clienteId: z.ZodOptional<z.ZodNumber>;
    situacao: z.ZodOptional<z.ZodString>;
    dataInicio: z.ZodOptional<z.ZodString>;
    dataFim: z.ZodOptional<z.ZodString>;
    page: z.ZodOptional<z.ZodNumber>;
    limit: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    clienteId?: number | undefined;
    situacao?: string | undefined;
    dataInicio?: string | undefined;
    dataFim?: string | undefined;
    page?: number | undefined;
    limit?: number | undefined;
    unidadeId?: number | undefined;
    empreendimentoId?: number | undefined;
}, {
    clienteId?: number | undefined;
    situacao?: string | undefined;
    dataInicio?: string | undefined;
    dataFim?: string | undefined;
    page?: number | undefined;
    limit?: number | undefined;
    unidadeId?: number | undefined;
    empreendimentoId?: number | undefined;
}>;
export declare const informarVendaSchema: z.ZodObject<{
    reservaId: z.ZodNumber;
    dataVenda: z.ZodString;
    observacoes: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    reservaId: number;
    dataVenda: string;
    observacoes?: string | undefined;
}, {
    reservaId: number;
    dataVenda: string;
    observacoes?: string | undefined;
}>;
export declare const criarReservaTool: MCPToolDefinition;
export declare const listarReservasTool: MCPToolDefinition;
export declare const informarVendaTool: MCPToolDefinition;
export declare function handleCriarReserva(args: unknown): Promise<string>;
export declare function handleListarReservas(args: unknown): Promise<string>;
export declare function handleInformarVenda(args: unknown): Promise<string>;
//# sourceMappingURL=reservas.d.ts.map