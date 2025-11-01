/**
 * MCP Server para CV CRM
 * Consultar: docs/04-MCP-TOOLS.md e docs/01-ARCHITECTURE.md
 */
export declare class CVCRMMCPServer {
    private server;
    private client;
    private authManager;
    constructor();
    /**
     * Registra todos os handlers do MCP
     */
    private registerHandlers;
    /**
     * Registra handler de tools
     */
    private registerToolsHandler;
    /**
     * Registra handler de resources
     */
    private registerResourcesHandler;
    /**
     * Inicia o servidor MCP
     */
    start(): Promise<void>;
    /**
     * Para o servidor MCP
     */
    stop(): Promise<void>;
}
//# sourceMappingURL=server.d.ts.map