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
      },
    };
    console.log(docusignConfig);
    return docusignConfig;
  }
}
