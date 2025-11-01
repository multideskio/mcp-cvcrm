# 🔌 Guia de Integração n8n + Luna Nova

## ✅ SIM! O n8n pode acessar via URL

Criamos **HTTP REST API** para os tools Luna Nova.

---

## 🚀 Quick Start

### 1. Iniciar Servidor

```bash
# Desenvolvimento
npm run dev

# Produção
npm start
```

**URL Base:** `http://localhost:3000/api/luna`

---

## 📋 Endpoints Disponíveis

### Opção 1: Endpoint Genérico

```
POST http://localhost:3000/api/luna
```

**Body:**
```json
{
  "tool": "luna_identificar_cliente",
  "arguments": {
    "cpf": "12345678900"
  }
}
```

### Opção 2: Endpoints Específicos (Recomendado)

```
POST http://localhost:3000/api/luna/identificar-cliente
POST http://localhost:3000/api/luna/consultar-parcelas
POST http://localhost:3000/api/luna/gerar-boleto
POST http://localhost:3000/api/luna/criar-chamado
POST http://localhost:3000/api/luna/consultar-chamados
POST http://localhost:3000/api/luna/listar-empreendimentos
```

---

## 🔧 Exemplo n8n: Fluxo Completo

### Workflow: Atendimento Luna Nova

```
┌─────────────┐
│   Webhook   │ ← WhatsApp envia: { "cpf": "123...", "mensagem": "..." }
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ HTTP Request│ → POST /api/luna/identificar-cliente
│ (Identificar│    Body: { "cpf": "{{ $json.cpf }}" }
│   Cliente)  │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│    Code     │ → Processa resposta e salva variáveis
│   (Parse)   │    clienteId, nome, perfil, unidades
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Switch    │ → Se perfil = "vip" → Rota 1
│   (Perfil)  │    Se perfil = "economico" → Rota 2
└──────┬──────┘
       │
       ├─────────────────┐
       │                 │
       ▼                 ▼
┌─────────────┐   ┌─────────────┐
│ Concierge   │   │    Menu     │
│    VIP      │   │  Econômico  │
└─────────────┘   └─────────────┘
```

---

## 📝 Configuração Detalhada n8n

### Node 1: Webhook (Entrada)

**Tipo:** Webhook  
**Method:** POST  
**Path:** `/luna-atendimento`

**Dados esperados:**
```json
{
  "cpf": "12345678900",
  "mensagem": "Preciso da segunda via do boleto",
  "phone": "11999999999"
}
```

---

### Node 2: HTTP Request - Identificar Cliente

**Tipo:** HTTP Request  
**Method:** POST  
**URL:** `http://localhost:3000/api/luna/identificar-cliente`

**Headers:**
```json
{
  "Content-Type": "application/json"
}
```

**Body (JSON):**
```json
{
  "cpf": "{{ $json.cpf }}"
}
```

**Resposta esperada:**
```json
{
  "encontrado": true,
  "cliente": {
    "id": 123,
    "nome": "João Silva",
    ...
  },
  "unidades": [...],
  "perfil": "economico"
}
```

---

### Node 3: Code - Processar Dados

**Tipo:** Code  
**Language:** JavaScript

```javascript
// Processar resposta da API Luna
const data = $input.all()[0].json;

if (!data.encontrado) {
  return [{
    json: {
      error: true,
      message: "Cliente não encontrado"
    }
  }];
}

// Extrair dados importantes
return [{
  json: {
    clienteId: data.cliente.id,
    nome: data.cliente.nome,
    email: data.cliente.email,
    telefone: data.cliente.telefone,
    perfil: data.perfil,
    unidades: data.unidades,
    temUnidades: data.unidades.length > 0,
    
    // Dados originais do webhook
    cpf: $('Webhook').item.json.cpf,
    mensagem: $('Webhook').item.json.mensagem,
    phone: $('Webhook').item.json.phone
  }
}];
```

---

### Node 4: Switch - Roteamento por Perfil

**Tipo:** Switch  
**Mode:** Rules

**Rules:**

1. **VIP:**
   - Field: `{{ $json.perfil }}`
   - Operation: Equal
   - Value: `vip`

2. **Econômico:**
   - Field: `{{ $json.perfil }}`
   - Operation: Equal
   - Value: `economico`

3. **Fallback:**
   - Default route

---

### Node 5a: Fluxo VIP

**Tipo:** HTTP Request  
**Method:** POST  
**URL:** Webhook Concierge VIP

**Body:**
```json
{
  "tipo": "atendimento_vip",
  "cliente": {
    "id": "{{ $json.clienteId }}",
    "nome": "{{ $json.nome }}",
    "cpf": "{{ $json.cpf }}"
  },
  "mensagem": "{{ $json.mensagem }}",
  "phone": "{{ $json.phone }}"
}
```

---

### Node 5b: Fluxo Econômico - Analisar Intenção

**Tipo:** Code

```javascript
// Analisar mensagem para identificar intenção
const mensagem = $json.mensagem.toLowerCase();

let intencao = 'outro';

if (mensagem.includes('boleto') || mensagem.includes('pagar')) {
  intencao = 'financeiro';
} else if (mensagem.includes('vazamento') || mensagem.includes('problema') || mensagem.includes('defeito')) {
  intencao = 'assistencia';
} else if (mensagem.includes('comprar') || mensagem.includes('imóvel')) {
  intencao = 'comercial';
}

return [{
  json: {
    ...$json,
    intencao
  }
}];
```

---

### Node 6: Switch - Por Intenção

**Rules:**

1. **Financeiro** → Chama `consultar-parcelas`
2. **Assistência** → Chama `criar-chamado`
3. **Comercial** → Chama `listar-empreendimentos`
4. **Outro** → Menu de opções

---

### Node 7a: Consultar Parcelas

**Tipo:** HTTP Request  
**URL:** `http://localhost:3000/api/luna/consultar-parcelas`

**Body:**
```json
{
  "clienteId": "{{ $json.clienteId }}",
  "unidadeId": "{{ $json.unidades[0].id }}",
  "situacao": "em_aberto"
}
```

---

### Node 7b: Criar Chamado Assistência

**Tipo:** HTTP Request  
**URL:** `http://localhost:3000/api/luna/criar-chamado`

**Body:**
```json
{
  "clienteId": "{{ $json.clienteId }}",
  "unidadeId": "{{ $json.unidades[0].id }}",
  "descricaoProblema": "{{ $json.mensagem }}",
  "urgencia": "media"
}
```

---

### Node 8: Resposta WhatsApp

**Tipo:** HTTP Request (para API WhatsApp)

**Body dinâmico:**

```javascript
// Code node anterior
const intencao = $json.intencao;
let resposta = '';

if (intencao === 'financeiro') {
  const parcelas = $json.parcelas || [];
  const emAberto = parcelas.filter(p => p.situacao === 'em_aberto');
  
  resposta = `Olá ${$json.nome}! Você tem ${emAberto.length} parcela(s) em aberto:

${emAberto.map(p => 
  `• Parcela ${p.numero}: R$ ${p.valor.toFixed(2)} - Venc: ${p.dataVencimento}`
).join('\n')}

Deseja gerar a 2ª via de alguma?`;

} else if (intencao === 'assistencia') {
  resposta = `Chamado aberto com sucesso!

Protocolo: ${$json.protocolo}
Nossa equipe entrará em contato em breve.`;

} else {
  resposta = `Olá ${$json.nome}! Como posso ajudar?

1️⃣ Financeiro (boletos, parcelas)
2️⃣ Assistência Técnica
3️⃣ Comercial (novos imóveis)
4️⃣ Cadastro`;
}

return [{
  json: {
    phone: $json.phone,
    message: resposta
  }
}];
```

---

## 🔐 Segurança (Opcional)

### Adicionar API Key

**1. Configurar .env:**
```env
LUNA_API_KEY=sua-chave-secreta-aqui
```

**2. No n8n - Headers:**
```json
{
  "Content-Type": "application/json",
  "x-api-key": "sua-chave-secreta-aqui"
}
```

---

## 🧪 Testar Antes de Usar no n8n

### cURL

```bash
curl -X POST http://localhost:3000/api/luna/identificar-cliente \
  -H "Content-Type: application/json" \
  -d '{"cpf":"12345678900"}'
```

### Postman

1. Criar nova request
2. Method: POST
3. URL: `http://localhost:3000/api/luna/identificar-cliente`
4. Body → raw → JSON:
```json
{
  "cpf": "12345678900"
}
```
5. Send

---

## 📊 Workflow n8n Completo

### Importar JSON

```json
{
  "name": "Luna Nova - Atendimento Completo",
  "nodes": [
    {
      "name": "Webhook",
      "type": "n8n-nodes-base.webhook",
      "parameters": {
        "path": "luna-atendimento",
        "httpMethod": "POST"
      }
    },
    {
      "name": "Identificar Cliente",
      "type": "n8n-nodes-base.httpRequest",
      "parameters": {
        "url": "http://localhost:3000/api/luna/identificar-cliente",
        "method": "POST",
        "bodyParameters": {
          "cpf": "={{ $json.cpf }}"
        }
      }
    }
    // ... mais nodes
  ]
}
```

---

## ✅ Checklist

- [ ] Next.js rodando (`npm run dev`)
- [ ] Redis rodando
- [ ] Testar endpoint com cURL
- [ ] Criar workflow n8n
- [ ] Configurar webhook de entrada
- [ ] Testar fluxo completo
- [ ] Conectar com WhatsApp (Twilio/Meta)

---

## 🚀 Deploy Produção

### Vercel

```bash
vercel deploy
```

**URL:** `https://seu-projeto.vercel.app/api/luna`

Atualizar n8n com nova URL.

---

## 📚 Documentação Completa

Ver: [docs/07-HTTP-API.md](docs/07-HTTP-API.md)

---

**Data:** 2025-11-01  
**Status:** ✅ Pronto para usar no n8n!

