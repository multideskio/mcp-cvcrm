# 🎯 Próximos Passos - CV CRM MCP Server

## 🚀 Para Começar a Usar AGORA

### 1. Instalar Dependências

```bash
npm install
```

### 2. Configurar Redis

```bash
# Com Docker (Recomendado)
docker run -d --name cvcrm-redis -p 6379:6379 redis:alpine
```

### 3. Configurar .env

```bash
cp .env.example .env
```

Editar `.env` com suas credenciais:
```env
CVCRM_DOMINIO=SEU_DOMINIO
CVCRM_USUARIO=seu.email@empresa.com
CVCRM_CPF=12345678900
CVCRM_VERIFICATION_CODE=123456
REDIS_URL=redis://localhost:6379
```

### 4. Build

```bash
npm run build
```

### 5. Configurar no Cursor

Editar arquivo de configuração MCP do Cursor:

**Windows:**
```
%APPDATA%\Cursor\User\globalStorage\saoudrizwan.claude-dev\settings\cline_mcp_settings.json
```

**Conteúdo:**
```json
{
  "mcpServers": {
    "cvcrm": {
      "command": "node",
      "args": [
        "C:/Users/User/OneDrive/Área de Trabalho/Nova pasta (5)/dist/index.js"
      ],
      "env": {
        "CVCRM_DOMINIO": "SEU_DOMINIO",
        "CVCRM_USUARIO": "seu.email@empresa.com",
        "CVCRM_CPF": "12345678900",
        "CVCRM_VERIFICATION_CODE": "123456",
        "REDIS_URL": "redis://localhost:6379",
        "LOG_LEVEL": "info"
      }
    }
  }
}
```

⚠️ **IMPORTANTE:** Substitua o caminho em `args[0]` pelo caminho ABSOLUTO do seu `dist/index.js`!

### 6. Reiniciar Cursor

Feche e abra o Cursor completamente.

### 7. Testar!

No chat do Cursor:
```
Liste os empreendimentos
```

---

## 📚 Para Entender o Projeto

### Leitura Essencial (nesta ordem)

1. **[README.md](README.md)** - Visão geral e instruções
2. **[docs/00-PROJECT-OVERVIEW.md](docs/00-PROJECT-OVERVIEW.md)** - Objetivos e estrutura
3. **[docs/01-ARCHITECTURE.md](docs/01-ARCHITECTURE.md)** - Como tudo funciona
4. **[docs/04-MCP-TOOLS.md](docs/04-MCP-TOOLS.md)** - Tools disponíveis

### Documentação Completa

- [docs/02-AUTHENTICATION.md](docs/02-AUTHENTICATION.md) - Sistema de autenticação
- [docs/03-API-ENDPOINTS.md](docs/03-API-ENDPOINTS.md) - Endpoints da API
- [docs/05-DEPLOYMENT.md](docs/05-DEPLOYMENT.md) - Deploy e troubleshooting

---

## 🛠️ Para Desenvolver

### Adicionar Novo Tool

1. Criar arquivo em `src/lib/mcp/tools/` (ex: `assistencias.ts`)
2. Definir schema Zod para validação
3. Criar tool definition (formato MCP)
4. Implementar handler
5. Exportar em `src/lib/mcp/tools/index.ts`
6. Registrar em `src/lib/mcp/server.ts`
7. Documentar em `docs/04-MCP-TOOLS.md`

**Exemplo:** Ver `src/lib/mcp/tools/clientes.ts`

### Adicionar Novo Endpoint da API

1. Adicionar types em `src/types/cvcrm.ts`
2. Adicionar método em `src/lib/cvcrm/client.ts`
3. Documentar em `docs/03-API-ENDPOINTS.md`

### Scripts Úteis

```bash
# Desenvolvimento
npm run dev              # Next.js dev server
npm run start:mcp        # Testar MCP standalone

# Build
npm run build            # Build completo

# Qualidade
npm run lint             # Linter
npm run type-check       # Verificar tipos

# Limpeza
npm run clean            # Limpar build
```

---

## 🎓 Para Aprender

### Conceitos Importantes

1. **MCP Protocol**
   - O que é MCP: https://modelcontextprotocol.io/
   - Tools vs Resources
   - stdio transport

2. **Autenticação CV CRM**
   - Fluxo de 2 etapas
   - Cache de tokens
   - Ver: [docs/02-AUTHENTICATION.md](docs/02-AUTHENTICATION.md)

3. **Arquitetura**
   - Camadas (MCP → API → Cache)
   - Fluxo de requisição
   - Ver: [docs/01-ARCHITECTURE.md](docs/01-ARCHITECTURE.md)

---

## 🐛 Troubleshooting

### Problema: Redis não conecta

```bash
# Verificar se está rodando
docker ps | grep redis

# Verificar logs
docker logs cvcrm-redis

# Reiniciar
docker restart cvcrm-redis
```

### Problema: MCP Server não aparece

1. Verificar caminho absoluto em `mcp.json`
2. Verificar se `dist/index.js` existe
3. Ver logs: `tail -f logs/cvcrm-mcp.log`
4. Reiniciar Cursor

### Problema: Token inválido

1. Verificar `CVCRM_VERIFICATION_CODE` no `.env`
2. Limpar Redis: `docker exec cvcrm-redis redis-cli FLUSHDB`
3. Testar autenticação manualmente

Ver mais: [docs/05-DEPLOYMENT.md#troubleshooting](docs/05-DEPLOYMENT.md)

---

## 📈 Roadmap

### Fase 1: Básico ✅ (COMPLETO)
- [x] Estrutura do projeto
- [x] Autenticação
- [x] API Client
- [x] MCP Server
- [x] Tools básicos (Atendimentos, Clientes, Reservas)
- [x] Documentação

### Fase 2: Expansão (Próxima)
- [ ] Assistência Técnica tools
- [ ] Comissões tools
- [ ] Upload de arquivos
- [ ] Cache de dados de cadastro
- [ ] Testes automatizados

### Fase 3: Avançado (Futuro)
- [ ] Dashboard web (Next.js UI)
- [ ] Webhook para código de verificação
- [ ] Métricas e monitoramento
- [ ] Rate limiting
- [ ] Suporte a múltiplos domínios

---

## 💡 Dicas

### Sempre Consulte a Documentação

Quando estiver em dúvida:

1. Leia [docs/README.md](docs/README.md) para índice
2. Consulte documento específico
3. Veja exemplos no código
4. Verifique [.cursorrules](.cursorrules) para padrões

### Não se Perca!

- Toda a lógica de negócio está documentada
- Siga os padrões existentes
- Use TypeScript para te guiar
- Logs são seus amigos: `tail -f logs/cvcrm-mcp.log`

### Desenvolvimento Eficiente

1. **Use hot reload:** `npm run dev`
2. **Teste incrementalmente:** Um tool por vez
3. **Consulte docs:** Não adivinhe, leia!
4. **Valide tipos:** `npm run type-check`
5. **Veja logs:** Sempre úteis

---

## 🎉 Pronto!

Você tem tudo que precisa para:

✅ Usar o MCP Server no Cursor  
✅ Entender como funciona  
✅ Adicionar novas funcionalidades  
✅ Resolver problemas  

**Documentação está completa e sempre disponível!**

---

## 🆘 Precisa de Ajuda?

1. **Consulte:** [docs/README.md](docs/README.md)
2. **Veja:** [QUICK_START.md](QUICK_START.md)
3. **Leia:** [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)
4. **Troubleshoot:** [docs/05-DEPLOYMENT.md](docs/05-DEPLOYMENT.md)

---

**Boa sorte! 🚀**

