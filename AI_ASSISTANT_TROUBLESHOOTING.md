# AI Assistant Troubleshooting Guide

## 🚨 Current Issue: "Reconnecting..." Error

The AI Assistant is showing "Reconnecting..." which indicates the Gemini API connection is failing.

## 🔍 Diagnosis

### Issue 1: API Key Format

Your current API key format: `AQ.Ab8RN6I28n6yyWWyrok1VQ7P55xNTC6WBKV2VvQwVbQTZji8Aw`

**Problem**: This doesn't match the standard Gemini API key format.

Valid Gemini API keys should:
- Start with `AIza` (e.g., `AIzaSyD-9tSrke72PouQMnMX-a7eZSW0jkFMBWY`)
- Be exactly 39 characters long
- Contain only alphanumeric characters and hyphens

### Issue 2: API Endpoint

The code uses: `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent`

**Note**: Verify this model name is correct. As of early 2025, available models include:
- `gemini-1.5-pro`
- `gemini-1.5-flash`
- `gemini-pro`

The model `gemini-2.5-flash` may not exist yet.

## ✅ Solution Steps

### Step 1: Get a Valid Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the key (should start with `AIza`)

### Step 2: Update .env.local

Open `my-react-app/.env.local` and update:

```bash
REACT_APP_GEMINI_API_KEY=AIzaYourActualKeyHere
```

### Step 3: Update Model Name (if needed)

If the API still fails, update the model name in `src/geminiService.js`:

```javascript
// Change from:
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

// To:
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';
```

### Step 4: Restart Dev Server

```bash
# Stop the current server (Ctrl+C)
npm start
```

Environment variables are only loaded when the server starts, so you MUST restart after changing `.env.local`.

### Step 5: Test the AI Assistant

1. Open the app in your browser
2. Click the AI Assistant icon
3. Type a message like "hello"
4. Check the browser console (F12 → Console tab) for detailed logs

## 🔧 Debugging Steps

### Check Environment Variables

Add this to your component to verify the key is loaded:

```javascript
console.log('API Key exists:', !!process.env.REACT_APP_GEMINI_API_KEY);
console.log('API Key length:', process.env.REACT_APP_GEMINI_API_KEY?.length);
console.log('API Key starts with:', process.env.REACT_APP_GEMINI_API_KEY?.substring(0, 4));
```

Expected output:
```
API Key exists: true
API Key length: 39
API Key starts with: AIza
```

### Check Browser Console

The `geminiService.js` has extensive logging. Look for:

```
🤖 Gemini API Call Started
📝 Message: [your message]
🔑 API Key exists: true
📡 Response status: [status code]
```

Common error codes:
- `400`: Invalid request (wrong model name or parameters)
- `403`: Invalid API key or insufficient permissions
- `429`: Rate limit exceeded (too many requests)
- `404`: Model not found (wrong model name)

### Test API Key Directly

Test your API key with curl:

```bash
curl -X POST \
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "contents": [{
      "parts": [{"text": "Hello"}]
    }]
  }'
```

Replace `YOUR_API_KEY` with your actual key.

## 🎯 Quick Fix Checklist

- [ ] Get valid Gemini API key from Google AI Studio (starts with `AIza`)
- [ ] Update `REACT_APP_GEMINI_API_KEY` in `.env.local`
- [ ] Verify model name is correct (`gemini-1.5-flash` or `gemini-1.5-pro`)
- [ ] Restart dev server (`npm start`)
- [ ] Clear browser cache (Ctrl+Shift+Delete)
- [ ] Test AI Assistant with a simple message
- [ ] Check browser console for error details

## 🔗 Alternative: Use Different Model

If Gemini API continues to fail, you can switch to other AI services:

### Option 1: OpenAI GPT
- Get API key from [OpenAI Platform](https://platform.openai.com/api-keys)
- Update `geminiService.js` to use OpenAI API

### Option 2: Anthropic Claude
- Get API key from [Anthropic Console](https://console.anthropic.com/)
- Update `geminiService.js` to use Claude API

### Option 3: Local AI (Ollama)
- Install [Ollama](https://ollama.ai/)
- Run local models without API keys
- Update `geminiService.js` to use local endpoint

## 📞 Still Having Issues?

If the AI Assistant still shows "Reconnecting..." after following all steps:

1. **Verify API Key**: Copy your key and test it in Google AI Studio playground
2. **Check Quotas**: Verify you haven't exceeded free tier limits
3. **Check Network**: Ensure your firewall isn't blocking Google APIs
4. **Check Browser**: Try a different browser or incognito mode
5. **Check Logs**: Share the browser console logs for detailed diagnosis

## 🆘 Emergency Fallback

If you need the AI Assistant working immediately, you can temporarily use the quick response system:

The app already has built-in quick responses for common queries like:
- "hello" / "hi"
- "help"
- "features"
- "invoice"
- "inventory"
- "reports"
- "customers"

These work without the Gemini API and provide instant responses.
