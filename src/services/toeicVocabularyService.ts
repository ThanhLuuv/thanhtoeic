import { API_ENDPOINTS } from '../config/api';
import { httpClient, APIError } from './httpClient';

// Types
export interface ToeicWordType {
  id: string;
  name: string;
  abbreviation: string;
  description?: string;
}

export interface ToeicTopic {
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
  topic?: ToeicTopic;
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

// Constants
const WORDS_PER_SET = 20;

// Data transformers
class VocabularyTransformer {
  static toVocabularyItem(vocab: ToeicVocabulary): VocabularyItem {
    return {
      id: vocab.id,
      word: vocab.word,
      type: vocab.wordType || 'unknown',
      phonetic: vocab.phonetic || '',
      meaning: vocab.meaning,
      audio: vocab.audio,
      topic: vocab.topic?.name || 'Other',
      exampleSentences: vocab.exampleSentences || [],
    };
  }

  static removeDuplicates(vocabulary: ToeicVocabulary[]): ToeicVocabulary[] {
    return vocabulary.filter((vocab, index, self) => 
      index === self.findIndex(v => v.word.toLowerCase() === vocab.word.toLowerCase())
    );
  }

  static createSets(vocabulary: ToeicVocabulary[], wordsPerSet: number): ToeicVocabulary[][] {
    const sets: ToeicVocabulary[][] = [];
    
    for (let i = 0; i < vocabulary.length; i += wordsPerSet) {
      const set = vocabulary.slice(i, i + wordsPerSet);
      if (set.length > 0) {
        sets.push(set);
      }
    }
    
    return sets;
  }
}

// Main service
class ToeicVocabularyService {
  // Word Types
  async getAllWordTypes(): Promise<ToeicWordType[]> {
    try {
      return await httpClient.get<ToeicWordType[]>(API_ENDPOINTS.VOCABULARY.WORD_TYPES);
    } catch (error) {
      console.error('Error fetching word types:', error);
      throw new APIError('Failed to fetch word types', 500);
    }
  }

  async getWordTypeById(id: string): Promise<ToeicWordType> {
    try {
      return await httpClient.get<ToeicWordType>(API_ENDPOINTS.VOCABULARY.WORD_TYPE_BY_ID(id));
    } catch (error) {
      console.error(`Error fetching word type ${id}:`, error);
      throw new APIError(`Failed to fetch word type ${id}`, 500);
    }
  }

  async createWordType(wordType: Omit<ToeicWordType, 'id'>): Promise<ToeicWordType> {
    try {
      return await httpClient.post<ToeicWordType>(API_ENDPOINTS.VOCABULARY.WORD_TYPES, wordType);
    } catch (error) {
      console.error('Error creating word type:', error);
      throw new APIError('Failed to create word type', 500);
    }
  }

  async updateWordType(id: string, wordType: Partial<ToeicWordType>): Promise<ToeicWordType> {
    try {
      return await httpClient.put<ToeicWordType>(API_ENDPOINTS.VOCABULARY.WORD_TYPE_BY_ID(id), wordType);
    } catch (error) {
      console.error(`Error updating word type ${id}:`, error);
      throw new APIError(`Failed to update word type ${id}`, 500);
    }
  }

  async deleteWordType(id: string): Promise<void> {
    try {
      return await httpClient.delete<void>(API_ENDPOINTS.VOCABULARY.WORD_TYPE_BY_ID(id));
    } catch (error) {
      console.error(`Error deleting word type ${id}:`, error);
      throw new APIError(`Failed to delete word type ${id}`, 500);
    }
  }

  // Topics
  async getAllTopics(): Promise<ToeicTopic[]> {
    try {
      return await httpClient.get<ToeicTopic[]>(API_ENDPOINTS.VOCABULARY.TOPICS);
    } catch (error) {
      console.error('Error fetching topics:', error);
      throw new APIError('Failed to fetch topics', 500);
    }
  }

  async getTopicById(id: string): Promise<ToeicTopic> {
    try {
      return await httpClient.get<ToeicTopic>(API_ENDPOINTS.VOCABULARY.TOPIC_BY_ID(id));
    } catch (error) {
      console.error(`Error fetching topic ${id}:`, error);
      throw new APIError(`Failed to fetch topic ${id}`, 500);
    }
  }

  async createTopic(topic: Omit<ToeicTopic, 'id' | 'createdAt' | 'updatedAt'>): Promise<ToeicTopic> {
    try {
      return await httpClient.post<ToeicTopic>(API_ENDPOINTS.VOCABULARY.TOPICS, topic);
    } catch (error) {
      console.error('Error creating topic:', error);
      throw new APIError('Failed to create topic', 500);
    }
  }

  async updateTopic(id: string, topic: Partial<ToeicTopic>): Promise<ToeicTopic> {
    try {
      return await httpClient.put<ToeicTopic>(API_ENDPOINTS.VOCABULARY.TOPIC_BY_ID(id), topic);
    } catch (error) {
      console.error(`Error updating topic ${id}:`, error);
      throw new APIError(`Failed to update topic ${id}`, 500);
    }
  }

  async deleteTopic(id: string): Promise<void> {
    try {
      return await httpClient.delete<void>(API_ENDPOINTS.VOCABULARY.TOPIC_BY_ID(id));
    } catch (error) {
      console.error(`Error deleting topic ${id}:`, error);
      throw new APIError(`Failed to delete topic ${id}`, 500);
    }
  }

  // Vocabulary
  async getAllVocabulary(): Promise<ToeicVocabulary[]> {
    try {
      return await httpClient.get<ToeicVocabulary[]>(API_ENDPOINTS.VOCABULARY.VOCABULARY);
    } catch (error) {
      console.error('Error fetching vocabulary:', error);
      throw new APIError('Failed to fetch vocabulary', 500);
    }
  }

  async getActiveVocabulary(): Promise<ToeicVocabulary[]> {
    try {
      return await httpClient.get<ToeicVocabulary[]>(API_ENDPOINTS.VOCABULARY.ACTIVE_VOCABULARY);
    } catch (error) {
      console.error('Error fetching active vocabulary:', error);
      throw new APIError('Failed to fetch active vocabulary', 500);
    }
  }

  async getVocabularyById(id: string): Promise<ToeicVocabulary> {
    try {
      return await httpClient.get<ToeicVocabulary>(API_ENDPOINTS.VOCABULARY.VOCABULARY_BY_ID(id));
    } catch (error) {
      console.error(`Error fetching vocabulary ${id}:`, error);
      throw new APIError(`Failed to fetch vocabulary ${id}`, 500);
    }
  }

  async getVocabularyByTopic(topicId: string): Promise<ToeicVocabulary[]> {
    try {
      return await httpClient.get<ToeicVocabulary[]>(API_ENDPOINTS.VOCABULARY.VOCABULARY_BY_TOPIC(topicId));
    } catch (error) {
      console.error(`Error fetching vocabulary by topic ${topicId}:`, error);
      throw new APIError(`Failed to fetch vocabulary by topic ${topicId}`, 500);
    }
  }

  async getVocabularyByWordType(wordTypeId: string): Promise<ToeicVocabulary[]> {
    try {
      return await httpClient.get<ToeicVocabulary[]>(API_ENDPOINTS.VOCABULARY.VOCABULARY_BY_WORD_TYPE(wordTypeId));
    } catch (error) {
      console.error(`Error fetching vocabulary by word type ${wordTypeId}:`, error);
      throw new APIError(`Failed to fetch vocabulary by word type ${wordTypeId}`, 500);
    }
  }

  async getVocabularyByDifficulty(difficulty: number): Promise<ToeicVocabulary[]> {
    try {
      return await httpClient.get<ToeicVocabulary[]>(API_ENDPOINTS.VOCABULARY.VOCABULARY_BY_DIFFICULTY(difficulty));
    } catch (error) {
      console.error(`Error fetching vocabulary by difficulty ${difficulty}:`, error);
      throw new APIError(`Failed to fetch vocabulary by difficulty ${difficulty}`, 500);
    }
  }

  async searchVocabularyByWord(word: string): Promise<ToeicVocabulary[]> {
    try {
      return await httpClient.get<ToeicVocabulary[]>(API_ENDPOINTS.VOCABULARY.SEARCH_VOCABULARY_BY_WORD(word));
    } catch (error) {
      console.error(`Error searching vocabulary by word ${word}:`, error);
      throw new APIError(`Failed to search vocabulary by word ${word}`, 500);
    }
  }

  async createVocabulary(vocabulary: Omit<ToeicVocabulary, 'id' | 'createdAt' | 'updatedAt'>): Promise<ToeicVocabulary> {
    try {
      return await httpClient.post<ToeicVocabulary>(API_ENDPOINTS.VOCABULARY.VOCABULARY, vocabulary);
    } catch (error) {
      console.error('Error creating vocabulary:', error);
      throw new APIError('Failed to create vocabulary', 500);
    }
  }

  async updateVocabulary(id: string, vocabulary: Partial<ToeicVocabulary>): Promise<ToeicVocabulary> {
    try {
      return await httpClient.put<ToeicVocabulary>(API_ENDPOINTS.VOCABULARY.VOCABULARY_BY_ID(id), vocabulary);
    } catch (error) {
      console.error(`Error updating vocabulary ${id}:`, error);
      throw new APIError(`Failed to update vocabulary ${id}`, 500);
    }
  }

  async deleteVocabulary(id: string): Promise<void> {
    try {
      return await httpClient.delete<void>(API_ENDPOINTS.VOCABULARY.VOCABULARY_BY_ID(id));
    } catch (error) {
      console.error(`Error deleting vocabulary ${id}:`, error);
      throw new APIError(`Failed to delete vocabulary ${id}`, 500);
    }
  }

  // Helper methods for Dictation
  async getVocabularySetsByTopic(): Promise<VocabSetByTopic[]> {
    try {
      const [topics, allVocabulary] = await Promise.all([
        this.getAllTopics(),
        this.getActiveVocabulary()
      ]);

      const vocabSetsByTopic: VocabSetByTopic[] = [];

      // Process each topic
      for (const topic of topics) {
        const topicVocabulary = allVocabulary.filter(vocab => vocab.topicId === topic.id);
        
        if (topicVocabulary.length > 0) {
          const uniqueVocabulary = VocabularyTransformer.removeDuplicates(topicVocabulary);
          const sets = VocabularyTransformer.createSets(uniqueVocabulary, WORDS_PER_SET);
          
          if (sets.length > 0) {
            vocabSetsByTopic.push({ topic: topic.name, sets });
          }
        }
      }

      // Add vocabulary without topic to "Other" category
      const vocabWithoutTopic = allVocabulary.filter(vocab => !vocab.topicId);
      const uniqueVocabWithoutTopic = VocabularyTransformer.removeDuplicates(vocabWithoutTopic);
      
      if (uniqueVocabWithoutTopic.length > 0) {
        const otherSets = VocabularyTransformer.createSets(uniqueVocabWithoutTopic, WORDS_PER_SET);
        if (otherSets.length > 0) {
          vocabSetsByTopic.push({ topic: 'Other', sets: otherSets });
        }
      }

      return vocabSetsByTopic;
    } catch (error) {
      console.error('Error getting vocabulary sets by topic:', error);
      throw new APIError('Failed to get vocabulary sets by topic', 500);
    }
  }

  async getVocabularySetByIndex(setIndex: number): Promise<ToeicVocabulary[]> {
    try {
      const vocabSetsByTopic = await this.getVocabularySetsByTopic();
      
      // Flatten all sets to get the global index
      const allSets: ToeicVocabulary[][] = [];
      vocabSetsByTopic.forEach(topicData => {
        allSets.push(...topicData.sets);
      });
      
      if (setIndex >= 0 && setIndex < allSets.length) {
        return allSets[setIndex];
      } else {
        throw new APIError(
          `Set index ${setIndex} is out of range. Available sets: ${allSets.length}`,
          400
        );
      }
    } catch (error) {
      console.error('Error getting vocabulary set by index:', error);
      throw error;
    }
  }

  // Utility methods
  convertToVocabularyItem(vocab: ToeicVocabulary): VocabularyItem {
    return VocabularyTransformer.toVocabularyItem(vocab);
  }

  async getTotalSetsCount(): Promise<number> {
    try {
      const vocabSetsByTopic = await this.getVocabularySetsByTopic();
      return vocabSetsByTopic.reduce((total, topicData) => total + topicData.sets.length, 0);
    } catch (error) {
      console.error('Error getting total sets count:', error);
      throw new APIError('Failed to get total sets count', 500);
    }
  }
}

// Export helper functions
export async function getExistingExamples(vocabularyId: string | number) {
  try {
    const response = await httpClient.get(API_ENDPOINTS.EXAMPLE_GENERATOR.EXISTING_EXAMPLES(vocabularyId));
    return response;
  } catch (error) {
    console.error('Error fetching existing examples:', error);
    throw new APIError('Failed to fetch existing examples', 500);
  }
}

export async function generateExampleAPI(vocabularyId: string | number, maxAttempts = 5) {
  try {
    const response = await httpClient.post(API_ENDPOINTS.EXAMPLE_GENERATOR.GENERATE_EXAMPLE, {
      vocabularyId,
      maxAttempts
    });
    return response;
  } catch (error) {
    console.error('Error generating example:', error);
    throw new APIError('Failed to generate example', 500);
  }
}

// Export singleton instance
export const toeicVocabularyService = new ToeicVocabularyService();
