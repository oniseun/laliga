import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LaLigaTeam } from './laliga-team.model';
import { StandingsApi } from '../api/api.interface';

@Injectable()
export class LaLigaTeamService {
  constructor(
    @InjectModel('LaLigaTeam')
    private readonly laLigaTeamModel: Model<LaLigaTeam>,
  ) {}

  async createLaligaTeam(teamList: StandingsApi[]): Promise<LaLigaTeam[]> {
    // Transform the data to match LaLigaTeam model properties
    const transformedTeams = teamList.map((team) => ({
      teamId: team.teamId,
      teamName: team.teamName,
    }));

    // Save transformed teams in bulk
    return this.laLigaTeamModel.insertMany(transformedTeams);
  }
  async getLaligaTeams(): Promise<LaLigaTeam[]> {
    return this.laLigaTeamModel.find().exec();
  }

  async getLaligaTeamById(teamId: number): Promise<LaLigaTeam> {
    const team = await this.laLigaTeamModel.findOne({ teamId }).exec();
    if (!team) {
      throw new NotFoundException(`Team with ID ${teamId} not found`);
    }
    return team;
  }

  async emptyRecords(): Promise<any> {
    return await this.laLigaTeamModel.deleteMany({}).exec();
  }
}
