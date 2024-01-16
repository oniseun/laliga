import { Module } from '@nestjs/common';
import { redisStore } from 'cache-manager-redis-yet';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { NewsModule } from './news/laliga-news.module';
import { LaLigaStandingsModule } from './standings/laliga-standings.module';
import { LaligaTeamModule } from './team/laliga-team.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        store: redisStore,
        url: `redis://${configService.get('REDIS_USER')}:${encodeURIComponent(configService.get('REDIS_PASSWORD'))}@${configService.get('REDIS_HOST')}:${parseInt(configService.get('REDIS_PORT'), 10)}`,
        ttl: parseInt(configService.get('REDIS_TTL'), 10) * 1000,
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
        dbName: configService.get<string>('MONGODB_NAME'),
      }),
      inject: [ConfigService],
    }),
    NewsModule,
    LaLigaStandingsModule,
    LaligaTeamModule,
  ],
})
export class AppModule {}
