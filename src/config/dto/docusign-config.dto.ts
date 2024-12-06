export class DocusignConfigDto {
  docusign?: {
    baseUrl?: string;
    accountId?: string;
    userId?: string;
    integrationKey?: string;
    clientSecret?: string;
    oAuthBaseUrl?: string;
    redirectUrl?: string;
    accessToken?: string;
  };
}
