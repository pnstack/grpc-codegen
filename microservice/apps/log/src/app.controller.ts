import { Controller, Get } from '@nestjs/common';
import {
  Ctx,
  GrpcMethod,
  MessagePattern,
  NatsContext,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { AppService } from './app.service';
import { Hero, HeroById } from '@nstack/proto';
import { Metadata, ServerUnaryCall } from '@grpc/grpc-js';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    console.log("hello log")
    return this.appService.getHello();
  }

  // @MessagePattern('notifications')
  // getNotifications(@Payload() data: any, @Ctx() context: RmqContext) {
  //   // const channel = context.getChannelRef();
  //   const originalMsg = context.getMessage();
  //   console.log(
  //     '🚀 ~ file: app.controller.ts:25 ~ AppController ~ getNotifications ~ originalMsg',
  //     originalMsg,
  //   );

  //   var buf = Buffer.from(originalMsg.content);

  //   console.log(buf.toString());

  //   // channel.ack(originalMsg);
  //   return 'ok';
  // }

  @GrpcMethod('HeroesService', 'FindOne')
  findOne(
    data: HeroById,
    metadata: Metadata,
    call: ServerUnaryCall<any, any>,
  ): Hero {
    const items = [
      { id: 1, name: 'John' },
      { id: 2, name: 'Doe' },
    ];
    console.log('call service');
    return items.find(({ id }) => id === data.id);
  }
}
