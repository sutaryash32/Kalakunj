import { IsString, IsOptional, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({ example: 'Product title' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'Short product description', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 'https://example.com/image.jpg' })
  @IsUrl()
  imageUrl: string;
}
