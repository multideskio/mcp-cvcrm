/**
 * MCP Tools - Financeiro (Parcelas e Boletos)
 */
import { z } from 'zod';
import type { MCPToolDefinition } from '@/types';
export declare const consultarParcelasSchema: z.ZodObject<{
    clienteId: z.ZodNumber;
    unidadeId: z.ZodNumber;
    situacao: z.ZodOptional<z.ZodEnum<["todas", "em_aberto", "vencidas", "pagas"]>>;
}, "strip", z.ZodTypeAny, {
    clienteId: number;
    unidadeId: number;
    situacao?: "todas" | "em_aberto" | "vencidas" | "pagas" | undefined;
}, {
    clienteId: number;
    unidadeId: number;
    situacao?: "todas" | "em_aberto" | "vencidas" | "pagas" | undefined;
}>;
export declare const gerarBoletoSchema: z.ZodObject<{
    parcelaId: z.ZodNumber;
    enviarEmail: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    parcelaId: number;
    enviarEmail?: boolean | undefined;
}, {
    parcelaId: number;
    enviarEmail?: boolean | undefined;
}>;
export declare const consultarParcelasTool: MCPToolDefinition;
export declare const gerarBoletoTool: MCPToolDefinition;
export declare function handleConsultarParcelas(args: unknown): Promise<string>;
export declare function handleGerarBoleto(args: unknown): Promise<string>;
//# sourceMappingURL=financeiro.d.ts.map