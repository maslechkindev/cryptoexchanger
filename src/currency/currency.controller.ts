import { Controller, Get } from '@nestjs/common';
import { AccountService } from './acount.service';

@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}
  @Get()
  async getHello(): Promise<string> {
    const cache = await this.accountService.getCache();
    console.log(cache);
    return 'Hello!';
  }
}
