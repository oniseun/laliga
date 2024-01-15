import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class LaLigaStandings extends Document {
  @Prop({ unique: true })
  rank: number;

  @Prop()
  matchPlayed: number;

  @Prop()
  win: number;

  @Prop()
  draw: number;

  @Prop()
  goalFor: number;

  @Prop()
  goalAgainst: number;

  @Prop()
  points: number;

  @Prop({ type: Number, ref: 'LaligaTeam', unique: true })
  teamId: number; // assuming you're using ObjectId as the type for teamId
}

export const LaLigaStandingsSchema =
  SchemaFactory.createForClass(LaLigaStandings);
