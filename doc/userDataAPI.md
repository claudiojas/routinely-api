# 👤 Dados do Usuário - Routinely API

Este documento explica como obter e gerenciar dados do usuário na **Routinely API** de acordo com a implementação atual.

## 🔍 Endpoints Disponíveis

### **1. Buscar Dados do Usuário (Perfil)**

#### ✅ **Endpoint Disponível**
- `GET /user/profile` (protegido, requer token JWT)

**Exemplo de requisição:**
```http
GET /user/profile
Authorization: Bearer <token>
```

**Resposta:**
```json
{
  "data": {
    "id": "user-id-123",
    "name": "João Silva",
    "email": "joao@email.com",
    "avatar": "https://example.com/avatar.jpg",
    "preferences": {
      "theme": "dark",
      "language": "pt-BR",
      "notifications": true
    },
    "createdAt": "2025-01-27T10:30:00.000Z",
    "updatedAt": "2025-01-27T10:30:00.000Z"
  }
}
```

### **2. Login Retorna Dados do Usuário**

- `POST /userLogin` retorna **token** e **dados completos do usuário**:

**Exemplo de resposta:**
```json
{
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "user-id-123",
      "name": "João Silva",
      "email": "joao@email.com",
      "avatar": "https://example.com/avatar.jpg",
      "preferences": {
        "theme": "dark",
        "language": "pt-BR",
        "notifications": true
      },
      "createdAt": "2025-01-27T10:30:00.000Z",
      "updatedAt": "2025-01-27T10:30:00.000Z"
    }
  }
}
```

### **3. Atualizar Perfil do Usuário**

- `PUT /user/profile` (protegido)

**Body:**
```json
{
  "name": "Novo Nome",
  "avatar": "https://example.com/avatar.jpg",
  "preferences": {
    "theme": "light",
    "language": "en-US",
    "notifications": false
  }
}
```

### **4. Estatísticas do Usuário**

- `GET /user/stats` (protegido)

**Resposta:**
```json
{
  "data": {
    "totalActivities": 10,
    "completedActivities": 7,
    "pendingActivities": 3,
    "streakDays": 5,
    "totalHours": 40,
    "favoriteActivityType": "TRABALHO"
  }
}
```

## 🛡️ Autenticação
- Todos os endpoints de perfil exigem o header:
```http
Authorization: Bearer <token>
```
- O token é obtido no login e deve ser salvo pelo frontend.

## 🧑‍💻 Fluxo Recomendado para o Frontend

1. **Cadastro:** `POST /user` → recebe token + dados do usuário
2. **Login:** `POST /userLogin` → recebe token + dados do usuário
3. **Salvar token e dados do usuário** no frontend (ex: localStorage)
4. **Buscar/atualizar perfil:** usar `/user/profile` com o token
5. **Atualizar preferências/avatar:** via `PUT /user/profile`
6. **Consultar estatísticas:** via `/user/stats`

## 📝 Interface Atual do Usuário
```typescript
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
  createdAt: Date;
  updatedAt: Date;
}
```

## 🎯 Resumo das Mudanças
- ✅ Agora existe o endpoint `/user/profile` para buscar e atualizar dados do usuário
- ✅ Login retorna token e dados completos do usuário
- ✅ Campos opcionais: `avatar`, `preferences`
- ✅ Endpoints protegidos por JWT
- ✅ Estrutura de resposta padronizada

---

**A integração frontend-backend agora é simples, segura e completa!** 