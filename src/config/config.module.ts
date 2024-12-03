import { Module } from '@nestjs/common';
import { Service } from './config.service';
import {
  ConfigService as NestConfigService,
  ConfigModule as NestConfigModule,
} from '@nestjs/config';

@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      envFilePath:
        process.env.NODE_ENV === 'production' ? '.env.prod' : '.env.dev',
    }),
  ],
  providers: [NestConfigService, Service],
  exports: [Service],
})
export class CModule {}
