// Configuração global para testes
beforeAll(async () => {
  // Configurar variáveis de ambiente para teste
  process.env.NODE_ENV = 'test';
  process.env.JWT_SECRET = 'test-secret-key';
  process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/routinely_test';
});

afterAll(async () => {
  // Limpeza após todos os testes
});

// Mock do Prisma para testes
jest.mock('../prisma/prisma.config', () => ({
  prisma: {
    user: {
      create: jest.fn(),
      findUnique: jest.fn(),
    },
    activity: {
      findMany: jest.fn(),
      create: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    $connect: jest.fn(),
    $disconnect: jest.fn(),
  },
})); 