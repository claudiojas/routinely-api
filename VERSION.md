# 🚀 Routinely API v1.1.0

## 📋 Resumo da Versão

A **Routinely API v1.1.0** representa uma evolução significativa da aplicação, adicionando funcionalidades avançadas de gestão de perfil do usuário e melhorando a experiência de desenvolvimento.

## ✨ Principais Novidades

### 👤 Gestão Completa de Perfil
- **Buscar perfil:** `GET /user/profile`
- **Atualizar perfil:** `PUT /user/profile` (nome, avatar, preferências)
- **Estatísticas:** `GET /user/stats` (atividades, sequência, horas)
- **Alterar senha:** `PUT /user/password`

### 🎨 Perfil Expandido
- **Avatar:** URL opcional para foto do usuário
- **Preferências:** Tema, idioma, notificações, fuso horário
- **Dados completos:** Login retorna perfil completo + token

### 🔧 Melhorias Técnicas
- **Validação robusta:** Zod para schemas
- **CRUD completo:** Atividades com edição e deleção funcionais
- **Documentação:** Guias completos de integração
- **Testes:** Todos os endpoints validados

## 🛠️ Stack Atualizada

### Backend
- **TypeScript** - Linguagem principal
- **Fastify** - Framework web
- **Prisma** - ORM moderno
- **PostgreSQL** - Banco de dados
- **JWT** - Autenticação
- **Zod** - Validação de schemas

### Funcionalidades
- ✅ **Autenticação segura** com JWT
- ✅ **Gestão de usuários** completa
- ✅ **CRUD de atividades** funcional
- ✅ **Perfil personalizado** com preferências
- ✅ **Estatísticas** do usuário
- ✅ **Documentação** completa

## 📊 Endpoints Disponíveis

### Autenticação
- `POST /user` - Cadastro
- `POST /userLogin` - Login

### Perfil do Usuário
- `GET /user/profile` - Buscar perfil
- `PUT /user/profile` - Atualizar perfil
- `GET /user/stats` - Estatísticas
- `PUT /user/password` - Alterar senha

### Atividades
- `GET /activities` - Listar atividades
- `POST /activities` - Criar atividade
- `PUT /activities/:id` - Editar atividade
- `DELETE /activities/:id` - Deletar atividade

## 🚀 Como Usar

```bash
# Instalar dependências
npm install

# Configurar ambiente
cp .env.example .env

# Executar migrações
npm run db:migrate

# Iniciar desenvolvimento
npm run dev
```

## 📚 Documentação

- **README.md** - Visão geral e início rápido
- **doc/README.md** - Índice da documentação
- **doc/userDataAPI.md** - Dados do usuário
- **doc/frontendIntegration.md** - Integração frontend
- **doc/technicalDetails.md** - Detalhes técnicos
- **CHANGELOG.md** - Histórico de mudanças

---

**Routinely API v1.1.0** - Organize suas rotinas de forma inteligente! 🎯 