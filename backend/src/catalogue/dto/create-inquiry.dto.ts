import { IsArray, IsOptional, IsString } from 'class-validator';

export class CreateInquiryDto {
  @IsArray()
  items: Record<string, any>[];

  @IsOptional()
  @IsString()
  contactName?: string;

  @IsOptional()
  @IsString()
  contactPhone?: string;
}
