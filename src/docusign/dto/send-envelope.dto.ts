import { IsString } from 'class-validator';

export class SendEnvelopeDto {
  @IsString()
  envelopeId: string;
}
