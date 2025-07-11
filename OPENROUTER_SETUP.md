# 🤖 OpenRouter AI Integration

## What is OpenRouter?

OpenRouter provides unified access to multiple AI models including:
- Claude 3 (Opus, Sonnet, Haiku)
- GPT-4
- Gemini Pro
- Llama 3
- And many more!

## Setup Instructions

### 1. Add Your API Key to Vercel

1. Go to your [Vercel Dashboard](https://vercel.com/danger-dangers-projects/blueprint-material-analyzer/settings/environment-variables)
2. Add new environment variable:
   ```
   OPENROUTER_API_KEY = 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
   ```
3. Redeploy your app

### 2. For Local Development

Create `.env.local` file:
```env
OPENROUTER_API_KEY=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
```

## How It Works

The app now uses OpenRouter to:
1. **Analyze PDF text** with Claude 3 Haiku (fast & affordable)
2. **Extract blueprint data** like square footage, wall dimensions
3. **Calculate materials** with AI assistance
4. **Provide confidence scores** for accuracy

## Cost Breakdown

Using Claude 3 Haiku via OpenRouter:
- **Input**: ~$0.25 per million tokens
- **Output**: ~$1.25 per million tokens
- **Per Blueprint**: ~$0.001-0.005 (very affordable!)

## Available Models

You can change the model in `claudeAnalyzer.ts`:

```typescript
// Budget option (current)
model: 'anthropic/claude-3-haiku-20240307'

// More accurate
model: 'anthropic/claude-3-sonnet-20240229'

// Most powerful
model: 'anthropic/claude-3-opus-20240229'

// Alternative models
model: 'openai/gpt-4-turbo'
model: 'google/gemini-pro'
```

## Features Enabled

With OpenRouter API key:
- ✅ **Intelligent PDF analysis** - AI extracts data accurately
- ✅ **Better material calculations** - AI understands construction terms
- ✅ **Confidence scoring** - Know how accurate the analysis is
- ✅ **Detailed notes** - AI provides insights about the blueprint

## Monitoring Usage

Check your usage at: https://openrouter.ai/activity

## Troubleshooting

### "API key invalid"
- Make sure you added the key to Vercel environment variables
- Redeploy after adding the key

### "Rate limit exceeded"
- OpenRouter has generous limits
- Consider upgrading your OpenRouter account if needed

### "Analysis falling back to extraction"
- Check API key is set correctly
- Check OpenRouter dashboard for errors
- May be a temporary service issue

## Benefits Over Direct APIs

1. **One API, many models** - Switch between Claude, GPT-4, etc.
2. **Cost tracking** - See exactly what each request costs
3. **Fallback options** - If one model is down, use another
4. **No vendor lock-in** - Easy to switch AI providers

Your Blueprint Analyzer now has AI superpowers! 🚀