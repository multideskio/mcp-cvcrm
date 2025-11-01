# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-11-01

### Added

#### Infraestrutura
- Configuração Next.js 14 com TypeScript
- Sistema de cache com Redis (Upstash)
- Sistema de logs com Pino
- Validação com Zod
- Configuração de ambiente com validação

#### Autenticação
- Sistema de autenticação CV CRM (2 etapas)
- Cache de tokens no Redis
- Renovação automática de tokens
- Suporte a código de verificação via env var

#### API Client
- Cliente completo da API CV CRM
- Tratamento de erros customizado
- Timeout e retry automático
- Validação de respostas

#### MCP Server
- Servidor MCP com stdio transport
- Sistema de tools extensível
- Sistema de resources
- Error handling robusto

#### Tools Implementados

**Atendimentos:**
- `cvcrm_criar_atendimento` - Cadastrar atendimento
- `cvcrm_listar_atendimentos` - Listar atendimentos

**Clientes:**
- `cvcrm_cadastrar_cliente` - Cadastrar cliente (PF/PJ)
- `cvcrm_buscar_clientes` - Buscar clientes

**Reservas:**
- `cvcrm_criar_reserva` - Criar reserva
- `cvcrm_listar_reservas` - Listar reservas
- `cvcrm_informar_venda` - Informar venda

#### Resources Implementados
- `cvcrm://auth/status` - Status de autenticação
- `cvcrm://empreendimentos` - Empreendimentos ativos
- `cvcrm://config` - Configuração do servidor

#### Documentação
- Documentação técnica completa em `docs/`
- README com instruções de uso
- Quick Start Guide
- Troubleshooting detalhado
- .cursorrules para desenvolvimento

### Development
- ESLint configurado
- Prettier configurado
- TypeScript strict mode
- Git ignore configurado

---

## [1.1.0] - 2025-11-01

### Added - Luna Nova Tools (MVP)

**6 novos tools para agente Luna Nova:**

#### Identificação
- `luna_identificar_cliente` - Identifica cliente por CPF e retorna unidades

#### Financeiro
- `luna_consultar_parcelas` - Consulta parcelas de pagamento
- `luna_gerar_segunda_via_boleto` - Gera segunda via de boleto

#### Assistência Técnica
- `luna_criar_chamado_assistencia` - Abre chamado de assistência
- `luna_consultar_chamados` - Lista chamados do cliente

#### Comercial
- `luna_listar_empreendimentos_disponiveis` - Lista empreendimentos com unidades

**Documentação:**
- `docs/06-LUNA-NOVA-TOOLS.md` - Especificação dos tools Luna
- `docs/LUNA-NOVA-TOOLS-NEEDED.md` - Lista completa de tools necessários
- `LUNA_NOVA_IMPLEMENTATION_PLAN.md` - Plano de implementação

**Melhorias:**
- Método `request()` público no CVCRMClient para tools customizados
- Types específicos para Luna Nova (`src/types/luna.ts`)
- Organização de tools em subpasta `luna/`

---

## [Unreleased]

### Planejado - Luna Nova Fase 2

#### Tools Cadastro
- `luna_consultar_dados_cadastrais`
- `luna_atualizar_dados_simples`

#### Tools Financeiro (expansão)
- `luna_consultar_extrato_financeiro`
- `luna_solicitar_negociacao`

#### Tools Assistência (expansão)
- `luna_agendar_vistoria`
- `luna_consultar_datas_disponiveis`

#### Features
- Webhook para receber código de verificação
- Dashboard web (Next.js)
- Métricas e monitoramento
- Rate limiting
- Testes unitários e E2E
- CI/CD com GitHub Actions

#### Melhorias
- Cache de dados de cadastro
- Paginação automática
- Retry em erros temporários
- Logs estruturados melhorados

