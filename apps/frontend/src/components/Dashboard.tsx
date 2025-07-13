import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchDashboardKPIs } from '../store/slices/dashboardSlice';
import { getCurrentUser } from '../store/slices/authSlice';
import Sidebar from './dashboard/Sidebar';
import StatisticsCards from './dashboard/StatisticsCards';
import SalesChart from './dashboard/SalesChart';
import OrdersTable from './dashboard/OrdersTable';
import { StatCard } from '../types/dashboard';

const Dashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const { kpis, isLoading, error } = useAppSelector((state) => state.dashboard);
  const { user } = useAppSelector((state) => state.auth);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    // Fetch user data if not available
    if (!user) {
      dispatch(getCurrentUser());
    }

    // Fetch dashboard data
    dispatch(fetchDashboardKPIs());
  }, [dispatch, user]);

  // Transform KPI data into stat cards
  const statisticsCards: StatCard[] = [
    {
      title: 'AVG. Order Value',
      value: kpis
        ? `$ ${(kpis.total_revenue / (kpis.total_orders || 1)).toFixed(2)}`
        : '$ 0.00',
      change: 3.48,
      changeLabel: 'From last month',
      trend: 'up' as const,
      icon: 'order',
    },
    {
      title: 'Total created Card',
      value: kpis?.total_cards.toString() || '0',
      change: undefined,
      changeLabel: `${kpis?.total_cards || 0} New Cards`,
      icon: 'card',
    },
    {
      title: 'Total Collections created',
      value: kpis?.total_collections.toString() || '0',
      change: 3.18,
      changeLabel: 'From last month',
      trend: 'up' as const,
      icon: 'collection',
    },
    {
      title: 'Total Users Account',
      value: kpis?.total_users.toString() || '0',
      change: -1.14,
      changeLabel: 'From last month',
      trend: 'down' as const,
      icon: 'users',
    },
  ];

  // Generate demo chart data (could be replaced with real data from backend)
  const generateChartData = () => {
    const labels = ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'];
    // Generate realistic revenue progression
    const baseRevenue = kpis?.total_revenue || 25000;
    const revenueData = labels.map((_, index) =>
      Math.floor(baseRevenue * (0.4 + index * 0.1) + Math.random() * 3000)
    );

    // Generate order data based on revenue
    const orderData = revenueData.map((revenue) =>
      Math.floor(revenue / 150 + Math.random() * 20)
    );

    return { labels, revenueData, orderData };
  };

  const { labels, revenueData, orderData } = generateChartData();

  const handleRefresh = () => {
    dispatch(fetchDashboardKPIs());
  };

  return (
    <div className="min-h-screen bg-[#120036] flex">
      {/* Sidebar */}
      <Sidebar
        isCollapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="bg-[#0F0036]/50 border-b border-purple-800/30 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white font-oxanium">
                Dashboard
              </h1>
              <p className="text-purple-300 text-sm font-poppins">
                Welcome back, {user?.first_name || 'Admin'}! Here's your sales
                overview.
              </p>
            </div>

            <div className="flex items-center gap-4">
              {/* Search */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search Here"
                  className="w-80 h-10 pl-10 pr-4 bg-purple-600/20 border border-purple-400/30 rounded-lg text-white placeholder-purple-300 focus:outline-none focus:border-purple-400/50 font-poppins"
                />
                <svg
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-purple-300"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>

              {/* Notifications */}
              <button className="relative p-2 text-purple-300 hover:text-white transition-colors">
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                </svg>
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#F81DFB] rounded-full"></span>
              </button>

              {/* Theme Toggle */}
              <button className="p-2 text-purple-300 hover:text-white transition-colors">
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>

              {/* User Profile */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-semibold">
                    {user?.first_name?.[0] || 'U'}
                  </span>
                </div>
                <div className="hidden md:block">
                  <p className="text-white text-sm font-medium">
                    {user?.first_name} {user?.last_name}
                  </p>
                  <p className="text-purple-300 text-xs">{user?.email}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="flex-1 p-6 overflow-auto">
          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm flex items-center justify-between">
              <span>{error}</span>
              <button
                onClick={handleRefresh}
                className="text-red-300 hover:text-red-200 underline"
              >
                Retry
              </button>
            </div>
          )}

          {/* Statistics Cards */}
          <StatisticsCards cards={statisticsCards} isLoading={isLoading} />

          {/* Charts and Tables */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Sales Chart */}
            <div className="xl:col-span-2">
              <SalesChart
                revenueData={revenueData}
                orderData={orderData}
                labels={labels}
                isLoading={isLoading}
              />
            </div>

            {/* Recent Orders Table */}
            <div className="xl:col-span-1">
              <OrdersTable
                orders={kpis?.recent_orders || []}
                isLoading={isLoading}
                onSeeAll={() => console.log('See all orders')}
                onFilter={() => console.log('Filter orders')}
                onExport={() => console.log('Export orders')}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
