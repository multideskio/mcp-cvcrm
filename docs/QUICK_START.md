# 🚀 Quick Start - CV CRM MCP Server

## Instalação Rápida

### 1️⃣ Instalar Dependências

```bash
npm install
```

### 2️⃣ Configurar Redis

**Com Docker (Recomendado):**
```bash
docker run -d --name cvcrm-redis -p 6379:6379 redis:alpine
```

### 3️⃣ Configurar Variáveis de Ambiente

```bash
cp .env.example .env
```

Editar `.env`:
```env
CVCRM_DOMINIO=minhaempresa
CVCRM_USUARIO=usuario@email.com
CVCRM_CPF=12345678900
CVCRM_VERIFICATION_CODE=123456  # Código fixo para automação
REDIS_URL=redis://localhost:6379
```

### 4️⃣ Build

```bash
npm run build
```

### 5️⃣ Configurar no Cursor

Adicionar ao arquivo de configuração MCP do Cursor:

**Localização do arquivo:**
- Windows: `%APPDATA%\Cursor\User\globalStorage\saoudrizwan.claude-dev\settings\cline_mcp_settings.json`
- Mac/Linux: `~/.cursor/mcp.json`

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

> ⚠️ **IMPORTANTE:** Substitua o caminho em `args` pelo caminho ABSOLUTO do seu `dist/index.js`

### 6️⃣ Reiniciar Cursor

Feche e abra o Cursor novamente.

### 7️⃣ Testar

No chat do Cursor, tente:

```
Liste os empreendimentos ativos
```

ou

```
Busque clientes com nome João
```

## ✅ Checklist

- [ ] Node.js >= 18 instalado
- [ ] Redis rodando (verificar: `docker ps | grep redis`)
- [ ] `.env` configurado com suas credenciais
- [ ] Build executado (`npm run build`)
- [ ] `dist/index.js` existe
- [ ] MCP configurado no Cursor (caminho correto!)
- [ ] Cursor reiniciado

## 🆘 Problemas?

### Redis não conecta
```bash
# Verificar se está rodando
docker ps | grep redis

# Iniciar se não estiver
docker start cvcrm-redis
```

### MCP Server não aparece no Cursor
1. Verificar caminho absoluto em `mcp.json`
2. Verificar se `dist/index.js` existe
3. Reiniciar Cursor completamente

### Token inválido
1. Verificar `CVCRM_VERIFICATION_CODE` no `.env`
2. Limpar Redis: `docker exec cvcrm-redis redis-cli FLUSHDB`
3. Reiniciar MCP Server

## 📚 Próximos Passos

- Ler [README.md](README.md) completo
- Consultar [docs/README.md](docs/README.md) para documentação técnica
- Experimentar os tools no Cursor!

---

**Pronto para usar! 🎉**

