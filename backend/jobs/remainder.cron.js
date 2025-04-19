const cron = require('node-cron');
const User = require('../models/user.model');
const { sendReminderEmail } = require('../utils/mailer');

// Run every day at 8:00 AM server time
cron.schedule('0 8 * * *', async () => {
  console.log('Sending daily reminder emails...');
  const users = await User.find({ emailReminders: true });

  for (const user of users) {
    try {
      await sendReminderEmail(user.email);
    } catch (err) {
      console.error(`Failed to send email to ${user.email}`, err.message);
    }
  }
});
