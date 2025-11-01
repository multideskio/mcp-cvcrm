# 🌐 HTTP API - Luna Nova

## Visão Geral

Além do MCP Server (stdio), os tools Luna Nova também estão disponíveis via **HTTP REST API** para integração com plataformas como **n8n**, **Typebot**, **Make**, **Zapier**, etc.

---

## 📍 Endpoints

### Base URL

```
http://localhost:3000/api/luna
```

Ou em produção:
```
https://seu-dominio.com/api/luna
```

---

## 🔧 Opção 1: Endpoint Genérico

### `POST /api/luna`

Chama qualquer tool enviando o nome e argumentos.

**Request:**
```http
POST /api/luna
Content-Type: application/json

{
  "tool": "luna_identificar_cliente",
  "arguments": {
    "cpf": "12345678900"
  }
}
```

**Response:**
```json
{
  "success": true,
  "tool": "luna_identificar_cliente",
  "data": {
    "encontrado": true,
    "cliente": {
      "id": 123,
      "nome": "João Silva",
      "cpf": "12345678900",
      "email": "joao@email.com",
      "telefone": "11999999999"
    },
    "unidades": [...],
    "perfil": "economico"
  }
}
```

---

## 🎯 Opção 2: Endpoints Específicos

Endpoints REST dedicados para cada tool.

### 1. Identificar Cliente

```http
POST /api/luna/identificar-cliente
Content-Type: application/json

{
  "cpf": "12345678900",
  "nome": "João Silva"
}
```

**Response:**
```json
{
  "encontrado": true,
  "cliente": {...},
  "unidades": [...],
  "perfil": "economico"
}
```

---

### 2. Consultar Parcelas

```http
POST /api/luna/consultar-parcelas
Content-Type: application/json

{
  "clienteId": 123,
  "unidadeId": 456,
  "situacao": "em_aberto"
}
```

**Response:**
```json
{
  "parcelas": [...],
  "resumo": {
    "totalPago": 10000,
    "totalEmAberto": 5000,
    "totalVencido": 2000
  }
}
```

---

### 3. Gerar Segunda Via Boleto

```http
POST /api/luna/gerar-boleto
Content-Type: application/json

{
  "parcelaId": 789,
  "enviarEmail": true
}
```

**Response:**
```json
{
  "linkBoleto": "https://...",
  "valor": 5100.00,
  "dataVencimento": "2025-12-01",
  "codigoBarras": "123456...",
  "emailEnviado": true
}
```

---

### 4. Criar Chamado Assistência

```http
POST /api/luna/criar-chamado
Content-Type: application/json

{
  "clienteId": 123,
  "unidadeId": 456,
  "descricaoProblema": "Vazamento no banheiro",
  "urgencia": "alta"
}
```

**Response:**
```json
{
  "chamadoId": 999,
  "protocolo": "AT-2025-0001",
  "situacao": "aberto",
  "dataCriacao": "2025-11-01T10:00:00Z"
}
```

---

### 5. Consultar Chamados

```http
POST /api/luna/consultar-chamados
Content-Type: application/json

{
  "clienteId": 123,
  "unidadeId": 456
}
```

**Response:**
```json
{
  "chamados": [...],
  "total": 3
}
```

---

### 6. Listar Empreendimentos

```http
POST /api/luna/listar-empreendimentos
Content-Type: application/json

{
  "cidade": "São Paulo",
  "valorMin": 300000,
  "valorMax": 800000
}
```

**Response:**
```json
{
  "empreendimentos": [...],
  "total": 5
}
```

---

## 📋 Listar Tools Disponíveis

### `GET /api/luna`

Lista todos os tools disponíveis e seus parâmetros.

**Response:**
```json
{
  "tools": [
    {
      "name": "luna_identificar_cliente",
      "description": "Identifica cliente por CPF",
      "method": "POST",
      "parameters": {
        "cpf": "string (11 dígitos)",
        "nome": "string (opcional)"
      }
    },
    ...
  ]
}
```

---

## 🔌 Integração com n8n

### Exemplo de Workflow n8n

#### 1. HTTP Request Node

**Configuração:**
- **Method:** POST
- **URL:** `http://localhost:3000/api/luna/identificar-cliente`
- **Body:** JSON

```json
{
  "cpf": "{{ $json.cpf }}"
}
```

#### 2. Processar Resposta

```javascript
// n8n Code Node
const data = $input.all()[0].json;

if (data.encontrado) {
  return {
    clienteId: data.cliente.id,
    nome: data.cliente.nome,
    perfil: data.perfil,
    temUnidades: data.unidades.length > 0
  };
}
```

#### 3. Fluxo Condicional

```
IF perfil = "vip"
  → Webhook Concierge VIP
ELSE
  → Menu de Opções
```

---

## 🔐 Segurança (Opcional)

### Adicionar API Key

**Criar:** `src/app/api/luna/auth.ts`

```typescript
export function validateApiKey(request: NextRequest): boolean {
  const apiKey = request.headers.get('x-api-key');
  return apiKey === process.env.LUNA_API_KEY;
}
```

**Usar no endpoint:**

```typescript
import { validateApiKey } from './auth';

export async function POST(request: NextRequest) {
  if (!validateApiKey(request)) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
  // ...
}
```

**Request com API Key:**

```http
POST /api/luna/identificar-cliente
Content-Type: application/json
x-api-key: sua-chave-secreta

{
  "cpf": "12345678900"
}
```

---

## 🚀 Deploy

### Local (Desenvolvimento)

```bash
npm run dev
```

Acesse: `http://localhost:3000/api/luna`

### Produção (Vercel)

```bash
vercel deploy
```

URL: `https://seu-projeto.vercel.app/api/luna`

---

## 📊 Monitoramento

### Logs

Todas as chamadas são logadas:

```bash
tail -f logs/cvcrm-mcp.log | grep "Luna"
```

### Métricas

Ver quantas chamadas cada tool recebeu:

```bash
grep "Luna tool call" logs/cvcrm-mcp.log | wc -l
```

---

## 🧪 Testar API

### cURL

```bash
# Identificar cliente
curl -X POST http://localhost:3000/api/luna/identificar-cliente \
  -H "Content-Type: application/json" \
  -d '{"cpf":"12345678900"}'

# Listar tools
curl http://localhost:3000/api/luna
```

### Postman / Insomnia

Importar collection:

```json
{
  "name": "Luna Nova API",
  "requests": [
    {
      "name": "Identificar Cliente",
      "method": "POST",
      "url": "{{baseUrl}}/api/luna/identificar-cliente",
      "body": {
        "cpf": "12345678900"
      }
    }
  ]
}
```

---

## 🔄 Diferenças: MCP vs HTTP API

| Feature | MCP (stdio) | HTTP API |
|---------|-------------|----------|
| **Uso** | Cursor, Claude Desktop | n8n, Make, Zapier, webhooks |
| **Protocolo** | stdio | HTTP REST |
| **Formato** | JSON-RPC | JSON |
| **Autenticação** | Env vars | API Key (opcional) |
| **Deploy** | Node process | Next.js server |
| **Performance** | Mais rápido | Rede adicional |

---

## 💡 Dicas

### n8n

1. Use **HTTP Request** node
2. Armazene `clienteId` em variável global
3. Use **Switch** node para fluxos condicionais
4. Cache dados do cliente com **Redis** node

### Make / Zapier

1. Configure webhook para receber dados
2. Chame API Luna via HTTP module
3. Parse JSON response
4. Continue workflow

### Typebot

1. Use bloco **HTTP Request**
2. Salve resposta em variável
3. Use condicionais baseadas no `perfil`

---

**Ver também:**
- [docs/06-LUNA-NOVA-TOOLS.md](./06-LUNA-NOVA-TOOLS.md) - Especificação dos tools
- [README.md](../README.md) - Documentação geral

**Última atualização:** 2025-11-01  
**Versão:** 1.1.0

