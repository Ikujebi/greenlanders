import { Schema, model, models, Document } from 'mongoose';

export interface IResult extends Document {
  homeTeam: string;
  awayTeam: string;
  homeGoals: number;
  awayGoals: number;
  date: Date;
}

const ResultSchema = new Schema<IResult>({
  homeTeam: { type: String, required: true },
  awayTeam: { type: String, required: true },
  homeGoals: { type: Number, required: true },
  awayGoals: { type: Number, required: true },
  date: { type: Date, required: true },
});

export default models.Result || model<IResult>('Result', ResultSchema);
