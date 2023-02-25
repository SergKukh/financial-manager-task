import { Post, Body, Put, Param, Delete, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Controller } from '@nestjs/common';
import { Bank } from '@common/entities';
import { FindById } from '@common/types';
import { BankService } from './bank.service';
import { CreateBankDto, GetBankByIdResponseDto, UpdateBankDto } from './dto';

@ApiTags('bank')
@Controller('bank')
export class BankController {
  constructor(private readonly bankService: BankService) {}

  @ApiOperation({ summary: 'Create bank' })
  @Post('/')
  createBank(@Body() body: CreateBankDto): Promise<void> {
    return this.bankService.create(body);
  }

  @ApiOperation({ summary: 'Update bank by id' })
  @Put('/:id')
  updateBank(
    @Param() params: FindById,
    @Body() body: UpdateBankDto,
  ): Promise<void> {
    return this.bankService.update(params.id, body);
  }

  @ApiOperation({ summary: 'Delete bank by id' })
  @Delete('/:id')
  deleteBank(@Param() params: FindById): Promise<void> {
    return this.bankService.delete(params.id);
  }

  @ApiOperation({ summary: 'Find bank by id' })
  @ApiResponse({ type: GetBankByIdResponseDto })
  @Get('/:id')
  getBankById(@Param() params: FindById): Promise<Bank> {
    return this.bankService.findById(params.id);
  }

  @ApiOperation({ summary: 'Find all banks' })
  @ApiResponse({ type: [GetBankByIdResponseDto] })
  @Get('/')
  getAllBanks(): Promise<Bank[]> {
    return this.bankService.findAll();
  }
}
