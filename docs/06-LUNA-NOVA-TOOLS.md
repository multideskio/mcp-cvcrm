# 🌙 Luna Nova Tools - MCP Server

## ✅ Tools Implementados (Fase 1 - MVP)

### 1. `luna_identificar_cliente`

**Descrição:** Identifica cliente por CPF e retorna dados + unidades vinculadas

**Input:**
```json
{
  "cpf": "12345678900",
  "nome": "João Silva" // opcional
}
```

**Output:**
```json
{
  "encontrado": true,
  "cliente": {
    "id": 123,
    "nome": "João Silva",
    "cpf": "12345678900",
    "email": "joao@email.com",
    "telefone": "11999999999"
  },
  "unidades": [
    {
      "id": 456,
      "numeroUnidade": "Unidade 101",
      "situacao": "em_execucao",
      "segmento": "economico"
    }
  ],
  "perfil": "economico"
}
```

---

### 2. `luna_consultar_parcelas`

**Descrição:** Consulta parcelas de pagamento de um cliente/unidade

**Input:**
```json
{
  "clienteId": 123,
  "unidadeId": 456,
  "situacao": "em_aberto" // opcional: "todas", "em_aberto", "vencidas", "pagas"
}
```

**Output:**
```json
{
  "parcelas": [
    {
      "id": 789,
      "numero": 1,
      "valor": 5000.00,
      "valorCorrigido": 5100.00,
      "dataVencimento": "2025-12-01",
      "situacao": "em_aberto",
      "linkBoleto": "https://..."
    }
  ],
  "resumo": {
    "totalPago": 10000.00,
    "totalEmAberto": 5000.00,
    "totalVencido": 2000.00
  }
}
```

**⚠️ Nota:** Requer endpoint `/reservas/{id}/parcelas` na API CV CRM

---

### 3. `luna_gerar_segunda_via_boleto`

**Descrição:** Gera segunda via de boleto atualizado

**Input:**
```json
{
  "parcelaId": 789,
  "enviarEmail": true
}
```

**Output:**
```json
{
  "linkBoleto": "https://...",
  "valor": 5100.00,
  "dataVencimento": "2025-12-01",
  "codigoBarras": "1234567890...",
  "emailEnviado": true
}
```

**⚠️ Nota:** Requer endpoint `/financeiro/boletos/segunda-via` na API CV CRM

---

### 4. `luna_criar_chamado_assistencia`

**Descrição:** Abre novo chamado de assistência técnica

**Input:**
```json
{
  "clienteId": 123,
  "unidadeId": 456,
  "descricaoProblema": "Vazamento no banheiro",
  "localidade": "banheiro",
  "urgencia": "alta",
  "fotosBase64": ["base64string..."] // opcional
}
```

**Output:**
```json
{
  "chamadoId": 999,
  "protocolo": "AT-2025-0001",
  "situacao": "aberto",
  "dataCriacao": "2025-11-01T10:00:00Z"
}
```

**✅ Nota:** Usa endpoint existente `/assistenciatecnica/assistencia`

---

### 5. `luna_consultar_chamados`

**Descrição:** Lista chamados de assistência técnica do cliente

**Input:**
```json
{
  "clienteId": 123,
  "unidadeId": 456, // opcional
  "situacao": "aberto" // opcional
}
```

**Output:**
```json
{
  "chamados": [
    {
      "id": 999,
      "protocolo": "AT-2025-0001",
      "descricao": "Vazamento no banheiro",
      "situacao": "aberto",
      "dataCriacao": "2025-11-01T10:00:00Z"
    }
  ],
  "total": 1
}
```

**✅ Nota:** Usa endpoint existente `/assistenciatecnica/assistencias`

---

### 6. `luna_listar_empreendimentos_disponiveis`

**Descrição:** Lista empreendimentos com unidades disponíveis

**Input:**
```json
{
  "cidade": "São Paulo", // opcional
  "bairro": "Moema", // opcional
  "valorMin": 300000, // opcional
  "valorMax": 800000 // opcional
}
```

**Output:**
```json
{
  "empreendimentos": [
    {
      "id": 1,
      "nome": "Residencial Solar",
      "codigo": "SOL-001",
      "situacao": "ativo",
      "cidade": "São Paulo",
      "estado": "SP",
      "unidadesDisponiveis": 15,
      "valorMinimo": 350000,
      "valorMaximo": 750000
    }
  ],
  "total": 1
}
```

**⚠️ Nota:** Tenta usar `/empreendimentos/{id}/unidades?disponivel=true` (pode não existir)

---

## 📋 Como Usar

### No Cursor (MCP Client)

Após build e configuração:

```typescript
// Exemplo de chamada pelo agente
const resultado = await mcp.callTool({
  name: 'luna_identificar_cliente',
  arguments: {
    cpf: '12345678900'
  }
});

const dados = JSON.parse(resultado.content[0].text);
console.log(dados.cliente.nome); // "João Silva"
```

### Retorno dos Tools

Todos os tools Luna Nova retornam **JSON stringificado** para facilitar parsing por agentes externos.

---

## ⚠️ Endpoints API Necessários

### ✅ Já Existentes
- `GET /clientes?cpf={cpf}` 
- `GET /reservas?clienteId={id}`
- `POST /assistenciatecnica/assistencia`
- `GET /assistenciatecnica/assistencias`
- `GET /empreendimentos`

### ⚠️ Podem Não Existir (verificar)
- `GET /reservas/{id}/parcelas` - Para consultar parcelas
- `POST /financeiro/boletos/segunda-via` - Para gerar boletos
- `GET /empreendimentos/{id}/unidades?disponivel=true` - Para listar unidades
- `POST /assistenciatecnica/assistencia/{id}/upload` - Para upload de fotos

### 💡 Soluções Alternativas

Se endpoints não existirem:

1. **Parcelas:** Buscar via módulo de reservas/contratos
2. **Boletos:** Integrar diretamente com gateway de pagamento
3. **Unidades:** Calcular via reservas existentes
4. **Upload:** Usar storage externo (S3/Cloudinary)

---

## 🚀 Build e Deploy

### Build

```bash
npm run build
```

### Testar Localmente

```bash
# Terminal 1: Iniciar MCP Server
npm run start:mcp

# Terminal 2: Testar tool
echo '{"jsonrpc":"2.0","method":"tools/call","params":{"name":"luna_identificar_cliente","arguments":{"cpf":"12345678900"}},"id":1}' | node dist/index.js
```

### Configurar no Cursor

Atualizar `mcp.json`:

```json
{
  "mcpServers": {
    "cvcrm-luna": {
      "command": "node",
      "args": ["path/to/dist/index.js"],
      "env": {
        "CVCRM_DOMINIO": "...",
        "CVCRM_USUARIO": "...",
        "CVCRM_CPF": "...",
        "CVCRM_VERIFICATION_CODE": "...",
        "REDIS_URL": "..."
      }
    }
  }
}
```

---

## 📊 Tools Status

| Tool | Status | API Endpoint | Notas |
|------|--------|--------------|-------|
| `luna_identificar_cliente` | ✅ Implementado | `GET /clientes` | OK |
| `luna_consultar_parcelas` | ⚠️ Implementado | `GET /reservas/{id}/parcelas` | **Verificar se existe** |
| `luna_gerar_segunda_via_boleto` | ⚠️ Implementado | `POST /financeiro/boletos/segunda-via` | **Verificar se existe** |
| `luna_criar_chamado_assistencia` | ✅ Implementado | `POST /assistenciatecnica/assistencia` | OK |
| `luna_consultar_chamados` | ✅ Implementado | `GET /assistenciatecnica/assistencias` | OK |
| `luna_listar_empreendimentos_disponiveis` | ⚠️ Implementado | `GET /empreendimentos` | **Unidades: verificar** |

---

## 🔜 Próximos Tools (Fase 2)

Ver: `LUNA_NOVA_IMPLEMENTATION_PLAN.md`

- Cadastro (consultar/atualizar dados)
- Agendamento de vistorias
- Simulação de financiamento
- E mais...

---

**Última atualização:** 2025-11-01  
**Versão:** 1.0 - MVP

