/**
 * MCP Tools - Comercial (Empreendimentos e Vendas)
 */
import { z } from 'zod';
import type { MCPToolDefinition } from '@/types';
export declare const listarEmpreendimentosSchema: z.ZodObject<{
    cidade: z.ZodOptional<z.ZodString>;
    bairro: z.ZodOptional<z.ZodString>;
    tipoImovel: z.ZodOptional<z.ZodString>;
    valorMin: z.ZodOptional<z.ZodNumber>;
    valorMax: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    cidade?: string | undefined;
    bairro?: string | undefined;
    tipoImovel?: string | undefined;
    valorMin?: number | undefined;
    valorMax?: number | undefined;
}, {
    cidade?: string | undefined;
    bairro?: string | undefined;
    tipoImovel?: string | undefined;
    valorMin?: number | undefined;
    valorMax?: number | undefined;
}>;
export declare const listarEmpreendimentosTool: MCPToolDefinition;
export declare function handleListarEmpreendimentos(args: unknown): Promise<string>;
//# sourceMappingURL=comercial.d.ts.map