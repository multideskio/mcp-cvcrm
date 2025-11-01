# CV CRM MCP Server - Visão Geral do Projeto

## 📋 Objetivo

Criar um MCP (Model Context Protocol) Server para integração com a API do CV CRM, permitindo que assistentes de IA gerenciem operações do CRM de forma natural e eficiente.

## 🏗️ Arquitetura

### Stack Tecnológico
- **Next.js 14+**: Framework React com App Router
- **TypeScript**: Tipagem estática
- **Redis**: Cache de tokens e dados
- **MCP SDK**: @modelcontextprotocol/sdk

### Estrutura do Projeto

```
cvcrm-mcp-server/
├── docs/                           # Documentação de desenvolvimento
│   ├── 00-PROJECT-OVERVIEW.md      # Este arquivo
│   ├── 01-ARCHITECTURE.md          # Arquitetura detalhada
│   ├── 02-AUTHENTICATION.md        # Sistema de autenticação
│   ├── 03-API-ENDPOINTS.md         # Endpoints da API CV CRM
│   ├── 04-MCP-TOOLS.md             # Tools do MCP Server
│   └── 05-DEPLOYMENT.md            # Deploy e configuração
├── src/
│   ├── app/                        # Next.js App Router
│   ├── lib/
│   │   ├── cvcrm/                  # Cliente API CV CRM
│   │   ├── mcp/                    # MCP Server implementation
│   │   ├── redis/                  # Redis client e cache
│   │   └── utils/                  # Utilitários
│   ├── types/                      # TypeScript types
│   └── config/                     # Configurações
├── .env.example                    # Exemplo de variáveis de ambiente
├── package.json
├── tsconfig.json
└── README.md
```

## 🎯 Funcionalidades Principais

### 1. Autenticação
- Fluxo de autenticação externa CV CRM (2 etapas)
- Cache de tokens no Redis
- Renovação automática de tokens
- Validade de 30 minutos

### 2. MCP Tools

#### Atendimentos
- `cvcrm_criar_atendimento`: Cadastrar novo atendimento
- `cvcrm_listar_atendimentos`: Listar atendimentos
- `cvcrm_adicionar_mensagem`: Adicionar mensagem ao atendimento

#### Assistência Técnica
- `cvcrm_criar_assistencia`: Criar assistência técnica
- `cvcrm_listar_assistencias`: Listar assistências
- `cvcrm_adicionar_visita`: Adicionar visita à assistência

#### Clientes
- `cvcrm_cadastrar_cliente`: Cadastrar cliente
- `cvcrm_buscar_clientes`: Buscar clientes
- `cvcrm_atualizar_cliente`: Atualizar dados do cliente

#### Reservas/Vendas
- `cvcrm_criar_reserva`: Criar reserva
- `cvcrm_listar_reservas`: Listar reservas
- `cvcrm_informar_venda`: Marcar reserva como vendida
- `cvcrm_processar_distrato`: Processar distrato

#### Comissões
- `cvcrm_listar_comissoes`: Listar comissões
- `cvcrm_alterar_comissao`: Alterar situação da comissão

### 3. MCP Resources
- `cvcrm://auth/status`: Status de autenticação
- `cvcrm://empreendimentos`: Lista de empreendimentos
- `cvcrm://workflows/{funcionalidade}`: Workflows disponíveis

## 🔐 Segurança

- Tokens armazenados no Redis com TTL
- Credenciais via variáveis de ambiente
- Validação de requests
- Rate limiting (opcional)

## 📊 Cache Strategy (Redis)

### Keys Pattern
- `cvcrm:token:{dominio}:{usuario}`: Token de autenticação
- `cvcrm:cache:empreendimentos`: Lista de empreendimentos (TTL: 1h)
- `cvcrm:cache:workflows:{funcionalidade}`: Workflows (TTL: 24h)

### TTL Padrões
- Tokens: 30 minutos (ou conforme API)
- Dados de cadastro (empreendimentos, workflows): 1-24 horas
- Dados transacionais (atendimentos, reservas): sem cache ou TTL curto

## 🚀 Quick Start

```bash
# 1. Instalar dependências
npm install

# 2. Configurar .env
cp .env.example .env
# Editar .env com suas credenciais

# 3. Iniciar Redis (Docker)
docker run -d -p 6379:6379 redis:alpine

# 4. Iniciar servidor
npm run dev

# 5. Configurar MCP no Cursor
# Adicionar configuração ao mcp.json
```

## 📝 Referências

- **API CV CRM**: https://desenvolvedor.cvcrm.com.br/reference/cadastrocv-1
- **MCP Protocol**: https://modelcontextprotocol.io/
- **Next.js**: https://nextjs.org/docs
- **Redis**: https://redis.io/docs/

## 📌 Notas Importantes

1. **Sempre consultar esta documentação** quando tiver dúvidas
2. **Seguir a estrutura** definida neste documento
3. **Atualizar docs** quando adicionar novas funcionalidades
4. **Testar autenticação** antes de implementar novos endpoints
5. **Validar schemas** de request/response da API CV CRM

---

**Última atualização**: 2025-11-01
**Versão**: 1.0.0

