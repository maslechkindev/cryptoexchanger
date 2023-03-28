import { PrismaService } from '../prisma.service';
import { Currency } from '@prisma/client';

export class CurrencyService {
  constructor(private prisma: PrismaService) {}

  async currencies(): Promise<Currency[]> {
    console.log(this.prisma);
    return this.prisma.currency.findMany();
  }
}
