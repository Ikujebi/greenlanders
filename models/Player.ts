import mongoose from 'mongoose';

const PlayerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  teamId: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true },
  goals: { type: Number, default: 0 },
  assists: { type: Number, default: 0 },
  yellowCards: { type: Number, default: 0 },
  redCards: { type: Number, default: 0 },
  picture: { type: String, default: "" }, // optional, default is empty string
});

export default mongoose.models.Player || mongoose.model('Player', PlayerSchema);
