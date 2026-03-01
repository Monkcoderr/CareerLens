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
      type: String,