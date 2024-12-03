import { Injectable, Inject } from '@nestjs/common';
import { AuthorizationCode } from 'simple-oauth2';
import { Service } from 'src/config/config.service';
import { DocusignConfigDto } from 'src/config/dto/docusign-config.dto';

@Injectable()
export class DocusignService {
  private oauth2: AuthorizationCode;
  private config: DocusignConfigDto;

  constructor(@Inject(Service) private configService: Service) {
    this.config = this.configService.getDocusignConfig();

    this.oauth2 = new AuthorizationCode({
      client: {
        id: this.config.docusign.integrationKey,
        secret: this.config.docusign.clientSecret,
      },
      auth: {
        tokenHost: this.config.docusign.oAuthBaseUrl,
        tokenPath: '/oauth/token',
        authorizePath: '/oauth/auth',
      },
    });
  }

  // Controi a uri de consentimento, para o usuario autorizar o uso da aplicacao
  // A uri de consetimento redireciona para a rota designada como redirecturi que nesse caso eh nossa rota callback
  // A rota callback pega o code gerado na resposta do redirecionamento da api do docusign e com ele conseguimos gerar o access token
  getConsentUri(): string {
    const authorizationUri = this.oauth2.authorizeURL({
      redirect_uri: this.config.docusign.redirectUrl,
      scope: 'signature',
    });
    return authorizationUri;
  }

  // Troca o código de autorização pelo token de acesso
  async getAccessToken(code: string) {
    const tokenParams = {
      code,
      redirect_uri: this.config.docusign.redirectUrl,
    };
    try {
      const accessToken = await this.oauth2.getToken(tokenParams);
      return accessToken.token.access_token;
    } catch (error) {
      throw new Error('Erro ao obter token de acesso');
    }
  }
}
