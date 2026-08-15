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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = require("bcryptjs");
const user_entity_1 = require("../entities/user.entity");
let AuthService = class AuthService {
    constructor(usersRepo, jwtService) {
        this.usersRepo = usersRepo;
        this.jwtService = jwtService;
    }
    async ensureSeedAdmin() {
        const username = process.env.ADMIN_USERNAME || 'admin';
        const existing = await this.usersRepo.findOne({ where: { username } });
        if (existing)
            return;
        const passwordHash = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'changeme123', 10);
        await this.usersRepo.save(this.usersRepo.create({ username, passwordHash, role: 'admin' }));
    }
    async login(username, password) {
        const user = await this.usersRepo.findOne({ where: { username } });
        if (!user)
            throw new common_1.UnauthorizedException('Invalid credentials');
        const valid = await bcrypt.compare(password, user.passwordHash);
        if (!valid)
            throw new common_1.UnauthorizedException('Invalid credentials');
        const token = this.jwtService.sign({ sub: user.id, username: user.username, role: user.role });
        return { token, user: { id: user.id, username: user.username, role: user.role } };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map