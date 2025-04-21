const cron = require('node-cron');
const moment = require('moment');
const User = require('../models/user.model');
const { sendReminderEmail } = require('../utils/mailer');


cron.schedule('* * * * *', async () => {
  const now = moment().format('HH:mm');

  const usersToNotify = await User.find({
    reminderEnabled: true,
    reminderTime: now, // e.g., "20:00"
  });

  for (const user of usersToNotify) {
    await sendReminderEmail(user.email, user.name);
  }
});
