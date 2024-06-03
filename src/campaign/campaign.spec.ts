import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';

import { CampaignService } from './campaign.service';
import { Campaign } from './entities/campaign.entity';
import { User } from '../user/entities/user.entity';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';

describe('CampaignService', () => {
  let service: CampaignService;

  const mockCampaignRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findBy: jest.fn(),
    findOneBy: jest.fn(),
    delete: jest.fn(),
  };

  const mockUserRepository = {
    findOneBy: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CampaignService,
        {
          provide: getRepositoryToken(Campaign),
          useValue: mockCampaignRepository,
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<CampaignService>(CampaignService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should throw an error if name is not provided', async () => {
      const createCampaignDto: CreateCampaignDto = {
        userId: 'user-id',
        name: '',
        startDate: new Date(),
      };

      await expect(service.create(createCampaignDto)).rejects.toThrow(BadRequestException);
    });

    it('should throw an error if endDate is before startDate', async () => {
      const createCampaignDto: CreateCampaignDto = {
        userId: 'user-id',
        name: 'Campaign Name',
        startDate: new Date(),
        endDate: new Date('2020-01-01'),
      };

      await expect(service.create(createCampaignDto)).rejects.toThrow(BadRequestException);
    });

    it('should throw an error if user does not exist', async () => {
      mockUserRepository.findOneBy.mockReturnValue(null);

      const createCampaignDto: CreateCampaignDto = {
        userId: 'non-existing-user-id',
        name: 'Campaign Name',
        startDate: new Date(),
      };

      await expect(service.create(createCampaignDto)).rejects.toThrow(NotFoundException);
    });

    it('should create and save a campaign', async () => {
      const createCampaignDto: CreateCampaignDto = {
        userId: 'user-id',
        name: 'Campaign Name',
        startDate: new Date(),
      };
      const user = new User();
      user.id = 'user-id';

      mockUserRepository.findOneBy.mockReturnValue(user);
      mockCampaignRepository.create.mockReturnValue(createCampaignDto);
      mockCampaignRepository.save.mockReturnValue(createCampaignDto);

      const result = await service.create(createCampaignDto);

      expect(result).toEqual(createCampaignDto);
      expect(mockUserRepository.findOneBy).toHaveBeenCalledWith({ id: createCampaignDto.userId });
      expect(mockCampaignRepository.create).toHaveBeenCalledWith({
        ...createCampaignDto,
        user,
        status: 0,
      });
      expect(mockCampaignRepository.save).toHaveBeenCalledWith(createCampaignDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of campaigns', async () => {
      const userId = 'user-id';
      const campaigns = [{ id: 1, name: 'Test Campaign', user: { id: userId } }];
      mockCampaignRepository.findBy.mockReturnValue(campaigns);

      const result = await service.findAll(userId);

      expect(result).toEqual(campaigns);
      expect(mockCampaignRepository.findBy).toHaveBeenCalledWith({ user: { id: userId } });
    });
  });

  describe('findOne', () => {
    it('should return a campaign if it exists', async () => {
      const campaignId = 1;
      const campaign = { id: campaignId, name: 'Test Campaign' };
      mockCampaignRepository.findOneBy.mockReturnValue(campaign);

      const result = await service.findOne(campaignId);

      expect(result).toEqual(campaign);
      expect(mockCampaignRepository.findOneBy).toHaveBeenCalledWith({ id: campaignId });
    });

    it('should throw an error if campaign does not exist', async () => {
      const campaignId = 1;
      mockCampaignRepository.findOneBy.mockReturnValue(null);

      await expect(service.findOne(campaignId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should throw an error if campaign does not exist', async () => {
      const campaignId = 1;
      const updateData: UpdateCampaignDto = { name: 'Updated Campaign', userId: 'user-id' };
      mockCampaignRepository.findOneBy.mockReturnValue(null);

      await expect(service.update(campaignId, updateData)).rejects.toThrow(NotFoundException);
    });

    it('should update and save a campaign', async () => {
      const campaignId = 1;
      const updateData: UpdateCampaignDto = { name: 'Updated Campaign', userId: '' };
      const existingCampaign = { id: campaignId, name: 'Old Campaign' };

      mockCampaignRepository.findOneBy.mockReturnValue(existingCampaign);
      mockCampaignRepository.save.mockReturnValue({ ...existingCampaign, ...updateData });

      const result = await service.update(campaignId, updateData);

      expect(result).toEqual({ ...existingCampaign, ...updateData });
      expect(mockCampaignRepository.findOneBy).toHaveBeenCalledWith({ id: campaignId });
      expect(mockCampaignRepository.save).toHaveBeenCalledWith({
        ...existingCampaign,
        ...updateData,
      });
    });
  });
});
