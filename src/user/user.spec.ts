import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { UserService } from './user.service';
import { User, SUBSCRIPTION_TIER } from './entities/user.entity';

describe('UserService', () => {
  let service: UserService;

  const mockUserRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOneBy: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create and save a user', async () => {
      const user = { id: 'user-id', role: 'user', tier: SUBSCRIPTION_TIER.FREE };
      mockUserRepository.create.mockReturnValue(user);
      mockUserRepository.save.mockReturnValue(user);

      const result = await service.create();

      expect(result).toEqual(user);
      expect(mockUserRepository.create).toHaveBeenCalledWith({
        role: 'user',
        tier: SUBSCRIPTION_TIER.FREE,
      });
      expect(mockUserRepository.save).toHaveBeenCalledWith(user);
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const users = [
        { id: 'user1', role: 'user', tier: SUBSCRIPTION_TIER.FREE },
        { id: 'user2', role: 'admin', tier: SUBSCRIPTION_TIER.PREMIUM },
      ];
      mockUserRepository.find.mockReturnValue(users);

      const result = await service.findAll();

      expect(result).toEqual(users);
      expect(mockUserRepository.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a user if found', async () => {
      const user = { id: 'user-id', role: 'user', tier: SUBSCRIPTION_TIER.FREE };
      mockUserRepository.findOneBy.mockReturnValue(user);

      const result = await service.findOne('user-id');

      expect(result).toEqual(user);
      expect(mockUserRepository.findOneBy).toHaveBeenCalledWith({ id: 'user-id' });
    });

    it('should return null if user is not found', async () => {
      mockUserRepository.findOneBy.mockReturnValue(null);

      const result = await service.findOne('non-existing-user-id');

      expect(result).toBeNull();
      expect(mockUserRepository.findOneBy).toHaveBeenCalledWith({ id: 'non-existing-user-id' });
    });
  });

  describe('remove', () => {
    it('should delete a user successfully', async () => {
      const userId = 'user-id';
      mockUserRepository.delete.mockReturnValue(undefined);

      await service.remove(userId);

      expect(mockUserRepository.delete).toHaveBeenCalledWith(userId);
    });
  });
});
