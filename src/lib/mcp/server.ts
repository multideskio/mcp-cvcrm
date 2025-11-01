/**
 * MCP Server para CV CRM
 * Consultar: docs/04-MCP-TOOLS.md e docs/01-ARCHITECTURE.md
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { getCVCRMClient, getAuthManager } from '@/lib/cvcrm';
import { logger, logOperationError, logOperationSuccess } from '@/lib/utils/logger';
import { formatErrorForUser } from '@/lib/utils/errors';
import { APP_CONSTANTS } from '@/config';

// Importar tools
import {
  criarAtendimentoTool,
  listarAtendimentosTool,
  handleCriarAtendimento,
  handleListarAtendimentos,
  cadastrarClienteTool,
  buscarClientesTool,
  handleCadastrarCliente,
  handleBuscarClientes,
  criarReservaTool,
  listarReservasTool,
  informarVendaTool,
  handleCriarReserva,
  handleListarReservas,
  handleInformarVenda,
} from './tools';

// Importar tools Luna Nova
import {
  identificarClienteTool,
  handleIdentificarCliente,
  consultarParcelasTool,
  gerarBoletoTool,
  handleConsultarParcelas,
  handleGerarBoleto,
  criarChamadoTool,
  consultarChamadosTool,
  handleCriarChamado,
  handleConsultarChamados,
  listarEmpreendimentosTool,
  handleListarEmpreendimentos,
} from './tools/luna';

export class CVCRMMCPServer {
  private server: Server;
  private client = getCVCRMClient();
  private authManager = getAuthManager();

  constructor() {
    this.server = new Server(
      {
        name: APP_CONSTANTS.NAME,
        version: APP_CONSTANTS.VERSION,
      },
      {
        capabilities: {
          tools: {},
          resources: {},
        },
      }
    );

    this.registerHandlers();
    logger.info('MCP Server inicializado');
  }

  /**
   * Registra todos os handlers do MCP
   */
  private registerHandlers(): void {
    this.registerToolsHandler();
    this.registerResourcesHandler();
  }

  /**
   * Registra handler de tools
   */
  private registerToolsHandler(): void {
    // Listar tools disponíveis
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      logger.debug('Listando tools disponíveis');
      
      return {
        tools: [
          // Atendimentos
          criarAtendimentoTool,
          listarAtendimentosTool,
          // Clientes
          cadastrarClienteTool,
          buscarClientesTool,
          // Reservas
          criarReservaTool,
          listarReservasTool,
          informarVendaTool,
          // Luna Nova - Identificação
          identificarClienteTool,
          // Luna Nova - Financeiro
          consultarParcelasTool,
          gerarBoletoTool,
          // Luna Nova - Assistência
          criarChamadoTool,
          consultarChamadosTool,
          // Luna Nova - Comercial
          listarEmpreendimentosTool,
        ],
      };
    });

    // Executar tool
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;
      const startTime = Date.now();

      logger.info({ tool: name }, 'Executando tool');

      try {
        let result: string;

        switch (name) {
          // Atendimentos
          case 'cvcrm_criar_atendimento':
            result = await handleCriarAtendimento(args);
            break;

          case 'cvcrm_listar_atendimentos':
            result = await handleListarAtendimentos(args);
            break;

          // Clientes
          case 'cvcrm_cadastrar_cliente':
            result = await handleCadastrarCliente(args);
            break;

          case 'cvcrm_buscar_clientes':
            result = await handleBuscarClientes(args);
            break;

          // Reservas
          case 'cvcrm_criar_reserva':
            result = await handleCriarReserva(args);
            break;

          case 'cvcrm_listar_reservas':
            result = await handleListarReservas(args);
            break;

          case 'cvcrm_informar_venda':
            result = await handleInformarVenda(args);
            break;

          // Luna Nova - Identificação
          case 'luna_identificar_cliente':
            result = await handleIdentificarCliente(args);
            break;

          // Luna Nova - Financeiro
          case 'luna_consultar_parcelas':
            result = await handleConsultarParcelas(args);
            break;

          case 'luna_gerar_segunda_via_boleto':
            result = await handleGerarBoleto(args);
            break;

          // Luna Nova - Assistência
          case 'luna_criar_chamado_assistencia':
            result = await handleCriarChamado(args);
            break;

          case 'luna_consultar_chamados':
            result = await handleConsultarChamados(args);
            break;

          // Luna Nova - Comercial
          case 'luna_listar_empreendimentos_disponiveis':
            result = await handleListarEmpreendimentos(args);
            break;

          default:
            throw new Error(`Tool desconhecido: ${name}`);
        }

        const duration = Date.now() - startTime;
        logOperationSuccess(`Tool: ${name}`, duration);

        return {
          content: [
            {
              type: 'text',
              text: result,
            },
          ],
        };
      } catch (error) {
        const duration = Date.now() - startTime;
        logOperationError(`Tool: ${name}`, error, { duration });

        const errorMessage = formatErrorForUser(error);

        return {
          content: [
            {
              type: 'text',
              text: `❌ **Erro ao executar ${name}**\n\n${errorMessage}`,
            },
          ],
          isError: true,
        };
      }
    });
  }

  /**
   * Registra handler de resources
   */
  private registerResourcesHandler(): void {
    // Listar resources disponíveis
    this.server.setRequestHandler(ListResourcesRequestSchema, async () => {
      logger.debug('Listando resources disponíveis');

      return {
        resources: [
          {
            uri: 'cvcrm://auth/status',
            name: 'Status de Autenticação',
            description: 'Verifica status da autenticação e validade do token',
            mimeType: 'application/json',
          },
          {
            uri: 'cvcrm://empreendimentos',
            name: 'Empreendimentos',
            description: 'Lista de todos os empreendimentos ativos',
            mimeType: 'application/json',
          },
          {
            uri: 'cvcrm://config',
            name: 'Configuração',
            description: 'Configuração atual do servidor',
            mimeType: 'application/json',
          },
        ],
      };
    });

    // Ler resource
    this.server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
      const { uri } = request.params;

      logger.info({ uri }, 'Lendo resource');

      try {
        let content: string;

        switch (uri) {
          case 'cvcrm://auth/status': {
            const isValid = await this.authManager.isTokenValid();
            const ttl = await this.authManager.getTokenTTL();

            content = JSON.stringify(
              {
                authenticated: isValid,
                tokenTTL: ttl,
                tokenTTLMinutes: Math.floor(ttl / 60),
                expiresIn: ttl > 0 ? `${Math.floor(ttl / 60)} minutos` : 'Expirado',
              },
              null,
              2
            );
            break;
          }

          case 'cvcrm://empreendimentos': {
            const empreendimentos = await this.client.listarEmpreendimentos();
            content = JSON.stringify(empreendimentos, null, 2);
            break;
          }

          case 'cvcrm://config': {
            content = JSON.stringify(
              {
                name: APP_CONSTANTS.NAME,
                version: APP_CONSTANTS.VERSION,
                nodeEnv: process.env.NODE_ENV,
                dominio: process.env.CVCRM_DOMINIO,
              },
              null,
              2
            );
            break;
          }

          default:
            throw new Error(`Resource desconhecido: ${uri}`);
        }

        logOperationSuccess(`Resource: ${uri}`);

        return {
          contents: [
            {
              uri,
              mimeType: 'application/json',
              text: content,
            },
          ],
        };
      } catch (error) {
        logOperationError(`Resource: ${uri}`, error);

        const errorMessage = formatErrorForUser(error);

        return {
          contents: [
            {
              uri,
              mimeType: 'text/plain',
              text: `Erro ao ler resource: ${errorMessage}`,
            },
          ],
        };
      }
    });
  }

  /**
   * Inicia o servidor MCP
   */
  async start(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    
    logger.info(
      {
        name: APP_CONSTANTS.NAME,
        version: APP_CONSTANTS.VERSION,
      },
      'MCP Server iniciado e conectado via stdio'
    );

    // Log para stderr (visível no Cursor)
    console.error(`${APP_CONSTANTS.NAME} v${APP_CONSTANTS.VERSION} - Ready`);
  }

  /**
   * Para o servidor MCP
   */
  async stop(): Promise<void> {
    await this.server.close();
    logger.info('MCP Server parado');
  }
}

