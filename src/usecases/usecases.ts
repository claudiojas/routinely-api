import { MetodsDatabase } from "../database/repository";
import { IActivity, ICreate, ICreateActivity, ILogin, IResponseLogin, IUser, IUpdateProfile, IChangePassword, IUserStats } from "../interfaces/interfaces";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';
import { z, ZodAny } from 'zod'

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

        // ✅ MELHORIA: Retornar dados do usuário no login
        const userProfile = await this.repositorie.getUserById(user.id);
        const { password, ...userWithoutPassword } = user;

        return { 
            token,
            user: userProfile || userWithoutPassword
        };
    }

    // ✅ NOVO: Buscar perfil do usuário
    async getUserProfile(userId: string): Promise<IUser> {
        const user = await this.repositorie.getUserById(userId);
        
        if (!user) {
            throw new Error('Usuário não encontrado');
        }

        return user;
    }

    // ✅ NOVO: Atualizar perfil do usuário
    async updateUserProfile(userId: string, data: IUpdateProfile): Promise<IUser> {
        const updateSchema = z.object({
            name: z.string().min(1).max(50).optional(),
            email: z.string().email().optional(),
            avatar: z.string().optional(),
            preferences: z.object({
                theme: z.enum(['light', 'dark', 'auto']).optional(),
                language: z.enum(['pt-BR', 'en-US', 'es']).optional(),
                notifications: z.boolean().optional(),
                timezone: z.string().optional(),
                dateFormat: z.string().optional()
            }).optional()
        });

        const _data = updateSchema.safeParse(data);

        if (!_data.success) {
            throw new Error(JSON.stringify(_data.error.format()));
        }

        // Verificar se email já existe (se estiver sendo atualizado)
        if (data.email) {
            const existingUser = await this.repositorie.getUserByEmail(data.email);
            if (existingUser && existingUser.id !== userId) {
                throw new Error('Email já está em uso');
            }
        }

        // Filtrar apenas campos definidos
        const updateData: IUpdateProfile = {};
        if (_data.data.name !== undefined) updateData.name = _data.data.name;
        if (_data.data.email !== undefined) updateData.email = _data.data.email;
        if (_data.data.avatar !== undefined) updateData.avatar = _data.data.avatar;
        if (_data.data.preferences !== undefined) {
            const prefs: any = {};
            if (_data.data.preferences.theme !== undefined) prefs.theme = _data.data.preferences.theme;
            if (_data.data.preferences.language !== undefined) prefs.language = _data.data.preferences.language;
            if (_data.data.preferences.notifications !== undefined) prefs.notifications = _data.data.preferences.notifications;
            if (_data.data.preferences.timezone !== undefined) prefs.timezone = _data.data.preferences.timezone;
            if (_data.data.preferences.dateFormat !== undefined) prefs.dateFormat = _data.data.preferences.dateFormat;
            updateData.preferences = prefs;
        }

        const updatedUser = await this.repositorie.updateUser(userId, updateData);
        return updatedUser;
    }

    // ✅ NOVO: Deletar conta do usuário
    async deleteUserProfile(userId: string): Promise<void> {
        const user = await this.repositorie.getUserById(userId);
        
        if (!user) {
            throw new Error('Usuário não encontrado');
        }

        await this.repositorie.deleteUser(userId);
    }

    // ✅ NOVO: Alterar senha
    async changeUserPassword(userId: string, data: IChangePassword): Promise<void> {
        const changePasswordSchema = z.object({
            currentPassword: z.string().min(4, { message: 'Senha atual deve ter pelo menos 4 caracteres' }),
            newPassword: z.string().min(4, { message: 'Nova senha deve ter pelo menos 4 caracteres' })
        });

        const _data = changePasswordSchema.safeParse(data);

        if (!_data.success) {
            throw new Error(JSON.stringify(_data.error.format()));
        }

        await this.repositorie.changePassword(userId, _data.data.currentPassword, _data.data.newPassword);
    }

    // ✅ NOVO: Estatísticas do usuário
    async getUserStats(userId: string): Promise<IUserStats> {
        const user = await this.repositorie.getUserById(userId);
        
        if (!user) {
            throw new Error('Usuário não encontrado');
        }

        const stats = await this.repositorie.getUserStats(userId);
        return stats;
    }

    async Activities (userId: string): Promise<IActivity[]> {
        const activitiesUser = z.object({userId: z.string({message: 'UserId not found!'})});
        const parsed = activitiesUser.safeParse({ userId });

        if (!parsed.success) {
            throw new Error(JSON.stringify(parsed.error.format()));
        }

        const activities = await this.repositorie.getAllByUserId(parsed.data.userId);

        return activities;
    }

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
        
        const activities = await this.repositorie.createActivity(
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

        const update = await this.repositorie.updateActivity(activityId, userId, updateDate);

        return update;
    }

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

        await this.repositorie.deleteActivity(activityId, userId);
    }
} 