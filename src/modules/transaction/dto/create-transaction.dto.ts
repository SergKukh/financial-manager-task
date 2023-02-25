import { IsString, IsNumber, IsArray, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TransactionType } from '@common/types';
import { mockBank, mockTransaction } from '@common/mocks';

export class CreateTransactionDto {
  @ApiProperty({
    example: mockBank.id,
    description: 'Bank id',
  })
  @IsString()
  bank: string;

  @ApiProperty({
    example: TransactionType.PROFITABLE,
    description: 'Transaction type',
  })
  @IsEnum(TransactionType)
  type: TransactionType;

  @ApiProperty({
    example: mockTransaction.amount,
    description: 'Transaction amount',
  })
  @IsNumber()
  amount: number;

  @ApiProperty({
    example: mockTransaction.categories,
    description: 'Array of category ids',
  })
  @IsArray()
  @IsString({ each: true })
  categories: string[];
}
