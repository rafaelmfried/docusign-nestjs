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
          'eyJ0eXAiOiJNVCIsImFsZyI6IlJTMjU2Iiwia2lkIjoiNjgxODVmZjEtNGU1MS00Y2U5LWFmMWMtNjg5ODEyMjAzMzE3In0.AQsAAAABAAUABwCA-7iNABbdSAgAgDvcm0MW3UgCAIWK81PABn1MpInaVUQnClwVAAEAAAAYAAEAAAAFAAAADQAkAAAAZWFmN2Y1ZWEtNTYzMS00Y2NlLWIxZjAtZmFkYjM2YzQ3MzBiIgAkAAAAZWFmN2Y1ZWEtNTYzMS00Y2NlLWIxZjAtZmFkYjM2YzQ3MzBiEgABAAAACwAAAGludGVyYWN0aXZlMAAAZSCNABbdSDcAMJeQs5sd5E2WXCwERr46Og.GfF1F8SFpt7iKiam5jssDNdpuPu5RqtPdprTCMUCj4fpIc1fm762KaLh0KaEdxQwlAAM5i6LMAp6wBP9JGQScDCoaFjn3Uzq95LMiJs-jlBknAnSH23KW4rTcBOuPPyNF84FSJKqUiFm5QyjG2vtsPms71tjQOiBgTR4xpDAT0fHABr1g_86Z1C3xDat9QO9CB36JLytx7kJC5BNWrdWfE4DsCRhVNzMEuu570i6hP8lixcScQCKE4HhF7N4Z_R5qHkDr_rn95VsxQ7GEQuQ9_S_9UtmKM_EQjauQf1VBNEpdRdgRwTUvPyMX6poJserB5cZ6gc2QHCF1u4e2wwayA',
      },
    };
    console.log(docusignConfig);
    return docusignConfig;
  }
}
