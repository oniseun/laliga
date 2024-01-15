import { Controller, Get, Param } from '@nestjs/common';
import { LaLigaTeamService } from './laliga-team.service';
import { LaLigaTeam } from './laliga-team.model';

@Controller('laliga')
export class LaLigaTeamController {
  constructor(private readonly laLigaTeamService: LaLigaTeamService) {}

  @Get('teams')
  getLaligaTeams(): Promise<LaLigaTeam[]> {
    return this.laLigaTeamService.getLaligaTeams();
  }

  @Get('team/:id')
  getLaligaTeamById(@Param('id') teamId: number): Promise<LaLigaTeam> {
    return this.laLigaTeamService.getLaligaTeamById(teamId);
  }
}
