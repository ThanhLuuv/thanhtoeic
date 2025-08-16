import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  QueryConstraint
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { COLLECTIONS } from '../constants/collections';
import type { VocabularyTopic, ToeicVocabulary } from '../types/vocabulary';

// Base service class for vocabulary operations
export abstract class BaseVocabularyService {
  protected abstract getCollectionName(): string;

  // Generic CRUD operations
  protected async getAll<T>(): Promise<T[]> {
    try {
      const querySnapshot = await getDocs(collection(db, this.getCollectionName()));
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as T[];
    } catch (error) {
      console.error(`Error fetching ${this.getCollectionName()}:`, error);
      throw new Error(`Failed to fetch ${this.getCollectionName()}`);
    }
  }

  protected async getById<T>(id: string): Promise<T | null> {
    try {
      const docRef = doc(db, this.getCollectionName(), id);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        return null;
      }
      
      return { id: docSnap.id, ...docSnap.data() } as T;
    } catch (error) {
      console.error(`Error fetching ${this.getCollectionName()} by ID:`, error);
      throw new Error(`Failed to fetch ${this.getCollectionName()} by ID`);
    }
  }

  protected async create<T>(data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<T> {
    try {
      const docRef = await addDoc(collection(db, this.getCollectionName()), {
        ...data,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      return { id: docRef.id, ...data, createdAt: new Date(), updatedAt: new Date() } as T;
    } catch (error) {
      console.error(`Error creating ${this.getCollectionName()}:`, error);
      throw new Error(`Failed to create ${this.getCollectionName()}`);
    }
  }

  protected async update<T>(id: string, data: Partial<T>): Promise<T> {
    try {
      const docRef = doc(db, this.getCollectionName(), id);
      await updateDoc(docRef, {
        ...data,
        updatedAt: new Date()
      });
      
      const updated = await this.getById<T>(id);
      if (!updated) {
        throw new Error(`Failed to get updated ${this.getCollectionName()}`);
      }
      return updated;
    } catch (error) {
      console.error(`Error updating ${this.getCollectionName()}:`, error);
      throw new Error(`Failed to update ${this.getCollectionName()}`);
    }
  }

  protected async delete(id: string): Promise<void> {
    try {
      const docRef = doc(db, this.getCollectionName(), id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error(`Error deleting ${this.getCollectionName()}:`, error);
      throw new Error(`Failed to delete ${this.getCollectionName()}`);
    }
  }

  protected async getWhere<T>(field: string, value: any): Promise<T[]> {
    try {
      const q = query(
        collection(db, this.getCollectionName()),
        where(field, '==', value)
      );
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as T[];
    } catch (error) {
      console.error(`Error fetching ${this.getCollectionName()} with constraint:`, error);
      throw new Error(`Failed to fetch ${this.getCollectionName()} with constraint`);
    }
  }
}
