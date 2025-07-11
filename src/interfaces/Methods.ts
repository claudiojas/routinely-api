import { IActivity, ICreate, ILogin, IResponseCreate, IResponseLogin, IUser, IUpdateProfile, IChangePassword, IUserStats } from "./interfaces"

export interface IMetodsUser {
    create(data:ICreate):Promise<IResponseCreate>
    getUserByEmail(email: string): Promise<IResponseCreate | null> 
    getAllByUserId(userId: string): Promise<IActivity[]>
    // ✅ NOVOS: Métodos para gerenciamento de usuário
    getUserById(userId: string): Promise<IUser | null>
    updateUser(userId: string, data: IUpdateProfile): Promise<IUser>
    deleteUser(userId: string): Promise<void>
    changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void>
    getUserStats(userId: string): Promise<IUserStats>
}