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

@Controller('laliga/news')
@ApiTags('LaLiga News')
export class LaLigaNewsController {
  private readonly logger = new Logger(LaLigaNewsController.name);
  constructor(
    private readonly newsService: LaLigaNewsService,
    private readonly teamService: LaLigaTeamService,
    private readonly apiService: ApiService,
  ) {}

  async onModuleInit() {
    const newsCount = await this.newsService.recordCount();
    if (newsCount === 0) {
      // Schedule the cron job when the module is initialized
      this.createNews();
    }
  }

  @Cron(CronExpression.EVERY_2_HOURS)
  async createNews() {
    try {
      // Fetch standings data from the API
      this.logger.log('Fetching la liga news from source..');
      const newsData: NewsApi[] = await this.apiService.getLaLigaNews();
      this.logger.log('saving in db..');
      const result = await this.newsService.createManyNews(newsData);
      this.logger.log(`${result} news items saved successfully.`);
    } catch (error) {
      // Handle errors
      this.logger.error('error fetching news from source', error);
    }
  }

  @Cron(CronExpression.EVERY_WEEKEND)
  async clearNewsDB() {
    try {
      this.logger.log('Emptying news database');
      await this.newsService.emptyRecords();
      this.logger.log('News Database Emptied');
    } catch (error) {
      // Handle errors
      this.logger.error('error clearing news databse', error);
    }
  }

  @Get('search')
  @ApiOperation({ summary: 'Search news by teamId' })
  @ApiQuery({ name: 'teamId', description: 'Team ID', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Laliga News matching the search team criteria',
    type: [LaLigaNews],
  })
  @ApiResponse({ status: 404, description: 'Team not found' })
  async searchNews(@Query('teamId') teamId: number): Promise<LaLigaNews[]> {
    try {
      const team = await this.teamService.getLaligaTeamById(teamId);
      const teamName = team ? team.teamName : null;

      if (!teamName) {
        throw new NotFoundException('Team Id not found');
      }
      return this.newsService.searchNews(teamName.toString());
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
