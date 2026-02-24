const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    fileName: {
      type: String,
      required: true
    },
    rawText: {
      type: String,
      required: true
    },
    targetRole: {
      type: String,
      default: ''
    },
    analysis: {
      overallScore: { type: Number, default: 0 },
      atsCompatibility: { type: Number, default: 0 },
      sections: {
        contact: { score: { type: Number, default: 0 }, feedback: { type: String, default: '' } },
        experience: { score: { type: Number, default: 0 }, feedback: { type: String, default: '' } },
        education: { score: { type: Number, default: 0 }, feedback: { type: String, default: '' } },
        skills: { score: { type: Number, default: 0 }, feedback: { type: String, default: '' } },
        projects: { score: { type: Number, default: 0 }, feedback: { type: String, default: '' } },
        formatting: { score: { type: Number, default: 0 }, feedback: { type: String, default: '' } }
      },
      keywords: { type: [String], default: [] },
      missingKeywords: { type: [String], default: [] },
      strengths: { type: [String], default: [] },
      improvements: { type: [String], default: [] }
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Resume', resumeSchema);