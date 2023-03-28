import { CacheModule, Module } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CurrencyService } from './currency.service';
import { CurrencyController } from './currency.controller';
import { CurrencyRepository } from './currency.repository';

@Module({
  imports: [CacheModule.register()],
  controllers: [CurrencyController],
  providers: [CurrencyService, CurrencyRepository, PrismaService],
  exports: [CurrencyService, CurrencyRepository],
})
export class CurrencyModule {}
