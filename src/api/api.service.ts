import { Injectable, Logger } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { HttpService } from '@nestjs/axios';

import { ConfigService } from '@nestjs/config';
import { NewsApi, StandingsApi } from './api.interface';

@Injectable()
export class ApiService {
  private readonly logger = new Logger(ApiService.name);
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async getLaLigaStandings(): Promise<StandingsApi[]> {
    const options = {
      params: {
        Category: 'soccer',
        Ccd: 'spain',
        Scd: 'laliga',
      },
      headers: {
        'X-RapidAPI-Key': this.configService.get('RAPID_API_KEY'),
        'X-RapidAPI-Host': this.configService.get('LIVESCORE_STANDINGS_HOST'),
      },
    };

    try {
      const response: AxiosResponse = await this.httpService
        .get(this.configService.get('LIVESCORE_STANDINGS_ENDPOINT'), options)
        .toPromise();
      const teams = this.extractTeamsInLTT1(response.data);
      return teams;
    } catch (error) {
      this.logger.error(error);
      throw new Error(`Failed to fetch data from the API: ${error.message}`);
    }
  }

  private extractTeamsInLTT1(teams: any): StandingsApi[] {
    // Assuming data is the JSON response from the API
    const teamsInLTT1 =
      teams.LeagueTable.L[0]?.Tables.find((table) => table.LTT === 1)?.team ||
      [];
    return this.mapStandingApiResponseToModel(teamsInLTT1);
  }

  private mapStandingApiResponseToModel(teamList) {
    const combinedModelMapping = {
      rnk: 'rank',
      Tid: 'teamId',
      Tnm: 'teamName',
      win: 'win',
      drw: 'draw',
      gf: 'goalFor',
      ga: 'goalAgainst',
      gd: 'goalDifference',
      ptsn: 'points',
    };

    return teamList.map((item) => {
      const mappedItem = {};
      for (const key in item) {
        if (combinedModelMapping[key]) {
          mappedItem[combinedModelMapping[key]] = item[key];
        }
      }
      return mappedItem;
    });
  }

  async getLaLigaNews(): Promise<NewsApi[]> {
    const options = {
      headers: {
        'X-RapidAPI-Key': this.configService.get('RAPID_API_KEY'),
        'X-RapidAPI-Host': this.configService.get('LALIGA_NEWS_HOST'),
      },
    };

    try {
      const response: AxiosResponse = await this.httpService
        .get(this.configService.get('LALIGA_NEWS_ENDPOINT'), options)
        .toPromise();
      const teams = this.mapNewsApiResponseToModel(response.data);
      return teams;
    } catch (error) {
      throw new Error(`Failed to fetch data from the API: ${error.message}`);
    }
  }

  private mapNewsApiResponseToModel(newsList) {
    const combinedModelMapping = {
      url: 'url',
      title: 'title',
      news_image: 'newsImage',
      short_desc: 'shortDesc',
    };

    return newsList.map((item) => {
      const mappedItem = {};
      for (const key in item) {
        if (combinedModelMapping[key]) {
          mappedItem[combinedModelMapping[key]] = item[key];
        }
      }
      return mappedItem;
    });
  }
}
