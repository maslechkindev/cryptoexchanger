import { CacheModule, Module } from '@nestjs/common';
import { BalanceExchangeHistoryService } from './balanceExchangeHistory.service';
import { PrismaService } from '../prisma.service';
import { CurrencyModule } from '../currency/currency.module';
import { BalanceRepository } from './balance.repository';

@Module({
  imports: [CacheModule.register(), CurrencyModule],
  providers: [BalanceExchangeHistoryService, PrismaService, BalanceRepository],
})
export class BalanceModule {}
