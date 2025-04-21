const { GoogleGenAI } = require('@google/genai');
require('dotenv').config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

exports.suggestTitleAndMood = async (content) => {
  const prompt = `
You are an assistant for a private diary app.

Given the following diary entry content:
"""${content}"""

Suggest:
1. A short, relevant title for the diary entry.
2. A mood (one of: 

  'Happy', 'Sad', 'Angry', 'Excited', 'Neutral', 'Anxious', 'Grateful',
  'Lonely', 'Motivated', 'Tired', 'Confused', 'Relaxed', 'Stressed', 'Bored'

    ).

Return the result as JSON like:
{ "title": "Your Title", "mood": "Mood" ,"tags": [" "]}
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
    });

    let text = response.text;

// Remove Markdown formatting if present
text = text.replace(/```(?:json)?/g, '').trim();

return JSON.parse(text);

  } catch (err) {
    console.error("Error parsing Gemini response:", err);
    return { title: '', mood: 'neutral' };
  }
};