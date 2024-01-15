import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LaLigaTeamController } from './laliga-team.controller';
import { LaLigaTeamService } from './laliga-team.service';
import { LaLigaTeamSchema } from './laliga-team.model';
import { ApiModule } from '../api/api.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'LaLigaTeam', schema: LaLigaTeamSchema },
    ]),
    ApiModule,
  ],
  controllers: [LaLigaTeamController],
  providers: [LaLigaTeamService],
})
export class LaligaTeamModule {}
