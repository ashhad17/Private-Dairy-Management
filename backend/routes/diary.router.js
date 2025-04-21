const router = require('express').Router();
const auth = require('../middlewares/auth.middleware');
const diary = require('../controllers/diary.controller');
require('../jobs/remainder.cron');
const User = require('../models/user.model'); // Add this line

router.use(auth); // protect all routes below

router.post('/', diary.createEntry);
router.get('/', diary.getEntries);

router.get('/calendar', diary.getCalendarView);
router.get('/filter', diary.getFilteredEntries);
router.get('/filter-by-date', diary.filterByUpdatedDate);

router.post('/reminder-preference', auth, async (req, res) => {
  try {
    const { reminderEnabled, reminderTime } = req.body;
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    user.reminderEnabled = reminderEnabled;
    user.reminderTime = reminderTime;

    await user.save();

    console.log("Reminder preference updated for user:", userId);
    res.status(200).json({ message: 'Reminder preference updated.' });
  } catch (err) {
    console.error("Error updating reminder preference:", err);
    res.status(500).json({ error: 'Failed to update reminder preference.' });
  }
});
  
router.get('/export/csv', diary.exportCSV);
router.get('/export/pdf', diary.exportPDF);
router.get('/:id', diary.getEntry);
router.put('/:id', diary.updateEntry);
router.delete('/:id', diary.deleteEntry);
module.exports = router;