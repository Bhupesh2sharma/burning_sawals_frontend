import axios from 'axios';

// AI Service for question generation using free APIs
export class AIService {
  // Using Hugging Face Inference API (free tier available)
  private static readonly HUGGINGFACE_API_URL = 'https://api-inference.huggingface.co/models';
  private static readonly OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';
  
  // Alternative free APIs we can use
  private static readonly OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
  private static readonly COHERE_API_URL = 'https://api.cohere.ai/v1/generate';

  // Generate questions using different AI models
  static async generateQuestions(
    prompt: string, 
    genre: string, 
    count: number = 5,
    apiProvider: 'huggingface' | 'openai' | 'openrouter' | 'cohere' = 'huggingface'
  ): Promise<{ questions: string[]; success: boolean; error?: string }> {
    try {
      const systemPrompt = `You are an expert at creating engaging conversation questions for dating and social apps. 
      Generate ${count} unique, thoughtful questions for the "${genre}" category based on this prompt: "${prompt}"
      
      Requirements:
      - Questions should be engaging and spark meaningful conversations
      - Make them appropriate for the genre/category
      - Each question should be different and unique
      - Keep questions concise but meaningful
      - Avoid yes/no questions
      - Make them personal and thought-provoking
      
      Return ONLY the questions, one per line, without numbering or bullet points.`;

      switch (apiProvider) {
        case 'huggingface':
          return await this.generateWithHuggingFace(systemPrompt);
        case 'openai':
          return await this.generateWithOpenAI(systemPrompt);
        case 'openrouter':
          return await this.generateWithOpenRouter(systemPrompt);
        case 'cohere':
          return await this.generateWithCohere(systemPrompt);
        default:
          return { questions: [], success: false, error: 'Invalid API provider' };
      }
    } catch (error) {
      console.error('AI Service Error:', error);
      return { 
        questions: [], 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      };
    }
  }

  // Hugging Face Inference API (Free tier available)
  private static async generateWithHuggingFace(prompt: string): Promise<{ questions: string[]; success: boolean; error?: string }> {
    try {
      // Using a text generation model
      const response = await axios.post(
        `${this.HUGGINGFACE_API_URL}/microsoft/DialoGPT-large`,
        {
          inputs: prompt,
          parameters: {
            max_length: 500,
            temperature: 0.8,
            do_sample: true,
            num_return_sequences: 1
          }
        },
        {
          headers: {
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_HUGGINGFACE_API_KEY || 'hf_demo'}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const generatedText = response.data[0]?.generated_text || '';
      const questions = this.parseGeneratedQuestions(generatedText);
      
      return { questions, success: true };
    } catch (error: any) {
      if (error.response?.status === 503) {
        return { 
          questions: [], 
          success: false, 
          error: 'Hugging Face model is loading. Please try again in a few seconds.' 
        };
      }
      throw error;
    }
  }

  // OpenAI API (requires API key)
  private static async generateWithOpenAI(prompt: string): Promise<{ questions: string[]; success: boolean; error?: string }> {
    const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
    if (!apiKey) {
      return { questions: [], success: false, error: 'OpenAI API key not configured' };
    }

    const response = await axios.post(
      this.OPENAI_API_URL,
      {
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are an expert at creating engaging conversation questions for dating and social apps.' },
          { role: 'user', content: prompt }
        ],
        max_tokens: 500,
        temperature: 0.8
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const generatedText = response.data.choices[0]?.message?.content || '';
    const questions = this.parseGeneratedQuestions(generatedText);
    
    return { questions, success: true };
  }

  // OpenRouter API (Free tier available)
  private static async generateWithOpenRouter(prompt: string): Promise<{ questions: string[]; success: boolean; error?: string }> {
    const apiKey = process.env.NEXT_PUBLIC_OPENROUTER_API_KEY;
    if (!apiKey) {
      return { questions: [], success: false, error: 'OpenRouter API key not configured' };
    }

    const response = await axios.post(
      this.OPENROUTER_API_URL,
      {
        model: 'openai/gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are an expert at creating engaging conversation questions for dating and social apps.' },
          { role: 'user', content: prompt }
        ],
        max_tokens: 500,
        temperature: 0.8
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const generatedText = response.data.choices[0]?.message?.content || '';
    const questions = this.parseGeneratedQuestions(generatedText);
    
    return { questions, success: true };
  }

  // Cohere API (Free tier available)
  private static async generateWithCohere(prompt: string): Promise<{ questions: string[]; success: boolean; error?: string }> {
    const apiKey = process.env.NEXT_PUBLIC_COHERE_API_KEY;
    if (!apiKey) {
      return { questions: [], success: false, error: 'Cohere API key not configured' };
    }

    const response = await axios.post(
      this.COHERE_API_URL,
      {
        model: 'command',
        prompt: prompt,
        max_tokens: 500,
        temperature: 0.8,
        stop_sequences: ['\n\n']
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const generatedText = response.data.generations[0]?.text || '';
    const questions = this.parseGeneratedQuestions(generatedText);
    
    return { questions, success: true };
  }

  // Parse generated text into individual questions
  private static parseGeneratedQuestions(text: string): string[] {
    if (!text) return [];
    
    // Split by newlines and filter out empty lines
    let questions = text
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0 && line.includes('?'))
      .map(line => {
        // Remove numbering (1., 2., etc.) and bullet points
        return line.replace(/^\d+\.\s*/, '').replace(/^[-*]\s*/, '').trim();
      });

    // If no questions with ? found, try to extract any meaningful sentences
    if (questions.length === 0) {
      questions = text
        .split(/[.!?]+/)
        .map(sentence => sentence.trim())
        .filter(sentence => sentence.length > 10 && sentence.length < 200)
        .slice(0, 5);
    }

    return questions.slice(0, 10); // Limit to 10 questions max
  }

  // Fallback: Generate sample questions if AI fails
  static generateSampleQuestions(genre: string): string[] {
    const sampleQuestions: Record<string, string[]> = {
      'For First Dates': [
        "What's the most spontaneous thing you've ever done?",
        "If you could have dinner with anyone, living or dead, who would it be and why?",
        "What's something you're really passionate about that most people don't know?",
        "If you could travel anywhere right now, where would you go?",
        "What's the best piece of advice you've ever received?"
      ],
      'For Friends': [
        "What's your favorite childhood memory?",
        "If you could master any skill instantly, what would it be?",
        "What's the funniest thing that happened to you this week?",
        "If you had to eat one food for the rest of your life, what would it be?",
        "What's something you've always wanted to try but haven't yet?"
      ],
      'For Family': [
        "What's your favorite family tradition?",
        "If you could ask your younger self one question, what would it be?",
        "What's something you learned from your parents that you still follow today?",
        "What's your favorite way to spend a weekend?",
        "If you could have any superpower, what would it be and why?"
      ],
      'Deep Questions': [
        "What's something you believe in that others might find controversial?",
        "If you knew you couldn't fail, what would you do differently?",
        "What's the biggest lesson you've learned from a mistake?",
        "What does success mean to you personally?",
        "If you could change one thing about the world, what would it be?"
      ],
      'Fun Prompts': [
        "If you were a pizza, what toppings would you have?",
        "What's the weirdest food combination you actually enjoy?",
        "If you could be any animal for a day, which would you choose?",
        "What's the most useless talent you have?",
        "If you could have any job for one day, what would it be?"
      ]
    };

    return sampleQuestions[genre] || sampleQuestions['For First Dates'];
  }

  // Get available AI providers
  static getAvailableProviders(): Array<{ id: string; name: string; free: boolean; requiresKey: boolean }> {
    return [
      { id: 'huggingface', name: 'Hugging Face (Free)', free: true, requiresKey: false },
      { id: 'openai', name: 'OpenAI GPT-3.5', free: false, requiresKey: true },
      { id: 'openrouter', name: 'OpenRouter (Free tier)', free: true, requiresKey: true },
      { id: 'cohere', name: 'Cohere (Free tier)', free: true, requiresKey: true }
    ];
  }
}
