import { PrismaService } from '../prisma.service';
import { Currency } from '@prisma/client';
import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { ExchangeRequestDto } from './dtos/exchangeRequest.dto';
import { ExchangeResponseDto } from './dtos/exchangeResponse.dto';
@Injectable()
export class CurrencyService {
  constructor(
    private readonly prismaService: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async currencies(): Promise<Currency[]> {
    return await this.prismaService.currency.findMany();
  }

  async exchange(body: ExchangeRequestDto): Promise<ExchangeResponseDto[]> {
    const keys = await this.cacheManager.store.keys();

    //Loop through keys and get data
    const allData: { [key: string]: any } = {};
    for (const key of keys) {
      allData[key] = await this.cacheManager.get(key);
    }
    console.log('allData', allData);

    const pair = body.cryptocurrency.reduce(
      (total: Array<ExchangeResponseDto>, cryptoItem: string) => {
        body.currency.map(async (currencyItem: string) => {
          const c = `${cryptoItem}/${currencyItem}`;
          const result = await this.cacheManager.get(c);
          if (result !== undefined) {
            const r = {
              currency: cryptoItem,
              currencyExchange: currencyItem,
              exchange: result.toString(),
            };
            total.push(r);
          }
        });
        return total;
      },
      [],
    );
    return pair;
  }

  async getAllPairCurrencies(): Promise<Array<string>> {
    const currenciesAll = await this.currencies();
    const cryptocurrency = currenciesAll.filter((currency) => currency.crypto);
    const currency = currenciesAll.filter((currency) => !currency.crypto);

    const pair = cryptocurrency.reduce(
      (total: Array<string>, cryptoItem: Currency) => {
        currency.map((currencyItem: Currency) => {
          total.push(`${cryptoItem.name}/${currencyItem.name}`);
        });
        return total;
      },
      [],
    );
    return pair;
  }
}
