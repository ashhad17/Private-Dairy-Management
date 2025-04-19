const mongoose = require('mongoose');

const diaryEntrySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: false // Optional, we can suggest using AI
  },
  content: {
    type: String,
    required: true
  },
  mood: {
    type: String,
    enum: ['happy', 'sad', 'angry', 'anxious', 'neutral'],
    default: 'neutral'
  },
  tags: [String], // ["work", "personal", "travel"]
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: Date
}, {
  timestamps: true
});

module.exports = mongoose.model('DiaryEntry', diaryEntrySchema);
