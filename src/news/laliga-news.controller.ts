import {
  Controller,
  Get,
  Query,
  NotFoundException,
  Logger,
} from '@nestjs/common';

import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { LaLigaNewsService } from './laliga-news.service';
import { LaLigaTeamService } from '../team/laliga-team.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ApiService } from '../api/api.service';
import { NewsApi } from 'src/api/api.interface';
import { LaLigaNews } from './laliga-news.model';

// Controller for handling LaLiga news-related endpoints
@Controller('laliga/news')
@ApiTags('LaLiga News')
export class LaLigaNewsController {
  private readonly logger = new Logger(LaLigaNewsController.name);

  // Constructor with dependency injection for required services
  constructor(
    private readonly newsService: LaLigaNewsService,
    private readonly teamService: LaLigaTeamService,
    private readonly apiService: ApiService,
  ) {}

  // Method executed when the module is initialized
  async onModuleInit() {
    // Check if there are no existing news records in the database
    const newsCount = await this.newsService.recordCount();
    if (newsCount === 0) {
      // Schedule the cron job to create news when the module is initialized
      this.createNews();
    }
  }

  // Cron job to fetch and save LaLiga news from the source every 2 hours
  @Cron(CronExpression.EVERY_2_HOURS)
  async createNews() {
    try {
      // Fetch news data from the API
      this.logger.log('Fetching LaLiga news from source..');
      const newsData: NewsApi[] = await this.apiService.getLaLigaNews();
      this.logger.log('Saving in the database..');
      const result = await this.newsService.createManyNews(newsData);
      this.logger.log(`${result} news items saved successfully.`);
    } catch (error) {
      // Handle errors during the cron job
      this.logger.error('Error fetching news from source', error);
    }
  }

  // Cron job to clear the news database every weekend
  @Cron(CronExpression.EVERY_WEEKEND)
  async clearNewsDB() {
    try {
      this.logger.log('Emptying the news database');
      await this.newsService.emptyRecords();
      this.logger.log('News Database Emptied');
    } catch (error) {
      // Handle errors during the cron job
      this.logger.error('Error clearing the news database', error);
    }
  }

  // Endpoint to search for LaLiga news by teamId
  @Get('search')
  @ApiOperation({ summary: 'Search news by teamId' })
  @ApiQuery({ name: 'teamId', description: 'Team ID', type: Number })
  @ApiResponse({
    status: 200,
    description: 'LaLiga News matching the search team criteria',
    type: [LaLigaNews],
  })
  @ApiResponse({ status: 404, description: 'Team not found' })
  async searchNews(@Query('teamId') teamId: number): Promise<LaLigaNews[]> {
    try {
      // Retrieve the team details based on the teamId
      const team = await this.teamService.getLaligaTeamById(teamId);
      const teamName = team ? team.teamName : null;

      // If team not found, throw a NotFoundException
      if (!teamName) {
        throw new NotFoundException('Team ID not found');
      }

      // Search for LaLiga news based on the teamName
      return this.newsService.searchNews(teamName.toString());
    } catch (error) {
      // Log and rethrow any errors
      this.logger.error(error);
      throw error;
    }
  }
}
