import { mockBank } from '@common/mocks';
import { Test, TestingModule } from '@nestjs/testing';
import { BankController } from './bank.controller';
import { BankService } from './bank.service';
import { CreateBankDto, UpdateBankDto } from './dto';

describe('BankController', () => {
  let controller: BankController;

  const mockBankService = {
    create: jest
      .fn()
      .mockImplementation((body: CreateBankDto) => ({ ...body })),
    update: jest.fn().mockImplementation((id: string, body: UpdateBankDto) => ({
      ...body,
      id,
    })),
    delete: jest.fn().mockImplementation((id: string) => ({ id })),
    findById: jest
      .fn()
      .mockImplementation((id: string) => ({ ...mockBank, id })),
    findAll: jest.fn().mockImplementation(() => [mockBank]),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BankController],
      providers: [BankService],
    })
      .overrideProvider(BankService)
      .useValue(mockBankService)
      .compile();

    controller = module.get<BankController>(BankController);
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('Create bank', () => {
    it('should call create method in Bank service', async () => {
      const body = { name: 'test' };
      await controller.createBank(body);
      expect(mockBankService.create).toHaveBeenCalledWith(body);
    });
  });

  describe('Update bank', () => {
    it('should call update method in Bank service', async () => {
      const id = mockBank.id;
      const body = { name: 'test' };
      await controller.updateBank({ id }, body);
      expect(mockBankService.update).toHaveBeenCalledWith(id, body);
    });
  });

  describe('Delete bank', () => {
    it('should call delete method in Bank service', async () => {
      const id = mockBank.id;
      await controller.deleteBank({ id });
      expect(mockBankService.delete).toHaveBeenCalledWith(id);
    });
  });

  describe('Find bank by id', () => {
    it('should call findById method in Bank service', async () => {
      const id = mockBank.id;
      await controller.getBankById({ id });
      expect(mockBankService.findById).toHaveBeenCalledWith(id);
    });
  });

  describe('Find all banks', () => {
    it('should call findAll method in Bank service', async () => {
      await controller.getAllBanks();
      expect(mockBankService.findAll).toHaveBeenCalledWith();
    });
  });
});
