const mongoose = require('mongoose')

const achievementSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      default: '🏆',
    },
    xpReward: {
      type: Number,
      default: 0,
    },
    condition: {
      type: {
        type: String,
        enum: ['sprints', 'streak', 'level', 'minutes'],
        required: true,
      },
      value: {
        type: Number,
        required: true,
      },
    },
  },
  { timestamps: true },
)

module.exports = mongoose.model('Achievement', achievementSchema)
