import React from 'react';
import { StatCard } from '../../types/dashboard';

interface StatisticsCardsProps {
  cards: StatCard[];
  isLoading?: boolean;
}

const StatisticsCards: React.FC<StatisticsCardsProps> = ({
  cards,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, index) => (
          <div
            key={index}
            className="bg-gradient-to-br from-purple-600/20 to-purple-800/10 backdrop-blur-md border border-purple-400/20 rounded-2xl p-6 animate-pulse"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="h-4 bg-purple-300/20 rounded w-3/4"></div>
              <div className="w-8 h-8 bg-purple-300/20 rounded-lg"></div>
            </div>
            <div className="h-8 bg-purple-300/20 rounded w-1/2 mb-2"></div>
            <div className="h-3 bg-purple-300/20 rounded w-1/3"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
      {cards.map((card, index) => (
        <div
          key={index}
          className="bg-gradient-to-br from-purple-600/20 to-purple-800/10 backdrop-blur-md border border-purple-400/20 rounded-2xl p-6 hover:border-purple-300/30 transition-all duration-300"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white/80 text-sm font-medium font-poppins">
              {card.title}
            </h3>
            {card.icon && (
              <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-purple-300"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            )}
          </div>

          {/* Value */}
          <div className="mb-3">
            <h2 className="text-3xl font-bold text-white font-oxanium">
              {card.value}
            </h2>
          </div>

          {/* Change indicator */}
          {card.change !== undefined && (
            <div className="flex items-center gap-2">
              <div
                className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                  card.trend === 'up'
                    ? 'bg-green-500/20 text-green-300'
                    : card.trend === 'down'
                    ? 'bg-red-500/20 text-red-300'
                    : 'bg-gray-500/20 text-gray-300'
                }`}
              >
                {card.trend === 'up' && (
                  <svg
                    className="w-3 h-3"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
                {card.trend === 'down' && (
                  <svg
                    className="w-3 h-3"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
                {Math.abs(card.change)}%
              </div>
              {card.changeLabel && (
                <span className="text-white/60 text-xs font-poppins">
                  {card.changeLabel}
                </span>
              )}
            </div>
          )}

          {/* New cards indicator */}
          {card.title.includes('Card') && card.changeLabel?.includes('New') && (
            <div className="mt-2">
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-500/20 text-yellow-300">
                {card.changeLabel}
              </span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default StatisticsCards;
