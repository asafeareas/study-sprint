const mongoose = require('mongoose')

const RANKS = ['Calouro', 'Estudante', 'Dedicado', 'Focado', 'Mestre', 'Lendário']

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 30,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    xp: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
    rank: {
      type: String,
      enum: RANKS,
      default: 'Calouro',
    },
    totalSprints: { type: Number, default: 0 },
    totalMinutes: { type: Number, default: 0 },
    currentStreak: { type: Number, default: 0 },
    longestStreak: { type: Number, default: 0 },
    lastSprintDate: { type: Date, default: null },
    achievements: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Achievement' }],
  },
  { timestamps: true },
)

userSchema.methods.toPublicJSON = function toPublicJSON() {
  const obj = this.toObject()
  delete obj.password
  return obj
}

module.exports = mongoose.model('User', userSchema)
module.exports.RANKS = RANKS
