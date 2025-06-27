import { ActivityType } from "../generated/prisma";

export interface ICreate {
    name: string,
    email: string,
    password: string
}

export interface ILogin {
    email: string,
    password: string
}

export interface IResponseLogin {
    token: string;
  }
  
export interface IResponseCreate {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IActivity {
  id: string;
  userId: string;
  title: string;
  description: string | null;
  type: ActivityType;
  startTime: string
  endTime: string
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateActivity {
  title: string;
  description?: string;
  type: 'PESSOAL' | 'TRABALHO' | 'ESTUDO' | 'SAUDE' | 'OUTRO';
  startTime: string;
  endTime: string;
}
