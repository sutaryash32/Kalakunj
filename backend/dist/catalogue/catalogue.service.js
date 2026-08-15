"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CatalogueService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const product_entity_1 = require("../entities/product.entity");
const inquiry_entity_1 = require("../entities/inquiry.entity");
let CatalogueService = class CatalogueService {
    constructor(productsRepo, inquiriesRepo) {
        this.productsRepo = productsRepo;
        this.inquiriesRepo = inquiriesRepo;
    }
    getProducts() {
        return this.productsRepo.find({ order: { sortOrder: 'ASC' } });
    }
    async createProduct(dto) {
        const maxSort = await this.productsRepo
            .createQueryBuilder()
            .select('MAX(sortOrder)', 'max')
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
    async deleteProduct(id) {
        const result = await this.productsRepo.delete(id);
        if (!result.affected)
            throw new common_1.NotFoundException('Product not found');
        return { deleted: true };
    }
    async reorderProducts(orderedIds) {
        const updates = orderedIds.map((id, index) => ({ id, sortOrder: index }));
        await this.productsRepo.manager.transaction(async (manager) => {
            for (const update of updates) {
                await manager.update(product_entity_1.Product, update.id, { sortOrder: update.sortOrder });
            }
        });
        return { reordered: true };
    }
    createInquiry(dto) {
        const inquiry = this.inquiriesRepo.create(dto);
        return this.inquiriesRepo.save(inquiry);
    }
    getInquiries() {
        return this.inquiriesRepo.find({ order: { createdAt: 'DESC' } });
    }
    getUnreadCount() {
        return { count: 0 };
    }
};
exports.CatalogueService = CatalogueService;
exports.CatalogueService = CatalogueService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(product_entity_1.Product)),
    __param(1, (0, typeorm_1.InjectRepository)(inquiry_entity_1.Inquiry)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], CatalogueService);
//# sourceMappingURL=catalogue.service.js.map