import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { UnprocessableEntityException, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      exceptionFactory: (errors) => {
        return new UnprocessableEntityException({
          message: 'Error de validación',
          status: false,
          errors: errors.map((error) => ({
            field: error.property,
            messages: Object.values(error.constraints ?? {}),
          })),
        });
      },
    }),
  );
  app.enableCors();
  await app.listen(process.env.PORT ?? 5000);
}
await bootstrap();
