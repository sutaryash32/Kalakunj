import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(); // lock this down to your frontend's real origin in production
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.setGlobalPrefix('api');

  const config = new DocumentBuilder()
    .setTitle('Kalakunj Catalogue API')
    .setDescription('API endpoints for the Kalakunj product catalogue and admin operations')
    .setVersion('1.0')
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'JWT')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(process.env.PORT || 3000);
  console.log(`Catalogue API running on http://localhost:${process.env.PORT || 3000}/api`);
  console.log(`Swagger docs available at ${process.env.SWAGGER_URL || `http://localhost:${process.env.PORT || 3000}/api/docs`}`);
}
bootstrap();
