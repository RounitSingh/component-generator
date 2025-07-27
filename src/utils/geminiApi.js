/* eslint-disable no-console */
import axios from 'axios';

export const generateComponentWithGemini = async (
  promptText,
  imagePart
) => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  console.log("api-key ***", apiKey);
  if (!apiKey) {
    throw new Error('Gemini API key is not set in environment variables.');
  }
  const response = await axios.post(
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent',
    {
      contents: [
        {
          parts: [
            { text: promptText },
            ...imagePart,
          ],
        },
      ],
    },
    {
      headers: {
        'Content-Type': 'application/json',
        'X-goog-api-key': apiKey,
      },
    }
  );
  return (
    response.data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response'
  );
};

