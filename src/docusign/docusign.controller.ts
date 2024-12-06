import {
  Controller,
  Get,
  Query,
  Redirect,
  Post,
  Body,
  Param,
} from '@nestjs/common';
import { DocusignService } from './docusign.service';

@Controller('auth/docusign')
export class DocusignController {
  constructor(private readonly docusignService: DocusignService) {}

  // Rota para redirecionar o usuário para o DocuSign
  @Get('login')
  @Redirect()
  async login() {
    const url = this.docusignService.getConsentUri();
    return { url };
  }

  // Rota de callback após a autenticação
  @Get('callback')
  async callback(@Query('code') code: string) {
    const accessToken = await this.docusignService.getAccessToken(code);
    return { accessToken };
  }

  @Post('populate-template')
  async populateTemplate(@Body() data: any) {
    return await this.docusignService.populateTemplate(data.templateId, data);
  }

  @Post('send-envelope/:id')
  async sendEnvelope(@Param('id') envelopeId: string) {
    return await this.docusignService.sendEnvelope(envelopeId);
  }

  @Get('documents-status')
  async listDocumentsStatus() {
    return await this.docusignService.listDocumentsStatus();
  }

  @Get('list-template')
  async listTemplate() {
    return await this.docusignService.listTemplates();
  }
}
