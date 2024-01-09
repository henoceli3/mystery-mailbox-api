import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { VersioningType } from '@nestjs/common';
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
  });
  app.enableVersioning({
    type: VersioningType.URI,
  });
  const server_port = process.env.SERVER_PORT;
  await app
    .listen(server_port)
    .then(() => {
      console.log(
        `Server is running on port ${server_port} : http://localhost:${server_port}`,
      );
    })
    .catch((err) => {
      console.log(err);
    });
}
bootstrap();
