const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const model = ai.getGenerativeModel({ model: 'gemini-2.0-flash' });

exports.suggestTitleAndMood = async (content) => {
  const prompt = `
You are an assistant for a private diary app.

Given the following diary entry content:
"""${content}"""

Suggest:
1. A short, relevant title for the diary entry.
2. A mood (one of: happy, sad, angry, anxious, neutral).

Return the result as JSON like:
{ "title": "Your Title", "mood": "mood" }
`;

  try {
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
    });

    const response = await result.response;
    const text = await response.text();

    return JSON.parse(text);
  } catch (err) {
    console.error('Error parsing Gemini response:', err);
    return { title: '', mood: 'neutral' };
  }
};
