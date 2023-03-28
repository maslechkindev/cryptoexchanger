import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PrismaService } from './prisma.service';
import { KrakenService } from './kraken/kraken.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const prismaService = app.get(PrismaService, { strict: false });
  await prismaService.enableShutdownHooks(app);
  app.get(KrakenService, { strict: false });
  await app.listen(3000);
}
bootstrap();
