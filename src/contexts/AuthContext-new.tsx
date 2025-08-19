'use client';

import { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import Cookies from 'js-cookie';
import { authAPI } from '@/lib/api';

// Cookie configuration
const COOKIE_OPTIONS = {
  expires: 7,
  path: '/',
  secure: false,
  sameSite: 'lax' as const,
};

// Storage utility functions
const setAuthData = (user: User, token: string) => {
  // Set in localStorage (primary storage)
  if (typeof window !== 'undefined') {
    localStorage.setItem('authToken', token);
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('userRole', user.role);
    localStorage.setItem('userId', user.id);
  }
  
  // Set in cookies (for middleware)
  Cookies.set('authToken', token, COOKIE_OPTIONS);
  Cookies.set('user', JSON.stringify(user), COOKIE_OPTIONS);
  Cookies.set('userRole', user.role, COOKIE_OPTIONS);
  Cookies.set('userId', user.id, COOKIE_OPTIONS);
};

const getAuthData = () => {
  if (typeof window === 'undefined') return { token: null, user: null };
  
  // Get from localStorage
  const token = localStorage.getItem('authToken');
  const userStr = localStorage.getItem('user');
  
  let user = null;
  if (userStr) {
    try {
      user = JSON.parse(userStr);
    } catch (error) {
      console.error('Error parsing user data:', error);
      clearAuthData();
      return { token: null, user: null };
    }
  }
  
  return { token, user };
};

const clearAuthData = () => {
  // Clear localStorage
  if (typeof window !== 'undefined') {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userId');
  }
  
  // Clear cookies
  Cookies.remove('authToken', { path: '/' });
  Cookies.remove('user', { path: '/' });
  Cookies.remove('userRole', { path: '/' });
  Cookies.remove('userId', { path: '/' });
};

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
  | { type: 'CLEAR_ERROR' }
  | { type: 'INIT_COMPLETE' };

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: true,
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
      return { ...state, user: null, isAuthenticated: false, error: null, loading: false };
    case 'UPDATE_PROFILE':
      return {
        ...state,
        user: state.user ? { ...state.user, ...action.payload } : null,
      };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    case 'INIT_COMPLETE':
      return { ...state, loading: false };
    default:
      return state;
  }
};

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string, role: User['role'], authProvider?: string) => Promise<void>;
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

  // Simple initialization - restore from localStorage if available
  useEffect(() => {
    const { token, user } = getAuthData();
    
    if (token && user && user.id && user.email && user.role) {
      dispatch({ type: 'LOGIN_SUCCESS', payload: user });
    } else {
      dispatch({ type: 'LOGOUT' });
    }
    
    dispatch({ type: 'INIT_COMPLETE' });
  }, []);

  const login = async (email: string, password: string) => {
    dispatch({ type: 'LOGIN_START' });
    try {
      const response = await authAPI.login(email, password);
      
      // Map API response to User interface
      const user: User = {
        id: response.data.userid?.toString() || response.data.id?.toString() || '1',
        email: response.data.email,
        name: response.data.name || response.data.username || email.split('@')[0],
        role: response.data.role || 'participant',
        avatar: response.data.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
        bio: response.data.bio || '',
        skills: response.data.skills || [],
        university: response.data.university || '',
      };

      // Store authentication data
      const token = response.token || response.data?.token || response.accessToken || response.data?.accessToken;
      
      if (token) {
        setAuthData(user, token);
      }
      
      dispatch({ type: 'LOGIN_SUCCESS', payload: user });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      dispatch({ type: 'LOGIN_FAILURE', payload: errorMessage });
      throw error;
    }
  };

  const signup = async (email: string, password: string, name: string, role: User['role'], authProvider: string = 'email') => {
    dispatch({ type: 'LOGIN_START' });
    try {
      await authAPI.signup(email, password, name, role, authProvider);
      dispatch({ type: 'CLEAR_ERROR' });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Signup failed';
      dispatch({ type: 'LOGIN_FAILURE', payload: errorMessage });
      throw error;
    }
  };

  const logout = () => {
    clearAuthData();
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
