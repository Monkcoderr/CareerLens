const mongoose = require('mongoose');

const AIjobSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    company: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true
    },
    position: {
      type: String,
      required: [true, 'Position is required'],
      trim: true
    },
    location: {
      type: String,
      default: ''
    },
    salary: {
      type: String,
      default: ''
    },
    url: {
      type: String,
      default: ''
    },
    status: {
      type: String,
      enum: ['saved', 'applied', 'interviewing', 'offered', 'rejected', 'accepted'],
      default: 'saved'
    },
    notes: {
      type: String,status: {
      type: String,
      enum: ['saved', 'applied', 'interviewing', 'offered', 'rejected', 'accepted'],
      default: 'saved'
    },
    notes: {
      type: String,
      default: ''
    },appliedDate: {
          type: Date,
          default: null
        }
      },fileName: {
      type: String,
      required: true
    },
      { timestamps: true }
    );
    
    module.exports = mongoose.model('Job', jobSchema);