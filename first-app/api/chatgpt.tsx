import axios from 'axios';
import { OPENAI_API_KEY } from '@env';

const API_URL = 'https://api.openai.com/v1/chat/completions';
const message_history = [
  {
    role: 'system',
    content: "You are Tom Riddle's diary. You start by asking the name of the person writing.",
  },
];
export async function sendTextToChatGPT(text: string): Promise<string> {
  try {
    const response = await axios.post(
      API_URL,
      {
        model: 'gpt-4o-mini',
        messages: message_history.concat({ role: 'user', content: text }),
        temperature: 0.7,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
        },
      }
    );
    message_history.push({ role: 'system', content: response.data.choices[0].message.content });
    const answer = response.data.choices[0].message.content.trim();
    return answer;
  } catch (error) {
    return 'Error sending text to ChatGPT: ' + error;
  }
}