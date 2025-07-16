import mongoose from 'mongoose';

const leadSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: String,
  email: String,
  message: String,
  submittedAt: Date
}, { collection: 'leads' });

export default mongoose.models.Lead || mongoose.model('Lead', leadSchema);