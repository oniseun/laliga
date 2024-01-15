import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LaLigaStandingsController } from './laliga-standings.controller';
import { LaLigaStandingsService } from './laliga-standings.service';
import { LaLigaStandingsSchema } from './laliga-standings.model';
import { ApiModule } from '../api/api.module';
import { LaLigaTeamService } from '../team/laliga-team.service';
import { LaligaTeamModule } from '../team/laliga-team.module';
import { LaLigaTeamSchema } from '../team/laliga-team.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'LaLigaStandings', schema: LaLigaStandingsSchema },
      { name: 'LaLigaTeam', schema: LaLigaTeamSchema },
    ]),
    ApiModule,
    LaligaTeamModule,
  ],
  controllers: [LaLigaStandingsController],
  providers: [LaLigaStandingsService, LaLigaTeamService],
})
export class LaLigaStandingsModule {}
