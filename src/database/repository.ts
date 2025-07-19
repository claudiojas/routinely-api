import { IActivity, ICreate, ICreateActivity, IResponseCreate, IUser, IUpdateProfile, IUserStats } from "../interfaces/interfaces";
import { IMetodsUser } from "../interfaces/Methods";
import { prisma } from "../prisma/prisma.config";
import bcrypt from "bcryptjs";

export class MetodsDatabase implements IMetodsUser {
    async create(data: ICreate): Promise<IResponseCreate> {
        const user = await prisma.user.create({
            data: {
              name: data.name,
              email: data.email,
              password: data.password,
            },
        });

        return user;
    }

    async getUserByEmail(email: string): Promise<IResponseCreate | null> {
        const user = await prisma.user.findUnique({
          where: { email },
        });
      
        if (!user) return null;
      
        return user;
    }

    // ✅ NOVO: Buscar usuário por ID
    async getUserById(userId: string): Promise<IUser | null> {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                email: true,
                avatar: true,
                preferences: true,
                createdAt: true,
                updatedAt: true
            }
        });

        if (!user) return null;

        return {
            ...user,
            avatar: user.avatar || undefined,
            preferences: user.preferences ? JSON.parse(user.preferences as string) : undefined
        };
    }

    // ✅ NOVO: Atualizar usuário
    async updateUser(userId: string, data: IUpdateProfile): Promise<IUser> {
        const user = await prisma.user.update({
            where: { id: userId },
            data: {
                name: data.name,
                email: data.email,
                avatar: data.avatar,
                preferences: data.preferences ? JSON.stringify(data.preferences) : undefined
            },
            select: {
                id: true,
                name: true,
                email: true,
                avatar: true,
                preferences: true,
                createdAt: true,
                updatedAt: true
            }
        });

        return {
            ...user,
            avatar: user.avatar || undefined,
            preferences: user.preferences ? JSON.parse(user.preferences as string) : undefined
        };
    }

    // ✅ NOVO: Deletar usuário
    async deleteUser(userId: string): Promise<void> {
        await prisma.user.delete({
            where: { id: userId }
        });
    }

    // ✅ NOVO: Alterar senha
    async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void> {
        const user = await prisma.user.findUnique({
            where: { id: userId }
        });

        if (!user) {
            throw new Error('Usuário não encontrado');
        }

        // Verificar senha atual
        const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
        
        if (!isCurrentPasswordValid) {
            throw new Error('Senha atual incorreta');
        }

        // Hash da nova senha
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        // Atualizar senha
        await prisma.user.update({
            where: { id: userId },
            data: { password: hashedNewPassword }
        });
    }

    // ✅ NOVO: Estatísticas do usuário
    async getUserStats(userId: string): Promise<IUserStats> {
      const activities = await prisma.activity.findMany({
            where: { userId }
        });

        const totalActivities = activities.length;
        const completedActivities = activities.filter(a => a.endTime < new Date().toISOString()).length;
        const pendingActivities = totalActivities - completedActivities;

        // Calcular horas totais
        const totalHours = activities.reduce((total, activity) => {
            const start = new Date(`2000-01-01T${activity.startTime}`);
            const end = new Date(`2000-01-01T${activity.endTime}`);
            const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
            return total + hours;
        }, 0);

        // Encontrar tipo de atividade favorito
        const activityTypes = activities.map(a => a.type);
        const favoriteActivityType = activityTypes.length > 0 
            ? activityTypes.sort((a, b) => 
                activityTypes.filter(v => v === a).length - 
                activityTypes.filter(v => v === b).length
              ).pop() || 'OUTRO'
            : 'OUTRO';

        // Streak days (simplificado - pode ser melhorado)
        const streakDays = Math.min(7, Math.floor(totalActivities / 3));

        return {
            totalActivities,
            completedActivities,
            pendingActivities,
            streakDays,
            totalHours: Math.round(totalHours),
            favoriteActivityType
        };
    }

    async getAllByUserId(userId: string, date?: string, startDate?: string, endDate?: string): Promise<IActivity[]> {
        const where: any = { userId };
        if (date) where.date = date;
        if (startDate && endDate) where.date = { gte: startDate, lte: endDate };
        const activities = await prisma.activity.findMany({
            where,
            orderBy: { startTime: 'asc' },
        });
        return activities;
    }

    async createActivity(data: ICreateActivity, userId: string): Promise<IActivity> {
        const activity = await prisma.activity.create({
        data: {
                userId,
          title: data.title,
          description: data.description,
          type: data.type,
          startTime: data.startTime,
          endTime: data.endTime,
                date: data.date,
            },
      });
        return activity;
    }

    async getById(activityId: string, userId: string) {
        const activity = await prisma.activity.findFirst({
        where: {
          id: activityId,
          userId,
        },
      });

        if (!activity) {
            throw new Error('Activity not found!');
        }

        return activity;
    }

    async updateActivity(activityId: string, userId: string, data: ICreateActivity): Promise<IActivity> {
        const activity = await prisma.activity.update({
            where: {
                id: activityId,
                userId,
            },
        data: {
                title: data.title,
                description: data.description,
                type: data.type,
                startTime: data.startTime,
                endTime: data.endTime,
                date: data.date,
        },
      });

        return activity;
    }

    async deleteActivity(activityId: string, userId: string): Promise<void> {
        await prisma.activity.delete({
            where: {
                id: activityId,
                userId,
            },
      });
    }
}   