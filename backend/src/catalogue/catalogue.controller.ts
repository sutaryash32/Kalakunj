import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { CatalogueService } from './catalogue.service';
import { CreateProductDto } from './dto/create-product.dto';
import { CreateInquiryDto } from './dto/create-inquiry.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('catalogue')
@Controller('catalogue')
export class CatalogueController {
  constructor(private catalogueService: CatalogueService) {}

  @Get()
  @ApiOperation({ summary: 'List all products in catalogue order' })
  @ApiResponse({ status: 200, description: 'Returns an array of products.', type: [Object] })
  getProducts() {
    return this.catalogueService.getProducts();
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new product (admin only)' })
  @ApiBody({ type: CreateProductDto })
  @ApiResponse({ status: 201, description: 'Product created successfully.', type: Object })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  createProduct(@Body() dto: CreateProductDto) {
    return this.catalogueService.createProduct(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a product by ID (admin only)' })
  @ApiResponse({ status: 200, description: 'Product deleted successfully.', type: Object })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  deleteProduct(@Param('id') id: string) {
    return this.catalogueService.deleteProduct(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('reorder')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Reorder products by providing ordered IDs (admin only)' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        orderedIds: {
          type: 'array',
          items: { type: 'string' },
          example: ['uuid-1', 'uuid-2', 'uuid-3'],
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Products reordered successfully.', type: Object })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  reorderProducts(@Body('orderedIds') orderedIds: string[]) {
    return this.catalogueService.reorderProducts(orderedIds);
  }

  @Post('inquiries')
  @ApiOperation({ summary: 'Submit an inquiry from the public catalogue' })
  @ApiBody({ type: CreateInquiryDto })
  @ApiResponse({ status: 201, description: 'Inquiry submitted successfully.', type: Object })
  createInquiry(@Body() dto: CreateInquiryDto) {
    return this.catalogueService.createInquiry(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('inquiries')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List all inquiries (admin only)' })
  @ApiResponse({ status: 200, description: 'Returns an array of inquiries.', type: [Object] })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  getInquiries() {
    return this.catalogueService.getInquiries();
  }

  @UseGuards(JwtAuthGuard)
  @Get('unread-count')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get unread inquiry count (admin only)' })
  @ApiResponse({ status: 200, description: 'Returns unread inquiry count.', type: Object })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  getUnreadCount() {
    return this.catalogueService.getUnreadCount();
  }
}
