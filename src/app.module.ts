import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DocusignModule } from './docusign/docusign.module';
import { CModule } from './config/config.module';

@Module({
  imports: [DocusignModule, CModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
