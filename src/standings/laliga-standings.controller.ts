import { Controller, Get, Logger, Param } from '@nestjs/common';
import { LaLigaStandingsService } from './laliga-standings.service';
import { LaLigaTeamService } from '../team/laliga-team.service';
import { ApiService } from '../api/api.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import { StandingsApi } from '../api/api.interface';
import { LaLigaStandings } from './laliga-standings.model';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

@Controller('laliga/standings')
@ApiTags('LaLiga Standings')
export class LaLigaStandingsController {
  private readonly logger = new Logger(LaLigaStandingsController.name);
  constructor(
    private readonly standingsService: LaLigaStandingsService,
    private readonly teamService: LaLigaTeamService,
    private readonly apiService: ApiService,
  ) {}

  async onModuleInit() {
    const standingsCount = await this.standingsService.recordCount();
    if (standingsCount === 0) {
      // Schedule the cron job when the module is initialized
      this.createLaLigaStandings();
    }
  }

  @Cron(CronExpression.EVERY_30_MINUTES_BETWEEN_9AM_AND_5PM)
  async createLaLigaStandings() {
    try {
      // Fetch standings data from the API
      this.logger.log('Fetching la liga standings from source..');
      const standingsData: StandingsApi[] =
        await this.apiService.getLaLigaStandings();
      this.logger.log('Done fetching data from source');

      // Clear both LaligaTeam and LaLigaStandings databases
      this.logger.log('Clearing current teams record...');
      await this.teamService.emptyRecords();
      this.logger.log('Clearing current standings record..');
      await this.standingsService.emptyRecords();
      this.logger.log('DONE with clearance');

      // Create teams in bulk
      this.logger.log('Creating Teams in bulk.');
      await this.teamService.createLaligaTeam(standingsData);
      this.logger.log('Done creating Teams in bulk.');

      // Create standings in bulk
      this.logger.log('Create Standings in bulk..');
      await this.standingsService.createLaLigaStandings(standingsData);
      this.logger.log('Done creating Standings in bulk.');
    } catch (error) {
      // Handle errors
      this.logger.error('error running cron schedule', error);
    }
  }
  @Get(':teamId')
  @ApiOperation({ summary: 'Get LaLiga Standings by Team ID' })
  @ApiParam({ name: 'teamId', description: 'Team ID', type: Number })
  @ApiResponse({
    status: 200,
    description: 'LaLiga Standings for the specified team',
    type: LaLigaStandings,
  })
  @ApiResponse({ status: 404, description: 'Team not found' })
  @Get(':teamId')
  getLaLigaStanding(@Param('teamId') teamId: number): Promise<LaLigaStandings> {
    return this.standingsService.getLaLigaStanding(teamId);
  }
}
