import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello() {
    console.log('get hello');
    // this.appService.serverStream();
    // this.appService.clientStream();
    this.appService.twoWayStream();
    return 'ok';
  }
}
