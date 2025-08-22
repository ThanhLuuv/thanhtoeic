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

export interface Sentence {
  id?: string;
  englishSentence: string;
  vietnameseTranslation: string;
  audio: string;
  part: 'part1' | 'part2' | 'part3';
  createdAt?: Date;
  updatedAt?: Date;
}

class SentenceService {
  // Create new sentence
  async createSentence(sentenceData: Omit<Sentence, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const sentenceRef = collection(db, 'sentences');
      const docRef = await addDoc(sentenceRef, {
        ...sentenceData,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating sentence:', error);
      throw error;
    }
  }

  // Get all sentences
  async getSentences(): Promise<Sentence[]> {
    try {
      const sentencesRef = collection(db, 'sentences');
      const q = query(sentencesRef, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const sentences = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate()
      })) as Sentence[];
      
      return sentences;
    } catch (error) {
      console.error('Error getting sentences:', error);
      throw error;
    }
  }

  // Get sentences by part
  async getSentencesByPart(part: 'part1' | 'part2' | 'part3' | 'part4'): Promise<Sentence[]> {
    try {
      const sentencesRef = collection(db, 'sentences');
      const q = query(
        sentencesRef, 
        where('part', '==', part),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      
      const sentences = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate()
      })) as Sentence[];
      
      return sentences;
    } catch (error) {
      console.error('Error getting sentences by part:', error);
      throw error;
    }
  }

  // Get sentence by ID
  async getSentenceById(sentenceId: string): Promise<Sentence | null> {
    try {
      const sentenceRef = doc(db, 'sentences', sentenceId);
      const sentenceDoc = await getDoc(sentenceRef);
      
      if (sentenceDoc.exists()) {
        const data = sentenceDoc.data();
        return {
          id: sentenceDoc.id,
          ...data,
          createdAt: data.createdAt?.toDate(),
          updatedAt: data.updatedAt?.toDate()
        } as Sentence;
      }
      
      return null;
    } catch (error) {
      console.error('Error getting sentence by ID:', error);
      throw error;
    }
  }

  // Update sentence
  async updateSentence(sentenceId: string, sentenceData: Partial<Sentence>): Promise<void> {
    try {
      const sentenceRef = doc(db, 'sentences', sentenceId);
      await updateDoc(sentenceRef, {
        ...sentenceData,
        updatedAt: Timestamp.now()
      });
    } catch (error) {
      console.error('Error updating sentence:', error);
      throw error;
    }
  }

  // Delete sentence
  async deleteSentence(sentenceId: string): Promise<void> {
    try {
      const sentenceRef = doc(db, 'sentences', sentenceId);
      await deleteDoc(sentenceRef);
    } catch (error) {
      console.error('Error deleting sentence:', error);
      throw error;
    }
  }

  // Get sentence count by part
  async getSentenceCountByPart(): Promise<Record<string, number>> {
    try {
      const sentences = await this.getSentences();
      const countByPart: Record<string, number> = {
        part1: 0,
        part2: 0,
        part3: 0,
        part4: 0
      };
      
      sentences.forEach(sentence => {
        countByPart[sentence.part]++;
      });
      
      return countByPart;
    } catch (error) {
      console.error('Error getting sentence count by part:', error);
      throw error;
    }
  }

  // Get sentence sets by part (10 sentences per set)
  async getSentenceSetsByPart(): Promise<Array<{ part: 'part1' | 'part2' | 'part3', sets: Sentence[][] }>> {
    try {
      const parts: ('part1' | 'part2' | 'part3')[] = ['part1', 'part2', 'part3'];
      const result: Array<{ part: 'part1' | 'part2' | 'part3', sets: Sentence[][] }> = [];
      
      for (const part of parts) {
        const sentences = await this.getSentencesByPart(part);
        const sets: Sentence[][] = [];
        
        // Create sets of 10 sentences each
        for (let i = 0; i < sentences.length; i += 10) {
          sets.push(sentences.slice(i, i + 10));
        }
        
        if (sets.length > 0) {
          result.push({ part, sets });
        }
      }
      
      return result;
    } catch (error) {
      console.error('Error getting sentence sets by part:', error);
      throw error;
    }
  }

  // Get specific sentence set by part and set index
  async getSentenceSetByPartAndSetIndex(part: 'part1' | 'part2' | 'part3', setIndex: number): Promise<Sentence[]> {
    try {
      const sentences = await this.getSentencesByPart(part);
      const startIndex = setIndex * 10;
      const endIndex = startIndex + 10;
      return sentences.slice(startIndex, endIndex);
    } catch (error) {
      console.error('Error getting sentence set by part and index:', error);
      throw error;
    }
  }

  // Get total sets count
  async getTotalSetsCount(): Promise<number> {
    try {
      const parts: ('part1' | 'part2' | 'part3')[] = ['part1', 'part2', 'part3'];
      let totalSets = 0;
      
      for (const part of parts) {
        const sentences = await this.getSentencesByPart(part);
        const setsCount = Math.ceil(sentences.length / 10);
        totalSets += setsCount;
      }
      
      return totalSets;
    } catch (error) {
      console.error('Error getting total sets count:', error);
      throw error;
    }
  }
}

export const sentenceService = new SentenceService();
