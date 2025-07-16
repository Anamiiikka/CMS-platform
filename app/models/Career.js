import mongoose from 'mongoose';

const careerSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: String,
  age: Number,
  experience: Number,
  resumeUrl: String,
  jobId: String,
  submittedAt: Date
}, { collection: 'applicants' });

export default mongoose.models.Career || mongoose.model('Career', careerSchema);