import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8001/api';

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Collections API interfaces
export interface Collection {
  id: number;
  name: string;
  description: string;
  status: 'pending' | 'in_production' | 'issued';
  expected_release_date: string;
  actual_release_date?: string;
  created_by: number;
  created_at: string;
  updated_at: string;
  total_cards: number;
  is_released: boolean;
}

export interface CollectionsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Collection[];
}

// Collections API service
export const collectionsApi = {
  // Get all collections with pagination
  getCollections: async (params?: {
    page?: number;
    page_size?: number;
    status?: string;
    search?: string;
    ordering?: string;
  }): Promise<CollectionsResponse> => {
    const response = await apiClient.get('/collections/', { params });
    return response.data;
  },

  // Get a single collection
  getCollection: async (id: number): Promise<Collection> => {
    const response = await apiClient.get(`/collections/${id}/`);
    return response.data;
  },

  // Create a new collection
  createCollection: async (data: Partial<Collection>): Promise<Collection> => {
    const response = await apiClient.post('/collections/', data);
    return response.data;
  },

  // Update a collection
  updateCollection: async (id: number, data: Partial<Collection>): Promise<Collection> => {
    const response = await apiClient.put(`/collections/${id}/`, data);
    return response.data;
  },

  // Delete a collection
  deleteCollection: async (id: number): Promise<void> => {
    await apiClient.delete(`/collections/${id}/`);
  },

  // Get cards in a collection
  getCollectionCards: async (id: number) => {
    const response = await apiClient.get(`/collections/${id}/cards/`);
    return response.data;
  },
}; 