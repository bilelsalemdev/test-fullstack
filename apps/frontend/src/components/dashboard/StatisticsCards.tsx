import React from 'react';
import { Link } from 'react-router-dom';
import { StatCard } from '../../types/dashboard';

interface StatisticsCardsProps {
  cards: StatCard[];
  isLoading?: boolean;
}

const StatisticsCards: React.FC<StatisticsCardsProps> = ({
  cards,
  isLoading,
}) => {
  // Function to determine card styling based on title
  const getCardStyling = (title: string) => {
    const titleLower = title.toLowerCase();

    // Check for avg order value and total collections
    if (
      titleLower.includes('avg order value') ||
      titleLower.includes('total collections')
    ) {
      return 'bg-[#12003696] shadow-[-4px_10px_11.9px_-16px_#00000040] rounded-2xl';
    }

    // Check for total cards and total users
    if (
      titleLower.includes('total created card') ||
      titleLower.includes('total users account')
    ) {
      return 'bg-[#6f4ff238] shadow-[-4px_10px_11.9px_-16px_#00000040] rounded-2xl';
    }

    // Default styling
    return 'bg-[#12003696] shadow-[-4px_10px_11.9px_-16px_#00000040] rounded-2xl';
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, index) => (
          <div
            key={index}
            className="bg-[#12003696] shadow-[-4px_10px_11.9px_-16px_#00000040] rounded-2xl p-6 animate-pulse"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="h-4 bg-purple-300/20 rounded w-3/4"></div>
              <div className="flex flex-col items-end gap-1">
                <div className="w-8 h-8 bg-purple-300/20 rounded-lg"></div>
                <div className="h-3 w-12 bg-purple-300/20 rounded"></div>
              </div>
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
      {cards?.map((card, index) => (
        <div
          key={index}
          className={`${getCardStyling(
            card.title
          )} p-6 hover:border-purple-300/30 transition-all duration-300 flex justify-between`}
        >
          <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white/80 text-sm font-medium font-poppins">
                {card.title}
              </h3>
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
                  className={`flex items-center gap-1 text-xs font-medium ${
                    card.trend === 'up'
                      ? 'text-[#2D7B34]'
                      : card.trend === 'down'
                      ? 'text-[#FB1D1D]'
                      : 'text-gray-300'
                  }`}
                >
                  {card.trend === 'up' && (
                    <span className="text-sm font-bold">+</span>
                  )}
                  {card.trend === 'down' && (
                    <span className="text-sm font-bold">-</span>
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
            {card.title.includes('Card') &&
              card.changeLabel?.includes('New') && (
                <div className="mt-2">
                  <span className="inline-flex items-center text-xs font-medium">
                    <span className="text-white">
                      {card.changeLabel.split(' ')[0]}
                    </span>
                    <span className="text-[#FF8F1F] ml-1">
                      {card.changeLabel.split(' ').slice(1).join(' ')}
                    </span>
                  </span>
                </div>
              )}
          </div>
          <div className="flex flex-col items-center justify-between gap-1">
            {card.icon && (
              <img
                src={`/assets/dashboard-icons/${card.icon}`}
                alt={card.icon}
                className="w-8 h-8"
              />
            )}
            {card.seeAllLink && (
              <Link
                className="text-[#FF04B4] text-sm font-medium font-poppins hover:text-[#FF04B4]/80 transition-colors duration-200"
                to={card.seeAllLink as string}
              >
                See All
              </Link>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatisticsCards;
