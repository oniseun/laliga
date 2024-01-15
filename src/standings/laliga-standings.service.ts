import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LaLigaStandings } from './laliga-standings.model';
import { StandingsApi } from '../api/api.interface';

@Injectable()
export class LaLigaStandingsService {
  constructor(
    @InjectModel('LaLigaStandings')
    private readonly LaLigaStandingsModel: Model<LaLigaStandings>,
  ) {}

  async createLaLigaStandings(
    standingsList: StandingsApi[],
  ): Promise<LaLigaStandings[]> {
    const transformedStandings = standingsList.map((standing) => ({
      rank: standing.rank,
      teamId: standing.teamId,
      win: standing.win,
      draw: standing.draw,
      goalFor: standing.goalFor,
      goalAgainst: standing.goalAgainst,
      points: standing.points,
    }));

    // Save transformed standings in bulk
    return this.LaLigaStandingsModel.insertMany(transformedStandings);
  }

  async getLaLigaStanding(teamId: number): Promise<LaLigaStandings> {
    const standings = await this.LaLigaStandingsModel.findOne({
      teamId,
    }).exec();
    if (!standings) {
      throw new NotFoundException('No Standing Data Found');
    }
    return standings;
  }

  async emptyRecords(): Promise<void> {
    await this.LaLigaStandingsModel.deleteMany({}).exec();
  }

  async recordCount(): Promise<number> {
    return await this.LaLigaStandingsModel.countDocuments().exec();
  }
}
