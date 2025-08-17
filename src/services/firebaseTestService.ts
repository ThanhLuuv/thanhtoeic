import { db } from '../config/firebase';
import { collection, getDocs } from 'firebase/firestore';

// Service để test kết nối Firebase
class FirebaseTestService {
  
  // Test kết nối cơ bản
  async testConnection(): Promise<boolean> {
    try {
      
      // Thử lấy một document từ collection users
      const usersRef = collection(db, 'users');
      const snapshot = await getDocs(usersRef);
      
      return true;
    } catch (error) {
      console.error('Firebase connection failed:', error);
      return false;
    }
  }

  // Test collection list
  async testListCollections(): Promise<boolean> {
    try {
      
      // Thử lấy danh sách collections
      const collections = ['users', 'vocabulary', 'topics'];
      
      for (const collectionName of collections) {
        try {
          const collectionRef = collection(db, collectionName);
          const snapshot = await getDocs(collectionRef);
        } catch (error) {
          console.error(`Failed to access collection ${collectionName}:`, error);
        }
      }
      
      return true;
    } catch (error) {
      console.error('Collection listing failed:', error);
      return false;
    }
  }
}

export const firebaseTestService = new FirebaseTestService();
