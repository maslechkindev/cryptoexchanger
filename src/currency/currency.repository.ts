import { PrismaService } from '../prisma.service';
import { Currency } from '@prisma/client';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CurrencyRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async currencies(): Promise<Currency[]> {
    return await this.prismaService.currency.findMany();
  }
}
