/**
 * MCP Tools - Assistência Técnica
 */
import { z } from 'zod';
import type { MCPToolDefinition } from '@/types';
export declare const criarChamadoSchema: z.ZodObject<{
    clienteId: z.ZodNumber;
    unidadeId: z.ZodNumber;
    descricaoProblema: z.ZodString;
    localidade: z.ZodOptional<z.ZodString>;
    urgencia: z.ZodOptional<z.ZodEnum<["baixa", "media", "alta"]>>;
    fotosBase64: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    clienteId: number;
    unidadeId: number;
    descricaoProblema: string;
    localidade?: string | undefined;
    urgencia?: "baixa" | "media" | "alta" | undefined;
    fotosBase64?: string[] | undefined;
}, {
    clienteId: number;
    unidadeId: number;
    descricaoProblema: string;
    localidade?: string | undefined;
    urgencia?: "baixa" | "media" | "alta" | undefined;
    fotosBase64?: string[] | undefined;
}>;
export declare const consultarChamadosSchema: z.ZodObject<{
    clienteId: z.ZodNumber;
    unidadeId: z.ZodOptional<z.ZodNumber>;
    situacao: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    clienteId: number;
    situacao?: string | undefined;
    unidadeId?: number | undefined;
}, {
    clienteId: number;
    situacao?: string | undefined;
    unidadeId?: number | undefined;
}>;
export declare const criarChamadoTool: MCPToolDefinition;
export declare const consultarChamadosTool: MCPToolDefinition;
export declare function handleCriarChamado(args: unknown): Promise<string>;
export declare function handleConsultarChamados(args: unknown): Promise<string>;
//# sourceMappingURL=assistencia.d.ts.map