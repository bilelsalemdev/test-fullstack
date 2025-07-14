import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchDashboardKPIs } from '../store/slices/dashboardSlice';
import Layout from './Layout';
import StatisticsCards from './dashboard/StatisticsCards';
import SalesChart from './dashboard/SalesChart';
import OrdersTable from './dashboard/OrdersTable';
import { StatCard } from '../types/dashboard';

const Dashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const { kpis, isLoading, error } = useAppSelector((state) => state.dashboard);

  useEffect(() => {
    // Fetch dashboard data
    dispatch(fetchDashboardKPIs());
  }, [dispatch]);

  // Transform KPI data into stat cards
  const statisticsCards: StatCard[] = [
    {
      title: 'AVG. Order Value',
      value: kpis
        ? `$ ${(
            parseFloat(kpis.total_revenue) / (kpis.total_orders || 1)
          ).toFixed(2)}`
        : '$ 0.00',
      change: 3.48,
      changeLabel: 'From last month',
      trend: 'up' as const,
      icon: 'database-icon.svg',
      seeAllLink: '/orders',
    },
    {
      title: 'Total created Card',
      value: kpis?.total_cards.toString() || '0',
      change: undefined,
      changeLabel: `${kpis?.total_cards || 0} New Cards`,
      seeAllLink: '/cards',
    },
    {
      title: 'Total Collections created',
      value: kpis?.total_collections.toString() || '0',
      change: 3.18,
      changeLabel: 'From last month',
      trend: 'up' as const,
      icon: 'database-icon.svg',
      seeAllLink: '/collections',
    },
    {
      title: 'Total Users Account',
      value: kpis?.total_users.toString() || '0',
      change: -1.14,
      changeLabel: 'From last month',
      trend: 'down' as const,
      seeAllLink: '/users',
    },
  ];

  // Generate demo chart data (could be replaced with real data from backend)
  const generateChartData = () => {
    const labels = ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'];
    // Generate realistic revenue progression
    const baseRevenue = kpis?.total_revenue
      ? parseFloat(kpis.total_revenue)
      : 25000;
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
    <Layout>
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

      <div className="p-5 bg-[#1D0054] rounded-2xl border border-[#41308D]">
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
    </Layout>
  );
};

export default Dashboard;
