'use client';

import { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { authAPI } from '@/lib/api';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'participant' | 'organizer' | 'judge';
  avatar?: string;
  bio?: string;
  skills?: string[];
  university?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: User }
  | { type: 'LOGIN_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_PROFILE'; payload: Partial<User> }
  | { type: 'CLEAR_ERROR' };

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, loading: true, error: null };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        loading: false,
        error: null,
      };
    case 'LOGIN_FAILURE':
      return { ...state, loading: false, error: action.payload };
    case 'LOGOUT':
      return { ...state, user: null, isAuthenticated: false, error: null };
    case 'UPDATE_PROFILE':
      return {
        ...state,
        user: state.user ? { ...state.user, ...action.payload } : null,
      };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
};

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string, role: User['role']) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check for existing token on mount
  useEffect(() => {
    const checkAuthToken = async () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          const data = await authAPI.getCurrentUser();
          const user: User = {
            id: data.id || data._id || '1',
            email: data.email,
            name: data.name || data.username,
            role: data.role || 'participant',
            avatar: data.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.email}`,
            bio: data.bio || '',
            skills: data.skills || [],
            university: data.university || '',
          };
          dispatch({ type: 'LOGIN_SUCCESS', payload: user });
        } catch (error) {
          // Error verifying token, remove it
          localStorage.removeItem('authToken');
        }
      }
    };

    checkAuthToken();
  }, []);

  const login = async (email: string, password: string) => {
    dispatch({ type: 'LOGIN_START' });
    try {
      const data = await authAPI.login(email, password);
      
      // Map API response to User interface
      const user: User = {
        id: data.user.id || data.user._id || '1',
        email: data.user.email,
        name: data.user.name || data.user.username || email.split('@')[0],
        role: data.user.role || 'participant',
        avatar: data.user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
        bio: data.user.bio || '',
        skills: data.user.skills || [],
        university: data.user.university || '',
      };

      // Store authentication token if provided
      if (data.token) {
        localStorage.setItem('authToken', data.token);
      }
      
      dispatch({ type: 'LOGIN_SUCCESS', payload: user });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      dispatch({ type: 'LOGIN_FAILURE', payload: errorMessage });
      throw error;
    }
  };

  const signup = async (email: string, password: string, name: string, role: User['role']) => {
    dispatch({ type: 'LOGIN_START' });
    try {
      const data = await authAPI.signup(email, password, name, role);
      
      // Map API response to User interface
      const newUser: User = {
        id: data.user.id || data.user._id || Date.now().toString(),
        email: data.user.email,
        name: data.user.name || name,
        role: data.user.role || role,
        avatar: data.user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
        bio: data.user.bio || '',
        skills: data.user.skills || [],
        university: data.user.university || '',
      };

      // Store authentication token if provided
      if (data.token) {
        localStorage.setItem('authToken', data.token);
      }
      
      dispatch({ type: 'LOGIN_SUCCESS', payload: newUser });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Signup failed';
      dispatch({ type: 'LOGIN_FAILURE', payload: errorMessage });
      throw error;
    }
  };

  const logout = () => {
    // Remove token from localStorage
    localStorage.removeItem('authToken');
    dispatch({ type: 'LOGOUT' });
  };

  const updateProfile = (data: Partial<User>) => {
    dispatch({ type: 'UPDATE_PROFILE', payload: data });
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const value: AuthContextType = {
    ...state,
    login,
    signup,
    logout,
    updateProfile,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
