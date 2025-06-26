# 🚀 API-MODEL

Modelo de servidor backend com **Node.js**, **TypeScript**, **Fastify** e **Prisma**, pronto para ser reutilizado em novos projetos. 

## 📦 Tecnologias

- [Node.js](https://nodejs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Fastify](https://www.fastify.io/)
- [Prisma ORM](https://www.prisma.io/)
- [ESLint + Prettier](https://eslint.org/)

## 📁 Estrutura básica

API-MODEL/
├── prisma/
│ └── schema.prisma # Modelo do banco de dados
├── src/
│ ├── server.ts # Inicialização do servidor Fastify
│ ├── routes/ # Rotas da aplicação
│ └── controllers/ # Controladores (handlers)
├── .env # Variáveis de ambiente
├── package.json
├── tsconfig.json
└── README.md


## ⚙️ Como usar

### 1. Clone o projeto

```bash
git clone https://github.com/seu-usuario/API-MODEL.git
cd API-MODEL
```

### Instale as dependências
```bush
npm install
```

### Configure o banco de dados

Atualize o arquivo .env com sua conexão:
```bush
DATABASE_URL="file:./dev.db" # ou PostgreSQL, MySQL etc.
```

### Inicialize o Prisma
```bash
npx prisma generate
npx prisma migrate dev --name init
```

### Inicie o servidor
```bash
npm run dev
```

#### Feito para ser um ponto de partida rápido e reutilizável. Fork it, clone it e comece a criar! 🚀
