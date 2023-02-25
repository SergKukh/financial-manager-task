import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bank } from '@common/entities';
import { TransactionModule } from '@/modules/transaction/transaction.module';
import { BankController } from './bank.controller';
import { BankService } from './bank.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Bank]),
    forwardRef(() => TransactionModule),
  ],
  controllers: [BankController],
  providers: [BankService],
  exports: [BankService],
})
export class BankModule {}
