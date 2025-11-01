# Sistema de Autenticação CV CRM

## 🔐 Visão Geral

O CV CRM utiliza autenticação externa em 2 etapas com tokens temporários de 30 minutos.

**Referência**: https://desenvolvedor.cvcrm.com.br/reference/codigoverificacao-1

## 📋 Fluxo de Autenticação

### Etapa 1: Solicitar Código de Verificação

**Endpoint**: `POST https://{dominiodocliente}.cvcrm.com.br/api/v1/cliente/codigo-verificacao`

**Request:**
```json
{
  "email": "usuario@email.com",
  "cpf": "12345678900"
}
```

**Response:**
```json
{
  "sucesso": true,
  "mensagem": "Código enviado com sucesso",
  "validadeMinutos": 30
}
```

**Importante:**
- Código enviado para o e-mail do usuário
- Validade de 30 minutos
- Apenas 1 código válido por vez

### Etapa 2: Gerar Token de Autenticação

**Endpoint**: `POST https://{dominiodocliente}.cvcrm.com.br/api/v1/autenticacao/token`

**Request:**
```json
{
  "email": "usuario@email.com",
  "codigo": "123456"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "tipo": "Bearer",
  "expiraEm": "2025-11-01T12:30:00Z"
}
```

## 🏗️ Implementação

### 1. Authentication Manager Class

**Arquivo**: `src/lib/cvcrm/auth.ts`

```typescript
import { Redis } from '@upstash/redis';
import { logger } from '@/lib/utils/logger';
import { CVCRMConfig } from '@/config/cvcrm';

export class CVCRMAuthManager {
  private redis: Redis;
  private config: CVCRMConfig;
  private tokenKey: string;

  constructor(config: CVCRMConfig, redis: Redis) {
    this.config = config;
    this.redis = redis;
    this.tokenKey = `cvcrm:token:${config.dominio}:${config.usuario}`;
  }

  /**
   * Obtém token válido (cache ou novo)
   */
  async getToken(): Promise<string> {
    // Verificar cache
    const cachedToken = await this.redis.get<string>(this.tokenKey);
    
    if (cachedToken) {
      logger.info('Token recuperado do cache');
      return cachedToken;
    }

    // Autenticar
    return await this.authenticate();
  }

  /**
   * Fluxo completo de autenticação
   */
  async authenticate(): Promise<string> {
    try {
      logger.info('Iniciando autenticação CV CRM');

      // Etapa 1: Solicitar código
      await this.requestVerificationCode();

      // Etapa 2: Obter código (env ou input)
      const code = await this.getVerificationCode();

      // Etapa 3: Gerar token
      const token = await this.generateToken(code);

      // Etapa 4: Armazenar no Redis
      await this.cacheToken(token);

      logger.info('Autenticação concluída com sucesso');
      return token;

    } catch (error) {
      logger.error({ error }, 'Erro na autenticação');
      throw new Error('Falha na autenticação CV CRM');
    }
  }

  /**
   * Solicita código de verificação
   */
  private async requestVerificationCode(): Promise<void> {
    const url = `https://${this.config.dominio}.cvcrm.com.br/api/v1/cliente/codigo-verificacao`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: this.config.usuario,
        cpf: this.config.cpf,
      }),
    });

    if (!response.ok) {
      throw new Error(`Erro ao solicitar código: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.sucesso) {
      throw new Error(data.mensagem || 'Erro ao solicitar código');
    }

    logger.info('Código de verificação solicitado com sucesso');
  }

  /**
   * Obtém código de verificação
   * - Prioritariamente da env var (para automação)
   * - Ou aguarda input manual (futuro: webhook, polling, etc)
   */
  private async getVerificationCode(): Promise<string> {
    // Opção 1: Código fixo em env (para testes/dev)
    if (this.config.verificationCode) {
      return this.config.verificationCode;
    }

    // Opção 2: Aguardar código (implementar conforme necessidade)
    // Por enquanto, lançar erro pedindo para configurar
    throw new Error(
      'Código de verificação necessário. Configure CVCRM_VERIFICATION_CODE ou implemente método de input.'
    );
  }

  /**
   * Gera token com o código de verificação
   */
  private async generateToken(code: string): Promise<string> {
    const url = `https://${this.config.dominio}.cvcrm.com.br/api/v1/autenticacao/token`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: this.config.usuario,
        codigo: code,
      }),
    });

    if (!response.ok) {
      throw new Error(`Erro ao gerar token: ${response.status}`);
    }

    const data = await response.json();

    if (!data.token) {
      throw new Error('Token não retornado pela API');
    }

    return data.token;
  }

  /**
   * Armazena token no Redis com TTL
   */
  private async cacheToken(token: string): Promise<void> {
    // TTL de 25 minutos (5 min antes do expire para renovar)
    const ttlSeconds = 25 * 60;

    await this.redis.setex(this.tokenKey, ttlSeconds, token);

    logger.info({ ttl: ttlSeconds }, 'Token armazenado no cache');
  }

  /**
   * Valida se token ainda é válido
   */
  async isTokenValid(): Promise<boolean> {
    const ttl = await this.redis.ttl(this.tokenKey);
    return ttl > 0;
  }

  /**
   * Força renovação do token
   */
  async refreshToken(): Promise<string> {
    await this.redis.del(this.tokenKey);
    return await this.authenticate();
  }

  /**
   * Invalida token (logout)
   */
  async invalidateToken(): Promise<void> {
    await this.redis.del(this.tokenKey);
    logger.info('Token invalidado');
  }
}
```

## 🔑 Estratégias de Obtenção do Código

### Opção 1: Código em Variável de Ambiente (Desenvolvimento)

**Vantagens:**
- Simples para testes
- Automação total

**Desvantagens:**
- Código precisa ser atualizado manualmente

**Configuração:**
```env
CVCRM_VERIFICATION_CODE=123456
```

### Opção 2: Webhook para Receber Código (Produção)

**Implementação futura:**

```typescript
// src/app/api/cvcrm/webhook/code/route.ts
export async function POST(request: Request) {
  const { email, code } = await request.json();
  
  // Armazenar código no Redis temporariamente
  await redis.setex(`cvcrm:code:${email}`, 300, code); // 5min
  
  return Response.json({ success: true });
}

// No AuthManager:
private async getVerificationCode(): Promise<string> {
  const codeKey = `cvcrm:code:${this.config.usuario}`;
  
  // Polling com timeout
  for (let i = 0; i < 60; i++) {
    const code = await this.redis.get<string>(codeKey);
    if (code) {
      await this.redis.del(codeKey);
      return code;
    }
    await new Promise(resolve => setTimeout(resolve, 1000)); // 1s
  }
  
  throw new Error('Timeout aguardando código de verificação');
}
```

### Opção 3: Integração com E-mail (Avançado)

**Usar serviço de parsing de e-mail:**
- Gmail API
- SendGrid Inbound Parse
- Mailgun Routes

## 📦 Configuração

### Config File: `src/config/cvcrm.ts`

```typescript
import { z } from 'zod';

const cvcrmConfigSchema = z.object({
  dominio: z.string().min(1, 'Domínio é obrigatório'),
  usuario: z.string().email('E-mail inválido'),
  cpf: z.string().regex(/^\d{11}$/, 'CPF deve ter 11 dígitos'),
  verificationCode: z.string().optional(),
});

export type CVCRMConfig = z.infer<typeof cvcrmConfigSchema>;

export function loadCVCRMConfig(): CVCRMConfig {
  const config = {
    dominio: process.env.CVCRM_DOMINIO,
    usuario: process.env.CVCRM_USUARIO,
    cpf: process.env.CVCRM_CPF,
    verificationCode: process.env.CVCRM_VERIFICATION_CODE,
  };

  return cvcrmConfigSchema.parse(config);
}
```

### Environment Variables

```env
# CV CRM Configuration
CVCRM_DOMINIO=minhaempresa
CVCRM_USUARIO=usuario@email.com
CVCRM_CPF=12345678900

# Desenvolvimento: código fixo (não usar em produção)
CVCRM_VERIFICATION_CODE=123456

# Redis
REDIS_URL=redis://localhost:6379
```

## 🔄 Renovação Automática de Token

### Background Job (Next.js Route Handler)

```typescript
// src/app/api/cvcrm/auth/refresh/route.ts
import { CVCRMAuthManager } from '@/lib/cvcrm/auth';

export async function POST() {
  const authManager = new CVCRMAuthManager(config, redis);
  
  try {
    const isValid = await authManager.isTokenValid();
    
    if (!isValid) {
      await authManager.refreshToken();
      return Response.json({ refreshed: true });
    }
    
    return Response.json({ refreshed: false, message: 'Token ainda válido' });
  } catch (error) {
    return Response.json({ error: 'Erro ao renovar token' }, { status: 500 });
  }
}
```

### Cron Job (Vercel Cron ou similar)

```json
// vercel.json
{
  "crons": [{
    "path": "/api/cvcrm/auth/refresh",
    "schedule": "*/20 * * * *"
  }]
}
```

## 🧪 Testes

### Unit Test

```typescript
// __tests__/lib/cvcrm/auth.test.ts
import { CVCRMAuthManager } from '@/lib/cvcrm/auth';

describe('CVCRMAuthManager', () => {
  it('deve autenticar com sucesso', async () => {
    const authManager = new CVCRMAuthManager(mockConfig, mockRedis);
    const token = await authManager.authenticate();
    expect(token).toBeDefined();
  });

  it('deve usar token do cache', async () => {
    mockRedis.get.mockResolvedValue('cached-token');
    const authManager = new CVCRMAuthManager(mockConfig, mockRedis);
    const token = await authManager.getToken();
    expect(token).toBe('cached-token');
  });
});
```

## 📊 Monitoramento

### Métricas Importantes

- Taxa de sucesso de autenticação
- Tempo médio de autenticação
- Quantidade de renovações de token
- Erros de autenticação

### Logs

```typescript
logger.info({
  event: 'auth_success',
  dominio: config.dominio,
  usuario: config.usuario,
  ttl: 1500,
}, 'Autenticação bem-sucedida');

logger.error({
  event: 'auth_failure',
  dominio: config.dominio,
  error: error.message,
}, 'Falha na autenticação');
```

---

**Ver também:**
- [01-ARCHITECTURE.md](./01-ARCHITECTURE.md) - Arquitetura geral
- [03-API-ENDPOINTS.md](./03-API-ENDPOINTS.md) - Uso do token nos endpoints

**Última atualização**: 2025-11-01

