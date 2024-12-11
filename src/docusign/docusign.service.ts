import { Injectable, Inject } from '@nestjs/common';
import { AuthorizationCode } from 'simple-oauth2';
import { Service } from 'src/config/config.service';
import { DocusignConfigDto } from 'src/config/dto/docusign-config.dto';
import {
  ApiClient,
  TemplatesApi,
  EnvelopesApi,
  EnvelopesInformation,
  Templates,
} from 'docusign-esign';
import { RequestUserInfoResponse } from './dto/request-user-info.dto';

@Injectable()
export class DocusignService {
  private oauth2: AuthorizationCode;
  private config: DocusignConfigDto;
  private accessToken: string;
  private user: RequestUserInfoResponse;

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

  // 1. Retorna uma URL de consentimento para o frontend
  getConsentUri(): string {
    const authorizationUri = this.oauth2.authorizeURL({
      redirect_uri: this.config.docusign.redirectUrl,
      scope: 'signature',
    });
    console.log('consent uri: ', authorizationUri);
    return authorizationUri;
  }

  // 2. Troca o código de autorização pelo token de acesso
  async getAccessToken(code: string) {
    const tokenParams = {
      code,
      redirect_uri: this.config.docusign.redirectUrl,
    };
    try {
      const accessToken = await this.oauth2.getToken(tokenParams);
      this.accessToken = accessToken.token.access_token;
      console.log('access token: service', this.accessToken);
      this.apiClient.addDefaultHeader(
        'Authorization',
        'Bearer ' + this.accessToken,
      );

      await this.userInfo();
    } catch (error) {
      throw new Error('Erro ao obter token de acesso');
    }
  }

  // 3. Obtem os dados completos do usuário do DocuSign e armazena na classe
  async userInfo() {
    try {
      const { accounts }: RequestUserInfoResponse =
        await this.apiClient.getUserInfo(this.accessToken);
      this.user = { accounts };
      console.log('User Info:', this.user);
    } catch (error) {
      throw new Error('Erro ao obter informações do usuário');
    }
  }

  // 4. Cria uma definição de envelope com dados dinâmicos
  async envelopeDefinition(data: any) {
    const envelopeDefinition = {
      emailSubject: 'Contrato - Assinatura necessária',
      templateId: data.templateId,
      templateRoles: data.templateRoles.map((role) => ({
        roleName: role.roleName,
        name: role.name,
        email: role.email,
        tabs: role.tabs,
      })),
      status: 'created',
    };

    console.log(
      'Envelope Definition:',
      JSON.stringify(envelopeDefinition, null, 2),
    );
    return envelopeDefinition;
  }

  // 5. Cria o envelope e retorna o ID
  async createEnvelope(data: any): Promise<string> {
    const { accountId } = this.config.docusign;
    const envelopesApi = new EnvelopesApi(this.apiClient);

    try {
      const envelopeDefinition = await this.envelopeDefinition(data);

      const envelope = await envelopesApi.createEnvelope(accountId, {
        envelopeDefinition,
      });

      if (!envelope || !envelope.envelopeId) {
        throw new Error('Falha ao criar envelope: Envelope ID não retornado.');
      }

      return envelope.envelopeId;
    } catch (error) {
      console.error(
        'Erro ao criar envelope:',
        error.response?.data || error.message,
      );

      // Verrificar erro resposta da API
      if (error.response) {
        const errorDetails = error.response.data || error.response;
        throw new Error(
          `Erro ao criar envelope na DocuSign: ${errorDetails.message || 'Erro desconhecido'}`,
        );
      } else {
        throw new Error(
          `Erro inesperado: ${error.message || 'Erro desconhecido'}`,
        );
      }
    }
  }

  // 6. Envia o envelope criado pelo seu ID
  async sendEnvelope(envelopeId: string): Promise<any> {
    const envelopesApi = new EnvelopesApi(this.apiClient);
    const { accountId } = this.config.docusign;

    try {
      const envelopeSummary = await envelopesApi.getEnvelope(
        accountId,
        envelopeId,
      );
      console.log('Envelope encontrado:', envelopeSummary);

      const envelopeStatus = {
        status: 'sent',
      };

      const sentEnvelope = await envelopesApi.update(
        accountId,
        envelopeId,
        envelopeStatus,
      );
      console.log('Envelope enviado com sucesso:', sentEnvelope);
      return sentEnvelope;
    } catch (error) {
      console.error(
        'Erro ao enviar o envelope:',
        error.response?.data || error.message,
      );
      throw new Error('Erro ao enviar envelope');
    }
  }

  // 7. Exibe o status dos envelopes usando o Connect do DocuSign ----------> Working and Thinking how this shits work better?
  async showEnvelopeStatus(envelopeIds: string): Promise<EnvelopesInformation> {
    const envelopesApi = new EnvelopesApi(this.apiClient);
    const status = await envelopesApi.listStatusChanges(
      this.config.docusign.accountId,
      {
        envelopeIds,
        fromDate: '2024-01-01',
        toDate: new Date().toISOString(),
      },
    );
    return status;
  }

  // 8. Lista todos os templates disponíveis na conta DocuSign
  async listTemplates() {
    const templatesApi = new TemplatesApi(this.apiClient);
    const templates = await templatesApi.listTemplates(
      this.config.docusign.accountId,
    );
    templates.envelopeTemplates?.forEach((template: Templates) => {
      console.log(
        `Template Name: ${template.name}, Template ID: ${template.templateId}`,
      );
    });
    return templates.envelopeTemplates;
  }
}
