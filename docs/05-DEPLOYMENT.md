# Deployment e Configuração

## 🚀 Deploy

### Opção 1: Standalone MCP Server (Recomendado para Cursor)

O MCP Server roda como processo standalone que se comunica com o Cursor via stdio.

**Estrutura:**
```
cvcrm-mcp-server/
├── dist/              # Compilado TypeScript
├── src/
├── package.json
└── tsconfig.json
```

**Build:**
```bash
npm run build
```

**Executar:**
```bash
node dist/index.js
```

### Opção 2: Next.js API Route (Opcional - HTTP)

Se precisar expor via HTTP (para outros clientes além do Cursor).

**Endpoint:** `POST /api/mcp`

---

## ⚙️ Configuração do Cursor

### 1. Instalar Dependências

```bash
cd cvcrm-mcp-server
npm install
```

### 2. Configurar Variáveis de Ambiente

```bash
cp .env.example .env
```

Editar `.env`:
```env
# CV CRM
CVCRM_DOMINIO=minhaempresa
CVCRM_USUARIO=usuario@email.com
CVCRM_CPF=12345678900
CVCRM_VERIFICATION_CODE=123456  # Opcional: para automação

# Redis
REDIS_URL=redis://localhost:6379

# Logs
LOG_LEVEL=info  # debug, info, warn, error
```

### 3. Iniciar Redis

**Docker:**
```bash
docker run -d --name cvcrm-redis -p 6379:6379 redis:alpine
```

**Ou local:**
```bash
redis-server
```

### 4. Build do Projeto

```bash
npm run build
```

### 5. Configurar MCP no Cursor

Adicionar ao `~/.cursor/mcp.json` (ou equivalente no Windows):

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

### 6. Reiniciar Cursor

O MCP Server estará disponível após reiniciar o Cursor.

---

## 🐳 Docker (Opcional)

### Dockerfile

```dockerfile
FROM node:20-alpine

WORKDIR /app

# Instalar dependências
COPY package*.json ./
RUN npm ci --only=production

# Copiar código
COPY dist ./dist

# Expor porta (se usar HTTP)
EXPOSE 3000

CMD ["node", "dist/index.js"]
```

### docker-compose.yml

```yaml
version: '3.8'

services:
  cvcrm-mcp:
    build: .
    environment:
      - CVCRM_DOMINIO=${CVCRM_DOMINIO}
      - CVCRM_USUARIO=${CVCRM_USUARIO}
      - CVCRM_CPF=${CVCRM_CPF}
      - CVCRM_VERIFICATION_CODE=${CVCRM_VERIFICATION_CODE}
      - REDIS_URL=redis://redis:6379
      - LOG_LEVEL=info
    depends_on:
      - redis
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis-data:/data
    restart: unless-stopped

volumes:
  redis-data:
```

**Executar:**
```bash
docker-compose up -d
```

---

## 🔧 Scripts package.json

```json
{
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "test": "jest",
    "test:watch": "jest --watch",
    "lint": "eslint src --ext .ts,.tsx",
    "type-check": "tsc --noEmit",
    "clean": "rm -rf dist"
  }
}
```

---

## 📊 Monitoramento

### Logs

**Arquivo de log:**
```
logs/
├── cvcrm-mcp.log         # Log geral
├── error.log             # Apenas erros
└── combined.log          # Tudo
```

**Configuração (pino):**
```typescript
// src/lib/utils/logger.ts
import pino from 'pino';

export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: {
    targets: [
      {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'SYS:standard',
        },
        level: 'info',
      },
      {
        target: 'pino/file',
        options: {
          destination: './logs/cvcrm-mcp.log',
        },
        level: 'info',
      },
      {
        target: 'pino/file',
        options: {
          destination: './logs/error.log',
        },
        level: 'error',
      },
    ],
  },
});
```

### Health Check

**Endpoint (se usar Next.js):**
```typescript
// src/app/api/health/route.ts
import { redis } from '@/lib/redis/client';

export async function GET() {
  try {
    // Testar Redis
    await redis.ping();

    return Response.json({
      status: 'ok',
      redis: 'connected',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return Response.json(
      {
        status: 'error',
        redis: 'disconnected',
        error: error.message,
      },
      { status: 503 }
    );
  }
}
```

### Métricas (Opcional)

Usar `prom-client` para métricas Prometheus:

```typescript
import { Counter, Histogram, register } from 'prom-client';

// Contador de chamadas
export const toolCallsCounter = new Counter({
  name: 'cvcrm_mcp_tool_calls_total',
  help: 'Total de chamadas de tools',
  labelNames: ['tool', 'status'],
});

// Duração das chamadas
export const toolCallDuration = new Histogram({
  name: 'cvcrm_mcp_tool_call_duration_seconds',
  help: 'Duração das chamadas de tools',
  labelNames: ['tool'],
});

// Endpoint de métricas
// GET /api/metrics
export async function GET() {
  return new Response(await register.metrics(), {
    headers: {
      'Content-Type': register.contentType,
    },
  });
}
```

---

## 🔐 Segurança

### 1. Variáveis de Ambiente Sensíveis

**NUNCA commitar:**
- `.env`
- Tokens
- Senhas
- Códigos de verificação

**Usar:**
- `.env.example` como template
- Variáveis de ambiente do sistema
- Secrets management (Vercel, AWS Secrets Manager, etc)

### 2. Redis

**Produção:**
- Usar Redis com senha
- TLS/SSL
- Restringir acesso por IP

```env
REDIS_URL=rediss://:<password>@redis.example.com:6380
```

### 3. Rate Limiting

```typescript
import { Ratelimit } from '@upstash/ratelimit';
import { redis } from './redis/client';

const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, '10 s'), // 10 req / 10s
});

// Usar antes de chamar API
const { success } = await ratelimit.limit(userId);
if (!success) {
  throw new Error('Rate limit excedido');
}
```

---

## 🧪 Testes

### Unit Tests

```bash
npm run test
```

### Integration Tests

```bash
npm run test:integration
```

### E2E Tests

Testar fluxo completo com MCP Client mock:

```typescript
import { Client } from '@modelcontextprotocol/sdk/client/index.js';

describe('MCP E2E', () => {
  it('deve criar atendimento via MCP', async () => {
    const client = new Client({/* config */});
    
    const result = await client.callTool({
      name: 'cvcrm_criar_atendimento',
      arguments: {
        assunto: 'Teste',
        descricao: 'Teste E2E',
        clienteId: 123,
      },
    });

    expect(result.content[0].text).toContain('criado com sucesso');
  });
});
```

---

## 📋 Checklist de Deploy

- [ ] Configurar variáveis de ambiente
- [ ] Iniciar Redis
- [ ] Build do projeto (`npm run build`)
- [ ] Testar autenticação CV CRM
- [ ] Configurar MCP no Cursor
- [ ] Testar tools básicos
- [ ] Configurar logs
- [ ] Configurar monitoramento (opcional)
- [ ] Documentar credenciais de forma segura
- [ ] Criar backup da configuração

---

## 🆘 Troubleshooting

### Erro: "Token inválido"

**Causa:** Token expirado ou código de verificação errado

**Solução:**
1. Verificar `CVCRM_VERIFICATION_CODE`
2. Limpar cache Redis: `redis-cli FLUSHDB`
3. Reautenticar

### Erro: "Redis connection refused"

**Causa:** Redis não está rodando

**Solução:**
```bash
# Verificar se Redis está rodando
docker ps | grep redis

# Iniciar Redis
docker start cvcrm-redis
# ou
redis-server
```

### Erro: "MCP Server not found"

**Causa:** Caminho incorreto no `mcp.json`

**Solução:**
1. Verificar caminho absoluto do `dist/index.js`
2. Verificar se build foi executado
3. Reiniciar Cursor

### Logs não aparecem

**Solução:**
```bash
# Ver logs em tempo real
tail -f logs/cvcrm-mcp.log

# Ver apenas erros
tail -f logs/error.log
```

---

**Ver também:**
- [00-PROJECT-OVERVIEW.md](./00-PROJECT-OVERVIEW.md) - Visão geral
- [02-AUTHENTICATION.md](./02-AUTHENTICATION.md) - Configuração de autenticação

**Última atualização**: 2025-11-01

