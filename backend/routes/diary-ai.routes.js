const router = require('express').Router();
const auth = require('../middlewares/auth.middleware');
const diaryAI = require('../controllers/diary-ai.controller');

router.use(auth);

router.post('/analyze', diaryAI.analyzeEntry);

module.exports = router;
