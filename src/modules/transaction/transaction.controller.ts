import {
  Controller,
  Post,
  Body,
  Delete,
  Param,
  Get,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FindById } from '@common/types';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto, FindAllResponse, GetAllParamsDto } from './dto';

@ApiTags('transaction')
@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @ApiOperation({ summary: 'Create transaction' })
  @Post('/')
  createTransaction(@Body() body: CreateTransactionDto) {
    return this.transactionService.create(body);
  }

  @ApiOperation({ summary: 'Delete transaction by id' })
  @Delete('/:id')
  deleteTransaction(@Param() params: FindById): Promise<void> {
    return this.transactionService.delete(params.id);
  }

  @ApiOperation({ summary: 'Find all transactions' })
  @ApiResponse({ type: [FindAllResponse] })
  @Get('/')
  getAllTransactions(
    @Query() params: GetAllParamsDto,
  ): Promise<FindAllResponse> {
    return this.transactionService.findAll(params);
  }
}
