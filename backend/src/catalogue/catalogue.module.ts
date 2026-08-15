import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '../entities/product.entity';
import { Inquiry } from '../entities/inquiry.entity';
import { CatalogueService } from './catalogue.service';
import { CatalogueController } from './catalogue.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Inquiry])],
  providers: [CatalogueService],
  controllers: [CatalogueController],
})
export class CatalogueModule {}
