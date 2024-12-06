import { Inject, Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';

@Injectable()
export class Service {
  constructor(
    @Inject(NestConfigService)
    private readonly configService: NestConfigService,
  ) {}

  getDocusignConfig() {
    console.log(this.configService);
    const docusignConfig = {
      docusign: {
        baseUrl: this.configService.get<string>('DOCUSIGN_BASE_URL'),
        accountId: this.configService.get<string>('DOCUSIGN_ACCOUNT_ID'),
        userId: this.configService.get<string>('DOCUSIGN_USER_ID'),

        integrationKey: this.configService.get<string>(
          'DOCUSIGN_INTEGRATION_KEY',
        ),
        clientSecret: this.configService.get<string>('DOCUSIGN_CLIENT_SECRET'),
        oAuthBaseUrl: this.configService.get<string>('DOCUSIGN_OAUTH_BASE_URL'),
        redirectUrl: this.configService.get<string>('DOCUSIGN_REDIRECT_URL'),
        accessToken:
          'eyJ0eXAiOiJNVCIsImFsZyI6IlJTMjU2Iiwia2lkIjoiNjgxODVmZjEtNGU1MS00Y2U5LWFmMWMtNjg5ODEyMjAzMzE3In0.AQoAAAABAAUABwCAnsej0BTdSAgAgN7qsRMV3UgCAIWK81PABn1MpInaVUQnClwVAAEAAAAYAAEAAAAFAAAADQAkAAAAZWFmN2Y1ZWEtNTYzMS00Y2NlLWIxZjAtZmFkYjM2YzQ3MzBiIgAkAAAAZWFmN2Y1ZWEtNTYzMS00Y2NlLWIxZjAtZmFkYjM2YzQ3MzBiMAAAZfMuzhTdSDcAMJeQs5sd5E2WXCwERr46Og.OL-ez8AxwgTkQiXrVAoHt1RF3ri55hzEsRbiatHU7z9dDNu_ATW0KGkmPSLe5k5-xKI8fM8WrrguDQZPm_P3mpskoRHqijpHSTWMSLB5Kcv2jRb2HHE5UA00GsLr_GqicBUvrQYXKzdKdzJbGmNPNzGWeD2AkxOQoV5DLjJO9ywUvWsXcU_KZ3cZ88vT2t4931aDZFBmU1pDPeex2kmrxjg6lanfkfnU27OQ_upJle98Bd5DV6Y6dFc2rY-H8Oitsr6WOe0Hk0SYwdPIqQ5uMBocIJvwoRUlESpbEHQk_B06-M-ykC1uXLHc7blUOS9v7u2Jfq_kCjybk61449xiaw',
      },
    };
    console.log(docusignConfig);
    return docusignConfig;
  }
}
