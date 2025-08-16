import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  User as FirebaseUser,
  UserCredential
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

// Types
export interface User {
  id: string;
  email: string;
  fullName: string;
  role: 'student' | 'teacher' | 'admin';
  status: 'active' | 'inactive' | 'suspended';
  avatarUrl?: string;
  phone?: string;
  dateOfBirth?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface RegisterData {
  email: string;
  password: string;
  fullName: string;
  phone?: string;
  dateOfBirth?: string;
  avatarUrl?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
}

// Firebase Authentication Service
class FirebaseAuthService {
  private readonly USERS_COLLECTION = 'users';
  private currentUser: User | null = null;
  private authStateListeners: ((user: User | null) => void)[] = [];

  constructor() {
    // Listen to auth state changes
    onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Get user data from Firestore
        const userData = await this.getUserFromFirestore(firebaseUser.uid);
        this.currentUser = userData;
        this.notifyAuthStateListeners(userData);
      } else {
        this.currentUser = null;
        this.notifyAuthStateListeners(null);
      }
    });
  }

  // Register new user
  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      // Create user in Firebase Auth
      const userCredential: UserCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      const firebaseUser = userCredential.user;

      // Create user profile in Firestore
      const userProfile: Omit<User, 'id'> = {
        email: data.email,
        fullName: data.fullName,
        role: 'student', // Default role
        status: 'active',
        avatarUrl: data.avatarUrl,
        phone: data.phone,
        dateOfBirth: data.dateOfBirth,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      await setDoc(doc(db, this.USERS_COLLECTION, firebaseUser.uid), userProfile);

      // Update Firebase Auth profile
      await updateProfile(firebaseUser, {
        displayName: data.fullName,
        photoURL: data.avatarUrl
      });

      // Get the created user
      const createdUser = await this.getUserFromFirestore(firebaseUser.uid);
      if (!createdUser) {
        throw new Error('Failed to create user profile');
      }

      this.currentUser = createdUser;

      return {
        user: createdUser,
        accessToken: await firebaseUser.getIdToken()
      };
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  // Login user
  async login(data: LoginData): Promise<AuthResponse> {
    try {
      const userCredential: UserCredential = await signInWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      const firebaseUser = userCredential.user;
      const userData = await this.getUserFromFirestore(firebaseUser.uid);
      
      if (!userData) {
        throw new Error('User profile not found');
      }

      this.currentUser = userData;

      return {
        user: userData,
        accessToken: await firebaseUser.getIdToken()
      };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  // Logout user
  async logout(): Promise<void> {
    try {
      await signOut(auth);
      this.currentUser = null;
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }

  // Get current user
  getCurrentUser(): User | null {
    return this.currentUser;
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.currentUser && auth.currentUser !== null;
  }

  // Get user from Firestore
  private async getUserFromFirestore(uid: string): Promise<User | null> {
    try {
      const userDoc = await getDoc(doc(db, this.USERS_COLLECTION, uid));
      if (userDoc.exists()) {
        return {
          id: userDoc.id,
          ...userDoc.data()
        } as User;
      }
      return null;
    } catch (error) {
      console.error('Error getting user from Firestore:', error);
      return null;
    }
  }

  // Update user profile
  async updateProfile(updates: Partial<User>): Promise<void> {
    try {
      if (!this.currentUser) {
        throw new Error('No user logged in');
      }

      const userRef = doc(db, this.USERS_COLLECTION, this.currentUser.id);
      await updateDoc(userRef, {
        ...updates,
        updatedAt: new Date()
      });

      // Update current user
      this.currentUser = { ...this.currentUser, ...updates };
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  }

  // Check user role
  hasRole(role: string): boolean {
    return this.currentUser?.role === role;
  }

  // Check if user is admin
  isAdmin(): boolean {
    return this.hasRole('admin');
  }

  // Check if user is teacher
  isTeacher(): boolean {
    return this.hasRole('teacher');
  }

  // Check if user is student
  isStudent(): boolean {
    return this.hasRole('student');
  }

  // Add auth state listener
  onAuthStateChanged(callback: (user: User | null) => void): () => void {
    this.authStateListeners.push(callback);
    
    // Return unsubscribe function
    return () => {
      const index = this.authStateListeners.indexOf(callback);
      if (index > -1) {
        this.authStateListeners.splice(index, 1);
      }
    };
  }

  // Notify all auth state listeners
  private notifyAuthStateListeners(user: User | null): void {
    this.authStateListeners.forEach(callback => callback(user));
  }

  // Get current Firebase user
  getFirebaseUser(): FirebaseUser | null {
    return auth.currentUser;
  }

  // Get current user's ID token
  async getCurrentUserToken(): Promise<string | null> {
    try {
      const user = auth.currentUser;
      return user ? await user.getIdToken() : null;
    } catch (error) {
      console.error('Error getting user token:', error);
      return null;
    }
  }
}

// Export singleton instance
export const firebaseAuthService = new FirebaseAuthService();
