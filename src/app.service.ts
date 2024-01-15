import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class AppService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async setHello(key: string): Promise<string> {
    await this.cacheManager.set(key, 'Hello World!');
    const value: string = await this.cacheManager.get(key);
    return value;
  }

  async getHello(key: string): Promise<string> {
    const value: string = await this.cacheManager.get(key);
    return value;
  }
}
