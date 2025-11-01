# 📚 Documentação do CV CRM MCP Server

## Índice

### Guias de Desenvolvimento

1. **[00-PROJECT-OVERVIEW.md](./00-PROJECT-OVERVIEW.md)** - Visão Geral do Projeto
   - Objetivo
   - Arquitetura
   - Funcionalidades
   - Quick Start

2. **[01-ARCHITECTURE.md](./01-ARCHITECTURE.md)** - Arquitetura Detalhada
   - Diagrama de componentes
   - Estrutura de diretórios
   - Fluxo de requisições
   - Componentes principais

3. **[02-AUTHENTICATION.md](./02-AUTHENTICATION.md)** - Sistema de Autenticação
   - Fluxo de autenticação (2 etapas)
   - Implementação do AuthManager
   - Estratégias de obtenção de código
   - Cache de tokens no Redis

4. **[03-API-ENDPOINTS.md](./03-API-ENDPOINTS.md)** - Endpoints da API CV CRM
   - Atendimentos
   - Assistência Técnica
   - Clientes
   - Reservas
   - Comissões
   - Cadastros gerais

5. **[04-MCP-TOOLS.md](./04-MCP-TOOLS.md)** - Especificação dos MCP Tools
   - Lista completa de tools
   - Parâmetros e schemas
   - Implementação
   - Formatação de respostas

6. **[05-DEPLOYMENT.md](./05-DEPLOYMENT.md)** - Deploy e Configuração
   - Deploy standalone
   - Configuração do Cursor
   - Docker
   - Monitoramento
   - Troubleshooting

## 🎯 Como Usar Esta Documentação

### Para Desenvolvedores

**Primeiro uso:**
1. Leia **00-PROJECT-OVERVIEW.md** para entender o projeto
2. Siga **05-DEPLOYMENT.md** para configurar o ambiente
3. Consulte **02-AUTHENTICATION.md** para configurar credenciais

**Durante o desenvolvimento:**
- Consulte **01-ARCHITECTURE.md** para entender onde adicionar código
- Use **03-API-ENDPOINTS.md** como referência dos endpoints
- Siga **04-MCP-TOOLS.md** ao criar novos tools

**Quando estiver perdido:**
- Sempre volte para **00-PROJECT-OVERVIEW.md**
- Verifique a estrutura em **01-ARCHITECTURE.md**
- Consulte os exemplos práticos em cada documento

## 🔍 Busca Rápida

### Autenticação
- Como autenticar? → [02-AUTHENTICATION.md](./02-AUTHENTICATION.md)
- Configurar token? → [02-AUTHENTICATION.md#configuração](./02-AUTHENTICATION.md)
- Token expirado? → [05-DEPLOYMENT.md#troubleshooting](./05-DEPLOYMENT.md)

### API
- Ver endpoints? → [03-API-ENDPOINTS.md](./03-API-ENDPOINTS.md)
- Adicionar endpoint? → [01-ARCHITECTURE.md#componentes-principais](./01-ARCHITECTURE.md)
- Erro na API? → [03-API-ENDPOINTS.md#tratamento-de-erros](./03-API-ENDPOINTS.md)

### MCP Tools
- Lista de tools? → [04-MCP-TOOLS.md#lista-de-tools](./04-MCP-TOOLS.md)
- Criar novo tool? → [04-MCP-TOOLS.md#implementação-dos-tools](./04-MCP-TOOLS.md)
- Formatar resposta? → [04-MCP-TOOLS.md#formatação-de-respostas](./04-MCP-TOOLS.md)

### Deploy
- Como deployar? → [05-DEPLOYMENT.md](./05-DEPLOYMENT.md)
- Configurar Cursor? → [05-DEPLOYMENT.md#configuração-do-cursor](./05-DEPLOYMENT.md)
- Problemas? → [05-DEPLOYMENT.md#troubleshooting](./05-DEPLOYMENT.md)

## 📊 Diagrama de Fluxo Simplificado

```
Cursor (Usuário)
    ↓
MCP Client
    ↓
MCP Server (Este projeto)
    ↓
Authentication Manager → Redis (Token Cache)
    ↓
CV CRM API Client
    ↓
CV CRM API (https://{dominio}.cvcrm.com.br)
```

## 🚀 Quick Commands

```bash
# Instalar
npm install

# Desenvolvimento
npm run dev

# Build
npm run build

# Executar
npm start

# Testes
npm test

# Limpar
npm run clean
```

## 📝 Convenções

### Nomenclatura
- **Tools MCP**: `cvcrm_{acao}_{entidade}` (ex: `cvcrm_criar_atendimento`)
- **Funções**: camelCase (ex: `handleCriarAtendimento`)
- **Classes**: PascalCase (ex: `CVCRMAuthManager`)
- **Constants**: UPPER_SNAKE_CASE (ex: `REDIS_TOKEN_TTL`)

### Estrutura de Arquivos
- Cada módulo tem seu próprio diretório
- Index exports para facilitar imports
- Types separados em arquivos `types.ts`

### Git Commits
- `feat:` Nova funcionalidade
- `fix:` Correção de bug
- `docs:` Atualização de documentação
- `refactor:` Refatoração de código
- `test:` Adição/modificação de testes

## 🔗 Links Úteis

- **API CV CRM**: https://desenvolvedor.cvcrm.com.br/reference/cadastrocv-1
- **MCP Protocol**: https://modelcontextprotocol.io/
- **MCP SDK**: https://github.com/modelcontextprotocol/typescript-sdk
- **Next.js**: https://nextjs.org/docs
- **Redis**: https://redis.io/docs/

## 🆘 Suporte

### Quando Estiver com Dúvida

1. **Consulte a documentação** (você está aqui!)
2. **Veja os exemplos** em cada seção
3. **Verifique os logs** em `logs/`
4. **Confira o troubleshooting** em [05-DEPLOYMENT.md](./05-DEPLOYMENT.md)

### Mantendo a Documentação Atualizada

- **Sempre** atualizar docs ao adicionar funcionalidades
- **Sempre** atualizar exemplos ao mudar código
- **Sempre** documentar decisões importantes
- **Sempre** adicionar troubleshooting para erros comuns

---

**Última atualização**: 2025-11-01
**Versão**: 1.0.0

