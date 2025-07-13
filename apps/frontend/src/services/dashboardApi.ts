import apiClient from './authApi';
import { DashboardKPIs } from '../types/dashboard';

export const dashboardApi = {
  /**
   * Get dashboard KPIs including statistics and recent data
   */
  getKPIs: async (): Promise<DashboardKPIs> => {
    const response = await apiClient.get('/dashboard/kpis/');
    return response.data;
  },

  /**
   * Get specific order details
   */
  getOrder: async (orderId: number) => {
    const response = await apiClient.get(`/orders/${orderId}/`);
    return response.data;
  },

  /**
   * Get orders with filtering and pagination
   */
  getOrders: async (params?: {
    status?: string;
    page?: number;
    limit?: number;
    search?: string;
  }) => {
    const response = await apiClient.get('/orders/', { params });
    return response.data;
  },

  /**
   * Get collections data
   */
  getCollections: async (params?: {
    status?: string;
    page?: number;
    limit?: number;
  }) => {
    const response = await apiClient.get('/collections/', { params });
    return response.data;
  },

  /**
   * Get cards data
   */
  getCards: async (params?: {
    category?: string;
    rarity?: string;
    collection?: number;
    page?: number;
    limit?: number;
  }) => {
    const response = await apiClient.get('/cards/', { params });
    return response.data;
  },

  /**
   * Update order status
   */
  updateOrderStatus: async (orderId: number, status: string) => {
    const response = await apiClient.patch(`/orders/${orderId}/`, { status });
    return response.data;
  },

  /**
   * Complete an order
   */
  completeOrder: async (orderId: number) => {
    const response = await apiClient.post(`/orders/${orderId}/complete/`);
    return response.data;
  },

  /**
   * Cancel an order
   */
  cancelOrder: async (orderId: number) => {
    const response = await apiClient.post(`/orders/${orderId}/cancel/`);
    return response.data;
  },
}; 