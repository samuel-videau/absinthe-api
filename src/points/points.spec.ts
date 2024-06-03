import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';

import { PointsService } from './points.service';
import { Points } from './entities/points.entity';
import { Campaign } from '../campaign/entities/campaign.entity';
import { Key } from '../key/entities/key.entity';
import { CreatePointDto } from './dto/create-point.dto';
import { FindPointsDto } from './dto/find-points.dto';
import { ResourceAccess } from '../interfaces/api-request.interface';

const mockIsAddress = jest.fn();

jest.mock('ethers', () => ({
  isAddress: (): any => mockIsAddress(),
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
      ],
    }).compile();

    service = module.get<TestService>(TestService);
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
      mockIsAddress.mockReturnValue(false);

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
      mockIsAddress.mockReturnValue(true);

      jest.spyOn(service as any, 'verifyResourceAccess').mockResolvedValue(true);

      const access: ResourceAccess = { userId: 'user-id', keyId: 'key-id' };

      await expect(service.create(createPointDto, access)).rejects.toThrow(BadRequestException);
    });

    it('should save points successfully', async () => {
      const createPointDto: CreatePointDto = {
        address: '0x0',
        campaignId: 1,
        points: 10,
      };
      mockIsAddress.mockReturnValue(true);

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
      mockIsAddress.mockReturnValue(false);
      jest.spyOn(service as any, 'verifyResourceAccess').mockResolvedValue(true);

      await expect(service.findAll(findPointsDto, access)).rejects.toThrow(BadRequestException);
    });

    it('should throw an error if event name is not provided', async () => {
      const findPointsDto: FindPointsDto = { campaignId: 1 };
      const access: ResourceAccess = { userId: 'user-id', keyId: 'key-id' };
      jest.spyOn(service as any, 'verifyResourceAccess').mockResolvedValue(true);

      await expect(service.findAll(findPointsDto, access)).rejects.toThrow(BadRequestException);
    });

    it('should return an array of points', async () => {
      const findPointsDto: FindPointsDto = { campaignId: 1, eventName: 'event' };
      const access: ResourceAccess = { userId: 'user-id', keyId: 'key-id', campaignId: 1 };
      const points = [{ id: 1, address: '0x0', points: 10 }];

      jest.spyOn(service as any, 'verifyResourceAccess').mockResolvedValue(true);
      mockPointsRepository.find.mockReturnValue(points);

      const result = await service.findAll(findPointsDto, access);

      expect(result).toEqual(points);
      expect(mockPointsRepository.find).toHaveBeenCalledWith({
        where: {
          campaign: { id: findPointsDto.campaignId },
          address: findPointsDto.address,
          eventName: findPointsDto.eventName,
        },
      });
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
