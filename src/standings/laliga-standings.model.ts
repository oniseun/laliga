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
  teamId: number;
}

export const LaLigaStandingsSchema =
  SchemaFactory.createForClass(LaLigaStandings);
