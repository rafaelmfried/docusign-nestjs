export class RequestUserInfoResponse {
  accounts: {
    accountId: string;
    isDefault: 'true' | 'false';
    baseUri: string;
  }[];
}
