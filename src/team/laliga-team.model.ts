import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class LaLigaTeam extends Document {
  @Prop({ unique: true })
  teamId: number;

  @Prop({ unique: true })
  teamName: string;
}

export const LaLigaTeamSchema = SchemaFactory.createForClass(LaLigaTeam);
