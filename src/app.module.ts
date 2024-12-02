import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DocusignModule } from './docusign/docusign.module';
import { ConfigModule } from './config/config.module';

@Module({
  imports: [DocusignModule, ConfigModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
