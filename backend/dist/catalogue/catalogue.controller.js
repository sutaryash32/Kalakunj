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
exports.CatalogueController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const catalogue_service_1 = require("./catalogue.service");
const create_product_dto_1 = require("./dto/create-product.dto");
const create_inquiry_dto_1 = require("./dto/create-inquiry.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let CatalogueController = class CatalogueController {
    constructor(catalogueService) {
        this.catalogueService = catalogueService;
    }
    getProducts() {
        return this.catalogueService.getProducts();
    }
    createProduct(dto) {
        return this.catalogueService.createProduct(dto);
    }
    deleteProduct(id) {
        return this.catalogueService.deleteProduct(id);
    }
    reorderProducts(orderedIds) {
        return this.catalogueService.reorderProducts(orderedIds);
    }
    createInquiry(dto) {
        return this.catalogueService.createInquiry(dto);
    }
    getInquiries() {
        return this.catalogueService.getInquiries();
    }
    getUnreadCount() {
        return this.catalogueService.getUnreadCount();
    }
};
exports.CatalogueController = CatalogueController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'List all products in catalogue order' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns an array of products.', type: [Object] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CatalogueController.prototype, "getProducts", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)(),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new product (admin only)' }),
    (0, swagger_1.ApiBody)({ type: create_product_dto_1.CreateProductDto }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Product created successfully.', type: Object }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized.' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_product_dto_1.CreateProductDto]),
    __metadata("design:returntype", void 0)
], CatalogueController.prototype, "createProduct", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a product by ID (admin only)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Product deleted successfully.', type: Object }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized.' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CatalogueController.prototype, "deleteProduct", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Patch)('reorder'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Reorder products by providing ordered IDs (admin only)' }),
    (0, swagger_1.ApiBody)({
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
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Products reordered successfully.', type: Object }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized.' }),
    __param(0, (0, common_1.Body)('orderedIds')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", void 0)
], CatalogueController.prototype, "reorderProducts", null);
__decorate([
    (0, common_1.Post)('inquiries'),
    (0, swagger_1.ApiOperation)({ summary: 'Submit an inquiry from the public catalogue' }),
    (0, swagger_1.ApiBody)({ type: create_inquiry_dto_1.CreateInquiryDto }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Inquiry submitted successfully.', type: Object }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_inquiry_dto_1.CreateInquiryDto]),
    __metadata("design:returntype", void 0)
], CatalogueController.prototype, "createInquiry", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('inquiries'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'List all inquiries (admin only)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns an array of inquiries.', type: [Object] }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized.' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CatalogueController.prototype, "getInquiries", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('unread-count'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get unread inquiry count (admin only)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns unread inquiry count.', type: Object }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized.' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CatalogueController.prototype, "getUnreadCount", null);
exports.CatalogueController = CatalogueController = __decorate([
    (0, swagger_1.ApiTags)('catalogue'),
    (0, common_1.Controller)('catalogue'),
    __metadata("design:paramtypes", [catalogue_service_1.CatalogueService])
], CatalogueController);
//# sourceMappingURL=catalogue.controller.js.map