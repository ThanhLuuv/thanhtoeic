export interface PhoneticRequest {
  word: string;
  type: string;
}

export interface PhoneticResponse {
  phonetic: string;
  error?: string;
}

class PhoneticService {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = process.env.REACT_APP_API_KEY_OPENAI || '';
    this.baseUrl = 'https://api.openai.com/v1/chat/completions';
  }

  async generatePhonetic(request: PhoneticRequest): Promise<PhoneticResponse> {
    try {
      if (!this.apiKey) {
        throw new Error('OpenAI API key not configured');
      }

      const prompt = `Generate the phonetic transcription (IPA) for the English word "${request.word}" which is a ${request.type}. 
      Return only the phonetic transcription in IPA format, nothing else. 
      Example: for "arrival" (n.), return "/əˈraɪvəl/"`;

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
              content: 'You are a linguistic expert specializing in English phonetics. Provide accurate IPA transcriptions.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 50,
          temperature: 0.1
        })
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const result = await response.json();
      const phonetic = result.choices[0]?.message?.content?.trim();

      if (!phonetic) {
        throw new Error('No phonetic transcription received');
      }

      return { phonetic };
    } catch (error) {
      console.error('Error generating phonetic:', error);
      return { 
        phonetic: '', 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }
}

export const phoneticService = new PhoneticService();
