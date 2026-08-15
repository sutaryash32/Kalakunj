import { Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { AuthService } from './auth/auth.service';
import { CatalogueModule } from './catalogue/catalogue.module';
import { UploadModule } from './upload/upload.module';
import { User } from './entities/user.entity';
import { Product } from './entities/product.entity';
import { Inquiry } from './entities/inquiry.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 3307,
      username: process.env.DB_USERNAME || 'root',
      password: process.env.DB_PASSWORD || 'root',
      database: process.env.DB_NAME || 'catalogue',
      entities: [User, Product, Inquiry],
      synchronize: true, // fine for dev; switch to migrations for production
    }),
    AuthModule,
    CatalogueModule,
    UploadModule,
  ],
})
export class AppModule implements OnModuleInit {
  constructor(private authService: AuthService) {}

  async onModuleInit() {
    await this.authService.ensureSeedAdmin();
  }
}
