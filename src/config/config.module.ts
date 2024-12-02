import { Module } from '@nestjs/common';
import { ConfigService } from './config.service';
import { ConfigService as NestConfigService } from '@nestjs/config';
import { ConfigModule as NestConfigModule } from '@nestjs/config';

@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      envFilePath:
        process.env.NODE_ENV === 'production' ? '.env.prod' : '.env.dev',
    }),
  ],
  providers: [NestConfigService],
  exports: [ConfigService],
})
export class ConfigModule {}
