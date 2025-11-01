# 🚀 CV CRM MCP Server

MCP (Model Context Protocol) Server para integração com a API do CV CRM, permitindo que assistentes de IA gerenciem operações do CRM de forma natural e eficiente.

## 📋 Índice

- [Sobre](#sobre)
- [Funcionalidades](#funcionalidades)
- [Pré-requisitos](#pré-requisitos)
- [Instalação](#instalação)
- [Configuração](#configuração)
- [Uso](#uso)
- [Documentação](#documentação)
- [Desenvolvimento](#desenvolvimento)
- [Troubleshooting](#troubleshooting)

## 🎯 Sobre

Este projeto implementa um servidor MCP que expõe a API do CV CRM para assistentes de IA (como o Cursor), permitindo:

- ✅ Gerenciamento de **atendimentos**
- ✅ Cadastro e busca de **clientes**
- ✅ Criação e gestão de **reservas**
- ✅ Consulta de **comissões**
- ✅ Acesso a **cadastros gerais** (empreendimentos, workflows, etc)

## ✨ Funcionalidades

### MCP Tools Disponíveis

#### Atendimentos
- `cvcrm_criar_atendimento` - Cadastra novo atendimento
- `cvcrm_listar_atendimentos` - Lista atendimentos com filtros

#### Clientes
- `cvcrm_cadastrar_cliente` - Cadastra cliente (PF ou PJ)
- `cvcrm_buscar_clientes` - Busca clientes por nome, CPF, CNPJ ou e-mail

#### Reservas
- `cvcrm_criar_reserva` - Cria nova reserva de unidade
- `cvcrm_listar_reservas` - Lista reservas com filtros
- `cvcrm_informar_venda` - Marca reserva como vendida

#### Luna Nova (Agente IA) ⭐ NOVO
- `luna_identificar_cliente` - Identifica cliente por CPF
- `luna_consultar_parcelas` - Consulta parcelas de pagamento
- `luna_gerar_segunda_via_boleto` - Gera 2ª via de boleto
- `luna_criar_chamado_assistencia` - Abre chamado de assistência
- `luna_consultar_chamados` - Lista chamados de assistência
- `luna_listar_empreendimentos_disponiveis` - Lista empreendimentos

**Ver:** [docs/06-LUNA-NOVA-TOOLS.md](docs/06-LUNA-NOVA-TOOLS.md)

### 🌐 Acesso via HTTP API (n8n, Make, Zapier)

**Todos os tools Luna também disponíveis via REST API!**

```bash
# Exemplo
POST http://localhost:3000/api/luna/identificar-cliente
Content-Type: application/json

{
  "cpf": "12345678900"
}
```

**Endpoints disponíveis:**
- `POST /api/luna/identificar-cliente`
- `POST /api/luna/consultar-parcelas`
- `POST /api/luna/gerar-boleto`
- `POST /api/luna/criar-chamado`
- `POST /api/luna/consultar-chamados`
- `POST /api/luna/listar-empreendimentos`

**Ver:** [N8N_INTEGRATION_GUIDE.md](N8N_INTEGRATION_GUIDE.md) e [docs/07-HTTP-API.md](docs/07-HTTP-API.md)

### MCP Resources Disponíveis

- `cvcrm://auth/status` - Status de autenticação e token
- `cvcrm://empreendimentos` - Lista de empreendimentos ativos
- `cvcrm://config` - Configuração do servidor

## 📦 Pré-requisitos

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0
- **Redis** (local ou Upstash)
- **Credenciais do CV CRM** (domínio, usuário, CPF)

## 🚀 Instalação

### 1. Clonar o repositório

```bash
git clone <url-do-repositorio>
cd cvcrm-mcp-server
```

### 2. Instalar dependências

```bash
npm install
```

### 3. Configurar Redis

**Opção A: Docker (Recomendado)**

```bash
docker run -d --name cvcrm-redis -p 6379:6379 redis:alpine
```

**Opção B: Redis local**

```bash
# Windows (com chocolatey)
choco install redis-64

# Mac (com homebrew)
brew install redis

# Linux
sudo apt-get install redis-server

# Iniciar
redis-server
```

**Opção C: Upstash (Cloud)**

1. Criar conta em [upstash.com](https://upstash.com)
2. Criar database Redis
3. Copiar URL de conexão

### 4. Configurar variáveis de ambiente

```bash
# Copiar arquivo de exemplo
cp .env.example .env
```

Editar `.env` com suas credenciais:

```env
# CV CRM
CVCRM_DOMINIO=minhaempresa
CVCRM_USUARIO=usuario@email.com
CVCRM_CPF=12345678900
CVCRM_VERIFICATION_CODE=123456  # Opcional

# Redis
REDIS_URL=redis://localhost:6379
```

> **⚠️ IMPORTANTE:** O `CVCRM_VERIFICATION_CODE` é opcional mas necessário para automação. Veja [Autenticação](#autenticação) para mais detalhes.

### 5. Build do projeto

```bash
npm run build
```

## ⚙️ Configuração

### Configurar MCP no Cursor

Adicionar ao arquivo de configuração MCP do Cursor:

**Windows:** `%APPDATA%\Cursor\User\globalStorage\saoudrizwan.claude-dev\settings\cline_mcp_settings.json`

**Mac/Linux:** `~/.cursor/mcp.json`

```json
{
  "mcpServers": {
    "cvcrm": {
      "command": "node",
      "args": [
        "C:/caminho/completo/para/cvcrm-mcp-server/dist/index.js"
      ],
      "env": {
        "CVCRM_DOMINIO": "minhaempresa",
        "CVCRM_USUARIO": "usuario@email.com",
        "CVCRM_CPF": "12345678900",
        "CVCRM_VERIFICATION_CODE": "123456",
        "REDIS_URL": "redis://localhost:6379",
        "LOG_LEVEL": "info"
      }
    }
  }
}
```

**Dicas:**
- Use caminho absoluto para o `dist/index.js`
- No Windows, use barras normais `/` ou escape barras invertidas `\\`
- Reinicie o Cursor após configurar

## 🎮 Uso

### No Cursor

Após configurar, você pode usar os tools diretamente no chat do Cursor:

**Exemplos:**

```
User: Crie um atendimento para o cliente ID 123 sobre vazamento no banheiro

AI: [executa cvcrm_criar_atendimento]
✅ Atendimento criado com sucesso!
Protocolo: ATD-2024-001
...
```

```
User: Liste todas as reservas do empreendimento 5

AI: [executa cvcrm_listar_reservas com empreendimentoId: 5]
📋 Reservas Encontradas (15 total)
...
```

```
User: Cadastre um cliente pessoa física com nome João Silva, CPF 12345678900 e email joao@email.com

AI: [executa cvcrm_cadastrar_cliente]
✅ Cliente cadastrado com sucesso!
...
```

### Executar manualmente (desenvolvimento)

```bash
# Modo desenvolvimento (watch)
npm run dev

# Modo produção
npm start

# Apenas MCP Server
npm run start:mcp
```

## 📚 Documentação

A documentação completa está na pasta `docs/`:

- **[00-PROJECT-OVERVIEW.md](docs/00-PROJECT-OVERVIEW.md)** - Visão geral do projeto
- **[01-ARCHITECTURE.md](docs/01-ARCHITECTURE.md)** - Arquitetura detalhada
- **[02-AUTHENTICATION.md](docs/02-AUTHENTICATION.md)** - Sistema de autenticação
- **[03-API-ENDPOINTS.md](docs/03-API-ENDPOINTS.md)** - Endpoints da API CV CRM
- **[04-MCP-TOOLS.md](docs/04-MCP-TOOLS.md)** - Especificação dos tools
- **[05-DEPLOYMENT.md](docs/05-DEPLOYMENT.md)** - Deploy e troubleshooting

## 🔐 Autenticação

O CV CRM usa autenticação em 2 etapas:

### Fluxo Automático (Recomendado para Dev)

Configure `CVCRM_VERIFICATION_CODE` no `.env` com um código fixo:

```env
CVCRM_VERIFICATION_CODE=123456
```

### Fluxo Manual

1. O servidor solicita código de verificação
2. Código é enviado para o e-mail configurado
3. Você precisa obter o código e fornecer ao sistema

> Ver [docs/02-AUTHENTICATION.md](docs/02-AUTHENTICATION.md) para mais detalhes.

## 🛠️ Desenvolvimento

### Estrutura do Projeto

```
cvcrm-mcp-server/
├── docs/                    # Documentação técnica
├── src/
│   ├── app/                # Next.js (opcional)
│   ├── lib/
│   │   ├── cvcrm/         # Cliente API CV CRM
│   │   ├── mcp/           # MCP Server
│   │   ├── redis/         # Cache Redis
│   │   └── utils/         # Utilitários
│   ├── types/             # TypeScript types
│   ├── config/            # Configurações
│   └── mcp/               # Entry point MCP
├── dist/                   # Build output
└── package.json
```

### Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev              # Next.js dev server
npm run start:mcp        # MCP server standalone

# Build
npm run build            # Build completo
npm run build:mcp        # Build apenas MCP

# Qualidade
npm run lint             # ESLint
npm run type-check       # TypeScript check
npm test                 # Testes

# Produção
npm start                # Next.js server
npm run start:mcp        # MCP server
```

### Adicionar Novos Tools

1. Criar arquivo em `src/lib/mcp/tools/`
2. Definir schema (Zod), tool definition e handler
3. Exportar em `src/lib/mcp/tools/index.ts`
4. Registrar em `src/lib/mcp/server.ts`

Ver [docs/04-MCP-TOOLS.md](docs/04-MCP-TOOLS.md) para exemplos.

## 🐛 Troubleshooting

### Erro: "Token inválido"

**Causa:** Token expirado ou código de verificação errado

**Solução:**
1. Verificar `CVCRM_VERIFICATION_CODE`
2. Limpar cache: `redis-cli FLUSHDB`
3. Reautenticar

### Erro: "Redis connection refused"

**Causa:** Redis não está rodando

**Solução:**
```bash
# Verificar
docker ps | grep redis

# Iniciar
docker start cvcrm-redis
# ou
redis-server
```

### Erro: "MCP Server not found"

**Causa:** Caminho incorreto no `mcp.json`

**Solução:**
1. Verificar caminho absoluto do `dist/index.js`
2. Verificar se `npm run build` foi executado
3. Reiniciar Cursor

### Logs não aparecem

```bash
# Ver logs
tail -f logs/cvcrm-mcp.log

# Ver erros
tail -f logs/error.log
```

### Mais problemas?

Consulte [docs/05-DEPLOYMENT.md](docs/05-DEPLOYMENT.md#troubleshooting) para lista completa.

## 📊 Logs e Monitoramento

Os logs são salvos em:

- `logs/cvcrm-mcp.log` - Log geral
- `logs/error.log` - Apenas erros

Configure o nível de log via `LOG_LEVEL` (debug, info, warn, error).

## 🔒 Segurança

- **NUNCA** commite `.env`
- Tokens armazenados no Redis com TTL
- Credenciais via variáveis de ambiente
- Validação de inputs com Zod

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'feat: Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto é privado e proprietário.

## 🆘 Suporte

- **Documentação:** Consulte a pasta `docs/`
- **Issues:** Abra uma issue no repositório
- **E-mail:** [seu-email@exemplo.com]

---

**Desenvolvido com ❤️ usando Next.js, TypeScript e Redis**

**Versão:** 1.0.0 | **Data:** 2025-11-01

