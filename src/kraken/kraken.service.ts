import { Injectable, OnModuleInit } from '@nestjs/common';
import * as WebSocket from 'ws';
import { CurrencyService } from './currency/currency.service';
import { Currency } from '@prisma/client';

@Injectable()
export class KrakenService implements OnModuleInit {
  constructor(private currencyService: CurrencyService) {}
  async onModuleInit() {
    await this.init();
  }

  async init() {
    const ws = new WebSocket(process.env.KRAKEN_WS_URL);
    const pair = await this.getPairCurrencies();
    await this.onOpen(ws, pair);
    await this.onMessage(ws);
    await this.onError(ws);
  }

  private async onOpen(ws: WebSocket, pair: Array<string>) {
    ws.on('open', function open() {
      ws.send(
        JSON.stringify({
          event: 'subscribe',
          pair: pair,
          subscription: {
            name: 'ticker',
          },
        }),
      );
    });
  }

  private async onMessage(ws: WebSocket) {
    ws.on('message', async function incoming(data) {
      const tickerData = JSON.parse(data);
      console.log(tickerData);
    });
  }

  private async onError(ws: WebSocket) {
    ws.on('error', function (error) {
      console.error(`WebSocket error: ${error}`);
    });
  }

  private async getPairCurrencies(): Promise<Array<string>> {
    const currenciesAll = await this.currencyService.currencies();
    const crypto = currenciesAll.filter((currency) => currency.crypto);
    const money = currenciesAll.filter((currency) => !currency.crypto);
    const pair = crypto.reduce((total: Array<string>, citem: Currency) => {
      money.map((mitem: Currency) => {
        total.push(`${citem.name}/${mitem.name}`);
      });
      return total;
    }, []);
    return pair;
  }

  // async updateCache(tickerData: Array<string>) {
  //   if (tickerData[1] && tickerData[1].c) {
  //     const pair = tickerData[3];
  //     const exchangeRate = parseFloat(tickerData[1].c[0]).toFixed(2);
  //     console.log(`Current exchange rate for ${pair}: ${exchangeRate}`);
  //     await this.currencyService.currencies();
  //   }
  // }
}
