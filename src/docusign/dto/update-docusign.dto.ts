import { PartialType } from '@nestjs/mapped-types';
import { CreateDocusignDto } from './create-docusign.dto';

export class UpdateDocusignDto extends PartialType(CreateDocusignDto) {}
