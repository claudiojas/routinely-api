# 🔗 Integração Frontend-Backend - Routinely API (TypeScript)

Este documento explica como o frontend deve integrar com a API de autenticação da aplicação Routinely usando TypeScript.

## 📋 Visão Geral

A API fornece endpoints de autenticação que o frontend deve consumir para:
- Criar novos usuários (signup)
- Fazer login de usuários existentes
- Acessar rotas protegidas com token JWT

## 🏗️ Interfaces e Tipos

### Definição dos Tipos
```typescript
// Interfaces para autenticação
interface IUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  preferences?: {
    theme: 'light' | 'dark' | 'auto';
    language: 'pt-BR' | 'en-US' | 'es';
    notifications: boolean;
    timezone?: string;
    dateFormat?: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface ISignupData {
  name: string;
  email: string;
  password: string;
}

interface ILoginData {
  email: string;
  password: string;
}

interface IAuthResponse {
  user: IUser;
  token: string;
}

interface ILoginResponse {
  token: string;
}

interface IApiResponse<T> {
  data: T;
}

interface IApiError {
  error: string;
}

// Interfaces para atividades
interface IActivity {
  id: string;
  userId: string;
  title: string;
  description: string | null;
  type: 'PESSOAL' | 'TRABALHO' | 'ESTUDO' | 'SAUDE' | 'OUTRO';
  startTime: string;
  endTime: string;
  createdAt: string;
  updatedAt: string;
}

interface ICreateActivity {
  title: string;
  description?: string;
  type: 'PESSOAL' | 'TRABALHO' | 'ESTUDO' | 'SAUDE' | 'OUTRO';
  startTime: string;
  endTime: string;
}

// Interfaces para perfil do usuário
interface IUpdateProfile {
  name?: string;
  avatar?: string;
  preferences?: {
    theme?: 'light' | 'dark' | 'auto';
    language?: 'pt-BR' | 'en-US' | 'es';
    notifications?: boolean;
    timezone?: string;
    dateFormat?: string;
  };
}

interface IChangePassword {
  currentPassword: string;
  newPassword: string;
}

interface IUserStats {
  totalActivities: number;
  completedActivities: number;
  pendingActivities: number;
  streakDays: number;
  totalHours: number;
  favoriteActivityType: string;
}

// Tipos para requisições
type ApiMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

interface ApiRequestConfig {
  method?: ApiMethod;
  body?: any;
  headers?: Record<string, string>;
}
```

## 🔐 Processo de Criação de Usuário (Signup)

### Fluxo Completo

#### 1. **Coleta de Dados no Frontend**
```typescript
const signupData: ISignupData = {
  name: 'João Silva',
  email: 'joao@email.com',
  password: '123456'
};
```

#### 2. **Validação Local (Opcional)**
```typescript
const validateSignup = (data: ISignupData): void => {
  if (data.name.length > 20) {
    throw new Error('Nome deve ter no máximo 20 caracteres');
  }
  if (data.password.length < 4) {
    throw new Error('Senha deve ter pelo menos 4 caracteres');
  }
  // Validar formato de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email)) {
    throw new Error('Email inválido');
  }
};
```

#### 3. **Requisição para a API**
```typescript
const signupUser = async (userData: ISignupData): Promise<{ success: boolean; data?: IApiResponse<IAuthResponse>; error?: string }> => {
  try {
    const response = await fetch('http://localhost:3000/user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    });

    const data = await response.json();
    return { success: response.ok, data };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Erro desconhecido' };
  }
};
```

#### 4. **Tratamento da Resposta**
```typescript
const handleSignup = async (userData: ISignupData): Promise<void> => {
  const result = await signupUser(userData);
  
  if (result.success && result.data) {
    // Sucesso - salvar dados do usuário
    localStorage.setItem('token', result.data.data.token);
    localStorage.setItem('user', JSON.stringify(result.data.data.user));
    
    // Redirecionar para dashboard
    window.location.href = '/dashboard';
  } else {
    // Erro - mostrar mensagem
    alert(result.error || 'Erro ao criar conta');
  }
};
```

### Resposta da API

#### ✅ **Sucesso (201)**
```typescript
const response: IApiResponse<IAuthResponse> = {
  data: {
    user: {
      id: "user-id-123",
      name: "João Silva",
      email: "joao@email.com",
      createdAt: "2025-07-11T00:33:57.473Z",
      updatedAt: "2025-07-11T00:33:57.473Z"
    },
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
};
```

#### ❌ **Erro (500)**
```typescript
const error: IApiError = {
  error: "This email is already registered!"
};
```

## 🔑 Processo de Login

### Fluxo Completo

#### 1. **Coleta de Dados**
```typescript
const loginData: ILoginData = {
  email: 'joao@email.com',
  password: '123456'
};
```

#### 2. **Requisição para a API**
```typescript
const loginUser = async (credentials: ILoginData): Promise<{ success: boolean; data?: IApiResponse<ILoginResponse>; error?: string }> => {
  try {
    const response = await fetch('http://localhost:3000/userLogin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(credentials)
    });

    const data = await response.json();
    return { success: response.ok, data };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Erro desconhecido' };
  }
};
```

#### 3. **Tratamento da Resposta**
```typescript
const handleLogin = async (credentials: ILoginData): Promise<void> => {
  const result = await loginUser(credentials);
  
  if (result.success && result.data) {
    // Sucesso - salvar token
    localStorage.setItem('token', result.data.data.token);
    
    // Redirecionar para dashboard
    window.location.href = '/dashboard';
  } else {
    // Erro - mostrar mensagem
    alert(result.error || 'Erro no login');
  }
};
```

### Resposta da API

#### ✅ **Sucesso (201)**
```typescript
const response: IApiResponse<ILoginResponse> = {
  data: {
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
};
```

#### ❌ **Erro (500)**
```typescript
const error: IApiError = {
  error: "User not found!"
};
```

## 🛡️ Acesso a Rotas Protegidas

### Configuração do Token

#### 1. **Função Helper para Requisições**
```typescript
const apiRequest = async <T>(
  url: string, 
  options: ApiRequestConfig = {}
): Promise<{ success: boolean; data?: T; status: number; error?: string }> => {
  const token = localStorage.getItem('token');
  
  const config: RequestInit = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers
    }
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();
    
    return { 
      success: response.ok, 
      data: response.ok ? data : undefined, 
      status: response.status,
      error: !response.ok ? data.error : undefined
    };
  } catch (error) {
    return { 
      success: false, 
      status: 0, 
      error: error instanceof Error ? error.message : 'Erro de rede' 
    };
  }
};
```

#### 2. **Exemplo de Uso**
```typescript
// Listar atividades do usuário
const getActivities = async (): Promise<IActivity[]> => {
  const result = await apiRequest<IApiResponse<IActivity[]>>('http://localhost:3000/activities');
  
  if (result.success && result.data) {
    return result.data.data;
  } else {
    throw new Error(result.error || 'Erro ao buscar atividades');
  }
};

// Criar nova atividade
const createActivity = async (activityData: ICreateActivity): Promise<IActivity> => {
  const result = await apiRequest<IApiResponse<IActivity>>('http://localhost:3000/activities', {
    method: 'POST',
    body: JSON.stringify(activityData)
  });
  
  if (result.success && result.data) {
    return result.data.data;
  } else {
    throw new Error(result.error || 'Erro ao criar atividade');
  }
};
```

## 📱 Implementação em React com TypeScript

### Componente de Login
```tsx
import React, { useState } from 'react';

interface LoginProps {
  onLoginSuccess?: (token: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await loginUser({ email, password });
      
      if (result.success && result.data) {
        localStorage.setItem('token', result.data.data.token);
        onLoginSuccess?.(result.data.data.token);
        window.location.href = '/dashboard';
      } else {
        setError(result.error || 'Erro ao fazer login');
      }
    } catch (error) {
      setError('Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="error">{error}</div>}
      <input
        type="email"
        value={email}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
        placeholder="Senha"
        required
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Entrando...' : 'Entrar'}
      </button>
    </form>
  );
};

export default Login;
```

### Componente de Cadastro
```tsx
import React, { useState } from 'react';

interface SignupProps {
  onSignupSuccess?: (user: IUser, token: string) => void;
}

const Signup: React.FC<SignupProps> = ({ onSignupSuccess }) => {
  const [formData, setFormData] = useState<ISignupData>({
    name: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await signupUser(formData);
      
      if (result.success && result.data) {
        localStorage.setItem('token', result.data.data.token);
        localStorage.setItem('user', JSON.stringify(result.data.data.user));
        onSignupSuccess?.(result.data.data.user, result.data.data.token);
        window.location.href = '/dashboard';
      } else {
        setError(result.error || 'Erro ao criar conta');
      }
    } catch (error) {
      setError('Erro ao criar conta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="error">{error}</div>}
      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Nome"
        maxLength={20}
        required
      />
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Email"
        required
      />
      <input
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="Senha"
        minLength={4}
        required
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Criando conta...' : 'Criar conta'}
      </button>
    </form>
  );
};

export default Signup;
```

## 👤 Gerenciamento de Perfil do Usuário

### Buscar Perfil do Usuário
```typescript
const getUserProfile = async (): Promise<IUser> => {
  const result = await apiRequest<IApiResponse<IUser>>('http://localhost:3000/user/profile');
  
  if (result.success && result.data) {
    return result.data.data;
  } else {
    throw new Error(result.error || 'Erro ao buscar perfil');
  }
};
```

### Atualizar Perfil do Usuário
```typescript
const updateUserProfile = async (profileData: IUpdateProfile): Promise<IUser> => {
  const result = await apiRequest<IApiResponse<IUser>>('http://localhost:3000/user/profile', {
    method: 'PUT',
    body: JSON.stringify(profileData)
  });
  
  if (result.success && result.data) {
    return result.data.data;
  } else {
    throw new Error(result.error || 'Erro ao atualizar perfil');
  }
};
```

### Buscar Estatísticas do Usuário
```typescript
const getUserStats = async (): Promise<IUserStats> => {
  const result = await apiRequest<IApiResponse<IUserStats>>('http://localhost:3000/user/stats');
  
  if (result.success && result.data) {
    return result.data.data;
  } else {
    throw new Error(result.error || 'Erro ao buscar estatísticas');
  }
};
```

### Alterar Senha
```typescript
const changePassword = async (passwordData: IChangePassword): Promise<void> => {
  const result = await apiRequest<IApiResponse<{ message: string }>>('http://localhost:3000/user/password', {
    method: 'PUT',
    body: JSON.stringify(passwordData)
  });
  
  if (!result.success) {
    throw new Error(result.error || 'Erro ao alterar senha');
  }
};
```

### Componente de Perfil do Usuário
```tsx
import React, { useState, useEffect } from 'react';

interface UserProfileProps {
  onProfileUpdate?: (user: IUser) => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ onProfileUpdate }) => {
  const [profile, setProfile] = useState<IUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async (): Promise<void> => {
    try {
      const userProfile = await getUserProfile();
      setProfile(userProfile);
    } catch (error) {
      setError('Erro ao carregar perfil');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (profileData: IUpdateProfile): Promise<void> => {
    try {
      const updatedProfile = await updateUserProfile(profileData);
      setProfile(updatedProfile);
      onProfileUpdate?.(updatedProfile);
    } catch (error) {
      setError('Erro ao atualizar perfil');
    }
  };

  if (loading) return <div>Carregando...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!profile) return <div>Perfil não encontrado</div>;

  return (
    <div className="user-profile">
      <h2>Perfil do Usuário</h2>
      <div className="profile-info">
        <p><strong>Nome:</strong> {profile.name}</p>
        <p><strong>Email:</strong> {profile.email}</p>
        {profile.avatar && (
          <img src={profile.avatar} alt="Avatar" className="avatar" />
        )}
        {profile.preferences && (
          <div className="preferences">
            <h3>Preferências</h3>
            <p>Tema: {profile.preferences.theme}</p>
            <p>Idioma: {profile.preferences.language}</p>
            <p>Notificações: {profile.preferences.notifications ? 'Ativadas' : 'Desativadas'}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
```

### Componente de Estatísticas
```tsx
import React, { useState, useEffect } from 'react';

const UserStats: React.FC = () => {
  const [stats, setStats] = useState<IUserStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async (): Promise<void> => {
    try {
      const userStats = await getUserStats();
      setStats(userStats);
    } catch (error) {
      setError('Erro ao carregar estatísticas');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Carregando estatísticas...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!stats) return <div>Estatísticas não disponíveis</div>;

  return (
    <div className="user-stats">
      <h2>Suas Estatísticas</h2>
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total de Atividades</h3>
          <p className="stat-number">{stats.totalActivities}</p>
        </div>
        <div className="stat-card">
          <h3>Atividades Concluídas</h3>
          <p className="stat-number">{stats.completedActivities}</p>
        </div>
        <div className="stat-card">
          <h3>Atividades Pendentes</h3>
          <p className="stat-number">{stats.pendingActivities}</p>
        </div>
        <div className="stat-card">
          <h3>Sequência de Dias</h3>
          <p className="stat-number">{stats.streakDays}</p>
        </div>
        <div className="stat-card">
          <h3>Total de Horas</h3>
          <p className="stat-number">{stats.totalHours}h</p>
        </div>
        <div className="stat-card">
          <h3>Tipo Favorito</h3>
          <p className="stat-text">{stats.favoriteActivityType}</p>
        </div>
      </div>
    </div>
  );
};

export default UserStats;
```

## 🔄 Gerenciamento de Estado com TypeScript

### Context API para Autenticação
```tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
  user: IUser | null;
  token: string | null;
  login: (userData: IUser, token: string) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Verificar se há token salvo
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Erro ao carregar dados do usuário:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    
    setLoading(false);
  }, []);

  const login = (userData: IUser, token: string): void => {
    setUser(userData);
    setToken(token);
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = (): void => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const value: AuthContextType = {
    user,
    token,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
};
```

## 🚨 Tratamento de Erros com TypeScript

### Interceptor para Requisições
```typescript
// Interceptor para adicionar token automaticamente
const createApiClient = () => {
  const baseURL: string = process.env.REACT_APP_API_URL || 'http://localhost:3000';
  
  const request = async <T>(
    endpoint: string, 
    options: ApiRequestConfig = {}
  ): Promise<T> => {
    const token = localStorage.getItem('token');
    
    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers
      }
    };

    try {
      const response = await fetch(`${baseURL}${endpoint}`, config);
      const data = await response.json();
      
      if (!response.ok) {
        // Se token expirou, fazer logout
        if (response.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
        throw new Error(data.error || 'Erro na requisição');
      }
      
      return data as T;
    } catch (error) {
      console.error('Erro na API:', error);
      throw error;
    }
  };

  return {
    get: <T>(endpoint: string): Promise<T> => request<T>(endpoint),
    post: <T>(endpoint: string, data: any): Promise<T> => 
      request<T>(endpoint, { method: 'POST', body: JSON.stringify(data) }),
    put: <T>(endpoint: string, data: any): Promise<T> => 
      request<T>(endpoint, { method: 'PUT', body: JSON.stringify(data) }),
    delete: <T>(endpoint: string): Promise<T> => 
      request<T>(endpoint, { method: 'DELETE' })
  };
};

const api = createApiClient();
```

## 📊 Exemplos de Uso com TypeScript

### Listar Atividades
```typescript
const activities: IActivity[] = await api.get<IApiResponse<IActivity[]>>('/activities');
console.log(activities.data); // Array de atividades
```

### Criar Atividade
```typescript
const newActivity: IActivity = await api.post<IApiResponse<IActivity>>('/activities', {
  title: 'Reunião',
  description: 'Reunião de equipe',
  type: 'TRABALHO',
  startTime: '09:00',
  endTime: '10:00'
});
```

### Atualizar Atividade
```typescript
const updatedActivity: IActivity = await api.put<IApiResponse<IActivity>>('/activities/activity-id', {
  title: 'Reunião Atualizada',
  description: 'Nova descrição',
  type: 'TRABALHO',
  startTime: '09:30',
  endTime: '10:30'
});
```

### Deletar Atividade
```typescript
await api.delete('/activities/activity-id');
```

## 🔧 Configuração de Ambiente

### Variáveis de Ambiente
```typescript
// .env
REACT_APP_API_URL=http://localhost:3000
REACT_APP_ENV=development
```

### Configuração da API
```typescript
const API_URL: string = process.env.REACT_APP_API_URL || 'http://localhost:3000';

// Usar em todas as requisições
const response = await fetch(`${API_URL}/user`, {
  // ... configuração
});
```

## 📝 Checklist de Implementação

### ✅ **Frontend deve implementar:**

1. **Formulários de cadastro e login**
   - Validação de campos com TypeScript
   - Feedback visual de erros tipados
   - Estados de loading tipados

2. **Gerenciamento de token**
   - Salvar token no localStorage com tipos
   - Incluir token em requisições protegidas
   - Remover token no logout

3. **Tratamento de erros**
   - Mostrar mensagens de erro tipadas
   - Redirecionar em caso de token expirado
   - Fallback para erros de rede

4. **Proteção de rotas**
   - Verificar se usuário está logado
   - Redirecionar para login se necessário
   - Guardar rota pretendida

5. **UX/UI**
   - Loading states tipados
   - Feedback de sucesso/erro
   - Formulários responsivos
   - Validação em tempo real

---

**Esta documentação garante uma integração completa e segura entre frontend e backend usando TypeScript! 🚀** 