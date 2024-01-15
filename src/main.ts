import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log'],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  app.enableCors();
  const options = new DocumentBuilder()
    .setTitle('LaLiga API')
    .setDescription('API documentation for LaLiga News and Standings')
    .setVersion('1.0')
    .addTag('LaLiga News Standings')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('swagger', app, document);

  // Define the HTTP port
  const httpPort =
    parseInt(app.get<ConfigService>(ConfigService).get<string>('APP_PORT')) ||
    3000;
  await app.listen(httpPort);
}
bootstrap();
