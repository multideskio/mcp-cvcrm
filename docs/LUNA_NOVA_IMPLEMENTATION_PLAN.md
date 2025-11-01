# 🌙 Plano de Implementação - Luna Nova

## 📊 Status Atual vs Necessário

### ✅ O que JÁ TEMOS Implementado (MCP Server Base)

#### Tools Existentes (7 tools)

| Tool | Descrição | Status |
|------|-----------|--------|
| `cvcrm_criar_atendimento` | Cadastra atendimento | ✅ Implementado |
| `cvcrm_listar_atendimentos` | Lista atendimentos | ✅ Implementado |
| `cvcrm_cadastrar_cliente` | Cadastra cliente | ✅ Implementado |
| `cvcrm_buscar_clientes` | Busca clientes | ✅ Implementado |
| `cvcrm_criar_reserva` | Cria reserva | ✅ Implementado |
| `cvcrm_listar_reservas` | Lista reservas | ✅ Implementado |
| `cvcrm_informar_venda` | Marca venda | ✅ Implementado |

#### Infraestrutura Existente

- ✅ **Autenticação CV CRM** (2 etapas com cache Redis)
- ✅ **API Client completo** com tratamento de erros
- ✅ **MCP Server** funcionando com stdio
- ✅ **Validação** com Zod
- ✅ **Logging** estruturado
- ✅ **Cache Redis** configurado
- ✅ **TypeScript** strict mode
- ✅ **Documentação completa**

---

### 🎯 O que FALTA para Luna Nova (16 novos tools)

#### 1. Identificação e Autenticação (1 tool)

| Tool | Prioridade | Complexidade |
|------|------------|--------------|
| `luna_identificar_cliente` | 🔴 Alta | Média |

**Funcionalidade:** Buscar cliente por CPF e retornar unidades vinculadas com segmentação (alto padrão / econômico)

---

#### 2. Comercial / Vendas (3 tools)

| Tool | Prioridade | Complexidade |
|------|------------|--------------|
| `luna_listar_empreendimentos_disponiveis` | 🟡 Média | Baixa |
| `luna_listar_unidades_disponiveis` | 🟡 Média | Baixa |
| `luna_simular_financiamento` | 🟢 Baixa | Média |
| `luna_criar_lead` | 🟡 Média | Baixa |

**Nota:** Parcialmente atendido por tools existentes, mas precisa adaptar para contexto Luna

---

#### 3. Financeiro (5 tools) ⚠️ CRÍTICOS

| Tool | Prioridade | Complexidade |
|------|------------|--------------|
| `luna_consultar_parcelas` | 🔴 Alta | Média |
| `luna_gerar_segunda_via_boleto` | 🔴 Alta | Alta |
| `luna_consultar_extrato_financeiro` | 🟡 Média | Média |
| `luna_solicitar_negociacao` | 🔴 Alta | Média |
| `luna_verificar_status_pagamento` | 🟡 Média | Baixa |

**Nota:** Requer endpoints específicos de financeiro que podem não existir na API padrão do CV CRM

---

#### 4. Cadastro (2 tools)

| Tool | Prioridade | Complexidade |
|------|------------|--------------|
| `luna_consultar_dados_cadastrais` | 🔴 Alta | Baixa |
| `luna_atualizar_dados_simples` | 🟡 Média | Média |
| `luna_solicitar_alteracao_dados_sensiveis` | 🟢 Baixa | Baixa |

**Nota:** Parcialmente atendido por `cvcrm_buscar_clientes`, mas precisa retornar mais dados

---

#### 5. Assistência Técnica (4 tools) ⚠️ JÁ QUASE PRONTO

| Tool | Prioridade | Complexidade |
|------|------------|--------------|
| `luna_criar_chamado_assistencia` | 🔴 Alta | Baixa |
| `luna_consultar_chamados` | 🔴 Alta | Baixa |
| `luna_consultar_datas_disponiveis_vistoria` | 🟡 Média | Alta |
| `luna_agendar_vistoria` | 🟡 Média | Média |
| `luna_consultar_status_chamado` | 🟢 Baixa | Baixa |

**Nota:** API CV CRM já tem endpoints de assistência técnica, só falta implementar os tools

---

#### 6. Atendimento Geral (1 tool)

| Tool | Prioridade | Complexidade |
|------|------------|--------------|
| `luna_transferir_para_humano` | 🟡 Média | Alta |

**Nota:** Depende de integração com sistema de filas/WhatsApp

---

## 🚀 Plano de Implementação

### Fase 1: MVP (1-2 semanas) - ESSENCIAL

**Objetivo:** Luna funcionando com funcionalidades básicas

#### Tools a Implementar (6 tools)

1. **`luna_identificar_cliente`** ⭐ CRÍTICO
   - Buscar por CPF
   - Retornar unidades com segmentação
   - Identificar perfil (VIP/Econômico)

2. **`luna_consultar_parcelas`** ⭐ CRÍTICO
   - Listar parcelas (pagas, abertas, vencidas)
   - Calcular valores corrigidos
   - Retornar resumo financeiro

3. **`luna_gerar_segunda_via_boleto`** ⭐ CRÍTICO
   - Gerar link do boleto
   - Enviar por email
   - Registrar no CRM

4. **`luna_criar_chamado_assistencia`** ⭐ CRÍTICO
   - Abrir chamado
   - Upload de fotos
   - Gerar protocolo

5. **`luna_consultar_chamados`** 
   - Listar chamados do cliente
   - Mostrar status
   - Histórico

6. **`luna_listar_empreendimentos_disponiveis`**
   - Listar empreendimentos ativos
   - Filtros básicos
   - Links de catálogo

**Endpoints API Necessários:**
- ✅ `GET /clientes?cpf={cpf}` (já existe)
- ⚠️ `GET /financeiro/parcelas?clienteId={id}` (verificar se existe)
- ⚠️ `POST /financeiro/boletos/segunda-via` (pode não existir)
- ✅ `POST /assistenciatecnica/assistencia` (já existe)
- ✅ `GET /assistenciatecnica/assistencias` (já existe)
- ✅ `GET /empreendimentos` (já existe)

---

### Fase 2: Expansão (2-3 semanas)

**Objetivo:** Funcionalidades completas de Financeiro e Cadastro

#### Tools a Implementar (8 tools)

7. **`luna_consultar_dados_cadastrais`**
8. **`luna_atualizar_dados_simples`**
9. **`luna_consultar_extrato_financeiro`**
10. **`luna_solicitar_negociacao`**
11. **`luna_verificar_status_pagamento`**
12. **`luna_listar_unidades_disponiveis`**
13. **`luna_simular_financiamento`**
14. **`luna_agendar_vistoria`**

**Integrações Necessárias:**
- Sistema de geração de boletos
- Portal do cliente (extrato)
- Agenda de vistorias

---

### Fase 3: Avançado (3-4 semanas)

**Objetivo:** Automações e integrações externas

#### Tools a Implementar (9 tools)

15. **`luna_criar_lead`**
16. **`luna_solicitar_alteracao_dados_sensiveis`**
17. **`luna_consultar_datas_disponiveis_vistoria`**
18. **`luna_consultar_status_chamado`**
19. **`luna_criar_atendimento_geral`** (já existe como `cvcrm_criar_atendimento`)
20. **`luna_transferir_para_humano`**

**Plus:**
- Resources (`luna://cliente/{cpf}/resumo`)
- Integração WhatsApp Business API
- Notificações automáticas
- Lembretes de vencimento/vistoria
- Dashboard de métricas

---

## 📋 Checklist de Desenvolvimento

### Preparação

- [ ] **Mapear endpoints faltantes** na API CV CRM
- [ ] **Verificar permissões** de acesso aos dados
- [ ] **Definir estrutura de dados** de parcelas/boletos
- [ ] **Confirmar fluxo** de agendamento de vistorias
- [ ] **Validar regras de negócio** com equipe CV CRM

### Desenvolvimento - Fase 1 (MVP)

#### Tool: luna_identificar_cliente
- [ ] Criar schema Zod
- [ ] Implementar handler
- [ ] Adicionar lógica de segmentação (VIP/Econômico)
- [ ] Testar com CPFs reais
- [ ] Documentar em `docs/04-MCP-TOOLS.md`

#### Tool: luna_consultar_parcelas
- [ ] Verificar endpoint API ⚠️ (pode precisar criar)
- [ ] Criar schema Zod
- [ ] Implementar cálculo de valores corrigidos
- [ ] Handler com formatação user-friendly
- [ ] Testar casos: sem parcelas, todas pagas, vencidas
- [ ] Documentar

#### Tool: luna_gerar_segunda_via_boleto
- [ ] Verificar endpoint API ⚠️ (pode precisar criar)
- [ ] Integração com sistema de boletos
- [ ] Implementar envio de email
- [ ] Validar geração de código de barras
- [ ] Testar
- [ ] Documentar

#### Tool: luna_criar_chamado_assistencia
- [ ] Usar endpoint existente `/assistenciatecnica/assistencia`
- [ ] Adicionar upload de fotos (base64)
- [ ] Gerar protocolo automático
- [ ] Handler com mensagem formatada
- [ ] Testar
- [ ] Documentar

#### Tool: luna_consultar_chamados
- [ ] Usar endpoint existente
- [ ] Filtros por situação
- [ ] Formatação do histórico
- [ ] Testar
- [ ] Documentar

#### Tool: luna_listar_empreendimentos_disponiveis
- [ ] Usar endpoint existente `/empreendimentos`
- [ ] Adicionar filtros
- [ ] Retornar links de catálogo
- [ ] Testar
- [ ] Documentar

### Desenvolvimento - Fase 2

- [ ] Implementar 8 tools da Fase 2
- [ ] Criar endpoints customizados se necessário
- [ ] Integrar sistemas externos
- [ ] Testes de integração

### Desenvolvimento - Fase 3

- [ ] Implementar 9 tools da Fase 3
- [ ] Integração WhatsApp
- [ ] Sistema de notificações
- [ ] Dashboard
- [ ] Testes E2E

---

## ⚠️ Desafios e Riscos

### 1. API CV CRM - Endpoints Faltantes

**Risco:** Endpoints de financeiro podem não existir ou não estarem documentados

**Mitigação:**
- Verificar documentação completa da API
- Contatar suporte CV CRM
- Implementar endpoints customizados se necessário
- Usar webhooks para dados em tempo real

### 2. Geração de Boletos

**Risco:** Sistema de boletos pode ser externo ao CV CRM

**Mitigação:**
- Identificar sistema usado (Banco, Gateway)
- Integração direta se possível
- Criar proxy/middleware se necessário

### 3. Agendamento de Vistorias

**Risco:** Pode não ter API de agenda disponível

**Mitigação:**
- Verificar se CV CRM tem módulo de agenda
- Integrar com Google Calendar ou similar
- Implementar sistema próprio de agenda

### 4. Integração WhatsApp

**Risco:** Complexidade de integrar MCP com WhatsApp Business API

**Mitigação:**
- Usar Twilio ou Meta Business API
- Criar camada intermediária (webhook server)
- Considerar plataformas prontas (Typebot, Botpress)

---

## 💡 Recomendações

### Arquitetura Sugerida para Luna Nova

```
WhatsApp ←→ Webhook Server ←→ MCP Server (Luna Nova Tools) ←→ CV CRM API
                ↓
          Redis Cache
                ↓
          Database (Logs, Sessões)
```

### Stack Tecnológica Adicional

- **WhatsApp:** Twilio API ou Meta Business API
- **Webhook Server:** Next.js API Routes (já temos!)
- **Cache:** Redis (já implementado)
- **Queue:** Bull/BullMQ para tarefas assíncronas
- **Storage:** S3/Cloudinary para fotos de assistência
- **Agenda:** Google Calendar API ou similar

### Organização do Código

```
src/lib/mcp/tools/
├── luna/                        # Tools específicos da Luna
│   ├── identificacao.ts         # luna_identificar_cliente
│   ├── financeiro.ts            # 5 tools de financeiro
│   ├── cadastro.ts              # 3 tools de cadastro
│   ├── assistencia.ts           # 5 tools de assistência
│   ├── comercial.ts             # 4 tools comercial
│   └── atendimento.ts           # Tools gerais
```

---

## 📊 Estimativa de Esforço

### Fase 1 - MVP (6 tools)
- **Desenvolvimento:** 40-60 horas
- **Testes:** 20 horas
- **Documentação:** 10 horas
- **Total:** ~80 horas (~2 semanas)

### Fase 2 - Expansão (8 tools)
- **Desenvolvimento:** 60-80 horas
- **Integrações:** 20 horas
- **Testes:** 20 horas
- **Total:** ~120 horas (~3 semanas)

### Fase 3 - Avançado (9 tools + integrações)
- **Desenvolvimento:** 60 horas
- **WhatsApp Integration:** 40 horas
- **Notificações:** 20 horas
- **Dashboard:** 30 horas
- **Testes E2E:** 30 horas
- **Total:** ~180 horas (~4-5 semanas)

**TOTAL GERAL:** ~380 horas (~9-10 semanas)

---

## 🎯 Próximo Passo Imediato

### AÇÃO REQUERIDA:

1. **Verificar API CV CRM:**
   - [ ] Acessar documentação completa: https://desenvolvedor.cvcrm.com.br
   - [ ] Listar TODOS os endpoints disponíveis
   - [ ] Identificar endpoints de financeiro
   - [ ] Verificar formato de dados de parcelas/boletos
   - [ ] Confirmar endpoints de agenda (se existir)

2. **Validar Requisitos:**
   - [ ] Reunir com equipe CV CRM
   - [ ] Confirmar dados disponíveis
   - [ ] Definir regras de negócio (negociação, agendamento)
   - [ ] Obter credenciais de acesso

3. **Iniciar Desenvolvimento MVP:**
   - [ ] Criar branch `feature/luna-nova-mvp`
   - [ ] Implementar `luna_identificar_cliente`
   - [ ] Testar integração
   - [ ] Avançar para próximos tools

---

## 📞 Contatos Necessários

- **Suporte CV CRM:** Para confirmar endpoints disponíveis
- **Equipe Financeiro:** Para regras de negociação e boletos
- **Equipe Assistência:** Para fluxo de agendamento
- **DevOps:** Para deploy e integrações

---

**Documento criado em:** 2025-11-01  
**Versão:** 1.0  
**Status:** 🟡 Aguardando validação de endpoints da API

