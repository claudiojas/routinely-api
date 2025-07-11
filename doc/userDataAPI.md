# 👤 Dados do Usuário - Routinely API

Este documento responde todas as questões sobre como obter e gerenciar dados do usuário na **Routinely API**.

## 🔍 Análise da API Atual

### **1. Endpoint para Buscar Dados do Usuário**

#### ❌ **Endpoint Específico NÃO Existe**
A API **NÃO possui** um endpoint dedicado como:
- `GET /user/profile`
- `GET /user/me`
- `GET /user/:id`

#### ✅ **Dados do Usuário Vêm no Login/Signup**
Os dados do usuário são retornados **apenas** nos endpoints de autenticação:

```typescript
// POST /user (Signup) - Retorna dados completos do usuário
interface IAuthResponse {
  user: IUser;
  token: string;
}

// POST /userLogin (Login) - Retorna APENAS o token
interface ILoginResponse {
  token: string;
}
```

### **2. Estrutura da Resposta da API**

#### **Interface Atual do Usuário**
```typescript
interface IUser {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}
```

#### **Resposta do Signup (POST /user)**
```typescript
// ✅ Sucesso (201)
{
  "data": {
    "user": {
      "id": "user-id-123",
      "name": "João Silva",
      "email": "joao@email.com",
      "createdAt": "2025-01-27T10:30:00.000Z",
      "updatedAt": "2025-01-27T10:30:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### **Resposta do Login (POST /userLogin)**
```typescript
// ✅ Sucesso (201)
{
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}

// ❌ NÃO retorna dados do usuário
```

### **3. Autenticação Necessária**

#### **Endpoints de Autenticação**
- `POST /user` - **NÃO protegido** (criação de conta)
- `POST /userLogin` - **NÃO protegido** (login)

#### **Endpoints Protegidos**
- `GET /activities` - **Protegido** (requer token)
- `POST /activities` - **Protegido** (requer token)
- `PUT /activities/:id` - **Protegido** (requer token)
- `DELETE /activities/:id` - **Protegido** (requer token)

#### **Header de Autenticação**
```http
Authorization: Bearer <token>
```

### **4. Dados Específicos Necessários**

#### **Dados Disponíveis no Banco**
```sql
model User {
  id        String   @id @default(uuid())
  name      String
  email     String   @unique
  password  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  activities Activity[]
}
```

#### **Dados Retornados pela API**
- ✅ **id** - Identificador único
- ✅ **name** - Nome do usuário
- ✅ **email** - Email do usuário
- ✅ **createdAt** - Data de criação
- ✅ **updatedAt** - Data de atualização
- ❌ **password** - NUNCA retornado (segurança)
- ❌ **avatar** - NÃO implementado
- ❌ **preferências** - NÃO implementado

## 🚨 Problemas Identificados

### **1. Falta de Endpoint para Dados do Usuário**
```typescript
// ❌ NÃO EXISTE
GET /user/profile
GET /user/me
GET /user/:id
```

### **2. Login Não Retorna Dados do Usuário**
```typescript
// ❌ Login retorna APENAS token
POST /userLogin → { token: string }

// ✅ Signup retorna dados completos
POST /user → { user: IUser, token: string }
```

### **3. Interface Incompleta**
```typescript
// ❌ Interface atual não inclui campos extras
interface IUser {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  // ❌ Faltam campos como avatar, preferências, etc.
}
```

## 💡 Soluções Recomendadas

### **1. Implementar Endpoint de Perfil**
```typescript
// ✅ NOVO ENDPOINT RECOMENDADO
GET /user/profile
Authorization: Bearer <token>

// Resposta
{
  "data": {
    "id": "user-id-123",
    "name": "João Silva",
    "email": "joao@email.com",
    "createdAt": "2025-01-27T10:30:00.000Z",
    "updatedAt": "2025-01-27T10:30:00.000Z"
  }
}
```

### **2. Modificar Login para Retornar Dados**
```typescript
// ✅ LOGIN MELHORADO
POST /userLogin → {
  "data": {
    "user": {
      "id": "user-id-123",
      "name": "João Silva",
      "email": "joao@email.com",
      "createdAt": "2025-01-27T10:30:00.000Z",
      "updatedAt": "2025-01-27T10:30:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### **3. Expandir Interface do Usuário**
```typescript
// ✅ INTERFACE EXPANDIDA
interface IUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;           // URL da imagem
  preferences?: UserPrefs;   // Preferências do usuário
  createdAt: Date;
  updatedAt: Date;
}

interface UserPrefs {
  theme: 'light' | 'dark';
  language: 'pt-BR' | 'en-US';
  notifications: boolean;
}
```

## 🔧 Implementação Atual para Frontend

### **Cenário 1: Usar Dados do Signup**
```typescript
// ✅ SOLUÇÃO ATUAL - Usar dados do signup
const handleSignup = async (userData: ISignupData) => {
  const result = await signupUser(userData);
  
  if (result.success && result.data) {
    // Salvar dados completos do usuário
    const { user, token } = result.data.data;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    
    // Usar dados salvos no frontend
    setUser(user);
  }
};
```

### **Cenário 2: Implementar Endpoint de Perfil**
```typescript
// ✅ SOLUÇÃO RECOMENDADA - Criar endpoint
const getUserProfile = async (): Promise<IUser> => {
  const token = localStorage.getItem('token');
  
  const response = await fetch('http://localhost:3000/user/profile', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  const data = await response.json();
  return data.data;
};
```

### **Cenário 3: Modificar Login**
```typescript
// ✅ SOLUÇÃO ALTERNATIVA - Modificar login
const handleLogin = async (credentials: ILoginData) => {
  const result = await loginUser(credentials);
  
  if (result.success && result.data) {
    // Buscar dados do usuário após login
    const userProfile = await getUserProfile();
    
    localStorage.setItem('token', result.data.data.token);
    localStorage.setItem('user', JSON.stringify(userProfile));
    
    setUser(userProfile);
  }
};
```

## 📋 Checklist de Implementação

### **Para o Backend (Recomendado)**
- [ ] **Criar endpoint `GET /user/profile`**
- [ ] **Modificar login para retornar dados do usuário**
- [ ] **Expandir interface `IUser`**
- [ ] **Adicionar campos opcionais (avatar, preferências)**
- [ ] **Implementar validação de token no endpoint**

### **Para o Frontend (Solução Atual)**
- [ ] ✅ **Usar dados do signup** (já implementado)
- [ ] ✅ **Salvar dados no localStorage** (já implementado)
- [ ] ✅ **Context API para gerenciamento** (já implementado)
- [ ] 🔄 **Implementar fallback para login** (recomendado)

## 🎯 Respostas Diretas às Questões

### **1. Endpoint para buscar dados do usuário**
❌ **NÃO existe** `GET /user/profile` ou `GET /user/me`
✅ **Dados vêm** no endpoint `POST /user` (signup)
❌ **Login NÃO retorna** dados do usuário

### **2. Estrutura da resposta da API**
✅ **Interface atual** é compatível com a API
✅ **Campos retornados**: id, name, email, createdAt, updatedAt
❌ **NÃO há campos adicionais** como avatar, preferências

### **3. Autenticação necessária**
❌ **Endpoints de usuário** NÃO são protegidos
✅ **Endpoints de atividades** são protegidos
✅ **Token JWT** necessário para rotas protegidas

### **4. Dados específicos necessários**
✅ **Dados básicos** disponíveis (nome, email)
❌ **Dados extras** NÃO implementados (avatar, preferências)
✅ **Interface atual** cobre todos os dados disponíveis

## 🚀 Recomendação Final

### **Solução Imediata (Frontend)**
```typescript
// ✅ USAR DADOS DO SIGNUP
const userData = JSON.parse(localStorage.getItem('user') || '{}');
```

### **Solução Ideal (Backend + Frontend)**
```typescript
// ✅ IMPLEMENTAR ENDPOINT DE PERFIL
GET /user/profile → Retorna dados completos do usuário
```

---

**Conclusão**: A API atual **NÃO possui** um endpoint específico para dados do usuário. Os dados vêm apenas no signup. Para uma experiência completa, recomenda-se implementar o endpoint `GET /user/profile` ou modificar o login para retornar dados do usuário. 