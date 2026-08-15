import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.setGlobalPrefix('api');

  const swaggerUrl = (process.env.SWAGGER_URL || `http://localhost:${process.env.PORT || 3000}`).replace(/\/$/, '');
  const config = new DocumentBuilder()
    .setTitle('Kalakunj Catalogue API')
    .setDescription('API endpoints for the Kalakunj product catalogue and admin operations')
    .setVersion('1.0')
    .addServer(swaggerUrl)
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'JWT')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = Number(process.env.PORT) || 3000;
  await app.listen(port, '0.0.0.0');
  console.log(`Catalogue API running on ${swaggerUrl}/api`);
  console.log(`Swagger docs available at ${swaggerUrl}/api/docs`);
}
bootstrap();
