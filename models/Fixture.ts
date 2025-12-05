import  { Schema, model, models } from 'mongoose';

const fixtureSchema = new Schema({
  round: { type: Number, required: true },
  home: { type: String, required: true },
  away: { type: String, required: true },
  date: { type: Date, default: null }, // optional
});

// Avoid recompiling the model in dev
const Fixture = models.Fixture || model('Fixture', fixtureSchema);
export default Fixture;
