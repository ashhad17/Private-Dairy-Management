const mongoose = require('mongoose');

const diaryEntrySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: false
  },
  content: {
    type: String,
    required: true
  },
  mood: {
    type: String,
    enum: [
      'Happy', 'Sad', 'Angry', 'Excited', 'Neutral', 'Anxious', 'Grateful',
      'Lonely', 'Motivated', 'Tired', 'Confused', 'Relaxed', 'Stressed', 'Bored'
    ],
    default: 'Neutral'
  },
  tags: [String],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: Date
}, {
  timestamps: true
});

module.exports = mongoose.model('DiaryEntry', diaryEntrySchema);
