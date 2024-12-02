import { Module } from '@nestjs/common';
import { DocusignService } from './docusign.service';
import { DocusignController } from './docusign.controller';
import { ConfigService } from 'src/config/config.service';

@Module({
  controllers: [DocusignController],
  providers: [DocusignService, ConfigService],
  exports: [DocusignService],
})
export class DocusignModule {}
