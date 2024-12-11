import { IsArray, IsString, IsEmail } from 'class-validator';

export class CreateEnvelopeDto {
  @IsEmail()
  emailSubject: string;

  @IsString()
  templateId: string;

  @IsArray()
  templateRoles: {
    roleName: string;
    name: string;
    email: string;
    tabs?: {
      textTabs?: Array<{
        tabLabel: string;
        value: string;
      }>;
    };
  }[];

  @IsString()
  status: string;
}
