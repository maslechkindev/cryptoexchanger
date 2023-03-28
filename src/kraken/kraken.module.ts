import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CurrencyService } from './currency.service';

@Module({
  imports: [],
  controllers: [],
  providers: [CurrencyService, PrismaService],
  exports: [CurrencyService],
})
export class CurrencyModule {}
