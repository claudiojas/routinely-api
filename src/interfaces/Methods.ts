import { IActivity, ICreate, ILogin, IResponseCreate, IResponseLogin } from "./interfaces"

export interface IMetodsUser {
    create(data:ICreate):Promise<IResponseCreate>
    getUserByEmail(email: string): Promise<IResponseCreate | null> 
    getAllByUserId(userId: string): Promise<IActivity[]>
}