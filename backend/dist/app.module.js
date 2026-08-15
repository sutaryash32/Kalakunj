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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const config_1 = require("@nestjs/config");
const auth_module_1 = require("./auth/auth.module");
const auth_service_1 = require("./auth/auth.service");
const catalogue_module_1 = require("./catalogue/catalogue.module");
const upload_module_1 = require("./upload/upload.module");
const user_entity_1 = require("./entities/user.entity");
const product_entity_1 = require("./entities/product.entity");
const inquiry_entity_1 = require("./entities/inquiry.entity");
let AppModule = class AppModule {
    constructor(authService) {
        this.authService = authService;
    }
    async onModuleInit() {
        await this.authService.ensureSeedAdmin();
    }
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
            typeorm_1.TypeOrmModule.forRoot({
                type: 'mysql',
                host: process.env.DB_HOST || 'localhost',
                port: Number(process.env.DB_PORT) || 3307,
                username: process.env.DB_USERNAME || 'root',
                password: process.env.DB_PASSWORD || 'root',
                database: process.env.DB_NAME || 'catalogue',
                entities: [user_entity_1.User, product_entity_1.Product, inquiry_entity_1.Inquiry],
                synchronize: true,
            }),
            auth_module_1.AuthModule,
            catalogue_module_1.CatalogueModule,
            upload_module_1.UploadModule,
        ],
    }),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AppModule);
//# sourceMappingURL=app.module.js.map