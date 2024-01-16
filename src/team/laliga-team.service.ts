import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LaLigaTeam } from './laliga-team.model';
import { StandingsApi } from '../api/api.interface';

// Injectable decorator indicates that this class can be managed by NestJS dependency injection system
@Injectable()
export class LaLigaTeamService {
  // Constructor with dependency injection for the Mongoose model
  constructor(
    @InjectModel('LaLigaTeam')
    private readonly laLigaTeamModel: Model<LaLigaTeam>,
  ) {}

  // Method to create LaLiga teams from an array of standings data
  async createLaligaTeam(teamList: StandingsApi[]): Promise<LaLigaTeam[]> {
    // Transform the data to match LaLigaTeam model properties
    const transformedTeams = teamList.map((team) => ({
      teamId: team.teamId,
      teamName: team.teamName,
    }));

    // Save transformed teams in bulk to the database
    return this.laLigaTeamModel.insertMany(transformedTeams);
  }

  // Method to retrieve all LaLiga teams from the database
  async getLaligaTeams(): Promise<LaLigaTeam[]> {
    return this.laLigaTeamModel.find().exec();
  }

  // Method to retrieve a specific LaLiga team by its teamId
  async getLaligaTeamById(teamId: number): Promise<LaLigaTeam> {
    // Query the database for a team based on the teamId
    const team = await this.laLigaTeamModel.findOne({ teamId }).exec();

    // If no team is found, throw a NotFoundException
    if (!team) {
      throw new NotFoundException(`Team with ID ${teamId} not found`);
    }

    // Return the found team
    return team;
  }

  // Method to delete all records of LaLiga teams from the database
  async emptyRecords(): Promise<any> {
    return await this.laLigaTeamModel.deleteMany({}).exec();
  }
}
