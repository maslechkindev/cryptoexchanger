import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma.service';
import { Cache } from 'cache-manager';
import { CurrencyRepository } from '../currency/currency.repository';
import { CurrencyService } from '../currency/currency.service';
import { BalanceRepository } from './balance.repository';

@Injectable()
export class BalanceExchangeHistoryService {
  constructor(
    private readonly prismaService: PrismaService,
    private currencyRepository: CurrencyRepository,
    private balanceRepository: BalanceRepository,
    private currencyService: CurrencyService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT, {
    name: 'update_account_balance',
  })
  async updateAccountBalanceHistory() {
    const exchangesValues = await this.getExchangesValues();
    const balances = await this.balanceRepository.balances();
    const currencies = await this.currencyRepository.currencies();

    const pp = balances.reduce((total, balance) => {
      const balanceExchanges = exchangesValues.filter((e) => {
        return e && e.currency && e.currency.includes(balance.currency.name);
      });
      const data = balanceExchanges.reduce((t, i) => {
        if (i.currency) {
          const iii = i.currency.split('/');
          const sum = parseFloat(
            parseFloat(String(balance.sum * +i.exchange)).toFixed(2),
          );
          const currencyExchange = currencies.find((ii) => ii.name === iii[1]);
          const d = {
            balanceId: balance.id,
            currencyExchangeId: currencyExchange.id,
            sum,
          };
          t.push(d);
        }
        return t;
      }, []);

      total = total.concat(data);
      return total;
    }, []);

    await this.prismaService.balanceExchangeHistory.createMany({
      data: pp,
      skipDuplicates: true,
    });
  }

  private async getExchangesValues() {
    const pair = await this.currencyService.getAllPairCurrencies();
    const res = await Promise.all(
      pair.map(async (item: string) => {
        const exchangeData = await this.cacheManager.get(item);
        if (exchangeData) {
          return {
            currency: item,
            exchange: exchangeData,
          };
        }
      }),
    );
    return res;
  }
}
