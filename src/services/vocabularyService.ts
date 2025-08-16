import { query, where } from 'firebase/firestore';
import { COLLECTIONS } from '../constants/collections';
import type { 
  ToeicVocabulary, 
  VocabularyItem, 
  VocabSetByTopic 
} from '../types/vocabulary';
import { BaseVocabularyService } from './baseVocabularyService';

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

// Main service - chỉ xử lý vocabulary
class VocabularyService extends BaseVocabularyService {
  protected getCollectionName(): string {
    return COLLECTIONS.VOCABULARY;
  }

  // Vocabulary operations
  async getAllVocabulary(): Promise<ToeicVocabulary[]> {
    return this.getAll<ToeicVocabulary>();
  }

  async getActiveVocabulary(): Promise<ToeicVocabulary[]> {
    return this.getWhere('isActive', true);
  }

  async getVocabularyById(id: string): Promise<ToeicVocabulary | null> {
    return this.getById<ToeicVocabulary>(id);
  }

  async getVocabularyByTopic(topicId: string): Promise<ToeicVocabulary[]> {
    return this.getWhere('topicId', topicId);
  }

  async getVocabularyByDifficulty(difficulty: number): Promise<ToeicVocabulary[]> {
    return this.getWhere('difficulty', difficulty);
  }

  async searchVocabularyByWord(word: string): Promise<ToeicVocabulary[]> {
    try {
      const { collection, query, where, getDocs } = await import('firebase/firestore');
      const { db } = await import('../config/firebase');
      
      const q = query(
        collection(db, this.getCollectionName()),
        where('word', '>=', word),
        where('word', '<=', word + '\uf8ff')
      );
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ToeicVocabulary[];
    } catch (error) {
      console.error(`Error searching vocabulary by word ${word}:`, error);
      throw new Error(`Failed to search vocabulary by word ${word}`);
    }
  }

  async createVocabulary(vocabulary: Omit<ToeicVocabulary, 'id' | 'createdAt' | 'updatedAt'>): Promise<ToeicVocabulary> {
    return this.create<ToeicVocabulary>(vocabulary);
  }

  async updateVocabulary(id: string, vocabulary: Partial<ToeicVocabulary>): Promise<ToeicVocabulary> {
    return this.update<ToeicVocabulary>(id, vocabulary);
  }

  async deleteVocabulary(id: string): Promise<void> {
    return this.delete(id);
  }

  // Helper methods for Dictation
  async getVocabularySetsByTopic(): Promise<VocabSetByTopic[]> {
    try {
      // Import topicService để lấy topics
      const { topicService } = await import('./topicService');
      const [topics, allVocabulary] = await Promise.all([
        topicService.getAllTopics(),
        this.getActiveVocabulary()
      ]);

      const vocabSetsByTopic: VocabSetByTopic[] = [];

      // Process each topic
      for (const topic of topics) {
        if (topic) {
          const topicVocabulary = allVocabulary.filter(vocab => vocab.topicId === topic.id);
          
          if (topicVocabulary.length > 0) {
            const uniqueVocabulary = VocabularyTransformer.removeDuplicates(topicVocabulary);
            const sets = VocabularyTransformer.createSets(uniqueVocabulary, WORDS_PER_SET);
            
            if (sets.length > 0) {
              vocabSetsByTopic.push({ topic: topic.name, sets });
            }
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
      throw new Error('Failed to get vocabulary sets by topic');
    }
  }

  async getVocabularySetByIndex(setIndex: number): Promise<ToeicVocabulary[]> {
    try {
      const vocabSetsByTopic = await this.getVocabularySetsByTopic();
      
      // Flatten all sets to get the global index
      const allSets: ToeicVocabulary[][] = [];
      vocabSetsByTopic.forEach(topicData => {
        if (topicData.sets && Array.isArray(topicData.sets)) {
          topicData.sets.forEach(set => {
            if (set && Array.isArray(set) && set.length > 0) {
              allSets.push(set);
            }
          });
        }
      });
      
      console.log(`[VocabularyService] Requested set index: ${setIndex}`);
      console.log(`[VocabularyService] Total available sets: ${allSets.length}`);
      console.log(`[VocabularyService] All sets:`, allSets.map((set, idx) => ({
        index: idx,
        count: set.length,
        firstWord: set[0]?.word || 'N/A'
      })));
      
      if (setIndex >= 0 && setIndex < allSets.length) {
        const selectedSet = allSets[setIndex];
        console.log(`[VocabularyService] Selected set ${setIndex}:`, {
          count: selectedSet.length,
          words: selectedSet.map(v => v.word)
        });
        return selectedSet;
      } else {
        throw new Error(
          `Set index ${setIndex} is out of range. Available sets: ${allSets.length}`
        );
      }
    } catch (error) {
      console.error('Error getting vocabulary set by index:', error);
      throw error;
    }
  }

  // New method: Get vocabulary set by topic and set index
  async getVocabularySetByTopicAndSetIndex(topicName: string, setIndex: number): Promise<ToeicVocabulary[]> {
    try {
      console.log(`[VocabularyService] Getting vocabulary for topic: ${topicName}, set index: ${setIndex}`);
      
      // Get all vocabulary for the specific topic
      let topicVocabulary: ToeicVocabulary[] = [];
      
      if (topicName === 'Other') {
        // Get vocabulary without topic
        topicVocabulary = await this.getActiveVocabulary();
        topicVocabulary = topicVocabulary.filter(vocab => !vocab.topicId);
      } else {
        // Get vocabulary by topic name
        const { topicService } = await import('./topicService');
        const topics = await topicService.getAllTopics();
        const targetTopic = topics.find(topic => topic.name === topicName);
        
        if (targetTopic) {
          topicVocabulary = await this.getVocabularyByTopic(targetTopic.id);
        } else {
          throw new Error(`Topic "${topicName}" not found`);
        }
      }
      
      // Remove duplicates and sort
      const uniqueVocabulary = VocabularyTransformer.removeDuplicates(topicVocabulary);
      console.log(`[VocabularyService] Found ${uniqueVocabulary.length} unique words for topic "${topicName}"`);
      
      // Calculate start and end index for the set
      const startIndex = setIndex * WORDS_PER_SET;
      const endIndex = startIndex + WORDS_PER_SET;
      
      console.log(`[VocabularyService] Set ${setIndex}: words ${startIndex} to ${endIndex - 1}`);
      
      if (startIndex >= uniqueVocabulary.length) {
        throw new Error(`Set index ${setIndex} is out of range for topic "${topicName}". Available words: ${uniqueVocabulary.length}`);
      }
      
      // Get the words for this set
      const setWords = uniqueVocabulary.slice(startIndex, endIndex);
      
      console.log(`[VocabularyService] Returning ${setWords.length} words for set ${setIndex}:`, {
        startIndex,
        endIndex,
        words: setWords.map(v => v.word)
      });
      
      return setWords;
    } catch (error) {
      console.error(`Error getting vocabulary set for topic "${topicName}" and set index ${setIndex}:`, error);
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
      throw new Error('Failed to get total sets count');
    }
  }


}

// Export singleton instance
export const vocabularyService = new VocabularyService();