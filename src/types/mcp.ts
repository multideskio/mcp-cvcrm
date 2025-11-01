/**
 * Types para o MCP (Model Context Protocol)
 */

import type { Tool } from '@modelcontextprotocol/sdk/types.js';

/**
 * Definição de um Tool do MCP
 */
export interface MCPToolDefinition extends Tool {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
}

/**
 * Handler de um Tool do MCP
 */
export type MCPToolHandler<TArgs = unknown, TResult = string> = (
  args: TArgs
) => Promise<TResult>;

/**
 * Resultado de execução de um Tool
 */
export interface MCPToolResult {
  content: Array<{
    type: 'text' | 'image' | 'resource';
    text?: string;
    data?: string;
    mimeType?: string;
  }>;
  isError?: boolean;
}

/**
 * Resource do MCP
 */
export interface MCPResource {
  uri: string;
  name: string;
  description: string;
  mimeType: string;
}

/**
 * Contexto passado para os handlers
 */
export interface MCPContext {
  userId?: string;
  sessionId?: string;
  metadata?: Record<string, unknown>;
}

