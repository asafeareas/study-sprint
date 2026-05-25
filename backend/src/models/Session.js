const mongoose = require('mongoose')

const sessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    duration: {
      type: Number,
      default: 25,
    },
    xpGained: {
      type: Number,
      default: 0,
    },
    completedAt: {
      type: Date,
      default: null,
    },
    startedAt: {
      type: Date,
      default: Date.now,
    },
    subject: {
      type: String,
      trim: true,
      default: null,
    },
    status: {
      type: String,
      enum: ['completed', 'abandoned'],
      default: null,
    },
  },
  { timestamps: true },
)

module.exports = mongoose.model('Session', sessionSchema)
