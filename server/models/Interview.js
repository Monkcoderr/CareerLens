const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  idealAnswer: { type: String, default: '' },
  userAnswer: { type: String, default: '' },
  aiFeedback: { type: String, default: '' },
  score: { type: Number, default: 0 }
});

const interviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    role: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ['technical', 'behavioral', 'system-design', 'mixed'],
      default: 'mixed'
    },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      default: 'medium'
    },
    questions: [questionSchema],
    overallScore: {
      type: Number,
      default: 0
    },
    overallFeedback: {
      type: String,
      default: ''
    },
    completedAt: {
      type: Date,
      default: null
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Interview', interviewSchema);