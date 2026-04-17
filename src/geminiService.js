// AI Service — Groq (Free AI, no credit card needed)
// Sign up at https://console.groq.com to get your free API key

const API_KEY = process.env.REACT_APP_GROQ_API_KEY;
const API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const MODEL   = 'llama-3.1-8b-instant'; // Current supported free model

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
    throw new Error('API key not set. Please add REACT_APP_GROQ_API_KEY to your .env.local file.');
  }

  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: MODEL,
      temperature: 0.7,
      max_tokens: 800,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user',   content: userMessage },
      ],
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || `Error ${res.status}: ${res.statusText}`);
  }

  const data = await res.json();
  const text = data?.choices?.[0]?.message?.content?.trim();
  if (!text) throw new Error('Empty response from AI.');
  return text;
}
