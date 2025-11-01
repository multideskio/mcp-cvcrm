/**
 * Funções de validação e utilitários
 */
/**
 * Valida CPF (11 dígitos)
 */
export declare function validateCPF(cpf: string): boolean;
/**
 * Valida CNPJ (14 dígitos)
 */
export declare function validateCNPJ(cnpj: string): boolean;
/**
 * Valida e-mail
 */
export declare function validateEmail(email: string): boolean;
/**
 * Valida data no formato ISO 8601 (YYYY-MM-DD ou YYYY-MM-DDTHH:mm:ss)
 */
export declare function validateISODate(date: string): boolean;
/**
 * Formata CPF (123.456.789-00)
 */
export declare function formatCPF(cpf: string): string;
/**
 * Formata CNPJ (12.345.678/0001-00)
 */
export declare function formatCNPJ(cnpj: string): string;
/**
 * Remove máscara de CPF/CNPJ
 */
export declare function removeMask(value: string): string;
/**
 * Valida número positivo
 */
export declare function validatePositiveNumber(value: unknown): value is number;
/**
 * Valida string não vazia
 */
export declare function validateNonEmptyString(value: unknown): value is string;
/**
 * Valida objeto não nulo
 */
export declare function validateObject(value: unknown): value is Record<string, unknown>;
/**
 * Valida array não vazio
 */
export declare function validateNonEmptyArray<T>(value: unknown): value is T[];
/**
 * Garante que valor é um enum válido
 */
export declare function validateEnum<T extends string>(value: unknown, enumValues: readonly T[]): value is T;
/**
 * Valida parâmetros de paginação
 */
export declare function validatePagination(params: {
    page?: unknown;
    limit?: unknown;
}): {
    page: number;
    limit: number;
};
/**
 * Valida range de datas
 */
export declare function validateDateRange(dataInicio?: string, dataFim?: string): void;
/**
 * Sanitiza string (remove caracteres perigosos)
 */
export declare function sanitizeString(value: string): string;
/**
 * Trunca texto
 */
export declare function truncateText(text: string, maxLength: number): string;
//# sourceMappingURL=validators.d.ts.map