import { BaseVocabularyService } from './baseVocabularyService';
import { COLLECTIONS } from '../constants/collections';
import type { VocabularyTopic } from '../types/vocabulary';

class TopicService extends BaseVocabularyService {
  protected getCollectionName(): string {
    return COLLECTIONS.TOPICS;
  }

  async getAllTopics(): Promise<VocabularyTopic[]> {
    return this.getAll<VocabularyTopic>();
  }

  async getTopicById(id: string): Promise<VocabularyTopic | null> {
    return this.getById<VocabularyTopic>(id);
  }

  async createTopic(topic: Omit<VocabularyTopic, 'id' | 'createdAt' | 'updatedAt'>): Promise<VocabularyTopic> {
    return this.create<VocabularyTopic>(topic);
  }

  async updateTopic(id: string, topic: Partial<VocabularyTopic>): Promise<VocabularyTopic> {
    return this.update<VocabularyTopic>(id, topic);
  }

  async deleteTopic(id: string): Promise<void> {
    return this.delete(id);
  }
}

export const topicService = new TopicService();
