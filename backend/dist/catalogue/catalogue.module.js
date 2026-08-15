"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CatalogueModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const product_entity_1 = require("../entities/product.entity");
const inquiry_entity_1 = require("../entities/inquiry.entity");
const catalogue_service_1 = require("./catalogue.service");
const catalogue_controller_1 = require("./catalogue.controller");
let CatalogueModule = class CatalogueModule {
};
exports.CatalogueModule = CatalogueModule;
exports.CatalogueModule = CatalogueModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([product_entity_1.Product, inquiry_entity_1.Inquiry])],
        providers: [catalogue_service_1.CatalogueService],
        controllers: [catalogue_controller_1.CatalogueController],
    })
], CatalogueModule);
//# sourceMappingURL=catalogue.module.js.map