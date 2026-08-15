import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private usersRepo: Repository<User>,
    private jwtService: JwtService,
  ) {}

  // Runs once on boot: makes sure an admin user exists, seeded from .env
  async ensureSeedAdmin() {
    const username = process.env.ADMIN_USERNAME || 'admin';
    const existing = await this.usersRepo.findOne({ where: { username } });
    if (existing) return;
    const passwordHash = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'changeme123', 10);
    await this.usersRepo.save(this.usersRepo.create({ username, passwordHash, role: 'admin' }));
  }

  async login(username: string, password: string) {
    const user = await this.usersRepo.findOne({ where: { username } });
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) throw new UnauthorizedException('Invalid credentials');
    const token = this.jwtService.sign({ sub: user.id, username: user.username, role: user.role });
    return { token, user: { id: user.id, username: user.username, role: user.role } };
  }
}
