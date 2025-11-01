#!/usr/bin/env node
/**
 * Entry point do MCP Server
 * Este arquivo é executado como processo standalone
 */

import { CVCRMMCPServer } from '../lib/mcp/server.js';
import { logger, logOperationError } from '../lib/utils/logger.js';

async function main() {
  try {
    const server = new CVCRMMCPServer();
    await server.start();

    // Cleanup handlers
    process.on('SIGINT', async () => {
      logger.info('Recebido SIGINT, encerrando servidor...');
      await server.stop();
      process.exit(0);
    });

    process.on('SIGTERM', async () => {
      logger.info('Recebido SIGTERM, encerrando servidor...');
      await server.stop();
      process.exit(0);
    });

    // Error handlers
    process.on('uncaughtException', (error) => {
      logOperationError('Uncaught Exception', error);
      process.exit(1);
    });

    process.on('unhandledRejection', (reason) => {
      logOperationError('Unhandled Rejection', reason);
      process.exit(1);
    });
  } catch (error) {
    logOperationError('Erro ao iniciar MCP Server', error);
    process.exit(1);
  }
}

main();

