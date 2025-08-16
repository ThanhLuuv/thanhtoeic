import { collection, addDoc, query, where, getDocs, orderBy, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { COLLECTIONS } from '../constants/collections';
import type { 
  StoredExampleSentence, 
  ExampleSentenceCreateRequest,
  ExampleSentence 
} from '../types/example';

// Service for managing example sentences in database
class ExampleService {
  private collectionName = COLLECTIONS.EXAMPLE_SENTENCES || 'example_sentences';

  /**
   * Create a new example sentence
   */
  async createExampleSentence(request: ExampleSentenceCreateRequest): Promise<StoredExampleSentence> {
    try {
      const now = new Date();
      const exampleData: Omit<StoredExampleSentence, 'id'> = {
        ...request,
        createdAt: now,
        updatedAt: now,
      };

      const docRef = await addDoc(collection(db, this.collectionName), exampleData);
      
      return {
        id: docRef.id,
        ...exampleData,
      };
    } catch (error) {
      console.error('Error creating example sentence:', error);
      throw new Error('Failed to create example sentence');
    }
  }

  /**
   * Get all example sentences for a specific word
   */
  async getExampleSentencesByWord(word: string): Promise<StoredExampleSentence[]> {
    try {
      const q = query(
        collection(db, this.collectionName),
        where('word', '==', word.toLowerCase()),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const examples: StoredExampleSentence[] = [];
      
      querySnapshot.forEach((doc) => {
        examples.push({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
          updatedAt: doc.data().updatedAt?.toDate() || new Date(),
        } as StoredExampleSentence);
      });
      
      return examples;
    } catch (error) {
      console.error('Error getting example sentences:', error);
      throw new Error('Failed to get example sentences');
    }
  }

  /**
   * Get all example sentences for a topic
   */
  async getExampleSentencesByTopic(topic: string): Promise<StoredExampleSentence[]> {
    try {
      const q = query(
        collection(db, this.collectionName),
        where('topic', '==', topic),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const examples: StoredExampleSentence[] = [];
      
      querySnapshot.forEach((doc) => {
        examples.push({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
          updatedAt: doc.data().updatedAt?.toDate() || new Date(),
        } as StoredExampleSentence);
      });
      
      return examples;
    } catch (error) {
      console.error('Error getting example sentences by topic:', error);
      throw new Error('Failed to get example sentences by topic');
    }
  }

  /**
   * Update an example sentence
   */
  async updateExampleSentence(id: string, updates: Partial<ExampleSentenceCreateRequest>): Promise<void> {
    try {
      const docRef = doc(db, this.collectionName, id);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: new Date(),
      });
    } catch (error) {
      console.error('Error updating example sentence:', error);
      throw new Error('Failed to update example sentence');
    }
  }

  /**
   * Delete an example sentence
   */
  async deleteExampleSentence(id: string): Promise<void> {
    try {
      const docRef = doc(db, this.collectionName, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting example sentence:', error);
      throw new Error('Failed to delete example sentence');
    }
  }

  /**
   * Convert StoredExampleSentence to ExampleSentence format
   */
  convertToExampleSentence(stored: StoredExampleSentence): ExampleSentence {
    return {
      englishSentence: stored.englishSentence,
      vietnameseTranslation: stored.vietnameseTranslation,
      contextInfo: stored.contextInfo,
    };
  }
}

// Export singleton instance
export const exampleService = new ExampleService();

// Export the class for testing purposes
export { ExampleService };
