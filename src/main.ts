import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
async function bootstrap() {
  const logger = new Logger('Main')
  const app = await NestFactory.createMicroservice< MicroserviceOptions>(AppModule, {
    transport: Transport.TCP,
    options: {
      port: Number(process.env.PORT) || 5000,
    },
    logger
  });
  await app.listen();
  logger.log(`Microservice is listening on port ${process.env.PORT}`);

}
bootstrap();
