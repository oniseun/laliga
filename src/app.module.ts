import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
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
        socket: {
          host: configService.get('REDIS_HOST'),
          port: parseInt(configService.get('REDIS_PORT'), 10),
        },
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
    // CacheModule.register<RedisClientOptions>({
    //   store: redisStore,
    //   socket: {
    //     host: process.env.REDIS_HOST ?? 'localhost',
    //     port: parseInt(process.env.REDIS_PORT ?? '6379'),
    //   },
    // }),
    NewsModule,
    LaLigaStandingsModule,
    LaligaTeamModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
