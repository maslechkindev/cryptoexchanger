import { PrismaService } from '../prisma.service';
import { Balance, Currency } from '@prisma/client';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BalanceRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async balances(): Promise<(Balance & { currency: Currency })[]> {
    const balances = await this.prismaService.balance.findMany({
      include: {
        currency: true,
      },
    });
    return balances;
  }
}
