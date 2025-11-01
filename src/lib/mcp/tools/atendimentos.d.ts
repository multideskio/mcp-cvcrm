/**
 * MCP Tools para Atendimentos
 * Consultar: docs/04-MCP-TOOLS.md
 */
import { z } from 'zod';
import type { MCPToolDefinition } from '@/types';
export declare const criarAtendimentoSchema: z.ZodObject<{
    assunto: z.ZodString;
    descricao: z.ZodString;
    clienteId: z.ZodNumber;
    prioridade: z.ZodOptional<z.ZodEnum<["baixa", "media", "alta"]>>;
    tipoAtendimentoId: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    assunto: string;
    descricao: string;
    clienteId: number;
    prioridade?: "baixa" | "media" | "alta" | undefined;
    tipoAtendimentoId?: number | undefined;
}, {
    assunto: string;
    descricao: string;
    clienteId: number;
    prioridade?: "baixa" | "media" | "alta" | undefined;
    tipoAtendimentoId?: number | undefined;
}>;
export declare const listarAtendimentosSchema: z.ZodObject<{
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
}, {
    clienteId?: number | undefined;
    situacao?: string | undefined;
    dataInicio?: string | undefined;
    dataFim?: string | undefined;
    page?: number | undefined;
    limit?: number | undefined;
}>;
export declare const criarAtendimentoTool: MCPToolDefinition;
export declare const listarAtendimentosTool: MCPToolDefinition;
export declare function handleCriarAtendimento(args: unknown): Promise<string>;
export declare function handleListarAtendimentos(args: unknown): Promise<string>;
//# sourceMappingURL=atendimentos.d.ts.map