# 🤖 AI Question Generator Setup Guide

## Overview
Your admin panel now includes an AI-powered question generator that can create engaging conversation questions using various free and paid AI APIs.

## Features
- ✅ Generate questions using multiple AI providers
- ✅ Copy individual or multiple questions
- ✅ Add generated questions directly to your database
- ✅ Fallback to sample questions if AI fails
- ✅ Support for different genres and categories
- ✅ Free tier options available

## Setup Instructions

### 1. Environment Variables
Create a `.env.local` file in your project root with the following API keys (all optional):

```env
# AI Service API Keys (Optional - for enhanced AI features)

# Hugging Face (Free tier available)
NEXT_PUBLIC_HUGGINGFACE_API_KEY=your_huggingface_api_key_here

# OpenAI (Paid service)
NEXT_PUBLIC_OPENAI_API_KEY=your_openai_api_key_here

# OpenRouter (Free tier available)
NEXT_PUBLIC_OPENROUTER_API_KEY=your_openrouter_api_key_here

# Cohere (Free tier available)
NEXT_PUBLIC_COHERE_API_KEY=your_cohere_api_key_here

# Your existing API configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api
```

### 2. Getting Free API Keys

#### Hugging Face (Recommended - Free)
1. Go to [https://huggingface.co/settings/tokens](https://huggingface.co/settings/tokens)
2. Create a free account
3. Generate a new token
4. Add it to your `.env.local` file

#### OpenRouter (Free Tier)
1. Go to [https://openrouter.ai/](https://openrouter.ai/)
2. Sign up for a free account
3. Get your API key from the dashboard
4. Add it to your `.env.local` file

#### Cohere (Free Tier)
1. Go to [https://dashboard.cohere.ai/](https://dashboard.cohere.ai/)
2. Sign up for a free account
3. Generate an API key
4. Add it to your `.env.local` file

#### OpenAI (Paid)
1. Go to [https://platform.openai.com/](https://platform.openai.com/)
2. Create an account and add billing
3. Generate an API key
4. Add it to your `.env.local` file

### 3. Usage Instructions

1. **Access the AI Generator**: 
   - Go to your admin panel
   - Click on the "🤖 AI Generator" tab

2. **Generate Questions**:
   - Enter a prompt describing what kind of questions you want
   - Select a genre/category
   - Choose an AI provider
   - Set the number of questions (1-10)
   - Click "Generate Questions"

3. **Copy Questions**:
   - Click the checkbox next to questions you want to copy
   - Use "Copy Selected" to copy multiple questions
   - Or click the 📋 icon next to individual questions

4. **Add to Database**:
   - Select questions you want to add
   - Click "Add Selected" to add them directly to your database

### 4. Fallback System
If AI generation fails or you don't have API keys configured, the system will automatically show sample questions based on the selected genre. This ensures the feature always works.

### 5. Sample Prompts
Try these sample prompts to get started:
- "Create questions about travel and adventure"
- "Generate questions about personal values and beliefs"
- "Make questions about hobbies and interests"
- "Create questions about future goals and dreams"
- "Generate questions about favorite memories"
- "Make questions about food and dining preferences"

## Troubleshooting

### Common Issues:
1. **"API key not configured"**: Add the appropriate API key to your `.env.local` file
2. **"AI generation failed"**: The system will show sample questions instead
3. **"Model is loading"**: Wait a few seconds and try again (Hugging Face specific)

### No API Keys Required:
The system works without any API keys by using sample questions. You can still:
- Generate sample questions for each genre
- Copy and use these questions
- Add them to your database

## File Structure
```
src/
├── utils/
│   └── aiService.ts          # AI service logic
├── components/
│   └── AIQuestionGenerator.tsx # UI component
└── app/admin/
    └── page.tsx              # Updated admin page
```

## Next Steps
1. Set up at least one free API key for better AI generation
2. Test the generator with different prompts and genres
3. Use the generated questions to populate your database
4. Customize the prompts based on your app's needs

Enjoy your new AI-powered question generator! 🎉
