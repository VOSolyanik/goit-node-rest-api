import { jest } from '@jest/globals';

describe('AuthController', () => {
  let authController;
  let mockAuthService;
  let req, res, next;

  beforeAll(async () => {
    // Create mocks
    mockAuthService = {
      registerUser: jest.fn(),
      loginUser: jest.fn(),
      logoutUser: jest.fn(),
      getUserById: jest.fn(),
      updateUserAvatar: jest.fn()
    };

    // Mock modules using dynamic import approach
    jest.unstable_mockModule('../db/sequelize.js', () => ({
      default: {
        authenticate: jest.fn().mockResolvedValue(),
        close: jest.fn().mockResolvedValue(),
        sync: jest.fn().mockResolvedValue(),
        query: jest.fn().mockResolvedValue([])
      }
    }));

    jest.unstable_mockModule('../services/authService.js', () => mockAuthService);

    // Import the controller after mocking
    authController = await import('./authController.js');
  });

  beforeEach(() => {
    req = {
      body: {},
      user: { id: 'user123' },
      file: null
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis()
    };
    next = jest.fn();

    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should register a user successfully', async () => {
      const mockUser = {
        id: 'user123',
        email: 'test@example.com',
        subscription: 'starter',
        avatarURL: 'avatar.jpg'
      };

      mockAuthService.registerUser.mockResolvedValue(mockUser);

      req.body = { email: 'test@example.com', password: 'password123' };

      await authController.register(req, res, next);

      expect(mockAuthService.registerUser).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockUser);
      expect(next).not.toHaveBeenCalled();
    });

    it('should handle registration errors', async () => {
      const error = new Error('Registration failed');
      mockAuthService.registerUser.mockRejectedValue(error);

      req.body = { email: 'test@example.com', password: 'password123' };

      await authController.register(req, res, next);

      expect(mockAuthService.registerUser).toHaveBeenCalledWith(req.body);
      expect(next).toHaveBeenCalledWith(error);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });
  });

  describe('login', () => {
    it('should login a user successfully', async () => {
      const mockLoginData = {
        token: 'jwt-token',
        user: {
          id: 'user123',
          email: 'test@example.com',
          subscription: 'starter'
        }
      };

      mockAuthService.loginUser.mockResolvedValue(mockLoginData);

      req.body = { email: 'test@example.com', password: 'password123' };

      await authController.login(req, res, next);

      expect(mockAuthService.loginUser).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockLoginData);
      expect(next).not.toHaveBeenCalled();
    });

    it('should handle invalid credentials', async () => {
      const mockError = new Error('Email or password is wrong');
      mockAuthService.loginUser.mockResolvedValue(null);

      req.body = { email: 'test@example.com', password: 'wrongpassword' };

      await authController.login(req, res, next);

      expect(mockAuthService.loginUser).toHaveBeenCalledWith(req.body);
      expect(next).toHaveBeenCalledWith(mockError);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });

    it('should handle login service errors', async () => {
      const error = new Error('Database connection failed');
      mockAuthService.loginUser.mockRejectedValue(error);

      req.body = { email: 'test@example.com', password: 'password123' };

      await authController.login(req, res, next);

      expect(mockAuthService.loginUser).toHaveBeenCalledWith(req.body);
      expect(next).toHaveBeenCalledWith(error);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });
  });

  describe('logout', () => {
    it('should logout a user successfully', async () => {
      mockAuthService.logoutUser.mockResolvedValue();

      await authController.logout(req, res, next);

      expect(mockAuthService.logoutUser).toHaveBeenCalledWith('user123');
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.send).toHaveBeenCalled();
      expect(next).not.toHaveBeenCalled();
    });

    it('should handle logout errors', async () => {
      const error = new Error('Logout failed');
      mockAuthService.logoutUser.mockRejectedValue(error);

      await authController.logout(req, res, next);

      expect(mockAuthService.logoutUser).toHaveBeenCalledWith('user123');
      expect(next).toHaveBeenCalledWith(error);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.send).not.toHaveBeenCalled();
    });
  });

  describe('getCurrentUser', () => {
    it('should get current user successfully', async () => {
      const mockUser = {
        id: 'user123',
        email: 'test@example.com',
        subscription: 'starter',
        avatarURL: 'avatar.jpg'
      };

      mockAuthService.getUserById.mockResolvedValue(mockUser);

      await authController.getCurrentUser(req, res, next);

      expect(mockAuthService.getUserById).toHaveBeenCalledWith('user123');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockUser);
      expect(next).not.toHaveBeenCalled();
    });

    it('should handle get current user errors', async () => {
      const error = new Error('User not found');
      mockAuthService.getUserById.mockRejectedValue(error);

      await authController.getCurrentUser(req, res, next);

      expect(mockAuthService.getUserById).toHaveBeenCalledWith('user123');
      expect(next).toHaveBeenCalledWith(error);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });
  });

  describe('updateCurrentUserAvatar', () => {
    it('should update user avatar successfully', async () => {
      const mockFile = { filename: 'avatar.jpg', path: '/uploads/avatar.jpg' };
      const mockUpdatedUser = {
        id: 'user123',
        email: 'test@example.com',
        subscription: 'starter',
        avatarURL: 'new-avatar.jpg'
      };

      mockAuthService.updateUserAvatar.mockResolvedValue(mockUpdatedUser);
      req.file = mockFile;

      await authController.updateCurrentUserAvatar(req, res, next);

      expect(mockAuthService.updateUserAvatar).toHaveBeenCalledWith('user123', mockFile);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockUpdatedUser);
      expect(next).not.toHaveBeenCalled();
    });

    it('should handle update avatar errors', async () => {
      const error = new Error('Avatar update failed');
      const mockFile = { filename: 'avatar.jpg', path: '/uploads/avatar.jpg' };

      mockAuthService.updateUserAvatar.mockRejectedValue(error);
      req.file = mockFile;

      await authController.updateCurrentUserAvatar(req, res, next);

      expect(mockAuthService.updateUserAvatar).toHaveBeenCalledWith('user123', mockFile);
      expect(next).toHaveBeenCalledWith(error);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });
  });
});
