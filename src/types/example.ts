// Types for example generation
export interface ExampleSentence {
  english: string;
  vietnamese: string;
  wordHighlight: string;
  context: string;
}

export interface ExampleSentenceResponse {
  exampleSentence: ExampleSentence;
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
  status?: number;
}
