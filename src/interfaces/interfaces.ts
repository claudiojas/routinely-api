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
    user?: IUser; // Adicionando dados do usuário no login
  }
  
export interface IResponseCreate {
  id: string;
  name: string;
  email: string;
  password?: string;
  createdAt: Date;
  updatedAt: Date;
}

// ✅ NOVA: Interface expandida do usuário
export interface IUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  preferences?: UserPreferences;
  createdAt: Date;
  updatedAt: Date;
}

// ✅ NOVA: Interface para preferências do usuário
export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: 'pt-BR' | 'en-US' | 'es';
  notifications: boolean;
  timezone?: string;
  dateFormat?: string;
}

// ✅ NOVA: Interface para atualizar perfil
export interface IUpdateProfile {
  name?: string;
  email?: string;
  avatar?: string;
  preferences?: UserPreferences;
}

// ✅ NOVA: Interface para alterar senha
export interface IChangePassword {
  currentPassword: string;
  newPassword: string;
}

// ✅ NOVA: Interface para recuperar senha
export interface IForgotPassword {
  email: string;
}

// ✅ NOVA: Interface para resetar senha
export interface IResetPassword {
  token: string;
  newPassword: string;
}

// ✅ NOVA: Interface para verificar token
export interface IVerifyToken {
  valid: boolean;
  user?: IUser;
}

// ✅ NOVA: Interface para estatísticas do usuário
export interface IUserStats {
  totalActivities: number;
  completedActivities: number;
  pendingActivities: number;
  streakDays: number;
  totalHours: number;
  favoriteActivityType: string;
}

export interface IActivity {
  id: string;
  userId: string;
  title: string;
  description: string | null;
  type: ActivityType;
  startTime: string;
  endTime: string;
  date: string; // formato YYYY-MM-DD
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateActivity {
  title: string;
  description?: string;
  type: 'PESSOAL' | 'TRABALHO' | 'ESTUDO' | 'SAUDE' | 'OUTRO';
  startTime: string;
  endTime: string;
  date: string; // formato YYYY-MM-DD
}

export interface IToggleActivityCompleted {
  activityId: string;
  userId: string;
}
