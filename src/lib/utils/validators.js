/**
 * Funções de validação e utilitários
 */
import { ValidationError } from './errors';
/**
 * Valida CPF (11 dígitos)
 */
export function validateCPF(cpf) {
    const cleaned = cpf.replace(/\D/g, '');
    return /^\d{11}$/.test(cleaned);
}
/**
 * Valida CNPJ (14 dígitos)
 */
export function validateCNPJ(cnpj) {
    const cleaned = cnpj.replace(/\D/g, '');
    return /^\d{14}$/.test(cleaned);
}
/**
 * Valida e-mail
 */
export function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
/**
 * Valida data no formato ISO 8601 (YYYY-MM-DD ou YYYY-MM-DDTHH:mm:ss)
 */
export function validateISODate(date) {
    const isoRegex = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?)?$/;
    if (!isoRegex.test(date)) {
        return false;
    }
    return !isNaN(new Date(date).getTime());
}
/**
 * Formata CPF (123.456.789-00)
 */
export function formatCPF(cpf) {
    const cleaned = cpf.replace(/\D/g, '');
    return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}
/**
 * Formata CNPJ (12.345.678/0001-00)
 */
export function formatCNPJ(cnpj) {
    const cleaned = cnpj.replace(/\D/g, '');
    return cleaned.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
}
/**
 * Remove máscara de CPF/CNPJ
 */
export function removeMask(value) {
    return value.replace(/\D/g, '');
}
/**
 * Valida número positivo
 */
export function validatePositiveNumber(value) {
    return typeof value === 'number' && value > 0 && !isNaN(value);
}
/**
 * Valida string não vazia
 */
export function validateNonEmptyString(value) {
    return typeof value === 'string' && value.trim().length > 0;
}
/**
 * Valida objeto não nulo
 */
export function validateObject(value) {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}
/**
 * Valida array não vazio
 */
export function validateNonEmptyArray(value) {
    return Array.isArray(value) && value.length > 0;
}
/**
 * Garante que valor é um enum válido
 */
export function validateEnum(value, enumValues) {
    return typeof value === 'string' && enumValues.includes(value);
}
/**
 * Valida parâmetros de paginação
 */
export function validatePagination(params) {
    const page = typeof params.page === 'number' && params.page > 0 ? params.page : 1;
    let limit = 20; // default
    if (typeof params.limit === 'number' && params.limit > 0) {
        limit = Math.min(params.limit, 100); // máximo 100
    }
    return { page, limit };
}
/**
 * Valida range de datas
 */
export function validateDateRange(dataInicio, dataFim) {
    if (dataInicio && !validateISODate(dataInicio)) {
        throw new ValidationError('Data de início inválida (use formato YYYY-MM-DD)');
    }
    if (dataFim && !validateISODate(dataFim)) {
        throw new ValidationError('Data de fim inválida (use formato YYYY-MM-DD)');
    }
    if (dataInicio && dataFim) {
        const inicio = new Date(dataInicio);
        const fim = new Date(dataFim);
        if (inicio > fim) {
            throw new ValidationError('Data de início deve ser anterior à data de fim');
        }
    }
}
/**
 * Sanitiza string (remove caracteres perigosos)
 */
export function sanitizeString(value) {
    return value
        .trim()
        .replace(/[<>]/g, '') // Remove < e >
        .slice(0, 1000); // Limita tamanho
}
/**
 * Trunca texto
 */
export function truncateText(text, maxLength) {
    if (text.length <= maxLength) {
        return text;
    }
    return text.slice(0, maxLength - 3) + '...';
}
//# sourceMappingURL=validators.js.map