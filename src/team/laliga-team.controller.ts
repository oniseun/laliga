import { Controller, Get, Param } from '@nestjs/common';
import { LaLigaTeamService } from './laliga-team.service';
import { LaLigaTeam } from './laliga-team.model';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

// Controller for handling LaLiga team-related endpoints
@Controller('laliga')
@ApiTags('LaLiga Teams')
export class LaLigaTeamController {
  // Constructor with dependency injection for the LaLigaTeamService
  constructor(private readonly laLigaTeamService: LaLigaTeamService) {}

  // Endpoint to get all LaLiga teams
  @Get('teams')
  @ApiOperation({ summary: 'Get all LaLiga Teams' })
  @ApiResponse({
    status: 200,
    description: 'List of LaLiga Teams',
    type: [LaLigaTeam],
  })
  getLaligaTeams(): Promise<LaLigaTeam[]> {
    return this.laLigaTeamService.getLaligaTeams();
  }

  // Endpoint to get a specific LaLiga team by teamId
  @Get('team/:id')
  @ApiOperation({ summary: 'Get LaLiga Team by Team ID' })
  @ApiParam({ name: 'id', description: 'Team ID', type: Number })
  @ApiResponse({
    status: 200,
    description: 'LaLiga Team for the specified ID',
    type: LaLigaTeam,
  })
  @ApiResponse({ status: 404, description: 'Team not found' })
  getLaligaTeamById(@Param('id') teamId: number): Promise<LaLigaTeam> {
    return this.laLigaTeamService.getLaligaTeamById(teamId);
  }
}
