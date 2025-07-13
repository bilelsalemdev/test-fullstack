import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { dashboardApi } from '../../services/dashboardApi';
import { DashboardState, DashboardKPIs } from '../../types/dashboard';

const initialState: DashboardState = {
  kpis: null,
  isLoading: false,
  error: null,
  lastUpdated: null,
};

// Async thunks
export const fetchDashboardKPIs = createAsyncThunk(
  'dashboard/fetchKPIs',
  async (_, { rejectWithValue }) => {
    try {
      const data = await dashboardApi.getKPIs();
      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.detail || 'Failed to fetch dashboard data'
      );
    }
  }
);

export const updateOrderStatus = createAsyncThunk(
  'dashboard/updateOrderStatus',
  async (
    { orderId, status }: { orderId: number; status: string },
    { rejectWithValue, dispatch }
  ) => {
    try {
      const response = await dashboardApi.updateOrderStatus(orderId, status);
      // Refresh dashboard data after update
      dispatch(fetchDashboardKPIs());
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.detail || 'Failed to update order status'
      );
    }
  }
);

export const completeOrder = createAsyncThunk(
  'dashboard/completeOrder',
  async (orderId: number, { rejectWithValue, dispatch }) => {
    try {
      const response = await dashboardApi.completeOrder(orderId);
      // Refresh dashboard data after completing order
      dispatch(fetchDashboardKPIs());
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.detail || 'Failed to complete order'
      );
    }
  }
);

export const cancelOrder = createAsyncThunk(
  'dashboard/cancelOrder',
  async (orderId: number, { rejectWithValue, dispatch }) => {
    try {
      const response = await dashboardApi.cancelOrder(orderId);
      // Refresh dashboard data after cancelling order
      dispatch(fetchDashboardKPIs());
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.detail || 'Failed to cancel order'
      );
    }
  }
);

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearDashboard: (state) => {
      state.kpis = null;
      state.lastUpdated = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch dashboard KPIs
      .addCase(fetchDashboardKPIs.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDashboardKPIs.fulfilled, (state, action) => {
        state.isLoading = false;
        state.kpis = action.payload;
        state.lastUpdated = new Date().toISOString();
        state.error = null;
      })
      .addCase(fetchDashboardKPIs.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Update order status
      .addCase(updateOrderStatus.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateOrderStatus.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Complete order
      .addCase(completeOrder.fulfilled, (state) => {
        state.error = null;
      })
      .addCase(completeOrder.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      // Cancel order
      .addCase(cancelOrder.fulfilled, (state) => {
        state.error = null;
      })
      .addCase(cancelOrder.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearDashboard } = dashboardSlice.actions;
export default dashboardSlice.reducer; 