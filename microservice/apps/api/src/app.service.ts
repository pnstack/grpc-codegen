import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc, ClientProxy } from '@nestjs/microservices';
import {
  ClientStreamRequest,
  ClientStreamResponse,
  HeroesService,
  TwoWayStreamRequest,
  TwoWayStreamResponse,
} from '@nstack/proto';
import { interval, lastValueFrom, map, Observable, ReplaySubject } from 'rxjs';

@Injectable()
export class AppService implements OnModuleInit {
  // constructor(@Inject('MATH_SERVICE') private client: ClientProxy) {}
  // async getHello() {
  //   const result = await this.client
  //     .emit('notifications', 'helloo world')
  //     .subscribe((dt) => {
  //       console.log(dt);
  //     });
  //   console.log('send', result);

  //   return 'Hello World!';
  // }

  private heroesService: HeroesService;

  constructor(@Inject('HERO_PACKAGE') private client: ClientGrpc) {}

  onModuleInit() {
    this.heroesService = this.client.getService<HeroesService>('HeroesService');
    console.log(
      '🚀 ~ file: app.service.ts:26 ~ AppService ~ onModuleInit ~ heroesService',
      this.heroesService,
    );
  }
  async getHero() {
    // @ts-ignore
    const dt = await lastValueFrom(this.heroesService.FindOne({ id: 1 }));
    console.log('dt', dt);

    return dt;
  }

  async serverStream() {
    this.heroesService
      .ServerStream({
        num: 10,
      })
      .subscribe({
        next(value) {
          console.log('res', value);
        },
      });
  }
  async clientStream() {
    const observable = new Observable<ClientStreamRequest>((subscriber) => {
      subscriber.next({
        num: 1,
      });
      subscriber.next({
        num: 2,
      });
      subscriber.next({ num: 3 });
      subscriber.complete();
    });
    // @ts-ignore
    const res = await lastValueFrom(
      // @ts-ignore
      this.heroesService.ClientStream(observable),
    );
    console.log(res);
  }

  async twoWayStream() {
    // const observable = new Observable<ClientStreamRequest>((subscriber) => {
    //   subscriber.next({
    //     num: 1,
    //   });
    //   subscriber.next({
    //     num: 2,
    //   });
    //   subscriber.next({ num: 3 });
    // });

    // const helloRequest$ = new ReplaySubject<ClientStreamRequest>();

    // this.heroesService.TwoWayStream(observable).subscribe({
    //   next(value) {
    //     console.log(value);
    //   },
    // });

    // const requests$ = interval(1000).pipe(
    //   map((num) => {
    //     const request: ClientStreamResponse = {
    //       num: 10,
    //     };
    //     return request;
    //   }),
    // );

    // // @ts-ignore
    // this.heroesService.ClientStream(requests$).subscribe({
    //   next(value) {
    //     console.log(value);
    //   },
    // });
    // console.log("stream")

    const call = this.heroesService.TwoWayStream;
  }
}
