import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from '@common/entities';
import { TransactionModule } from '@/modules/transaction/transaction.module';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';

@Module({
  imports: [TypeOrmModule.forFeature([Category]), TransactionModule],
  controllers: [CategoryController],
  providers: [CategoryService],
})
export class CategoryModule {}
