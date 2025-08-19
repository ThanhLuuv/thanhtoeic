import type { 
  ExampleSentenceResponse, 
  GenerateExampleRequest, 
  GenerateExampleError 
} from '../types/example';

// Service for generating example sentences using our secure API endpoint
class ExampleGenerationService {
  private apiEndpoint: string;

  constructor() {
    // Ưu tiên dùng base URL cấu hình qua biến môi trường khi frontend không chạy cùng domain với API
    const baseFromEnv = (process.env.REACT_APP_API_BASE_URL || '').trim();
    const normalizedBase = baseFromEnv ? baseFromEnv.replace(/\/$/, '') : '';
    this.apiEndpoint = `${normalizedBase}/api/chat` || '/api/chat';
  }

  /**
   * Generate example sentence using our secure API endpoint and save to database
   */
  async generateExampleSentence(
    request: GenerateExampleRequest,
    topic?: string
  ): Promise<ExampleSentenceResponse> {
    try {
      // Tạo danh sách các câu đã tồn tại để tránh trùng lặp
      const existingExamplesText = request.existingExamples && request.existingExamples.length > 0 
        ? `\n\nCÁC CÂU ĐÃ TẠO TRƯỚC ĐÓ (KHÔNG ĐƯỢC TẠO LẠI):\n${request.existingExamples.map((example, index) => `${index + 1}. ${example}`).join('\n')}`
        : '';
      
      const prompt = `Tạo một câu mẫu sử dụng từ "${request.word}" (${request.meaning}) - loại từ: ${request.type}.

Yêu cầu:
1. Tạo một câu tiếng Anh tự nhiên, đúng ngữ pháp ngắn và đơn giản
2. Sử dụng từ "${request.word}" trong ngữ cảnh phù hợp
3. Cung cấp bản dịch tiếng Việt
4. Câu phải dễ hiểu và thực tế
5. QUAN TRỌNG: KHÔNG được tạo câu giống với các câu đã tạo trước đó${existingExamplesText}

Trả về JSON với format:
{
  "exampleSentence": {
    "english": "Câu tiếng Anh mẫu",
    "vietnamese": "Bản dịch tiếng Việt",
    "wordHighlight": "${request.word}",
    "context": "Giải thích ngắn về cách sử dụng từ này bằng tiếng Việt"
  }
}`;

      const response = await fetch(this.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages: [
            {
              role: 'system',
              content: 'Bạn là giáo viên tiếng Anh chuyên tạo câu mẫu để giúp học sinh hiểu cách sử dụng từ vựng trong ngữ cảnh thực tế.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 500,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw this.handleApiError(response.status, errorData);
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content;
      
      if (!content) {
        throw new Error('Không nhận được response từ OpenAI');
      }

      try {
        // Tìm JSON trong response
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsedResponse = JSON.parse(jsonMatch[0]);
          
          // Save to database if generation was successful
          if (parsedResponse.exampleSentence) {
            await this.saveExampleToDatabase(request.word, parsedResponse.exampleSentence, topic);
          }
          
          return parsedResponse;
        } else {
          throw new Error('Không tìm thấy JSON trong response');
        }
      } catch (parseError) {
        console.error('Error parsing JSON:', parseError);
        throw new Error('Lỗi phân tích response từ AI');
      }

    } catch (error) {
      console.error('Error generating example:', error);
      throw error;
    }
  }

  /**
   * Save generated example to database
   */
  private async saveExampleToDatabase(word: string, example: any, topic?: string): Promise<void> {
    try {
      // Import exampleService dynamically to avoid circular dependency
      const { exampleService } = await import('./exampleService');
      
      await exampleService.createExampleSentence({
        word: word.toLowerCase(),
        englishSentence: example.english,
        vietnameseTranslation: example.vietnamese,
        contextInfo: example.context,
        topic: topic || 'Other',
      });
      
    } catch (error) {
      console.error('Error saving example to database:', error);
      // Don't throw error here, just log it
      // The example generation was successful, we just couldn't save it
    }
  }

  /**
   * Handle different types of API errors
   */
  private handleApiError(status: number, errorData: any): GenerateExampleError {
    switch (status) {
      case 401:
        return {
          error: 'UNAUTHORIZED',
          message: 'API key không hợp lệ hoặc đã hết hạn.',
          status
        };
      case 403:
        return {
          error: 'FORBIDDEN',
          message: 'Tài khoản không có quyền truy cập hoặc đã hết credit.',
          status
        };
      case 429:
        return {
          error: 'RATE_LIMIT',
          message: 'Rate limit exceeded. Vui lòng thử lại sau vài phút.',
          status
        };
      case 500:
        return {
          error: 'INTERNAL_ERROR',
          message: 'Lỗi server nội bộ từ OpenAI.',
          status
        };
      default:
        return {
          error: 'UNKNOWN_ERROR',
          message: `Lỗi không xác định: ${status}`,
          status
        };
    }
  }

  /**
   * Check if service is available (always true since we use our API endpoint)
   */
  isAvailable(): boolean {
    return true;
  }
}

// Export singleton instance
export const exampleGenerationService = new ExampleGenerationService();

// Export the class for testing purposes
export { ExampleGenerationService };
