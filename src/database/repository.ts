import { IActivity, ICreate, ICreateActivity, IResponseCreate } from "../interfaces/interfaces";
import { IMetodsUser } from "../interfaces/Methods";
import { prisma } from "../prisma/prisma.config";

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

    async getAllByUserId(userId: string): Promise<IActivity[]> {
      const activities = await prisma.activity.findMany({
        where: { userId },
        orderBy: { startTime: 'asc' },
      });
    
      return activities.map(activity => ({
        id: activity.id,
        userId: activity.userId,
        title: activity.title,
        description: activity.description,
        type: activity.type,
        startTime: activity.startTime,
        endTime: activity.endTime,
        createdAt: activity.createdAt,
        updatedAt: activity.updatedAt,
      }));
    };

    async createByActivitie (data: ICreateActivity, userId: string) {

      const newActivity = await prisma.activity.create({
        data: {
          title: data.title,
          description: data.description,
          type: data.type,
          startTime: data.startTime,
          endTime: data.endTime,
          userId
        }
      });

      return newActivity;
    }
      
}   