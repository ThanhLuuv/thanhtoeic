import { 
  collection, 
  addDoc, 
  getDocs, 
  getDoc,
  query, 
  where, 
  updateDoc, 
  deleteDoc,
  doc,
  orderBy,
  Timestamp 
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { ttsService } from './ttsService';
import { phoneticService } from './phoneticService';

export interface Topic {
  id?: string;
  name: string;
  description: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Vocabulary {
  id?: string;
  word: string;
  type: string;
  phonetic?: string;
  meaning: string;
  audio?: string;
  topicId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

class AdminService {
  // Topics
  async createTopic(topicData: Omit<Topic, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const topicRef = collection(db, 'topics');
      const docRef = await addDoc(topicRef, {
        ...topicData,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating topic:', error);
      throw error;
    }
  }

  async getTopics(): Promise<Topic[]> {
    try {
      const topicsRef = collection(db, 'topics');
      const q = query(topicsRef, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const topics = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate()
      })) as Topic[];
      
      return topics;
    } catch (error) {
      console.error('Error getting topics:', error);
      throw error;
    }
  }

  async updateTopic(topicId: string, topicData: Partial<Topic>): Promise<void> {
    try {
      const topicRef = doc(db, 'topics', topicId);
      await updateDoc(topicRef, {
        ...topicData,
        updatedAt: Timestamp.now()
      });
    } catch (error) {
      console.error('Error updating topic:', error);
      throw error;
    }
  }

  async deleteTopic(topicId: string): Promise<void> {
    try {
      // First, get all vocabularies in this topic to delete their audio files
      const vocabQuery = query(collection(db, 'vocabulary'), where('topicId', '==', topicId));
      const vocabSnapshot = await getDocs(vocabQuery);
      
      // Delete audio files for all vocabularies in this topic
      const deleteAudioPromises = vocabSnapshot.docs.map(async (vocabDoc) => {
        const vocabData = vocabDoc.data() as Vocabulary;
        if (vocabData.audio && vocabData.audio.trim() !== '') {
          try {
            await ttsService.deleteAudioFromCloudinary(vocabData.audio);
            console.log(`Audio deleted for vocabulary: ${vocabData.word}`);
          } catch (error) {
            console.error('Failed to delete audio, but continuing:', error);
          }
        }
      });
      
      // Wait for all audio deletions to complete (or fail gracefully)
      await Promise.allSettled(deleteAudioPromises);
      
      // Then delete the topic document
      const topicRef = doc(db, 'topics', topicId);
      await deleteDoc(topicRef);
    } catch (error) {
      console.error('Error deleting topic:', error);
      throw error;
    }
  }

  // Vocabulary
  async createVocabulary(vocabData: Omit<Vocabulary, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      // Generate phonetic using OpenAI if not provided
      let finalVocabData = { ...vocabData };
      
      if (!vocabData.phonetic) {
        try {
          const phoneticResponse = await phoneticService.generatePhonetic({
            word: vocabData.word,
            type: vocabData.type
          });
          
          if (phoneticResponse.phonetic && !phoneticResponse.error) {
            finalVocabData.phonetic = phoneticResponse.phonetic;
          } else {
            console.warn('Failed to generate phonetic:', phoneticResponse.error);
            finalVocabData.phonetic = '';
          }
        } catch (phoneticError) {
          console.error('Error generating phonetic:', phoneticError);
          finalVocabData.phonetic = '';
        }
      }
      
      const vocabRef = collection(db, 'vocabulary');
      const docRef = await addDoc(vocabRef, {
        ...finalVocabData,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating vocabulary:', error);
      throw error;
    }
  }

  async getVocabularies(): Promise<Vocabulary[]> {
    try {
      const vocabRef = collection(db, 'vocabulary');
      const q = query(vocabRef, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const vocabularies = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate()
      })) as Vocabulary[];
      
      return vocabularies;
    } catch (error) {
      console.error('Error getting vocabularies:', error);
      throw error;
    }
  }

  async getVocabulariesByTopic(topicId: string): Promise<Vocabulary[]> {
    try {
      const vocabRef = collection(db, 'vocabulary');
      const q = query(
        vocabRef, 
        where('topicId', '==', topicId),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      
      const vocabularies = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate()
      })) as Vocabulary[];
      
      return vocabularies;
    } catch (error) {
      console.error('Error getting vocabularies by topic:', error);
      throw error;
    }
  }

  async updateVocabulary(vocabId: string, vocabData: Partial<Vocabulary>): Promise<void> {
    try {
      const vocabRef = doc(db, 'vocabulary', vocabId);
      await updateDoc(vocabRef, {
        ...vocabData,
        updatedAt: Timestamp.now()
      });
    } catch (error) {
      console.error('Error updating vocabulary:', error);
      throw error;
    }
  }

  async deleteVocabulary(vocabId: string): Promise<void> {
    try {
      // First, get the vocabulary to check if it has audio
      const vocabRef = doc(db, 'vocabulary', vocabId);
      const vocabDoc = await getDoc(vocabRef);
      
      if (vocabDoc.exists()) {
        const vocabData = vocabDoc.data() as Vocabulary;
        
        // If vocabulary has audio, delete it from Cloudinary first
        if (vocabData.audio && vocabData.audio.trim() !== '') {
          try {
            await ttsService.deleteAudioFromCloudinary(vocabData.audio);
            console.log(`Audio deleted for vocabulary: ${vocabData.word}`);
          } catch (error) {
            console.error('Failed to delete audio, but continuing with vocabulary deletion:', error);
            // Don't throw error here to avoid blocking vocabulary deletion
          }
        }
      }
      
      // Then delete the vocabulary document
      await deleteDoc(vocabRef);
    } catch (error) {
      console.error('Error deleting vocabulary:', error);
      throw error;
    }
  }

  // Bulk operations
  async createMultipleVocabularies(vocabList: Omit<Vocabulary, 'id' | 'createdAt' | 'updatedAt'>[]): Promise<string[]> {
    try {
      const vocabRef = collection(db, 'vocabulary');
      
      // Process vocabularies one by one to generate phonetics
      const results = [];
      for (const vocab of vocabList) {
        try {
          // Generate phonetic using OpenAI if not provided
          let finalVocabData = { ...vocab };
          
          if (!vocab.phonetic) {
            try {
              const phoneticResponse = await phoneticService.generatePhonetic({
                word: vocab.word,
                type: vocab.type
              });
              
              if (phoneticResponse.phonetic && !phoneticResponse.error) {
                finalVocabData.phonetic = phoneticResponse.phonetic;
              } else {
                console.warn('Failed to generate phonetic for', vocab.word, ':', phoneticResponse.error);
                finalVocabData.phonetic = '';
              }
            } catch (phoneticError) {
              console.error('Error generating phonetic for', vocab.word, ':', phoneticError);
              finalVocabData.phonetic = '';
            }
          }
          
          const docRef = await addDoc(vocabRef, {
            ...finalVocabData,
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now()
          });
          
          results.push(docRef);
        } catch (error) {
          console.error('Error creating vocabulary', vocab.word, ':', error);
          // Continue with other vocabularies
        }
      }
      
      return results.map(doc => doc.id);
    } catch (error) {
      console.error('Error creating multiple vocabularies:', error);
      throw error;
    }
  }

  // Search and filter
  async searchVocabularies(searchTerm: string): Promise<Vocabulary[]> {
    try {
      const vocabRef = collection(db, 'vocabulary');
      const querySnapshot = await getDocs(vocabRef);
      
      const vocabularies = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate()
      })) as Vocabulary[];
      
      return vocabularies.filter(vocab => 
        vocab.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vocab.meaning.toLowerCase().includes(searchTerm.toLowerCase())
      );
    } catch (error) {
      console.error('Error searching vocabularies:', error);
      throw error;
    }
  }
}

export const adminService = new AdminService();
