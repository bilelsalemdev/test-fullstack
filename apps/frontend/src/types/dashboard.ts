export interface DashboardKPIs {
  total_orders: number;
  total_revenue: number;
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

export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
}

export interface Collection {
  id: number;
  name: string;
  description?: string;
  status: 'pending' | 'in_production' | 'issued';
  created_at: string;
  updated_at: string;
  total_cards: number;
  is_released: boolean;
}

export interface Card {
  id: number;
  name: string;
  description?: string;
  collection: Collection;
  category: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  rarity: 'normal' | 'foil' | 'holographic' | 'special';
  base_price: string;
  market_price?: string;
  current_price: string;
  stock_quantity: number;
  is_in_stock: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: number;
  card: Card;
  quantity: number;
  unit_price: string;
  total_price: string;
}

export interface Order {
  id: number;
  order_number: string;
  user: User;
  order_value: string;
  status: 'processing' | 'completed' | 'cancelled';
  order_date: string;
  completed_date?: string;
  notes?: string;
  items: OrderItem[];
  total_items: number;
  is_completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface StatCard {
  title: string;
  value: string;
  change?: number;
  changeLabel?: string;
  icon?: string;
  trend?: 'up' | 'down' | 'neutral';
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor: string;
    backgroundColor: string;
    tension: number;
  }[];
}

export interface DashboardState {
  kpis: DashboardKPIs | null;
  isLoading: boolean;
  error: string | null;
  lastUpdated: string | null;
} 