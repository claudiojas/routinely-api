# 🚀 Routinely API v1.2.0

Uma API RESTful moderna desenvolvida em **TypeScript** para gerenciamento de rotinas e atividades diárias.

## 📋 Sobre o Projeto

A **Routinely API** é uma aplicação backend que permite aos usuários:
- ✅ Criar e gerenciar contas de usuário
- ✅ Fazer login com autenticação JWT segura
- ✅ Gerenciar perfil de usuário (avatar, preferências)
- ✅ Consultar estatísticas pessoais
- ✅ Alterar senha de forma segura
- ✅ Criar, editar, listar e deletar atividades
- ✅ Organizar atividades por categorias (Pessoal, Trabalho, Estudo, Saúde, Outro)

## 🛠️ Stack Tecnológica

### **Backend**
- **TypeScript** - Linguagem principal com tipagem estática
- **Node.js** - Runtime JavaScript
- **Fastify** - Framework web rápido e eficiente
- **Prisma** - ORM moderno para banco de dados
- **PostgreSQL** - Banco de dados relacional
- **JWT** - Autenticação baseada em tokens
- **bcrypt** - Criptografia de senhas

### **Ferramentas de Desenvolvimento**
- **Jest** - Framework de testes unitários
- **Docker** - Containerização da aplicação
- **GitHub Actions** - CI/CD automatizado
- **ESLint** - Linting de código
- **Prettier** - Formatação de código

## 🚀 Início Rápido

### **Pré-requisitos**
- Node.js 18+
- PostgreSQL 12+
- Docker (opcional)

### **Instalação**

1. **Clone o repositório**
```bash
git clone https://github.com/seu-usuario/routinely-api.git
cd routinely-api
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure as variáveis de ambiente**
```bash
cp .env.example .env
# Edite o arquivo .env com suas configurações
```

4. **Configure o banco de dados**
```bash
# Execute as migrações
npm run db:migrate

# Gere o cliente Prisma
npm run db:generate
```

5. **Execute a aplicação**
```bash
# Desenvolvimento
npm run dev

# Produção
npm run build
npm start
```

### **Com Docker**
```bash
# Execute com Docker Compose
docker-compose up

# Ou construa a imagem
docker build -t routinely-api .
docker run -p 3000:3000 routinely-api
```

## 📡 Endpoints da API

### **Autenticação**
```http
POST /user
Content-Type: application/json

{
  "name": "João Silva",
  "email": "joao@email.com",
  "password": "123456"
}
```

```http
POST /userLogin
Content-Type: application/json

{
  "email": "joao@email.com",
  "password": "123456"
}
```

### **Perfil do Usuário (Protegidos)**
```http
GET /user/profile
Authorization: Bearer <token>
```

```http
PUT /user/profile
Authorization: Bearer <token>
Content-Type: application/json

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

### **Estatísticas do Usuário**
```http
GET /user/stats
Authorization: Bearer <token>
```

### **Gerenciamento de Senha**
```http
PUT /user/password
Authorization: Bearer <token>
Content-Type: application/json

{
  "currentPassword": "senha_atual",
  "newPassword": "nova_senha"
}
```

### **Atividades (Protegidas)**
```http
GET /activities
Authorization: Bearer <token>

POST /activities
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Reunião de equipe",
  "description": "Discussão sobre novos projetos",
  "type": "TRABALHO",
  "startTime": "09:00",
  "endTime": "10:00",
  "date": "2024-01-15"
}

PUT /activities/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Reunião atualizada",
  "description": "Nova descrição",
  "type": "TRABALHO",
  "startTime": "09:30",
  "endTime": "10:30",
  "date": "2024-01-15"
}

DELETE /activities/:id
Authorization: Bearer <token>
```

## 🧪 Testes

### **Executar Testes**
```bash
# Todos os testes
npm test

# Testes em modo watch
npm run test:watch

# Cobertura de testes
npm run test:coverage
```

### **Estrutura de Testes**
- **Testes Unitários** - Lógica de negócio isolada
- **Testes de Integração** - Fluxos completos
- **Mocks** - Banco de dados e dependências externas

## 🔧 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev          # Executa em modo desenvolvimento
npm run build        # Compila TypeScript
npm start           # Executa em produção

# Testes
npm test            # Executa todos os testes
npm run test:watch  # Executa testes em modo watch
npm run test:coverage # Executa testes com cobertura

# Banco de dados
npm run db:migrate  # Executa migrações
npm run db:generate # Gera cliente Prisma
npm run db:studio   # Abre Prisma Studio

# Docker
docker-compose up   # Executa com Docker Compose
```

## 📊 Modelo de Dados

### **Entidades**
- **User** - Usuários do sistema com perfil completo
- **Activity** - Atividades/rotinas dos usuários

### **Campos do Usuário**
- `id` - Identificador único
- `name` - Nome do usuário
- `email` - Email único
- `password` - Senha criptografada
- `avatar` - URL do avatar (opcional)
- `preferences` - Preferências do usuário (opcional)
- `createdAt` - Data de criação
- `updatedAt` - Data de atualização

### **Relacionamentos**
- Um usuário pode ter múltiplas atividades
- Atividades pertencem a um usuário específico

## 🔐 Segurança

### **Implementado**
- ✅ Senhas criptografadas com bcrypt
- ✅ Tokens JWT com expiração
- ✅ Validação de entrada em todas as rotas
- ✅ Headers de segurança configurados
- ✅ CORS configurado adequadamente

### **Próximas Implementações**
- 🔄 Rate limiting
- 🔄 HTTPS em produção
- 🔄 Logs de auditoria
- 🔄 Sanitização avançada de dados

## 🐳 Docker

### **Docker Compose**
```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://user:password@db:5432/routinely
    depends_on:
      - db

  db:
    image: postgres:15
    environment:
      - POSTGRES_DB=routinely
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=password
    ports:
      - "5432:5432"
```

## 📈 CI/CD

### **GitHub Actions**
- ✅ Testes automatizados em cada push/PR
- ✅ Validação de código TypeScript
- ✅ Build verification
- ✅ Cobertura de testes

## 📚 Documentação

### **Documentação Técnica**
- [`doc/README.md`](./doc/README.md) - Visão geral da documentação
- [`doc/technicalDetails.md`](./doc/technicalDetails.md) - Detalhes técnicos da implementação
- [`doc/frontendIntegration.md`](./doc/frontendIntegration.md) - Guia de integração frontend-backend com TypeScript
- [`doc/userDataAPI.md`](./doc/userDataAPI.md) - Documentação completa dos dados do usuário

## 🤝 Contribuição

### **Como Contribuir**
1. Fork do repositório
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

### **Padrões de Código**
- **TypeScript** - Tipagem estática obrigatória
- **ESLint** - Regras de linting
- **Prettier** - Formatação automática
- **Conventional Commits** - Padrão de commits

## 📞 Suporte

### **Canais de Ajuda**
- **Issues** - Reportar bugs ou solicitar features
- **Documentação** - Guias detalhados em `/doc`
- **Exemplos** - Código de exemplo para integração

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🔮 Roadmap

### **Funcionalidades Futuras**
- [ ] Sistema de notificações
- [ ] Relatórios e analytics avançados
- [ ] API para mobile apps
- [ ] Integração com calendários
- [ ] Sistema de tags para atividades
- [ ] Backup automático de dados
- [ ] Autenticação social (Google, Facebook)
- [ ] Recuperação de senha por email

### **Melhorias Técnicas**
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
