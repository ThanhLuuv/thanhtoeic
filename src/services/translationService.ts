export interface TranslationRequest {
  englishSentence: string;
}

export interface TranslationResponse {
  vietnameseTranslation: string;
  error?: string;
}

class TranslationService {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = process.env.REACT_APP_API_KEY_OPENAI || '';
    this.baseUrl = 'https://api.openai.com/v1/chat/completions';
  }

  async translateToVietnamese(request: TranslationRequest): Promise<TranslationResponse> {
    try {
      if (!this.apiKey) {
        throw new Error('OpenAI API key not configured');
      }

      const prompt = `Translate the following English sentence to Vietnamese. Return only the Vietnamese translation, nothing else.

English: "${request.englishSentence}"
Vietnamese:`;

      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'You are a professional English to Vietnamese translator. Provide accurate and natural Vietnamese translations.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 200,
          temperature: 0.3
        })
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const result = await response.json();
      const translation = result.choices[0]?.message?.content?.trim();

      if (!translation) {
        throw new Error('No translation received');
      }

      return { vietnameseTranslation: translation };
    } catch (error) {
      console.error('Error translating sentence:', error);
      return { 
        vietnameseTranslation: '', 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }
}

export const translationService = new TranslationService();
