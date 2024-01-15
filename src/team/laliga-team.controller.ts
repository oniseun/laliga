import { Controller, Get, Param } from '@nestjs/common';
import { LaLigaTeamService } from './laliga-team.service';
import { LaLigaTeam } from './laliga-team.model';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

@Controller('laliga')
@ApiTags('LaLiga Teams')
export class LaLigaTeamController {
  constructor(private readonly laLigaTeamService: LaLigaTeamService) {}

  @Get('teams')
  @ApiOperation({ summary: 'Get all LaLiga Teams' })
  @ApiResponse({
    status: 200,
    description: 'List of LaLiga Teams',
    type: [LaLigaTeam],
  })
  @Get('teams')
  getLaligaTeams(): Promise<LaLigaTeam[]> {
    return this.laLigaTeamService.getLaligaTeams();
  }

  @Get('team/:id')
  @ApiOperation({ summary: 'Get LaLiga Team by Team ID' })
  @ApiParam({ name: 'id', description: 'Team ID', type: Number })
  @ApiResponse({
    status: 200,
    description: 'LaLiga Team for the specified ID',
    type: LaLigaTeam,
  })
  @ApiResponse({ status: 404, description: 'Team not found' })
  @Get('team/:id')
  getLaligaTeamById(@Param('id') teamId: number): Promise<LaLigaTeam> {
    return this.laLigaTeamService.getLaligaTeamById(teamId);
  }
}
