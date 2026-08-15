import { IsString, IsOptional, IsUrl } from 'class-validator';

export class CreateProductDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsUrl()
  imageUrl: string;
}
