import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';

import { PointsService } from './points.service';
import { Points } from './entities/points.entity';
import { Campaign } from '../campaign/entities/campaign.entity';
import { Key } from '../key/entities/key.entity';
import { CreatePointDto } from './dto/create-point.dto';
import { FindPointsDto } from './dto/find-points.dto';
import { ResourceAccess } from '../interfaces/api-request.interface';

const mockGetAddress = jest.fn();

jest.mock('ethers', () => ({
  getAddress: (): any => mockGetAddress(),
}));

class TestService extends PointsService {
  testVerifyResourceAccess = this.verifyResourceAccess;
}

describe('PointsService', () => {
  let service: TestService;

  const mockPointsRepository = {
    save: jest.fn(),
    find: jest.fn(),
    delete: jest.fn(),
  };

  const mockCampaignRepository = {
    findOne: jest.fn(),
  };

  const mockKeyRepository = {
    findOneBy: jest.fn(),
  };

  const createQueryBuilder: any = {
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    getMany: jest.fn(),
  };

  const mockEntityManager = {
    createQueryBuilder: jest.fn().mockReturnValue(createQueryBuilder),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TestService,
        {
          provide: getRepositoryToken(Points),
          useValue: mockPointsRepository,
        },
        {
          provide: getRepositoryToken(Campaign),
          useValue: mockCampaignRepository,
        },
        {
          provide: getRepositoryToken(Key),
          useValue: mockKeyRepository,
        },
        {
          provide: EntityManager,
          useValue: mockEntityManager,
        },
      ],
    }).compile();

    service = module.get<TestService>(TestService);
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should throw an error if the address is invalid', async () => {
      const createPointDto: CreatePointDto = {
        address: 'invalid-address',
        campaignId: 1,
        points: 10,
      };
      mockGetAddress.mockImplementation(() => {
        throw new Error('Invalid address');
      });

      jest.spyOn(service as any, 'verifyResourceAccess').mockResolvedValue(true);

      const access: ResourceAccess = { userId: 'user-id', keyId: 'key-id' };

      await expect(service.create(createPointDto, access)).rejects.toThrow(BadRequestException);
    });

    it('should throw an error if the metadata is invalid', async () => {
      const createPointDto: CreatePointDto = {
        address: '0x0',
        campaignId: 1,
        points: 10,
        metadata: 'invalid-json',
      };
      mockGetAddress.mockReturnValue('0x00');

      jest.spyOn(service as any, 'verifyResourceAccess').mockResolvedValue(true);

      const access: ResourceAccess = { userId: 'user-id', keyId: 'key-id' };

      await expect(service.create(createPointDto, access)).rejects.toThrow(BadRequestException);
    });

    it('should save points successfully', async () => {
      const createPointDto: CreatePointDto = {
        address: '0x00',
        campaignId: 1,
        points: 10,
      };
      mockGetAddress.mockReturnValue('0x00');

      const access: ResourceAccess = { userId: 'user-id', keyId: 'key-id', campaignId: 1 };

      jest.spyOn(service as any, 'verifyResourceAccess').mockResolvedValue(true);
      mockPointsRepository.save.mockReturnValue(createPointDto);

      const result = await service.create(createPointDto, access);

      expect(result).toEqual(createPointDto);
      expect(mockPointsRepository.save).toHaveBeenCalledWith({
        ...createPointDto,
        campaign: { id: createPointDto.campaignId },
        key: { id: access.keyId },
      });
    });
  });

  describe('findAll', () => {
    it('should throw an error if the address is invalid', async () => {
      const findPointsDto: FindPointsDto = { campaignId: 1, address: 'invalid-address' };
      const access: ResourceAccess = { userId: 'user-id', keyId: 'key-id' };
      mockGetAddress.mockImplementation(() => {
        throw new Error('Invalid address');
      });
      jest.spyOn(service as any, 'verifyResourceAccess').mockResolvedValue(true);

      await expect(service.findAll(findPointsDto, access)).rejects.toThrow(BadRequestException);
    });

    it('should throw an error if the address is not provided', async () => {
      const findPointsDto: FindPointsDto = { campaignId: 1, eventName: 'event' };
      const access: ResourceAccess = { userId: 'user-id', keyId: 'key-id' };
      jest.spyOn(service as any, 'verifyResourceAccess').mockResolvedValue(true);

      await expect(service.findAll(findPointsDto, access)).rejects.toThrow(BadRequestException);
    });
  });

  describe('remove', () => {
    it('should delete points successfully', async () => {
      const id = 1;
      mockPointsRepository.delete.mockReturnValue(undefined);

      await service.remove(id);

      expect(mockPointsRepository.delete).toHaveBeenCalledWith(id);
    });
  });

  describe('verifyResourceAccess', () => {
    it('should throw an error if campaign does not exist', async () => {
      const campaignId = 1;
      const access: ResourceAccess = { userId: 'user-id', keyId: 'key-id' };
      mockCampaignRepository.findOne.mockReturnValue(null);

      await expect(service.testVerifyResourceAccess(access, campaignId)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw an error if user is unauthorized', async () => {
      const campaignId = 1;
      const access: ResourceAccess = { userId: 'user-id', keyId: 'key-id' };
      const campaign = { id: campaignId, user: { id: 'different-user-id' } };
      mockCampaignRepository.findOne.mockReturnValue(campaign);

      await expect(service.testVerifyResourceAccess(access, campaignId)).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('should return true if access is valid', async () => {
      const campaignId = 1;
      const access: ResourceAccess = { userId: 'user-id', keyId: 'key-id', campaignId: 1 };
      const campaign = { id: campaignId, user: { id: 'user-id' } };
      mockCampaignRepository.findOne.mockReturnValue(campaign);

      const result = await service.testVerifyResourceAccess(access, campaignId);

      expect(result).toBe(true);
    });
  });
});
