# 🚀 Routinely API

API RESTful moderna para gerenciamento de rotinas e atividades diárias, desenvolvida em **TypeScript** com Fastify, Prisma e PostgreSQL.

## 📋 Sobre o Projeto

A **Routinely API** permite:
- Gerenciar contas de usuário (cadastro, login, perfil, preferências)
- Criar, editar, listar, deletar e marcar atividades como concluídas
- Organizar atividades por categorias (Pessoal, Trabalho, Estudo, Saúde, Outro)
- Consultar estatísticas pessoais
- Segurança com autenticação JWT e senhas criptografadas

## 🛠️ Stack Tecnológica
- **TypeScript** | **Node.js** | **Fastify** | **Prisma** | **PostgreSQL**
- **JWT** | **bcrypt** | **Jest** | **Docker**

---

# 📡 Endpoints da API

## Autenticação e Usuário

### Criar Usuário
`POST /user`
```json
{
  "name": "João Silva",
  "email": "joao@email.com",
  "password": "123456"
}
```
**Resposta:**
```json
{
  "user": { "id": "...", "name": "João Silva", "email": "..." },
  "token": "<jwt>"
}
```

### Login
`POST /userLogin`
```json
{
  "email": "joao@email.com",
  "password": "123456"
}
```
**Resposta:**
```json
{
  "token": "<jwt>"
}
```

### Perfil do Usuário
`GET /user/profile`
- **Headers:** `Authorization: Bearer <token>`
- **Resposta:**
```json
{
  "data": {
    "id": "...",
    "name": "...",
    "email": "...",
    "avatar": "...",
    "preferences": { ... },
    ...
  }
}
```

### Atualizar Perfil
`PUT /user/profile`
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
```json
{
  "name": "Novo Nome",
  "avatar": "https://example.com/avatar.jpg",
  "preferences": {
    "theme": "dark",
    "language": "pt-BR",
    "notifications": true
  }
}
```
- **Resposta:**
```json
{
  "data": { ...perfil atualizado... }
}
```

### Estatísticas do Usuário
`GET /user/stats`
- **Headers:** `Authorization: Bearer <token>`
- **Resposta:**
```json
{
  "data": {
    "totalActivities": 10,
    "completedActivities": 5,
    "pendingActivities": 5,
    "streakDays": 3,
    "totalHours": 12,
    "favoriteActivityType": "TRABALHO"
  }
}
```

### Alterar Senha
`PUT /user/password`
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
```json
{
  "currentPassword": "senha_atual",
  "newPassword": "nova_senha"
}
```
- **Resposta:**
```json
{
  "message": "Senha alterada com sucesso"
}
```

---

## Atividades

### Listar Atividades
`GET /activities`
- **Headers:** `Authorization: Bearer <token>`
- **Query params (opcional):**
  - `date=YYYY-MM-DD` (filtra por data)
  - `startDate=YYYY-MM-DD&endDate=YYYY-MM-DD` (filtra por período)
- **Resposta:**
```json
{
  "data": [
    {
      "id": "...",
      "userId": "...",
      "title": "...",
      "description": "...",
      "type": "TRABALHO",
      "startTime": "09:00",
      "endTime": "10:00",
      "date": "2024-01-15",
      "completed": false,
      "createdAt": "...",
      "updatedAt": "..."
    }
  ]
}
```

### Criar Atividade
`POST /activities`
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
```json
{
  "title": "Reunião de equipe",
  "description": "Discussão sobre novos projetos",
  "type": "TRABALHO",
  "startTime": "09:00",
  "endTime": "10:00",
  "date": "2024-01-15"
}
```
- **Resposta:**
```json
{
  "data": { ...atividade criada... }
}
```

### Editar Atividade
`PUT /activities/:id`
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
```json
{
  "title": "Reunião atualizada",
  "description": "Nova descrição",
  "type": "TRABALHO",
  "startTime": "09:30",
  "endTime": "10:30",
  "date": "2024-01-15"
}
```
- **Resposta:**
```json
{
  "data": { ...atividade atualizada... }
}
```

### Deletar Atividade
`DELETE /activities/:id`
- **Headers:** `Authorization: Bearer <token>`
- **Resposta:**
```json
{
  "message": "Atividade deletada com sucesso"
}
```

### Marcar/Desmarcar Atividade como Concluída (Checklist)
`PATCH /activities/:activityId/toggle`
- **Headers:** `Authorization: Bearer <token>`
- **Resposta:**
```json
{
  "data": {
    "id": "...",
    "completed": true,
    ... // demais campos da atividade
  }
}
```

---

## 🧪 Testes

```bash
npm test            # Executa todos os testes
npm run test:watch  # Testes em modo watch
npm run test:coverage # Cobertura de testes
```

## 🔧 Scripts Disponíveis

```bash
npm run dev          # Desenvolvimento
npm run build        # Compila TypeScript
npm start            # Produção
npm run db:migrate   # Migrações Prisma
npm run db:generate  # Gera cliente Prisma
npm run db:studio    # Prisma Studio
```

## 📊 Modelo de Dados

### User
- `id`, `name`, `email`, `password`, `avatar`, `preferences`, `createdAt`, `updatedAt`

### Activity
- `id`, `userId`, `title`, `description`, `type`, `startTime`, `endTime`, `date`, `completed`, `createdAt`, `updatedAt`

## 🔐 Segurança
- Senhas criptografadas (bcrypt)
- Autenticação JWT
- Validação de entrada (Zod)
- CORS configurado

## 🐳 Docker
```bash
docker-compose up   # Sobe app e banco
```

## 📚 Documentação Técnica
- [`doc/technicalDetails.md`](./doc/technicalDetails.md)
- [`doc/frontendIntegration.md`](./doc/frontendIntegration.md)
- [`doc/userDataAPI.md`](./doc/userDataAPI.md)

---

# 🔮 Roadmap

### Funcionalidades Futuras
- [ ] Sistema de notificações
- [ ] Relatórios e analytics avançados
- [ ] API para mobile apps
- [ ] Integração com calendários
- [ ] Sistema de tags para atividades
- [ ] Backup automático de dados
- [ ] Autenticação social (Google, Facebook)
- [ ] Recuperação de senha por email

### Melhorias Técnicas
- [ ] Cache com Redis
- [ ] Rate limiting
- [ ] Documentação OpenAPI/Swagger
- [ ] Logs estruturados
- [ ] Métricas de performance
- [ ] Upload de arquivos para avatares
- [ ] Validação de email

---

**Routinely API** - Organize suas rotinas de forma inteligente! 🎯

*Desenvolvido com TypeScript, Fastify e PostgreSQL*
