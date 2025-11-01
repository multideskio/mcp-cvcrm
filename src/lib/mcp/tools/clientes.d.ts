/**
 * MCP Tools para Clientes
 * Consultar: docs/04-MCP-TOOLS.md
 */
import { z } from 'zod';
import type { MCPToolDefinition } from '@/types';
export declare const cadastrarClienteSchema: z.ZodObject<{
    tipoPessoa: z.ZodEnum<["fisica", "juridica"]>;
    nome: z.ZodOptional<z.ZodString>;
    cpf: z.ZodOptional<z.ZodString>;
    razaoSocial: z.ZodOptional<z.ZodString>;
    cnpj: z.ZodOptional<z.ZodString>;
    email: z.ZodString;
    telefone: z.ZodOptional<z.ZodString>;
    celular: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    tipoPessoa: "fisica" | "juridica";
    email: string;
    nome?: string | undefined;
    cpf?: string | undefined;
    razaoSocial?: string | undefined;
    cnpj?: string | undefined;
    telefone?: string | undefined;
    celular?: string | undefined;
}, {
    tipoPessoa: "fisica" | "juridica";
    email: string;
    nome?: string | undefined;
    cpf?: string | undefined;
    razaoSocial?: string | undefined;
    cnpj?: string | undefined;
    telefone?: string | undefined;
    celular?: string | undefined;
}>;
export declare const buscarClientesSchema: z.ZodObject<{
    nome: z.ZodOptional<z.ZodString>;
    cpf: z.ZodOptional<z.ZodString>;
    cnpj: z.ZodOptional<z.ZodString>;
    email: z.ZodOptional<z.ZodString>;
    page: z.ZodOptional<z.ZodNumber>;
    limit: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    page?: number | undefined;
    limit?: number | undefined;
    nome?: string | undefined;
    cpf?: string | undefined;
    cnpj?: string | undefined;
    email?: string | undefined;
}, {
    page?: number | undefined;
    limit?: number | undefined;
    nome?: string | undefined;
    cpf?: string | undefined;
    cnpj?: string | undefined;
    email?: string | undefined;
}>;
export declare const cadastrarClienteTool: MCPToolDefinition;
export declare const buscarClientesTool: MCPToolDefinition;
export declare function handleCadastrarCliente(args: unknown): Promise<string>;
export declare function handleBuscarClientes(args: unknown): Promise<string>;
//# sourceMappingURL=clientes.d.ts.map