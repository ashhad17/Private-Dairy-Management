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

router.post('/toggle-reminder', auth, async (req, res) => {
    const { emailReminders } = req.body;
    const user = await User.findById(req.user.id);
    user.emailReminders = emailReminders;
    await user.save();
    res.json({ message: 'Reminder preference updated.' });
  });
  
router.get('/export/csv', diary.exportCSV);
router.get('/export/pdf', diary.exportPDF);
router.get('/:id', diary.getEntry);
router.put('/:id', diary.updateEntry);
router.delete('/:id', diary.deleteEntry);
module.exports = router;