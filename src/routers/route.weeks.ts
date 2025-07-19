import { FastifyInstance, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { prisma } from '../prisma/prisma.config';
import { authenticate } from '../middlewares/middleware';

export default async function weekRoutes(fastify: FastifyInstance) {
  // Listar todas as semanas do usuário
  fastify.get('/api/weeks', { preHandler: [authenticate] }, async (request: any, reply) => {
    const userId = request.user.id;
    const weeks = await prisma.week.findMany({
      where: { userId },
      orderBy: { startDate: 'desc' },
    });
    return weeks;
  });

  // Criar nova semana
  fastify.post('/api/weeks', { preHandler: [authenticate] }, async (request: any, reply) => {
    const userId = request.user.id;
    const bodySchema = z.object({
      startDate: z.string().datetime(),
      endDate: z.string().datetime(),
      weekNumber: z.number().int(),
    });
    const { startDate, endDate, weekNumber } = bodySchema.parse(request.body);
    const week = await prisma.week.create({
      data: {
        userId,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        weekNumber,
      },
    });
    return reply.code(201).send(week);
  });

  // Finalizar semana
  fastify.patch('/api/weeks/:id/complete', { preHandler: [authenticate] }, async (request: any, reply) => {
    const userId = request.user.id;
    const { id } = request.params;
    const week = await prisma.week.findUnique({ where: { id } });
    if (!week || week.userId !== userId) {
      return reply.code(404).send({ error: 'Semana não encontrada' });
    }
    const updated = await prisma.week.update({
      where: { id },
      data: {
        isActive: false,
        isCompleted: true,
        completedAt: new Date(),
      },
    });
    return updated;
  });

  // Listar últimas 4 semanas finalizadas
  fastify.get('/api/weeks/completed', { preHandler: [authenticate] }, async (request: any, reply) => {
    const userId = request.user.id;
    const limit = Number((request.query as any).limit) || 4;
    const weeks = await prisma.week.findMany({
      where: { userId, isCompleted: true },
      orderBy: { completedAt: 'desc' },
      take: limit,
    });
    return weeks;
  });

  // Finalizar semanas expiradas automaticamente
  fastify.get('/api/weeks/check-expired', { preHandler: [authenticate] }, async (request: any, reply) => {
    const userId = request.user.id;
    const now = new Date();
    const expiredWeeks = await prisma.week.findMany({
      where: {
        userId,
        isActive: true,
        endDate: { lt: now },
      },
    });
    const updatedWeeks = await Promise.all(
      expiredWeeks.map(week =>
        prisma.week.update({
          where: { id: week.id },
          data: { isActive: false, isCompleted: true, completedAt: now },
        })
      )
    );
    return { finalized: updatedWeeks.length, weeks: updatedWeeks };
  });
} 