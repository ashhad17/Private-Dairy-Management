const DiaryEntry = require('../models/diary.model');
const mongoose=require('mongoose')
const PDFDocument = require('pdfkit');
const { Parser } = require('json2csv');
// Create
exports.createEntry = async (req, res) => {
  try {
    const {name, title, content, mood, tags } = req.body;

    const entry = await DiaryEntry.create({
      user: req.user.id,
      name,
      title,
      content,
      mood,
      tags
    });

    res.status(201).json(entry);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create entry', error: err.message });
  }
};

// Get All (for the user)
exports.getEntries = async (req, res) => {
  const entries = await DiaryEntry.find({ user: req.user.id }).sort({ createdAt: -1 });
  res.json(entries);
};
// GET /entries/filter-by-date
exports.filterByUpdatedDate = async (req, res) => {
  const { updatedFrom, updatedTo } = req.query;
  const query = { user: req.user.id };

  if (updatedFrom || updatedTo) {
    query.updatedAt = {};
    if (updatedFrom) query.updatedAt.$gte = new Date(updatedFrom);
    if (updatedTo) query.updatedAt.$lte = new Date(updatedTo);
  }

  try {
    const entries = await DiaryEntry.find(query).sort({ updatedAt: -1 });
    res.json(entries);
  } catch (err) {
    console.error("Error fetching date-filtered entries:", err);
    res.status(500).json({ message: 'Failed to filter by date', error: err.message });
  }
};


// Get Single
// Get Single
exports.getEntry = async (req, res) => {
  const { id } = req.params;
  console.log('Received ID:', id);

  const trimmedId = id.trim();

  // Validate if the id is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(trimmedId)) {
    return res.status(400).json({ error: 'Invalid ID format' });
  }

  try {
    const entry = await DiaryEntry.findById(trimmedId);
    if (!entry) {
      return res.status(404).json({ error: 'Entry not found' });
    }
    res.status(200).json(entry);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};


exports.exportCSV = async (req, res) => {
  const entries = await DiaryEntry.find({ user: req.user._id });

  const fields = ['title', 'content', 'mood', 'tags', 'createdAt'];
  const opts = { fields };
  const parser = new Parser(opts);
  const csv = parser.parse(entries);

  res.header('Content-Type', 'text/csv');
  res.attachment('diary-entries.csv');
  res.send(csv);
};
exports.moodSummary = async (req, res) => {
  const summary = await DiaryEntry.aggregate([
    { $match: { user: req.user._id } },
    { $group: { _id: '$mood', count: { $sum: 1 } } }
  ]);

  res.json(summary); // e.g. [{ _id: 'happy', count: 10 }]
};
exports.getCalendarView = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);  // 👈 convert string to ObjectId
    console.log('Fetching entries for user ID:', userId);

    const entries = await DiaryEntry.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
          },
          entries: { $push: "$$ROOT" },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id": -1 } }
    ]);

    console.log('Entries grouped by date:', entries);
    res.json(entries);
  } catch (err) {
    console.error('Error fetching calendar view:', err);
    res.status(500).json({ message: 'Calendar view failed', error: err.message });
  }
};

exports.exportPDF = async (req, res) => {
  const entries = await DiaryEntry.find({ user: req.user._id });

  const doc = new PDFDocument();
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename=diary-entries.pdf');
  doc.pipe(res);

  entries.forEach(entry => {
    doc
      .fontSize(16).text(entry.title || 'Untitled')
      .fontSize(12).text(`Mood: ${entry.mood || 'N/A'}`)
      .fontSize(10).text(`Tags: ${entry.tags.join(', ')}`)
      .moveDown(0.5)
      .fontSize(12).text(entry.content)
      .moveDown(1);
  });

  doc.end();
};

// Get entries filtered by tags (optional)
exports.getFilteredEntries = async (req, res) => {
  const { tags, from, to, mood } = req.query; // ← Add mood here
  const query = { user: req.user.id };

  if (mood) {
    query.mood = mood;
  }

  if (tags) {
    const tagArray = tags.split(',').map(tag => tag.trim().toLowerCase());
    query.tags = { $in: tagArray };
  }

  if (from || to) {
    query.createdAt = {};
    if (from) query.createdAt.$gte = new Date(from);
    if (to) query.createdAt.$lte = new Date(to);
  }

  console.log("Querying with:", query); // 🐞 Debug

  try {
    const entries = await DiaryEntry.find(query).sort({ createdAt: -1 });
    res.json(entries);
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ message: 'Failed to fetch entries', error: err.message });
  }
};


// Update
exports.updateEntry = async (req, res) => {
  const { title, content, mood, tags } = req.body;

  const entry = await DiaryEntry.findOneAndUpdate(
    { _id: req.params.id, user: req.user.id },
    { title, content, mood, tags, updatedAt: new Date() },
    { new: true }
  );

  if (!entry) return res.status(404).json({ message: 'Entry not found' });

  res.json(entry);
};

// Delete
exports.deleteEntry = async (req, res) => {
  const entry = await DiaryEntry.findOneAndDelete({ _id: req.params.id, user: req.user.id });
  if (!entry) return res.status(404).json({ message: 'Entry not found' });
  res.json({ message: 'Entry deleted' });
};