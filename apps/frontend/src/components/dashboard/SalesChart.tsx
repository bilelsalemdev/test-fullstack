import React, { useState, useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface SalesChartProps {
  revenueData?: number[];
  orderData?: number[];
  labels?: string[];
  isLoading?: boolean;
}

const SalesChart: React.FC<SalesChartProps> = ({
  revenueData = [],
  orderData = [],
  labels = [],
  isLoading = false,
}) => {
  const [activeTab, setActiveTab] = useState<'Revenue' | 'Order'>('Revenue');

  // Default data for demonstration
  const defaultLabels = [
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
    'Jan',
  ];
  const defaultRevenueData = [
    5000, 8000, 12000, 15000, 18000, 16000, 20000, 25000,
  ];
  const defaultOrderData = [45, 65, 85, 95, 110, 95, 125, 150];

  const chartLabels = labels.length > 0 ? labels : defaultLabels;
  const chartRevenueData =
    revenueData.length > 0 ? revenueData : defaultRevenueData;
  const chartOrderData = orderData.length > 0 ? orderData : defaultOrderData;

  const chartData = useMemo(
    () => ({
      labels: chartLabels,
      datasets: [
        {
          label: activeTab,
          data: activeTab === 'Revenue' ? chartRevenueData : chartOrderData,
          borderColor: '#F81DFB',
          backgroundColor: 'rgba(248, 29, 251, 0.1)',
          borderWidth: 3,
          tension: 0.4,
          pointBackgroundColor: '#F81DFB',
          pointBorderColor: '#ffffff',
          pointBorderWidth: 2,
          pointRadius: 6,
          pointHoverRadius: 8,
          fill: true,
        },
      ],
    }),
    [activeTab, chartLabels, chartRevenueData, chartOrderData]
  );

  const chartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(15, 0, 54, 0.9)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#F81DFB',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          label: (context) => {
            const value = context.parsed.y;
            return activeTab === 'Revenue'
              ? `$${value.toLocaleString()}`
              : `${value} orders`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: '#ffffff80',
          font: {
            size: 12,
            family: 'Poppins',
          },
        },
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: '#ffffff80',
          font: {
            size: 12,
            family: 'Poppins',
          },
          callback: (value) => {
            return activeTab === 'Revenue'
              ? `$${Number(value) / 1000}k`
              : value.toString();
          },
        },
      },
    },
    elements: {
      point: {
        hoverBackgroundColor: '#F81DFB',
      },
    },
  };

  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-purple-600/20 to-purple-800/10 backdrop-blur-md border border-purple-400/20 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="h-6 bg-purple-300/20 rounded w-48 animate-pulse"></div>
          <div className="flex bg-purple-600/20 rounded-lg p-1">
            <div className="h-8 bg-purple-300/20 rounded w-20 animate-pulse"></div>
            <div className="h-8 bg-purple-300/20 rounded w-20 ml-1 animate-pulse"></div>
          </div>
        </div>
        <div className="h-80 bg-purple-300/10 rounded-lg animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-purple-600/20 to-purple-800/10 backdrop-blur-md border border-purple-400/20 rounded-2xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-white font-oxanium">
          Sales Overtime
        </h3>

        {/* Toggle Buttons */}
        <div className="flex bg-purple-600/20 rounded-lg p-1">
          {(['Revenue', 'Order'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 font-poppins ${
                activeTab === tab
                  ? 'bg-[#F81DFB] text-white shadow-lg'
                  : 'text-purple-300 hover:text-white hover:bg-purple-600/30'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Chart Container */}
      <div className="h-80 relative">
        <Line data={chartData} options={chartOptions} />
      </div>

      {/* Chart Info */}
      <div className="mt-4 flex items-center justify-between text-sm">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[#F81DFB] rounded-full"></div>
            <span className="text-purple-300 font-poppins">
              {activeTab === 'Revenue' ? 'Revenue' : 'Orders'}
            </span>
          </div>
          <span className="text-purple-400 font-poppins">Last 8 months</span>
        </div>

        <div className="text-purple-300 font-poppins">
          {activeTab === 'Revenue' ? (
            <span>Peak: $25k in Jan</span>
          ) : (
            <span>Peak: 150 orders in Jan</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default SalesChart;
