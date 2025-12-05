import { Schema, model, models } from 'mongoose';

const ResultSchema = new Schema({
  homeTeam: { type: String, required: true },
  awayTeam: { type: String, required: true },
  homeGoals: Number,
  awayGoals: Number,
  date: { type: Date, required: true },
});

export default models.Result || model('Result', ResultSchema);
