// AI Service — Google Gemini API
// Using Gemini 1.5 Flash for fast, intelligent responses

const API_KEY = process.env.REACT_APP_GEMINI_API_KEY;
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${API_KEY}`;

const SYSTEM_PROMPT = `You are bizBuddy Assistant 🤖 — a smart, friendly AI helper built into the bizBuddy business management app.

You help small business owners with:
- Recording and managing Sales & Invoices
- Tracking Purchases & Expenses
- Managing Inventory (Items & Stock)
- Managing Customers & Suppliers (Parties)
- Viewing Annual Financial Reports
- Changing app Settings (currency, language, business name)

Always be helpful, concise, and friendly. Use emojis occasionally to be engaging.
If someone asks something unrelated to business or bizBuddy, politely redirect them.`;

export function isAIConfigured() {
  return Boolean(API_KEY && API_KEY.trim().length > 10);
}

export async function getAIResponse(userMessage) {
  if (!isAIConfigured()) {
    throw new Error('API key not set. Please add REACT_APP_GEMINI_API_KEY to your .env.local file.');
  }

  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [{
        parts: [{
          text: `${SYSTEM_PROMPT}\n\nUser: ${userMessage}\n\nAssistant:`
        }]
      }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 800,
      }
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || `Error ${res.status}: ${res.statusText}`);
  }

  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
  if (!text) throw new Error('Empty response from AI.');
  return text;
}
