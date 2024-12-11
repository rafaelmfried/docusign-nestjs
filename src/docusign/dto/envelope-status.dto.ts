import { IsString } from 'class-validator';

export class ShowEnvelopeStatusDto {
  @IsString()
  envelopeIds: string;
}
