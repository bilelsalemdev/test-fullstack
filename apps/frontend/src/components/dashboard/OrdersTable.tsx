import React, { useState } from 'react';
import { Order } from '../../types/dashboard';
import { useAppDispatch } from '../../store/hooks';
import { completeOrder, cancelOrder } from '../../store/slices/dashboardSlice';

interface OrdersTableProps {
  orders: Order[];
  isLoading?: boolean;
  onSeeAll?: () => void;
  onFilter?: () => void;
  onExport?: () => void;
}

const OrdersTable: React.FC<OrdersTableProps> = ({
  orders,
  isLoading = false,
  onSeeAll,
  onFilter,
  onExport,
}) => {
  const dispatch = useAppDispatch();
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  const handleOrderAction = async (
    orderId: number,
    action: 'complete' | 'cancel'
  ) => {
    setActionLoading(orderId);
    try {
      if (action === 'complete') {
        await dispatch(completeOrder(orderId)).unwrap();
      } else {
        await dispatch(cancelOrder(orderId)).unwrap();
      }
    } catch (error) {
      console.error('Failed to update order:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'processing':
        return 'bg-[#F81DFB]/20 text-[#F81DFB] border-[#F81DFB]/30';
      case 'cancelled':
        return 'bg-red-500/20 text-red-300 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatPrice = (price: string) => {
    return `$${parseFloat(price).toFixed(2)}`;
  };

  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-purple-600/20 to-purple-800/10 backdrop-blur-md border border-purple-400/20 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="h-6 bg-purple-300/20 rounded w-32 animate-pulse"></div>
          <div className="flex gap-2">
            <div className="h-8 bg-purple-300/20 rounded w-16 animate-pulse"></div>
            <div className="h-8 bg-purple-300/20 rounded w-16 animate-pulse"></div>
            <div className="h-8 bg-purple-300/20 rounded w-16 animate-pulse"></div>
          </div>
        </div>
        <div className="space-y-3">
          {[...Array(6)].map((_, index) => (
            <div
              key={index}
              className="h-12 bg-purple-300/10 rounded animate-pulse"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-purple-600/20 to-purple-800/10 backdrop-blur-md border border-purple-400/20 rounded-2xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-white font-oxanium">
          Latest Orders
        </h3>

        <div className="flex items-center gap-2">
          <button
            onClick={onSeeAll}
            className="px-4 py-2 bg-[#F81DFB] text-white text-sm font-medium rounded-lg hover:bg-[#F81DFB]/80 transition-colors font-poppins"
          >
            See All
          </button>
          <button
            onClick={onFilter}
            className="px-4 py-2 bg-purple-600/30 text-purple-300 hover:text-white hover:bg-purple-600/50 text-sm font-medium rounded-lg transition-colors font-poppins"
          >
            Filter
          </button>
          <button
            onClick={onExport}
            className="px-4 py-2 bg-purple-600/30 text-purple-300 hover:text-white hover:bg-purple-600/50 text-sm font-medium rounded-lg transition-colors font-poppins"
          >
            Export
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-purple-400/20">
              <th className="text-left text-purple-300 text-sm font-medium py-3 font-poppins">
                Order ID
              </th>
              <th className="text-left text-purple-300 text-sm font-medium py-3 font-poppins">
                Card Name
              </th>
              <th className="text-left text-purple-300 text-sm font-medium py-3 font-poppins">
                Copy Number
              </th>
              <th className="text-left text-purple-300 text-sm font-medium py-3 font-poppins">
                Order Date
              </th>
              <th className="text-left text-purple-300 text-sm font-medium py-3 font-poppins">
                Payment
              </th>
              <th className="text-left text-purple-300 text-sm font-medium py-3 font-poppins">
                Status
              </th>
              <th className="text-left text-purple-300 text-sm font-medium py-3 font-poppins">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="text-center text-purple-300 py-8 font-poppins"
                >
                  No orders found
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr
                  key={order.id}
                  className="border-b border-purple-400/10 hover:bg-purple-600/5 transition-colors"
                >
                  <td className="py-4 text-white font-medium font-poppins">
                    {order.order_number}
                  </td>
                  <td className="py-4 text-white font-poppins">
                    {order.items?.[0]?.card?.name || 'Multiple Items'}
                  </td>
                  <td className="py-4 text-purple-300 font-poppins">
                    {order.items?.[0]?.quantity
                      ? `${order.items[0].quantity
                          .toString()
                          .padStart(3, '0')}/100`
                      : 'N/A'}
                  </td>
                  <td className="py-4 text-purple-300 font-poppins">
                    {formatDate(order.order_date)}
                  </td>
                  <td className="py-4 text-white font-medium font-poppins">
                    {formatPrice(order.order_value)}
                  </td>
                  <td className="py-4">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {order.status === 'processing'
                        ? 'Processing'
                        : order.status === 'completed'
                        ? 'Transfer'
                        : 'Cancelled'}
                    </span>
                  </td>
                  <td className="py-4">
                    <div className="flex items-center gap-2">
                      {order.status === 'processing' && (
                        <>
                          <button
                            onClick={() =>
                              handleOrderAction(order.id, 'complete')
                            }
                            disabled={actionLoading === order.id}
                            className="text-green-400 hover:text-green-300 disabled:opacity-50 transition-colors"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>
                          <button
                            onClick={() =>
                              handleOrderAction(order.id, 'cancel')
                            }
                            disabled={actionLoading === order.id}
                            className="text-red-400 hover:text-red-300 disabled:opacity-50 transition-colors"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>
                        </>
                      )}
                      <button className="text-purple-300 hover:text-white transition-colors">
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrdersTable;
