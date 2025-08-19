// API utility functions for making authenticated requests

const API_BASE_URL = 'http://localhost:8000/api/v1';

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Get auth token from localStorage
const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('authToken');
  }
  return null;
};

// Create headers with auth token
const createHeaders = (includeAuth: boolean = true): HeadersInit => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (includeAuth) {
    const token = getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  return headers;
};

// Generic API request function
export const apiRequest = async <T = any>(
  endpoint: string,
  options: RequestInit = {},
  includeAuth: boolean = true
): Promise<T> => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const response = await fetch(url, {
    ...options,
    headers: {
      ...createHeaders(includeAuth),
      ...options.headers,
    },
  });

  if (!response.ok) {
    let errorMessage = 'An error occurred';
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorData.error || errorMessage;
    } catch {
      errorMessage = response.statusText || errorMessage;
    }
    throw new Error(errorMessage);
  }

  return response.json();
};

// Specific API functions
export const authAPI = {
  login: (email: string, password: string) =>
    apiRequest('/users/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }, false),

  signup: (email: string, password: string, name: string, role: string) =>
    apiRequest('/users/create', {
      method: 'POST',
      body: JSON.stringify({ email, password, name, role }),
    }, false),

  getCurrentUser: () =>
    apiRequest('/users/me'),

  updateProfile: (data: any) =>
    apiRequest('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
};

// Events API functions
export const eventsAPI = {
  getAll: () => apiRequest('/events'),
  
  getById: (id: string) => apiRequest(`/events/${id}`),
  
  create: (eventData: any) =>
    apiRequest('/events', {
      method: 'POST',
      body: JSON.stringify(eventData),
    }),
  
  update: (id: string, eventData: any) =>
    apiRequest(`/events/${id}`, {
      method: 'PUT',
      body: JSON.stringify(eventData),
    }),
  
  delete: (id: string) =>
    apiRequest(`/events/${id}`, {
      method: 'DELETE',
    }),
  
  register: (eventId: string) =>
    apiRequest(`/events/${eventId}/register`, {
      method: 'POST',
    }),
  
  unregister: (eventId: string) =>
    apiRequest(`/events/${eventId}/unregister`, {
      method: 'DELETE',
    }),
};

export default { apiRequest, authAPI, eventsAPI };
