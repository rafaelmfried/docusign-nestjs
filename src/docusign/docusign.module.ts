import { Module } from '@nestjs/common';
import { DocusignService } from './docusign.service';
import { DocusignController } from './docusign.controller';
import { Service } from 'src/config/config.service';
import { CModule } from 'src/config/config.module';
import { ApiClient } from 'docusign-esign';

@Module({
  imports: [CModule],
  controllers: [DocusignController],
  providers: [DocusignService, Service, ApiClient],
  exports: [DocusignService],
})
export class DocusignModule {}
