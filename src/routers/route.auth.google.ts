import { FastifyInstance } from 'fastify';
import { OAuth2Client } from 'google-auth-library';
import { prisma } from '../prisma/prisma.config';
import jwt from 'jsonwebtoken';

const client = new OAuth2Client({
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  redirectUri: process.env.GOOGLE_REDIRECT_URI,
});

export default async function googleAuthRoutes(fastify: FastifyInstance) {
  // Rota para redirecionar para o Google
  fastify.get('/api/auth/google', async (request, reply) => {
    const params = new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID!,
      redirect_uri: process.env.GOOGLE_REDIRECT_URI!,
      response_type: 'code',
      scope: [
        'openid',
        'email',
        'profile',
        'https://www.googleapis.com/auth/calendar',
      ].join(' '),
      access_type: 'offline',
      prompt: 'consent',
    });
    reply.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`);
  });

  // Rota de callback do Google
  fastify.get('/api/auth/google/callback', async (request, reply) => {
    const { code } = request.query as { code?: string };
    if (!code) {
      return reply.status(400).send({ error: 'Código não informado pelo Google.' });
    }
    try {
      // Trocar code por tokens
      const { tokens } = await client.getToken(code);
      if (!tokens.id_token || !tokens.access_token) {
        return reply.status(400).send({ error: 'Tokens não recebidos do Google.' });
      }
      // Decodificar o id_token para pegar dados do usuário
      const ticket = await client.verifyIdToken({
        idToken: tokens.id_token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();
      if (!payload || !payload.email) {
        return reply.status(400).send({ error: 'Dados do usuário não recebidos do Google.' });
      }
      // Buscar ou criar usuário no banco
      let user = await prisma.user.findUnique({ where: { email: payload.email } });

      if (!user) {
        user = await prisma.user.create({
          data: {
            name: payload.name || 'Usuário Google',
            email: payload.email,
            avatar: payload.picture,
            googleId: payload.sub,
            googleAccessToken: tokens.access_token,
            googleRefreshToken: tokens.refresh_token,
          },
        });
      } else {
        // Atualizar tokens e dados
        user = await prisma.user.update({
          where: { id: user.id },
          data: {
            name: payload.name || user.name,
            avatar: payload.picture || user.avatar,
            googleId: payload.sub,
            googleAccessToken: tokens.access_token,
            googleRefreshToken: tokens.refresh_token || user.googleRefreshToken,
          },
        });
      }
      // Gerar JWT da aplicação
      const appJwt = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET || 'default_secret', { expiresIn: '7d' });
      // Redirecionar para o frontend com o token (pode ser cookie seguro ou query param)
      reply.redirect(`${process.env.GOOGLE_REDIRECT_URI_FRONTEND || 'http://localhost:5173'}/auth/callback?token=${appJwt}`);
    } catch (err) {
      reply.status(500).send({ error: 'Erro ao autenticar com Google', details: (err as Error).message });
    }
  });
} 