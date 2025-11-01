/**
 * MCP Tools - Identificação de Cliente
 */
import { z } from 'zod';
import type { MCPToolDefinition } from '@/types';
export declare const identificarClienteSchema: z.ZodObject<{
    cpf: z.ZodString;
    nome: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    cpf: string;
    nome?: string | undefined;
}, {
    cpf: string;
    nome?: string | undefined;
}>;
export declare const identificarClienteTool: MCPToolDefinition;
export declare function handleIdentificarCliente(args: unknown): Promise<string>;
//# sourceMappingURL=identificacao.d.ts.map