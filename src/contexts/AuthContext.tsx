import React, { createContext, useContext, useEffect, useState } from 'react';
import { firebaseAuthService, User } from '../services/firebaseAuthService';

interface AuthContextType {
  currentUser: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, fullName: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      // Get the service instance
      const authService = firebaseAuthService();
      
      // Use firebaseAuthService to listen to auth state changes
      const unsubscribe = authService.onAuthStateChanged((user: User | null) => {
        setCurrentUser(user);
        setLoading(false);
      });

      // Set initial user state
      const initialUser = authService.getCurrentUser();
      if (initialUser) {
        setCurrentUser(initialUser);
      }
      setLoading(false);
      
      setError(null);
      
      return unsubscribe;
    } catch (err: any) {
      console.error('Error initializing auth service:', err);
      setError('Failed to initialize authentication service');
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const authService = firebaseAuthService();
      await authService.login({ email, password });
      // User is automatically set in the auth state listener above
    } catch (error: any) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (email: string, password: string, fullName: string) => {
    try {
      const authService = firebaseAuthService();
      await authService.register({ 
        email, 
        password, 
        fullName 
      });
      // User is automatically set in the auth state listener above
    } catch (error: any) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      const authService = firebaseAuthService();
      await authService.logout();
      // User is automatically cleared in the auth state listener above
    } catch (error: any) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  const value: AuthContextType = {
    currentUser,
    login,
    register,
    logout,
    loading
  };

  // Show error if auth service failed to initialize
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600 mb-2">Authentication Error</h2>
          <p className="text-gray-600">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
