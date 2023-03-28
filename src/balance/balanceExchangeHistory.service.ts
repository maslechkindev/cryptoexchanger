import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma.service';
import { Cache } from 'cache-manager';

@Injectable()
export class BalanceExchangeHistoryService {
  constructor(
    private readonly prismaService: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  @Cron(CronExpression.EVERY_10_SECONDS, {
    name: 'update_account_balance',
  })
  updateAccountBalanceHistory() {
    console.log('UPDATE!!!!!!!!');
  }
}
