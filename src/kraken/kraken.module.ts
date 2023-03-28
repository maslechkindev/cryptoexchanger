import { CacheModule, Module } from '@nestjs/common';
import { KrakenService } from './kraken.service';
import { CurrencyModule } from '../currency/currency.module';

@Module({
  imports: [CurrencyModule, CacheModule.register()],
  providers: [KrakenService],
})
export class KrakenModule {}
