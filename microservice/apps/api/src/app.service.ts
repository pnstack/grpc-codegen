import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc, ClientProxy } from '@nestjs/microservices';
import { HeroesService } from '@nstack/proto';
import { lastValueFrom, Observable } from 'rxjs';

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
}
