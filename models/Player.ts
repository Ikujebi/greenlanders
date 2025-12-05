import  { Schema, model, models } from 'mongoose';

const PlayerStatSchema = new Schema({
  name: { type: String, required: true },
  team: { type: String, required: true },
  goals: { type: Number, default: 0 },
  assists: { type: Number, default: 0 },
});

export default models.PlayerStat || model('PlayerStat', PlayerStatSchema);
