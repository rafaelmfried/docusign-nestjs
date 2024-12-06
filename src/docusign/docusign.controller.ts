import {
  Controller,
  Get,
  Query,
  Redirect,
  // Post,
  // Body,
  // Param,
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
    console.log('url: ', url);
    return { url };
  }

  // Rota de callback após a autenticação
  @Get('callback')
  async callback(@Query('code') code: string) {
    const accessToken = await this.docusignService.getAccessToken(code);
    console.log('access token: ', accessToken);
    return { accessToken };
  }

  // @Post('populate-template')
  // async populateTemplate(@Body() data: any) {
  //   return await this.docusignService.populateTemplate(data.templateId, data);
  // }

  // @Post('send-envelope/:id')
  // async sendEnvelope(@Param('id') envelopeId: string) {
  //   return await this.docusignService.sendEnvelope(envelopeId);
  // }

  // @Get('documents-status')
  // async listDocumentsStatus() {
  //   return await this.docusignService.listDocumentsStatus();
  // }

  @Get('create-envelope')
  async createEnvelope() {
    const envDef = await this.envelopeDefinition();
    return await this.docusignService.createEnvelope(envDef);
  }

  @Get('list-template')
  async listTemplate() {
    return await this.docusignService.listTemplates();
  }

  @Get('test')
  async userInfo() {
    return await this.docusignService.userInfo();
  }

  @Get('envDef')
  async envelopeDefinition() {
    const templateId = '476bec7e-79b9-4b3d-bcfa-09cc0d28da00';
    const data = {
      fullName: 'rafael',
      emailDevedor: 'rafa.fried@gmail.com',
    };
    return await this.docusignService.envelopeDefinition(templateId, data);
  }
}
