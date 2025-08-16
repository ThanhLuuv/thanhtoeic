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
import { COLLECTIONS } from '../constants/collections';

// Types
export interface User {
  id: string;
  email: string;
  fullName: string;
  role: 'student' | 'teacher' | 'admin';
  status: 'active' | 'inactive' | 'suspended';
  avatarUrl?: string | null;
  phone?: string | null;
  dateOfBirth?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface RegisterData {
  email: string;
  password: string;
  fullName: string;
  phone?: string | null;
  dateOfBirth?: string | null;
  avatarUrl?: string | null;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
}

class FirebaseAuthService {
  private readonly USERS_COLLECTION = COLLECTIONS.USERS;
  private currentUser: User | null = null;
  private authStateListeners: ((user: User | null) => void)[] = [];

  constructor() {
    console.log('FirebaseAuthService constructor called');
    console.log('Auth object:', auth);
    console.log('DB object:', db);
    console.log('USERS_COLLECTION:', this.USERS_COLLECTION);
    
    // Listen to auth state changes
    try {
      onAuthStateChanged(auth, async (firebaseUser) => {
        console.log('Auth state changed:', firebaseUser ? firebaseUser.uid : 'null');
        
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
      console.log('Auth state listener set up successfully');
    } catch (error) {
      console.error('Error setting up auth state listener:', error);
    }
  }

  // Register new user
  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      console.log('Starting registration process...', { email: data.email, fullName: data.fullName });
      
      // Create user in Firebase Auth
      const userCredential: UserCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      const firebaseUser = userCredential.user;
      console.log('Firebase Auth user created:', firebaseUser.uid);

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

      console.log('Creating user profile in Firestore:', { collection: this.USERS_COLLECTION, uid: firebaseUser.uid });
      
      try {
        // Filter out undefined values to avoid Firestore errors
        const cleanUserProfile = Object.fromEntries(
          Object.entries(userProfile).filter(([_, value]) => value !== undefined)
        );
        
        await setDoc(doc(db, this.USERS_COLLECTION, firebaseUser.uid), cleanUserProfile);
        console.log('User profile created successfully in Firestore');
      } catch (firestoreError) {
        console.error('Error creating user profile in Firestore:', firestoreError);
        // Try to delete the Firebase Auth user if Firestore fails
        try {
          await firebaseUser.delete();
          console.log('Firebase Auth user deleted due to Firestore failure');
        } catch (deleteError) {
          console.error('Error deleting Firebase Auth user:', deleteError);
        }
        throw new Error(`Failed to create user profile in database: ${firestoreError}`);
      }

      // Update Firebase Auth profile
      try {
        await updateProfile(firebaseUser, {
          displayName: data.fullName,
          photoURL: data.avatarUrl
        });
        console.log('Firebase Auth profile updated successfully');
      } catch (profileError) {
        console.error('Error updating Firebase Auth profile:', profileError);
        // This is not critical, so we continue
      }

      // Get the created user
      const createdUser = await this.getUserFromFirestore(firebaseUser.uid);
      if (!createdUser) {
        throw new Error('Failed to retrieve created user profile');
      }

      console.log('User registration completed successfully:', createdUser);
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
      console.log('Getting user from Firestore:', { collection: this.USERS_COLLECTION, uid });
      
      const userDoc = await getDoc(doc(db, this.USERS_COLLECTION, uid));
      console.log('Firestore document exists:', userDoc.exists());
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        console.log('User data from Firestore:', userData);
        
        const user: User = {
          id: userDoc.id,
          ...userData
        } as User;
        
        console.log('Constructed user object:', user);
        return user;
      }
      
      console.log('User document does not exist in Firestore');
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

      // Filter out undefined values to avoid Firestore errors
      const cleanUpdates = Object.fromEntries(
        Object.entries(updates).filter(([_, value]) => value !== undefined)
      );

      const userRef = doc(db, this.USERS_COLLECTION, this.currentUser.id);
      await updateDoc(userRef, {
        ...cleanUpdates,
        updatedAt: new Date()
      });

      // Update current user
      this.currentUser = { ...this.currentUser, ...cleanUpdates };
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

// Export singleton instance with lazy initialization
let _firebaseAuthService: FirebaseAuthService | null = null;

export const firebaseAuthService = (): FirebaseAuthService => {
  if (!_firebaseAuthService) {
    // Check if Firebase is properly initialized
    if (!auth || !db) {
      console.error('Firebase not properly initialized. Auth:', !!auth, 'DB:', !!db);
      throw new Error('Firebase not properly initialized');
    }
    
    console.log('Creating new FirebaseAuthService instance');
    _firebaseAuthService = new FirebaseAuthService();
  }
  return _firebaseAuthService;
};

// For backward compatibility, also export the instance directly
export const firebaseAuthServiceInstance = new FirebaseAuthService();
