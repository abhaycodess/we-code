import mongoose from 'mongoose';

const hackathonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  venue: {
    type: String,
    required: true,
  },
  organization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: [],
  }],
  problemStatements: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ProblemStatement',
    default: [],
  }],
}, { timestamps: true });

// ✅ Export using `export const`
export const Hackathon = mongoose.model('Hackathon', hackathonSchema);
export default Hackathon;