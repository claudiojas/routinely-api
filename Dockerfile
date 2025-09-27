# Estágio de build
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install --production

COPY . .

ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL

# Execute o prisma generate APÓS copiar o código e antes do build da aplicação
RUN npx prisma generate

RUN npm run build

# Estágio de produção
FROM node:20-alpine AS production

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY package.json ./

# Variáveis de ambiente para o Prisma
# O Prisma precisa das variáveis de ambiente no runtime para se conectar ao banco de dados.
# No Google Cloud, você passará essas variáveis de ambiente diretamente para o serviço de deploy (ex: Cloud Run).
# Não inclua o arquivo .env diretamente na imagem por questões de segurança.

EXPOSE 3000

CMD ["npm", "run", "start"]
