

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
// require('./jobs/reminder.cron');

const authRoutes = require('./routes/auth.routes');
// const router = require('./routes/dairy.router');
const diaryRoutes = require('./routes/diary.router');
const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Mongo connected'));

app.use('/auth', authRoutes);

app.use('/api/diary', diaryRoutes);
app.use('/api/diary-ai', require('./routes/diary-ai.routes'));
// PUT /api/user/reminder-preference


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
