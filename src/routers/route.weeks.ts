import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from '../prisma/prisma.config';
import { authenticate } from '../middlewares/middleware';

export async function weekRoutes(app: FastifyInstance) {
  // Listar todas as semanas do usuário
  app.get('/weeks', { preHandler: authenticate }, async (request: any, reply) => {
    const userId = request.user.id;
    const weeks = await prisma.week.findMany({
      where: { userId },
      orderBy: { startDate: 'desc' },
    });
    return reply.send({ data: weeks });
  });

  // Criar nova semana
  app.post('/weeks', { preHandler: authenticate }, async (request: any, reply) => {
    const userId = request.user.id;
    const bodySchema = z.object({
      startDate: z.string().datetime(),
      endDate: z.string().datetime(),
      weekNumber: z.number().int().positive(),
    });
    const parse = bodySchema.safeParse(request.body);
    if (!parse.success) {
      return reply.status(400).send({ error: parse.error.format() });
    }
    const { startDate, endDate, weekNumber } = parse.data;
    if (new Date(startDate) >= new Date(endDate)) {
      return reply.status(400).send({ error: 'startDate deve ser menor que endDate' });
    }
    const week = await prisma.week.create({
      data: {
        userId,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        weekNumber,
      },
    });
    return reply.status(201).send({ data: week });
  });

  // Editar semana
  app.put('/weeks/:id', { preHandler: authenticate }, async (request: any, reply) => {
    const userId = request.user.id;
    const { id } = request.params;
    const bodySchema = z.object({
      startDate: z.string().datetime().optional(),
      endDate: z.string().datetime().optional(),
      weekNumber: z.number().int().positive().optional(),
      isActive: z.boolean().optional(),
      isCompleted: z.boolean().optional(),
    });
    const parse = bodySchema.safeParse(request.body);
    if (!parse.success) {
      return reply.status(400).send({ error: parse.error.format() });
    }
    const week = await prisma.week.findUnique({ where: { id } });
    if (!week || week.userId !== userId) {
      return reply.status(404).send({ error: 'Semana não encontrada' });
    }
    const updateData: any = { ...parse.data };
    if (updateData.startDate) updateData.startDate = new Date(updateData.startDate);
    if (updateData.endDate) updateData.endDate = new Date(updateData.endDate);
    const updated = await prisma.week.update({
      where: { id },
      data: updateData,
    });
    return reply.send({ data: updated });
  });

  // Remover semana
  app.delete('/weeks/:id', { preHandler: authenticate }, async (request: any, reply) => {
    const userId = request.user.id;
    const { id } = request.params;
    const week = await prisma.week.findUnique({ where: { id } });
    if (!week || week.userId !== userId) {
      return reply.status(404).send({ error: 'Semana não encontrada' });
    }
    await prisma.week.delete({ where: { id } });
    return reply.send({ message: 'Semana removida com sucesso' });
  });

  // (Opcional) Finalizar semana
  app.patch('/weeks/:id/complete', { preHandler: authenticate }, async (request: any, reply) => {
    const userId = request.user.id;
    const { id } = request.params;
    const week = await prisma.week.findUnique({ where: { id } });
    if (!week || week.userId !== userId) {
      return reply.status(404).send({ error: 'Semana não encontrada' });
    }
    const updated = await prisma.week.update({
      where: { id },
      data: {
        isActive: false,
        isCompleted: true,
        completedAt: new Date(),
      },
    });
    return reply.send({ data: updated });
  });

  // (Opcional) Listar últimas 4 semanas finalizadas
  app.get('/weeks/completed', { preHandler: authenticate }, async (request: any, reply) => {
    const userId = request.user.id;
    const limit = Number((request.query as any).limit) || 4;
    const weeks = await prisma.week.findMany({
      where: { userId, isCompleted: true },
      orderBy: { completedAt: 'desc' },
      take: limit,
    });
    return reply.send({ data: weeks });
  });

  // (Opcional) Finalizar semanas expiradas automaticamente
  app.get('/weeks/check-expired', { preHandler: authenticate }, async (request: any, reply) => {
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
    return reply.send({ finalized: updatedWeeks.length, weeks: updatedWeeks });
  });
} 