import { Module } from '@nestjs/common';
import { ProductsModule } from './products/products.module';
import { ConfigModule } from '@nestjs/config';
import { DrizzleModule } from './drizzle/drizzle.module';

@Module({
  imports: [
    DrizzleModule,
    ProductsModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
