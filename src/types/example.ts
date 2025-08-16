// Types for example generation
export interface ExampleSentence {
  englishSentence: string;
  vietnameseTranslation: string;
  contextInfo?: string;
}

export interface ExampleSentenceResponse {
  exampleSentence?: {
    english: string;
    vietnamese: string;
    wordHighlight: string;
    context: string;
  };
  error?: string;
  message?: string;
}

export interface GenerateExampleRequest {
  word: string;
  meaning: string;
  type: string;
  existingExamples?: string[];
}

export interface GenerateExampleError {
  error: string;
  message: string;
  status: number;
}

// New interfaces for database storage
export interface StoredExampleSentence {
  id?: string;
  word: string;
  englishSentence: string;
  vietnameseTranslation: string;
  contextInfo?: string;
  topic?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ExampleSentenceCreateRequest {
  word: string;
  englishSentence: string;
  vietnameseTranslation: string;
  contextInfo?: string;
  topic?: string;
}
