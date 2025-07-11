# 📚 Documentação - Routinely API

Bem-vindo à documentação completa da **Routinely API**, uma aplicação de gerenciamento de rotinas e atividades desenvolvida com tecnologias modernas e TypeScript.

## 🚀 Visão Geral

A **Routinely API** é uma API RESTful desenvolvida em **TypeScript** que permite aos usuários:
- Criar e gerenciar contas de usuário
- Fazer login com autenticação JWT
- Criar, editar, listar e deletar atividades
- Organizar atividades por categorias (Pessoal, Trabalho, Estudo, Saúde, Outro)

## 🛠️ Stack Tecnológica

### **Backend**
- **TypeScript** - Linguagem principal com tipagem estática
- **Node.js** - Runtime JavaScript
- **Fastify** - Framework web rápido e eficiente
- **Prisma** - ORM moderno para banco de dados
- **PostgreSQL** - Banco de dados relacional
- **JWT** - Autenticação baseada em tokens
- **bcrypt** - Criptografia de senhas
- **Jest** - Framework de testes unitários

### **Ferramentas de Desenvolvimento**
- **Docker** - Containerização da aplicação
- **GitHub Actions** - CI/CD automatizado
- **ESLint** - Linting de código
- **Prettier** - Formatação de código

## 📁 Estrutura da Documentação

### **📋 Documentação Técnica**
- [`technicalDetails.md`](./technicalDetails.md) - Detalhes técnicos da arquitetura
- [`frontendIntegration.md`](./frontendIntegration.md) - Guia de integração frontend-backend com TypeScript

### **🔧 Guias de Desenvolvimento**
- **Configuração do Ambiente** - Como configurar o projeto localmente
- **Executando Testes** - Como rodar a suíte de testes
- **Deploy** - Como fazer deploy da aplicação

## 🏗️ Arquitetura do Sistema

### **Padrão de Design**
- **Repository Pattern** - Separação entre lógica de negócio e acesso a dados
- **Use Case Pattern** - Organização da lógica de negócio
- **Middleware Pattern** - Interceptação de requisições
- **TypeScript Interfaces** - Contratos bem definidos entre camadas

### **Estrutura de Camadas**
```
┌─────────────────┐
│   Controllers   │ ← Rotas e validação de entrada
├─────────────────┤
│   Use Cases     │ ← Lógica de negócio
├─────────────────┤
│   Repository    │ ← Acesso a dados
├─────────────────┤
│   Database      │ ← PostgreSQL + Prisma
└─────────────────┘
```

## 🔐 Sistema de Autenticação

### **Fluxo de Autenticação**
1. **Signup** - Criação de conta com validação
2. **Login** - Autenticação com JWT
3. **Middleware** - Proteção de rotas
4. **Token Management** - Gerenciamento de sessão

### **Segurança**
- Senhas criptografadas com bcrypt
- Tokens JWT com expiração
- Validação de entrada em todas as rotas
- Headers de segurança configurados

## 📊 Modelo de Dados

### **Entidades Principais**
- **User** - Usuários do sistema
- **Activity** - Atividades/rotinas dos usuários

### **Relacionamentos**
- Um usuário pode ter múltiplas atividades
- Atividades pertencem a um usuário específico

## 🧪 Testes

### **Cobertura de Testes**
- **Testes Unitários** - Lógica de negócio isolada
- **Testes de Integração** - Fluxos completos
- **Mocks** - Banco de dados e dependências externas

### **Ferramentas de Teste**
- **Jest** - Framework principal
- **Supertest** - Testes de API
- **Prisma Mock** - Simulação do banco de dados

## 🚀 CI/CD

### **GitHub Actions**
- **Testes Automatizados** - Executados em cada push/PR
- **Validação de Código** - Linting e formatação
- **Build Verification** - Compilação TypeScript

### **Workflow**
```yaml
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - Setup Node.js
      - Install dependencies
      - Run tests
      - Validate TypeScript
```

## 📱 Integração Frontend

### **APIs Disponíveis**
- **POST /user** - Criação de usuário
- **POST /userLogin** - Login de usuário
- **GET /activities** - Listar atividades
- **POST /activities** - Criar atividade
- **PUT /activities/:id** - Editar atividade
- **DELETE /activities/:id** - Deletar atividade

### **Autenticação**
- Tokens JWT no header `Authorization: Bearer <token>`
- Rotas protegidas com middleware de autenticação
- Refresh automático de tokens

## 🔧 Configuração do Ambiente

### **Pré-requisitos**
- Node.js 18+
- PostgreSQL 12+
- Docker (opcional)

### **Variáveis de Ambiente**
```env
DATABASE_URL="postgresql://user:password@localhost:5432/routinely"
JWT_SECRET="your-secret-key"
PORT=3000
```

### **Comandos de Desenvolvimento**
```bash
# Instalar dependências
npm install

# Executar em desenvolvimento
npm run dev

# Executar testes
npm test

# Build para produção
npm run build

# Executar com Docker
docker-compose up
```

## 📈 Roadmap

### **Funcionalidades Futuras**
- [ ] Sistema de notificações
- [ ] Relatórios e analytics
- [ ] API para mobile apps
- [ ] Integração com calendários
- [ ] Sistema de tags para atividades
- [ ] Backup automático de dados

### **Melhorias Técnicas**
- [ ] Cache com Redis
- [ ] Rate limiting
- [ ] Documentação OpenAPI/Swagger
- [ ] Logs estruturados
- [ ] Métricas de performance

## 🤝 Contribuição

### **Como Contribuir**
1. Fork do repositório
2. Criar branch para feature
3. Implementar com TypeScript
4. Adicionar testes
5. Fazer pull request

### **Padrões de Código**
- **TypeScript** - Tipagem estática obrigatória
- **ESLint** - Regras de linting
- **Prettier** - Formatação automática
- **Conventional Commits** - Padrão de commits

## 📞 Suporte

### **Canais de Ajuda**
- **Issues** - Reportar bugs ou solicitar features
- **Documentação** - Guias detalhados
- **Exemplos** - Código de exemplo para integração

---

**Routinely API** - Organize suas rotinas de forma inteligente! 🎯

*Desenvolvido com TypeScript, Fastify e PostgreSQL* 