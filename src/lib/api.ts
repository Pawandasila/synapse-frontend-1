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

export const apiRequest = async <T = unknown>(
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
  
  updateProfile: (data: Record<string, unknown>) =>
    apiRequest("/users/profile", {
      method: "PUT",
      body: JSON.stringify(data),
    }),
};

export const eventsAPI = {
  // Get all events with pagination
  getAll: (page: number = 1) => {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    return apiRequest(`/events?${params.toString()}`);
  },

  // Search events with query parameters and pagination
  search: (query?: string, mode?: string, theme?: string, page: number = 1) => {
    const params = new URLSearchParams();
    
    // Only add query parameter if it has at least 2 characters (backend validation requirement)
    if (query && query.trim().length >= 2) {
      params.append('q', query.trim());
    }
    
    if (mode && mode !== 'all') params.append('mode', mode);
    if (theme && theme !== 'all') params.append('theme', theme);
    params.append('page', page.toString());
    
    const queryString = params.toString();
    console.log(queryString)
    return apiRequest(`/events/search${queryString ? `?${queryString}` : ''}`);
  },

  // Get upcoming events
  getUpcoming: () => apiRequest("/events/upcoming"),

  // Get events by organizer
  getByOrganizer: (organizerId: string, page: number = 1) => {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    return apiRequest(`/events/organizer/${organizerId}?${params.toString()}`);
  },

  // Get event by ID
  getById: (id: string) => apiRequest(`/events/${id}`),

  create: (eventData: Record<string, unknown>) =>
    apiRequest("/events/create", {
      method: "POST",
      body: JSON.stringify(eventData),
    }),

  update: (id: string, eventData: Record<string, unknown>) =>
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
