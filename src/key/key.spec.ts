import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';

import { KeyService } from './key.service';
import { KEY_PERMISSION, Key } from './entities/key.entity';
import { User } from '../user/entities/user.entity';
import { Campaign } from '../campaign/entities/campaign.entity';
import { CreateKeyDto } from './dto/create-key.dto';
import { UpdateKeyDto } from './dto/update-key.dto';
import { FindKeysDto } from './dto/find-keys.dto';
import * as utils from './utils';

describe('KeyService', () => {
  let service: KeyService;

  const mockKeyRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findBy: jest.fn(),
    findOneBy: jest.fn(),
    delete: jest.fn(),
    update: jest.fn(),
  };

  const mockUserRepository = {
    findOneBy: jest.fn(),
  };

  const mockCampaignRepository = {
    findOneBy: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        KeyService,
        {
          provide: getRepositoryToken(Key),
          useValue: mockKeyRepository,
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: getRepositoryToken(Campaign),
          useValue: mockCampaignRepository,
        },
      ],
    }).compile();

    service = module.get<KeyService>(KeyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should throw an error if end date is in the past', async () => {
      const createKeyDto: CreateKeyDto = {
        userId: 'user-id',
        permissions: [KEY_PERMISSION.GET],
        endDate: new Date('2020-01-01'),
      };

      await expect(service.create(createKeyDto)).rejects.toThrow(BadRequestException);
    });

    it('should throw an error if no permissions are provided', async () => {
      const createKeyDto: CreateKeyDto = {
        userId: 'user-id',
        permissions: [],
      };

      await expect(service.create(createKeyDto)).rejects.toThrow(BadRequestException);
    });

    it('should throw an error if the campaign is invalid', async () => {
      const createKeyDto: CreateKeyDto = {
        userId: 'user-id',
        permissions: [KEY_PERMISSION.GET],
        campaignId: 1,
      };

      mockCampaignRepository.findOneBy.mockReturnValue(null);

      await expect(service.create(createKeyDto)).rejects.toThrow(BadRequestException);
    });

    it('should throw an error if the campaign does not belong to the user', async () => {
      const createKeyDto: CreateKeyDto = {
        userId: 'user-id',
        permissions: [KEY_PERMISSION.GET],
        campaignId: 1,
      };

      const campaign = { id: 1, user: { id: 'different-user-id' } } as Campaign;
      mockCampaignRepository.findOneBy.mockReturnValue(campaign);

      await expect(service.create(createKeyDto)).rejects.toThrow(ForbiddenException);
    });

    it('should create and save a key', async () => {
      const createKeyDto: CreateKeyDto = {
        userId: 'user-id',
        permissions: [KEY_PERMISSION.GET],
      };

      const hashedKey = 'hashed-key';
      jest.spyOn(service as any, 'generateApiKey').mockReturnValue('api-key');
      jest.spyOn(utils, 'hashApiKey').mockReturnValue(Promise.resolve(hashedKey));
      mockKeyRepository.save.mockReturnValue({ id: 'key-id', ...createKeyDto });

      const result = await service.create(createKeyDto);

      expect(result).toEqual({ apiKey: 'key-id.api-key' });
      expect(mockKeyRepository.save).toHaveBeenCalledWith({
        hashedKey,
        permissions: createKeyDto.permissions,
        user: { id: createKeyDto.userId },
        campaign: null,
      });
    });
  });

  describe('findAll', () => {
    it('should return an array of keys', async () => {
      const findKeysDto: FindKeysDto = { userId: 'user-id' };
      const keys = [{ id: 'key-id', hashedKey: 'hashed-key' }];
      mockKeyRepository.findBy.mockReturnValue(keys);

      const result = await service.findAll(findKeysDto);

      expect(result).toEqual([{ id: 'key-id' }]);
      expect(mockKeyRepository.findBy).toHaveBeenCalledWith({ user: { id: 'user-id' } });
    });
  });

  describe('update', () => {
    it('should throw an error if the key does not exist', async () => {
      const updateKeyDto: UpdateKeyDto = { permissions: [KEY_PERMISSION.GET] };
      mockKeyRepository.findOneBy.mockReturnValue(null);

      await expect(service.update('key-id', updateKeyDto)).rejects.toThrow(BadRequestException);
    });

    it('should throw an error if the end date is in the past', async () => {
      const updateKeyDto: UpdateKeyDto = { endDate: new Date('2020-01-01') };
      const key = { id: 'key-id' } as Key;
      mockKeyRepository.findOneBy.mockReturnValue(key);

      await expect(service.update('key-id', updateKeyDto)).rejects.toThrow(BadRequestException);
    });

    it('should throw an error if no permissions are provided', async () => {
      const updateKeyDto: UpdateKeyDto = { permissions: [] };
      const key = { id: 'key-id' } as Key;
      mockKeyRepository.findOneBy.mockReturnValue(key);

      await expect(service.update('key-id', updateKeyDto)).rejects.toThrow(BadRequestException);
    });

    it('should throw an error if the campaign is invalid', async () => {
      const updateKeyDto: UpdateKeyDto = { campaignId: 1 };
      const key = { id: 'key-id' } as Key;
      mockKeyRepository.findOneBy.mockReturnValue(key);
      mockCampaignRepository.findOneBy.mockReturnValue(null);

      await expect(service.update('key-id', updateKeyDto)).rejects.toThrow(BadRequestException);
    });

    it('should throw an error if the campaign does not belong to the user', async () => {
      const updateKeyDto: UpdateKeyDto = { campaignId: 1 };
      const key = { id: 'key-id', user: { id: 'user-id' } } as Key;
      mockKeyRepository.findOneBy.mockReturnValue(key);

      const campaign = { id: 1, user: { id: 'different-user-id' } } as Campaign;
      mockCampaignRepository.findOneBy.mockReturnValue(campaign);

      await expect(service.update('key-id', updateKeyDto)).rejects.toThrow(ForbiddenException);
    });

    it('should update and save a key', async () => {
      const updateKeyDto: UpdateKeyDto = { permissions: [KEY_PERMISSION.GET] };
      const key = { id: 'key-id', user: { id: 'user-id' } } as Key;
      mockKeyRepository.findOneBy.mockReturnValue(key);

      await service.update('key-id', updateKeyDto);

      expect(mockKeyRepository.update).toHaveBeenCalledWith('key-id', {
        ...updateKeyDto,
        campaign: null,
      });
    });
  });

  describe('remove', () => {
    it('should delete a key', async () => {
      const keyId = 'key-id';
      mockKeyRepository.delete.mockReturnValue(undefined);

      await service.remove(keyId);

      expect(mockKeyRepository.delete).toHaveBeenCalledWith(keyId);
    });
  });
});
