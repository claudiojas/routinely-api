FROM node:lts-alpine AS base

#---------

FROM base AS deps
WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev

#---------

FROM base AS runner
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 api
RUN chown api:nodejs .

COPY --chown=api:nodejs . .
COPY --from=deps /app/node_modules ./node_modules

RUN npx prisma generate

USER api

EXPOSE 3333
ENV PORT=3333
ENV HOSTNAME="0.0.0.0"

ENTRYPOINT ["npm", "run", "dev"]
