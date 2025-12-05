import  { Schema, model, models } from 'mongoose';

const TeamSchema = new Schema({
  name: { type: String, required: true },
  logo: String,
});

export default models.Team || model('Team', TeamSchema);
