import { MetodsDatabase } from "../database/repository";
import { IActivity, ICreate, ICreateActivity, ILogin, IResponseLogin } from "../interfaces/interfaces";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';
import { z } from 'zod'



export class Usecases {

    private repositorie: MetodsDatabase;

    constructor() {
        this.repositorie = new MetodsDatabase();
    }


    async create (data:ICreate) {

        const createSchema = z.object({
            name: z.string().max(20, {message: 'The name must have a maximum of 20 characters'}),
            email: z.string().email({message: 'Invalid email format'}),
            password: z.string().min(4, {message: 'Password must have at least 4 characters'})
        })

        const _data = createSchema.safeParse(data);

        if (!_data.success) {
            throw new Error(JSON.stringify(_data.error.format()));
        }

        const user = await this.repositorie.getUserByEmail(_data.data.email);

        if (user) {
            throw new Error('This email is already registered!');
        }

        const hashedPassword = await bcrypt.hash(data.password, 10);

        const responseDataBase = await this.repositorie.create({
            ..._data.data,
            password: hashedPassword
        });

        if (!process.env.JWT_SECRET) {
            throw new Error('JWT_SECRET is not defined in environment variables');
        }
        const token = jwt.sign(
            { userId: responseDataBase.id, email: responseDataBase.email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        const { password, ...userWithoutPassword } = responseDataBase;

        return {
            user: userWithoutPassword,
            token,
        };
    }

    async Login (data: ILogin): Promise<IResponseLogin> {

        const loginUser = z.object({
            email: z.string().email({message: 'Invalid email format'}),
            password: z.string().min(4, {message: 'Password must have at least 4 characters'})
        });

        const _data = loginUser.safeParse(data);

        if(!_data.success) { throw new Error(JSON.stringify(_data.error.format()));};

        const user = await this.repositorie.getUserByEmail(_data.data.email);

        if (!user) {
            throw new Error('User not found!');
        }

        const isPasswordCorrect = await bcrypt.compare(_data.data.password, user.password);

        if (!isPasswordCorrect) {
            throw new Error('Incorrect password');
        }

        if (!process.env.JWT_SECRET) {
            throw new Error('JWT_SECRET is not defined in environment variables');
        }
        const token = jwt.sign(
            { userId: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
          );


        return { token };

    };

    async Activities (userId: string, date?: string, startDate?: string, endDate?: string): Promise<IActivity[]> {
        const activitiesUser = z.object({userId: z.string({message: 'UserId not found!'})});
        const parsed = activitiesUser.safeParse({ userId });

        if (!parsed.success) {
            throw new Error(JSON.stringify(parsed.error.format()));
        }

        const activities = await this.repositorie.getAllByUserId(parsed.data.userId, date, startDate, endDate);

        return activities;
    };

    async CreateActivitie (data: ICreateActivity, userId: string) {

        const createActivitySchema = z.object({
            title: z.string().min(1),
            description: z.string().optional(),
            type: z.enum(['PESSOAL', 'TRABALHO', 'ESTUDO', 'SAUDE', 'OUTRO']),
            startTime: z.string(),
            endTime: z.string()
        });
        
        const userIdSchema = z.string({ message: 'UserId not found!' });
        
        const _activitie = createActivitySchema.safeParse(data);
        const _userId = userIdSchema.safeParse(userId);
        
        if (!_activitie.success) {
            throw new Error(JSON.stringify(_activitie.error.format()));
        }
        
        if (!_userId.success) {
        throw new Error(JSON.stringify(_userId.error.format()));
        }
        
        const activities = await this.repositorie.createByActivitie(
            _activitie.data,
            _userId.data
        );
          
        return activities;
    }

    async updateActivity (userId: string, activityId: string, updateDate:ICreateActivity) {
        const updateActivitySchema = z.object({
            userId: z.string(),
            activityId: z.string()
        });

        const _updateActivity = updateActivitySchema.safeParse({userId, activityId});

        if(!_updateActivity.success) { throw new Error(JSON.stringify(_updateActivity.error.format()));}


        const activity = await this.repositorie.getById(_updateActivity.data.activityId, _updateActivity.data.userId);

        if (!activity || activity.userId !== userId) {
            throw new Error('user or activity not found!');
        };


        const update = await this.repositorie.updateActivity(updateDate, _updateActivity.data.activityId,)


        return update;

    };

    async deleteActivitie (userId: string, activityId: string) {
        const updateActivitySchema = z.object({
            userId: z.string(),
            activityId: z.string()
        });

        const _updateActivity = updateActivitySchema.safeParse({userId, activityId});
        if(!_updateActivity.success) { throw new Error(JSON.stringify(_updateActivity.error.format()));}

        const activity = await this.repositorie.getById(_updateActivity.data.activityId, _updateActivity.data.userId);

        if (!activity || activity.userId !== userId) {
            throw new Error('user or activity not found!');
        };

        const deleteActivitie = await this.repositorie.deleteActivities(_updateActivity.data.activityId);

        return deleteActivitie;
    }
}