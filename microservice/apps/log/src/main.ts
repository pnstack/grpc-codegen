import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  // const app = await NestFactory.createMicroservice<MicroserviceOptions>(
  //   AppModule,
  //   {
  //     transport: Transport.GRPC,
  //     options: {
  //       package: 'hero',
  //       protoPath: './node_modules/@nstack/proto/proto/hero.proto',
  //       url: '0.0.0.0:3001',
  //       loader: { keepCase: true },
  //     },
  //   },
  // );
  // await app.listen();
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: 'hero',
      protoPath: './node_modules/@nstack/proto/proto/hero.proto',
      url: '0.0.0.0:3001',
    },
  });
  await app.startAllMicroservices();
  await app.listen(3001);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
