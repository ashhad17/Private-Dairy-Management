const { suggestTitleAndMood } = require('../services/openai.service');

exports.analyzeEntry = async (req, res) => {
  const { content } = req.body;
  if (!content) return res.status(400).json({ message: 'Content required' });

  try {
    const result = await suggestTitleAndMood(content);
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: 'AI analysis failed', error: err.message });
  }
};
