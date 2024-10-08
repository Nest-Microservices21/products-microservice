import { Module, ValidationPipe } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { APP_PIPE } from '@nestjs/core';
import { DrizzleModule } from 'src/drizzle/drizzle.module';
@Module({
  controllers: [ProductsController],
  providers: [
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
        always: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
      }),
    },
    ProductsService,
  ],
  imports: [DrizzleModule],
})
export class ProductsModule {}
