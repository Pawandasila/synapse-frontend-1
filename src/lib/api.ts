// API utility functions for making authenticated requests
import Cookies from 'js-cookie';
import config from './config';

const API_BASE_URL = config.apiBaseUrl;

// Get auth token from cookies
const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return Cookies.get('authToken') || null;
  }
  return null;
};

const createHeaders = (includeAuth: boolean = true): HeadersInit => {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (includeAuth) {
    const token = getAuthToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  return headers;
};

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
    // If we get a 401 (Unauthorized), clear the cookies
    if (response.status === 401 && typeof window !== 'undefined') {
      Cookies.remove('authToken');
      Cookies.remove('user');
      Cookies.remove('userRole');
      Cookies.remove('userId');
      // Optionally redirect to login page
      if (window.location.pathname !== '/auth/login') {
        window.location.href = '/auth/login';
      }
    }
    
    let errorMessage = "An error occurred";
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

export const authAPI = {
  login: (email: string, password: string) =>
    apiRequest(
      "/users/login",
      {
        method: "POST",
        body: JSON.stringify({ email, password }),
      },
      false
    ),

  signup: (
    email: string,
    password: string,
    name: string,
    role: string,
    authProvider: string = "email"
  ) =>
    apiRequest(
      "/users/create",
      {
        method: "POST",
        body: JSON.stringify({
          email,
          password,
          name,
          role,
          authprovider: authProvider,
        }),
      },
      false
    ),

  // Note: No getCurrentUser endpoint available in backend
  // getCurrentUser functionality is handled through cookie restoration
  
  updateProfile: (data: any) =>
    apiRequest("/users/profile", {
      method: "PUT",
      body: JSON.stringify(data),
    }),
};

export const eventsAPI = {
  // Get all events
  getAll: () => apiRequest("/events"),

  // Search events with query parameters
  search: (query?: string, mode?: string, theme?: string) => {
    const params = new URLSearchParams();
    if (query) params.append('query', query);
    if (mode) params.append('mode', mode);
    if (theme) params.append('theme', theme);
    
    const queryString = params.toString();
    return apiRequest(`/events/search${queryString ? `?${queryString}` : ''}`);
  },

  // Get upcoming events
  getUpcoming: () => apiRequest("/events/upcoming"),

  // Get event by ID
  getById: (id: string) => apiRequest(`/events/${id}`),

  create: (eventData: any) =>
    apiRequest("/events", {
      method: "POST",
      body: JSON.stringify(eventData),
    }),

  update: (id: string, eventData: any) =>
    apiRequest(`/events/${id}`, {
      method: "PUT",
      body: JSON.stringify(eventData),
    }),

  delete: (id: string) =>
    apiRequest(`/events/${id}`, {
      method: "DELETE",
    }),

  register: (eventId: string) =>
    apiRequest(`/events/${eventId}/register`, {
      method: "POST",
    }),

  unregister: (eventId: string) =>
    apiRequest(`/events/${eventId}/unregister`, {
      method: "DELETE",
    }),
};

export default { apiRequest, authAPI, eventsAPI };
