export class GetOAuthDto {
  scopes: string[];
  clientId: string;
  redirectUri: string;
  responseType: string;
  randomState?: string;
}
