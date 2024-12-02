import { Inject, Injectable } from '@nestjs/common';
import docusign from 'docusign-esign';
import assert from 'node:assert';
import { error } from 'node:console';
import { ConfigService } from 'src/config/config.service';

@Injectable()
export class DocusignService {
  constructor(
    @Inject(ConfigService) private readonly configService: ConfigService,
  ) {}
  async create() {
    const config = await this.configService.getDocusignConfig();
    const apiClient = new docusign.ApiClient();
    apiClient
      .generateAccessToken(
        config.docusign.integrationKey,
        config.docusign.secretKey,
        100,
      )
      .then((oAuthToken) => {
        assert.equal(error, undefined);
        assert.notEqual(oAuthToken, undefined);
        assert.notEqual(oAuthToken.accessToken, undefined);
        assert.ok(oAuthToken.expiresIn > 0);

        console.log(oAuthToken);

        apiClient
          .getUserInfo(oAuthToken.accessToken)
          .then(function (userInfo) {
            assert.equal(error, undefined);
            assert.notEqual(userInfo, undefined);
            assert.notEqual(userInfo.accounts, undefined);
            assert.ok(userInfo.accounts.length > 0);

            console.log('UserInfo: ' + userInfo);
            // parse first account's basePath
            // below code required for production, no effect in demo (same
            // domain)
            apiClient.setBasePath(userInfo.accounts[0].baseUri + '/restapi');
            return oAuthToken;
          })
          .catch(function (err) {
            throw err;
          });
      })
      .catch(function (err) {
        throw err;
      });
  }
}
