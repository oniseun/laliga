import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class LaLigaNews extends Document {
  @Prop()
  url: string;

  @Prop()
  title: string;

  @Prop()
  newsImage: string;

  @Prop()
  shortDesc: string;

  @Prop({ default: Date.now })
  dateCreated: Date;
}

export const LaLigaNewsSchema = SchemaFactory.createForClass(LaLigaNews);
