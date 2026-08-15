import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../entities/product.entity';
import { Inquiry } from '../entities/inquiry.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { CreateInquiryDto } from './dto/create-inquiry.dto';

@Injectable()
export class CatalogueService {
  constructor(
    @InjectRepository(Product) private productsRepo: Repository<Product>,
    @InjectRepository(Inquiry) private inquiriesRepo: Repository<Inquiry>,
  ) {}

  // GET /catalogue — public, ordered by manual sortOrder
  getProducts() {
    return this.productsRepo.find({ order: { sortOrder: 'ASC' } });
  }

  // POST /catalogue — admin only
  async createProduct(dto: CreateProductDto) {
    const maxSort = await this.productsRepo
      .createQueryBuilder()
      .select('MAX("sortOrder")', 'max')
      .getRawOne();
    const nextSort = (maxSort?.max ?? -1) + 1;
    const product = this.productsRepo.create({
      title: dto.title,
      description: dto.description,
      imageUrl: dto.imageUrl,
      sortOrder: nextSort,
    });
    return this.productsRepo.save(product);
  }

  async deleteProduct(id: string) {
    const result = await this.productsRepo.delete(id);
    if (!result.affected) throw new NotFoundException('Product not found');
    return { deleted: true };
  }

  async reorderProducts(orderedIds: string[]) {
    const updates = orderedIds.map((id, index) => ({ id, sortOrder: index }));
    await this.productsRepo.manager.transaction(async (manager) => {
      for (const update of updates) {
        await manager.update(Product, update.id, { sortOrder: update.sortOrder });
      }
    });
    return { reordered: true };
  }

  // POST /catalogue/inquiries — public, from the client's inquiry cart
  createInquiry(dto: CreateInquiryDto) {
    const inquiry = this.inquiriesRepo.create(dto);
    return this.inquiriesRepo.save(inquiry);
  }

  getInquiries() {
    return this.inquiriesRepo.find({ order: { createdAt: 'DESC' } });
  }

  getUnreadCount() {
    return { count: 0 };
  }
}
