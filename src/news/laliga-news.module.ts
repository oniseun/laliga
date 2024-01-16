import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LaLigaNewsController } from './laliga-news.controller';
import { LaLigaNewsSchema } from './laliga-news.model';
import { LaLigaNewsService } from './laliga-news.service';
import { ApiModule } from '../api/api.module';
import { LaLigaTeamService } from '../team/laliga-team.service';
import { LaLigaTeamSchema } from '../team/laliga-team.model';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'LaLigaNews', schema: LaLigaNewsSchema },
      { name: 'LaLigaTeam', schema: LaLigaTeamSchema },
    ]),
    ApiModule,
    CacheModule.register(),
  ],
  controllers: [LaLigaNewsController],
  providers: [LaLigaNewsService, LaLigaTeamService],
})
export class NewsModule {}
