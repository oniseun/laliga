import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/set/:key')
  async setHello(@Param('key') key: string): Promise<string> {
    return await this.appService.setHello(key);
  }

  @Get('/get/:key')
  async getHello(@Param('key') key: string): Promise<string> {
    return await this.appService.getHello(key);
  }
}
