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
  startAfter,
  QueryConstraint,
  DocumentData,
  QueryDocumentSnapshot
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { COLLECTIONS } from '../constants/collections';

// Base service class for Firebase operations
export class FirebaseService {
  protected collectionName: string;

  constructor(collectionName: string) {
    this.collectionName = collectionName;
  }

  // Get all documents from a collection
  async getAll<T = DocumentData>(): Promise<T[]> {
    try {
      const querySnapshot = await getDocs(collection(db, this.collectionName));
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as T[];
    } catch (error) {
      console.error(`Error getting all ${this.collectionName}:`, error);
      throw error;
    }
  }

  // Get a single document by ID
  async getById<T = DocumentData>(id: string): Promise<T | null> {
    try {
      const docRef = doc(db, this.collectionName, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data()
        } as T;
      }
      return null;
    } catch (error) {
      console.error(`Error getting ${this.collectionName} by ID:`, error);
      throw error;
    }
  }

  // Get documents with query constraints
  async getWhere<T = DocumentData>(constraints: QueryConstraint[]): Promise<T[]> {
    try {
      const q = query(collection(db, this.collectionName), ...constraints);
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as T[];
    } catch (error) {
      console.error(`Error getting ${this.collectionName} with constraints:`, error);
      throw error;
    }
  }

  // Get documents with pagination
  async getPaginated<T = DocumentData>(
    pageSize: number = 10,
    lastDoc?: QueryDocumentSnapshot<DocumentData>
  ): Promise<{ data: T[]; lastDoc: QueryDocumentSnapshot<DocumentData> | null }> {
    try {
      let q = query(
        collection(db, this.collectionName),
        orderBy('createdAt', 'desc'),
        limit(pageSize)
      );

      if (lastDoc) {
        q = query(q, startAfter(lastDoc));
      }

      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as T[];

      const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1] || null;

      return {
        data,
        lastDoc: lastVisible
      };
    } catch (error) {
      console.error(`Error getting paginated ${this.collectionName}:`, error);
      throw error;
    }
  }

  // Add a new document
  async add<T = DocumentData>(data: Omit<T, 'id'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, this.collectionName), {
        ...data,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      return docRef.id;
    } catch (error) {
      console.error(`Error adding ${this.collectionName}:`, error);
      throw error;
    }
  }

  // Update an existing document
  async update<T = DocumentData>(id: string, data: Partial<T>): Promise<void> {
    try {
      const docRef = doc(db, this.collectionName, id);
      await updateDoc(docRef, {
        ...data,
        updatedAt: new Date()
      });
    } catch (error) {
      console.error(`Error updating ${this.collectionName}:`, error);
      throw error;
    }
  }

  // Delete a document
  async delete(id: string): Promise<void> {
    try {
      const docRef = doc(db, this.collectionName, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error(`Error deleting ${this.collectionName}:`, error);
      throw error;
    }
  }

  // Search documents by field
  async searchByField<T = DocumentData>(
    field: string, 
    value: string | number,
    operator: '==' | '!=' | '<' | '<=' | '>' | '>=' | 'array-contains' | 'array-contains-any' | 'in' | 'not-in' = '=='
  ): Promise<T[]> {
    try {
      const q = query(
        collection(db, this.collectionName),
        where(field, operator, value)
      );
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as T[];
    } catch (error) {
      console.error(`Error searching ${this.collectionName} by field:`, error);
      throw error;
    }
  }

  // Get documents ordered by field
  async getOrdered<T = DocumentData>(
    field: string,
    direction: 'asc' | 'desc' = 'asc',
    limitCount?: number
  ): Promise<T[]> {
    try {
      let q = query(
        collection(db, this.collectionName),
        orderBy(field, direction)
      );

      if (limitCount) {
        q = query(q, limit(limitCount));
      }

      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as T[];
    } catch (error) {
      console.error(`Error getting ordered ${this.collectionName}:`, error);
      throw error;
    }
  }
}

// Export singleton instances for different collections
export const userService = new FirebaseService(COLLECTIONS.USERS);
