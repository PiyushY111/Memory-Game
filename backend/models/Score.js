import mongoose from 'mongoose';

const scoreSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  displayName: {
    type: String,
    required: true
  },
  score: {
    type: Number,
    required: true
  },
  level: {
    type: String,
    required: true
  },
  moves: {
    type: Number,
    required: true
  },
  misses: {
    type: Number,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

// Index for efficient queries
scoreSchema.index({ userId: 1, level: 1 });
scoreSchema.index({ score: -1 });
scoreSchema.index({ level: 1, score: -1 });

export default mongoose.model('Score', scoreSchema); 