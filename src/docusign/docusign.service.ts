import { Injectable, Inject } from '@nestjs/common';
import { AuthorizationCode } from 'simple-oauth2';
import { Service } from 'src/config/config.service';
import { DocusignConfigDto } from 'src/config/dto/docusign-config.dto';
import { ApiClient, TemplatesApi, EnvelopesApi } from 'docusign-esign';
import docusign from 'docusign-esign';
import { RequestUserInfoResponse } from './dto/request-user-info.dto';

@Injectable()
export class DocusignService {
  private oauth2: AuthorizationCode;
  private config: DocusignConfigDto;
  private accessToken: string;

  constructor(
    @Inject(Service) private configService: Service,
    @Inject(ApiClient) private apiClient: ApiClient,
  ) {
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

    this.apiClient.setBasePath(this.config.docusign.baseUrl);
    this.apiClient.addDefaultHeader(
      'Authorization',
      'Bearer ' + this.config.docusign.accessToken,
    );
  }

  // Constroi a uri de consentimento, para o usuario autorizar o uso da aplicacao
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
      this.accessToken = accessToken.token.access_token;
      console.log('access token: ', this.accessToken);
    } catch (error) {
      throw new Error('Erro ao obter token de acesso');
    }
  }

  async userInfo() {
    try {
      const { accounts }: RequestUserInfoResponse =
        await this.apiClient.getUserInfo(this.config.docusign.accessToken);

      console.log(accounts);
    } catch (error) {
      throw new Error('Erro ao obter informações do usuário');
    }
  }

  async envelopeDefinition(templateId: string, data: any) {
    // Cria os tabs dinamicamente com base no JSON recebido
    // const formatedData = this.formatDataForDocusign(data);
    const envelopeDefinition = {
      emailSubject: 'Teste de envio de envelope',
      templateId: templateId,
      templateRoles: [
        {
          roleName: 'signer',
          name: data.fullName,
          email: data.emailDevedor,
          tabs: {
            textTabs: [
              {
                tabLabel: 'fullName',
                value: data.nomeDevedor,
              },
            ],
          },
        },
      ],
      status: 'created',
    };
    console.log(envelopeDefinition);
    return envelopeDefinition;
  }

  async createEnvelope(envelopeDefinition): Promise<docusign.EnvelopeSummary> {
    const envelopesApi = new EnvelopesApi(this.apiClient);
    const envelope = await envelopesApi.createEnvelope(envelopeDefinition);
    console.log(envelope);
    return envelope;
  }

  // async sendEnvelope(envelopeId: string): Promise<docusign.EnvelopeSummary> {
  //   const envelopesApi = new docusign.EnvelopesApi(this.apiClient);
  //   const envelope = await envelopesApi.getEnvelope(
  //     this.config.docusign.accountId,
  //     envelopeId,
  //   );
  //   envelope.status = 'sent';
  //   return await envelopesApi.update(
  //     this.config.docusign.accountId,
  //     envelopeId,
  //     { envelope },
  //   );
  // }

  // async listDocumentsStatus(): Promise<docusign.EnvelopesInformation> {
  //   const envelopesApi = new docusign.EnvelopesApi(this.apiClient);
  //   const status = ['sent', 'delivered', 'completed'];
  //   const options = { status: status.join(',') };
  //   return await envelopesApi.listStatusChanges(
  //     this.config.docusign.accountId,
  //     options,
  //   );
  // }

  // formatDataForDocusign(data: any): any {
  //   const formattedData: any = {};

  //   function flattenObject(obj: any, parentKey: string = '') {
  //     Object.keys(obj).forEach((key) => {
  //       const newKey = parentKey
  //         ? `${parentKey}${key.charAt(0).toUpperCase() + key.slice(1)}`
  //         : key;
  //       if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
  //         flattenObject(obj[key], newKey);
  //       } else {
  //         formattedData[newKey] = obj[key];
  //       }
  //     });
  //   }

  //   flattenObject(data);
  //   return formattedData;
  // }

  async listTemplates() {
    const templatesApi = new TemplatesApi(this.apiClient);
    console.log('templates: ', templatesApi);
    const templates = await templatesApi.listTemplates(
      this.config.docusign.accountId,
    );
    console.log('templates: ', templates);
    templates.envelopeTemplates?.forEach((template) => {
      console.log(
        `Template Name: ${template.name}, Template ID: ${template.templateId}`,
      );
    });
  }
}
