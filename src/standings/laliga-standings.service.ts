import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LaLigaStandings } from './laliga-standings.model';
import { StandingsApi } from '../api/api.interface';

// Injectable decorator indicates that this class can be managed by NestJS dependency injection system
@Injectable()
export class LaLigaStandingsService {
  // Constructor with dependency injection for the Mongoose model
  constructor(
    @InjectModel('LaLigaStandings')
    private readonly LaLigaStandingsModel: Model<LaLigaStandings>,
  ) {}

  // Method to create LaLiga standings from an array of standings data
  async createLaLigaStandings(
    standingsList: StandingsApi[],
  ): Promise<LaLigaStandings[]> {
    // Transform the standings data to match the schema and structure
    const transformedStandings = standingsList.map((standing) => ({
      rank: standing.rank,
      teamId: standing.teamId,
      win: standing.win,
      draw: standing.draw,
      goalFor: standing.goalFor,
      goalAgainst: standing.goalAgainst,
      points: standing.points,
    }));

    // Save transformed standings data in bulk to the database
    return this.LaLigaStandingsModel.insertMany(transformedStandings);
  }

  // Method to retrieve LaLiga standings for a specific team
  async getLaLigaStanding(teamId: number): Promise<LaLigaStandings> {
    // Query the database for standings data based on the teamId
    const standings = await this.LaLigaStandingsModel.findOne({
      teamId,
    }).exec();

    // If no standings data is found, throw a NotFoundException
    if (!standings) {
      throw new NotFoundException('No Standing Data Found');
    }

    // Return the found standings data
    return standings;
  }

  // Method to delete all records in the database
  async emptyRecords(): Promise<void> {
    await this.LaLigaStandingsModel.deleteMany({}).exec();
  }

  // Method to retrieve the count of records in the database
  async recordCount(): Promise<number> {
    return await this.LaLigaStandingsModel.countDocuments().exec();
  }
}
