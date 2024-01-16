// Import necessary modules and libraries
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

// Define a Mongoose schema for LaLigaStandings
@Schema()
export class LaLigaStandings extends Document {
  @Prop({ unique: true }) // Unique rank for each standing
  rank: number;

  @Prop() // Number of matches played
  matchPlayed: number;

  @Prop() // Number of wins
  win: number;

  @Prop() // Number of draws
  draw: number;

  @Prop() // Number of goals scored
  goalFor: number;

  @Prop() // Number of goals conceded
  goalAgainst: number;

  @Prop() // Total points earned
  points: number;

  @Prop({ type: Number, ref: 'LaligaTeam', unique: true }) // Reference to the LaligaTeam model with a unique teamId
  teamId: number;
}

// Create the Mongoose schema based on the LaLigaStandings class
export const LaLigaStandingsSchema =
  SchemaFactory.createForClass(LaLigaStandings);
