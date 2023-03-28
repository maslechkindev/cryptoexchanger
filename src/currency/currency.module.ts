import { Module } from '@nestjs/common';
import { AccountController } from './account/account.controller';
import { AppGateway } from './app/app.gateway';

@Module({
  imports: [
    // TypeOrmModu.forRoot({
    //   type: 'postgres',
    //   host: 'localhost',
    //   username: '<USERNAME>',
    //   password: '<PASSWORD>',
    //   database: 'chat',
    //   entities: [Chat],
    //   synchronize: true,
    // }),
  ],
  controllers: [AccountController],
  providers: [AppGateway],
})
export class AppModule {}
