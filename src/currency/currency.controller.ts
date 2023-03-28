import { Body, Controller, Post } from '@nestjs/common';
import { CurrencyService } from './currency.service';
import { ExchangeRequestDto } from './dtos/exchangeRequest.dto';
import { ExchangeResponseDto } from './dtos/exchangeResponse.dto';
@Controller('currency')
export class CurrencyController {
  constructor(private readonly currencyService: CurrencyService) {}
  @Post()
  async exchange(
    @Body() body: ExchangeRequestDto,
  ): Promise<ExchangeResponseDto[]> {
    const res = await this.currencyService.exchange(body);
    return res;
  }
}
