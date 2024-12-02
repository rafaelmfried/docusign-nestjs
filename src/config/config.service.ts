import { Inject, Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';

@Injectable()
export class ConfigService {
  constructor(
    @Inject(NestConfigService)
    private readonly configService: NestConfigService,
  ) {}

  async getDocusignConfig() {
    return {
      docusign: {
        baseUrl: this.configService.get<string>('BASE_URL'),
        accountId: this.configService.get<string>('ACCOUNT_ID'),
        userId: this.configService.get<string>('USER_ID'),

        integrationKey: this.configService.get<string>('INTEGRATION_KEY'),
        secretKey: this.configService.get<string>('SECRET_KEY'),
      },
    };
  }
}
