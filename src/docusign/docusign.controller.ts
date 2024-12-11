import { Body, Controller, Get, Post, Query, Redirect } from '@nestjs/common';
import { DocusignService } from './docusign.service';
// import { ShowEnvelopeStatusDto } from './dto/envelope-status.dto';
import { SendEnvelopeDto } from './dto/send-envelope.dto';
import { CreateEnvelopeDto } from './dto/create-envelope.dto';

@Controller('docusign')
export class DocusignController {
  constructor(private readonly docusignService: DocusignService) {}

  // 1. Endpoint para obter a URL de consentimento
  @Get('auth')
  @Redirect()
  async login() {
    const url = this.docusignService.getConsentUri();
    console.log('url: ', url);
    return url;
  }

  // 2. Endpoint de callback após a autenticação
  @Get('auth/callback')
  async callback(@Query('code') code: string) {
    await this.docusignService.getAccessToken(code);
    return { message: 'Token de acesso obtido com sucesso' };
  }

  // 3. Endpoint para definição  do envelope com as tabs e roles de assinatura e envio do template.
  @Get('envelope/definition')
  async envelopeDefinition() {
    const data = {
      emailSubject: 'Contrato - Assinatura necessária',
      templateId: '6284754b-a511-46bd-8ab1-295706f353e0',
      templateRoles: [
        {
          roleName: 'Party A', // Papel configurado no template
          name: 'Rafael Friederick',
          email: 'rafael.friederick@gmail.com',
          tabs: {
            textTabs: [
              { tabLabel: 'contractDate', value: '10/12/2024' },
              { tabLabel: 'arbitrationCity', value: 'Salvador' },
            ],
          },
        },
        {
          roleName: 'Party B', // Papel configurado no template
          name: 'Américo Alves Silveira',
          email: 'rafael.friederick@hotmail.com',
        },
      ],
    };
    return await this.docusignService.envelopeDefinition(data);
  }

  // 4. Endpoint para criar um envelope
  @Post('envelope/create')
  async createEnvelope(@Body() createEnvelopeDto: CreateEnvelopeDto) {
    const envelopeId =
      await this.docusignService.createEnvelope(createEnvelopeDto);
    return { envelopeId };
  }

  // 5. Endpoint para enviar o envelope
  @Post('envelope/send')
  async sendEnvelope(@Body() sendEnvelopeDto: SendEnvelopeDto) {
    const status = await this.docusignService.sendEnvelope(
      sendEnvelopeDto.envelopeId,
    );
    return { status };
  }

  // 6. Endpoint para verificar o status de um envelope
  @Post('envelope/status')
  async showEnvelopeStatus() {
    const status = await this.docusignService.showEnvelopeStatus();
    return { status };
  }

  // 7. Endpoint para listar os templates
  @Get('templates/list')
  async listTemplates() {
    const templates = await this.docusignService.listTemplates();
    return templates;
  }
}
