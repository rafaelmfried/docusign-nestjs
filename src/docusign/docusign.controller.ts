import { Controller, Get, Query, Redirect } from '@nestjs/common';
import { DocusignService } from './docusign.service';

@Controller('auth/docusign')
export class DocusignController {
  constructor(private readonly docusignService: DocusignService) {}

  // Rota para redirecionar o usuário para o DocuSign
  @Get('login')
  @Redirect()
  async login() {
    console.log('entrei em login');
    const url = this.docusignService.getAuthorizationUrl();
    console.log(url);
    return { url };
  }

  // Rota de callback após a autenticação
  @Get('callback')
  async callback(@Query('code') code: string) {
    console.log(code);
    const accessToken = await this.docusignService.getAccessToken(code);
    console.log(accessToken);
    return { accessToken };
  }
}
