import { Usecases } from '../usercases/usecases';
import { prisma } from '../prisma/prisma.config';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Mock do bcrypt
jest.mock('bcryptjs', () => ({
  hash: jest.fn().mockResolvedValue('hashedPassword123'),
  compare: jest.fn().mockResolvedValue(true)
}));

// Mock do jsonwebtoken
jest.mock('jsonwebtoken', () => ({
  sign: jest.fn().mockReturnValue('mock-jwt-token')
}));

// Mock do repository
jest.mock('../database/repository', () => ({
  MetodsDatabase: jest.fn().mockImplementation(() => ({
    create: jest.fn(),
    getUserByEmail: jest.fn(),
    getAllByUserId: jest.fn(),
    createByActivitie: jest.fn(),
    getById: jest.fn(),
    updateActivity: jest.fn(),
    deleteActivities: jest.fn()
  }))
}));

describe('Auth Use Cases', () => {
  let usecases: Usecases;
  let mockRepository: any;

  beforeEach(() => {
    // Configurar variáveis de ambiente para teste
    process.env.JWT_SECRET = 'test-secret-key';
    
    usecases = new Usecases();
    mockRepository = (usecases as any).repositorie;
    
    // Limpar todos os mocks
    jest.clearAllMocks();
  });

  describe('User Registration', () => {
    it('should create a new user successfully', async () => {
      // Mock data
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      };

      const mockUser = {
        id: 'user-id-123',
        name: userData.name,
        email: userData.email,
        password: 'hashedPassword123',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Setup mocks
      mockRepository.getUserByEmail.mockResolvedValue(null);
      mockRepository.create.mockResolvedValue(mockUser);

      // Execute use case
      const result = await usecases.create(userData);

      // Assertions
      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('token');
      expect(result.user).toEqual({
        id: mockUser.id,
        name: mockUser.name,
        email: mockUser.email,
        createdAt: mockUser.createdAt,
        updatedAt: mockUser.updatedAt
      });
      expect(result.token).toBe('mock-jwt-token');
      
      // Verify mocks were called
      expect(mockRepository.getUserByEmail).toHaveBeenCalledWith(userData.email);
      expect(mockRepository.create).toHaveBeenCalledWith({
        name: userData.name,
        email: userData.email,
        password: 'hashedPassword123'
      });
      expect(bcrypt.hash).toHaveBeenCalledWith(userData.password, 10);
      expect(jwt.sign).toHaveBeenCalledWith(
        { userId: mockUser.id, email: mockUser.email },
        'test-secret-key',
        { expiresIn: '1h' }
      );
    });

    it('should throw error when email already exists', async () => {
      const userData = {
        name: 'Test User',
        email: 'existing@example.com',
        password: 'password123'
      };

      // Mock existing user
      mockRepository.getUserByEmail.mockResolvedValue({
        id: 'existing-user-id',
        email: userData.email
      });

      // Execute and expect error
      await expect(usecases.create(userData)).rejects.toThrow('This email is already registered!');
      
      expect(mockRepository.getUserByEmail).toHaveBeenCalledWith(userData.email);
      expect(mockRepository.create).not.toHaveBeenCalled();
    });

    it('should throw error for invalid email format', async () => {
      const userData = {
        name: 'Test User',
        email: 'invalid-email',
        password: 'password123'
      };

      await expect(usecases.create(userData)).rejects.toThrow();
    });

    it('should throw error for password too short', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: '123'
      };

      await expect(usecases.create(userData)).rejects.toThrow();
    });

    it('should throw error for name too long', async () => {
      const userData = {
        name: 'This is a very long name that exceeds the maximum allowed length',
        email: 'test@example.com',
        password: 'password123'
      };

      await expect(usecases.create(userData)).rejects.toThrow();
    });
  });

  describe('User Login', () => {
    it('should login successfully with valid credentials', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'password123'
      };

      const mockUser = {
        id: 'user-id-123',
        name: 'Test User',
        email: loginData.email,
        password: 'hashedPassword123',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Setup mocks
      mockRepository.getUserByEmail.mockResolvedValue(mockUser);

      // Execute use case
      const result = await usecases.Login(loginData);

      // Assertions
      expect(result).toHaveProperty('token');
      expect(result.token).toBe('mock-jwt-token');
      
      // Verify mocks were called
      expect(mockRepository.getUserByEmail).toHaveBeenCalledWith(loginData.email);
      expect(bcrypt.compare).toHaveBeenCalledWith(loginData.password, 'hashedPassword123');
      expect(jwt.sign).toHaveBeenCalledWith(
        { userId: mockUser.id, email: mockUser.email },
        'test-secret-key',
        { expiresIn: '1h' }
      );
    });

    it('should throw error for non-existent user', async () => {
      const loginData = {
        email: 'nonexistent@example.com',
        password: 'password123'
      };

      // Mock user not found
      mockRepository.getUserByEmail.mockResolvedValue(null);

      await expect(usecases.Login(loginData)).rejects.toThrow('User not found!');
      
      expect(mockRepository.getUserByEmail).toHaveBeenCalledWith(loginData.email);
      expect(bcrypt.compare).not.toHaveBeenCalled();
    });

    it('should throw error for incorrect password', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'wrongpassword'
      };

      const mockUser = {
        id: 'user-id-123',
        email: loginData.email,
        password: 'hashedPassword123'
      };

      // Setup mocks
      mockRepository.getUserByEmail.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(usecases.Login(loginData)).rejects.toThrow('Incorrect password');
      
      expect(mockRepository.getUserByEmail).toHaveBeenCalledWith(loginData.email);
      expect(bcrypt.compare).toHaveBeenCalledWith(loginData.password, 'hashedPassword123');
    });

    it('should throw error for invalid email format', async () => {
      const loginData = {
        email: 'invalid-email',
        password: 'password123'
      };

      await expect(usecases.Login(loginData)).rejects.toThrow();
    });

    it('should throw error for password too short', async () => {
      const loginData = {
        email: 'test@example.com',
        password: '123'
      };

      await expect(usecases.Login(loginData)).rejects.toThrow();
    });
  });
}); 