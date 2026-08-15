import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { CatalogueService } from './catalogue.service';
import { CreateProductDto } from './dto/create-product.dto';
import { CreateInquiryDto } from './dto/create-inquiry.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('catalogue')
export class CatalogueController {
  constructor(private catalogueService: CatalogueService) {}

  @Get()
  getProducts() {
    return this.catalogueService.getProducts();
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  createProduct(@Body() dto: CreateProductDto) {
    return this.catalogueService.createProduct(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  deleteProduct(@Param('id') id: string) {
    return this.catalogueService.deleteProduct(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('reorder')
  reorderProducts(@Body('orderedIds') orderedIds: string[]) {
    return this.catalogueService.reorderProducts(orderedIds);
  }

  @Post('inquiries')
  createInquiry(@Body() dto: CreateInquiryDto) {
    return this.catalogueService.createInquiry(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('inquiries')
  getInquiries() {
    return this.catalogueService.getInquiries();
  }

  @UseGuards(JwtAuthGuard)
  @Get('unread-count')
  getUnreadCount() {
    return this.catalogueService.getUnreadCount();
  }
}
