import { Module } from '@nestjs/common';
import { BalanceModule } from './balance/balance.module';
import { CurrencyModule } from './currency/currency.module';
import { PrismaService } from './prisma.service';
import { ConfigModule } from '@nestjs/config';
import { KrakenModule } from './kraken/kraken.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    BalanceModule,
    CurrencyModule,
    KrakenModule,
    ConfigModule.forRoot(),
    ScheduleModule.forRoot(),
  ],
  providers: [PrismaService],
})
export class AppModule {}
