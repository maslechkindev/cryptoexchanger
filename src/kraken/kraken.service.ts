import { OnModuleInit } from '@nestjs/common';
import * as WebSocket from 'ws';
import { CurrencyService } from '../currency/currency.service';
import { MessageDto } from './dtos/message.dto';
import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { WsEventsDto } from './enums/wsEvents.dto';
import { WsSubscriptionsDto } from './enums/wsSubscriptions.dto';

const CACHE_EXPIRED_PERIOD = 300000;
@Injectable()
export class KrakenService implements OnModuleInit {
  constructor(
    private currencyService: CurrencyService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async onModuleInit() {
    const ws = new WebSocket(process.env.KRAKEN_WS_URL);
    const pair = await this.currencyService.getAllPairCurrencies();
    await Promise.all([
      await this.onOpen(ws, pair),
      await this.onMessage(ws),
      await this.onError(ws),
    ]);
  }

  private async onOpen(ws: WebSocket, pair: Array<string>) {
    ws.on('open', function open() {
      ws.send(
        JSON.stringify({
          event: WsEventsDto.SUBSCRIBE,
          pair,
          subscription: {
            name: WsSubscriptionsDto.TICKER,
          },
        }),
      );
    });
  }

  private async onMessage(ws: WebSocket) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self = this;
    ws.on('message', async function incoming(data) {
      const tickerData: MessageDto = JSON.parse(data);
      await self.updateCache(tickerData);
    });
  }

  private async onError(ws: WebSocket) {
    ws.on('error', function (error) {
      console.error(`WebSocket error: ${error}`);
    });
  }

  async updateCache(tickerData: MessageDto) {
    if (tickerData[1] && tickerData[1].c) {
      const pair = tickerData[3];
      const exchangeRate = parseFloat(tickerData[1].c[0]).toFixed(2);
      if (exchangeRate) {
        await this.cacheManager.set(pair, exchangeRate, CACHE_EXPIRED_PERIOD);
      }
    }
  }
}
