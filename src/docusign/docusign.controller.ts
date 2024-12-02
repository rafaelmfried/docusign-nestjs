import { Controller, Post } from '@nestjs/common';
import { DocusignService } from './docusign.service';

@Controller('docusign')
export class DocusignController {
  constructor(private readonly docusignService: DocusignService) {}

  @Post()
  create() {
    return this.docusignService.create();
  }
}
