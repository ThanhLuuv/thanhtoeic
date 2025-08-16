// Common vocabulary types

export interface VocabularyTopic {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ToeicVocabulary {
  id: string;
  word: string;
  wordType?: string;
  phonetic?: string;
  meaning: string;
  englishMeaning?: string;
  audio?: string;
  topicId?: string;
  examples?: any;
  exampleSentences?: any[];
  usageStats?: any;
  tags?: any;
  difficulty?: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  topic?: VocabularyTopic;
}

export interface VocabularyItem {
  id: string;
  word: string;
  type: string;
  phonetic: string;
  meaning: string;
  audio?: string;
  topic?: string;
  exampleSentences?: any[];
}

export interface VocabSetByTopic {
  topic: string;
  sets: ToeicVocabulary[][];
}
