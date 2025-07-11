# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Versionamento Semântico](https://semver.org/lang/pt-BR/).

## [1.1.0] - 2025-07-11

### ✨ Adicionado
- **Gestão completa de perfil do usuário**
  - Endpoint `GET /user/profile` - Buscar perfil do usuário
  - Endpoint `PUT /user/profile` - Atualizar perfil (nome, avatar, preferências)
  - Endpoint `GET /user/stats` - Estatísticas do usuário
  - Endpoint `PUT /user/password` - Alterar senha

- **Campos expandidos no modelo de usuário**
  - Campo `avatar` (opcional) - URL do avatar do usuário
  - Campo `preferences` (opcional) - Preferências do usuário (tema, idioma, notificações)

- **Melhorias na autenticação**
  - Login agora retorna dados completos do usuário junto com o token
  - Validação melhorada com Zod

- **Documentação completa**
  - Documentação técnica atualizada
  - Exemplos de integração frontend-backend
  - Guias de uso para todos os endpoints

### 🔧 Corrigido
- **Endpoints de atividades**
  - Corrigido método `createActivity` → `CreateActivitie`
  - Corrigido método `deleteActivity` → `deleteActivitie`
  - Corrigida ordem de parâmetros no `updateActivity`

- **Validações**
  - Validação de perfil menos restritiva (nome mínimo 1 caractere)
  - Avatar não requer mais URL válida obrigatória

- **Dependências**
  - Adicionado Zod para validação de schemas
  - Corrigidas dependências faltantes

### 🧪 Testado
- **Todos os endpoints funcionais**
  - ✅ Cadastro e login de usuário
  - ✅ Gestão completa de perfil
  - ✅ CRUD completo de atividades
  - ✅ Estatísticas do usuário
  - ✅ Alteração de senha

### 📚 Documentação
- README.md atualizado com novos endpoints
- Documentação técnica completa em `/doc`
- Exemplos de integração frontend-backend
- Guias de uso para todas as funcionalidades

## [1.0.0] - 2025-07-11

### ✨ Lançamento inicial
- Autenticação JWT
- CRUD básico de atividades
- Banco de dados PostgreSQL com Prisma
- Framework Fastify com TypeScript 