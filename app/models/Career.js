const mongoose = require('mongoose');

const careerSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  resume: String,
  appliedPosition: String,
  status: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.models.Career || mongoose.model('Career', careerSchema);
