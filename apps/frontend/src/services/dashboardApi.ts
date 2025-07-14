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

// Dashboard KPI interfaces
export interface DashboardKPIs {
  total_orders: number;
  total_revenue: string;
  total_collections: number;
  total_cards: number;
  pending_orders: number;
  completed_orders: number;
  cancelled_orders: number;
  active_collections: number;
  issued_collections: number;
  total_users: number;
  recent_orders: Order[];
  top_selling_cards: Card[];
}

export interface Order {
  id: number;
  order_number: string;
  user: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
  };
  order_value: string;
  status: 'processing' | 'completed' | 'cancelled';
  order_date: string;
  completed_date?: string;
  notes?: string;
  total_items: number;
  is_completed: boolean;
}

export interface Card {
  id: number;
  name: string;
  description: string;
  collection: {
    id: number;
    name: string;
  };
  category: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  rarity: 'normal' | 'foil' | 'holographic' | 'special';
  base_price: string;
  market_price?: string;
  stock_quantity: number;
  is_active: boolean;
  current_price: string;
  is_in_stock: boolean;
}

// Dashboard API service
export const dashboardApi = {
  // Get dashboard KPIs
  getDashboardKPIs: async (): Promise<DashboardKPIs> => {
    const response = await apiClient.get('/dashboard/kpis/');
    return response.data;
  },
}; 