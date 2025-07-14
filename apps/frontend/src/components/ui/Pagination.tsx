import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onNextPage?: () => void;
  showNextButton?: boolean;
  className?: string;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  onNextPage,
  showNextButton = true,
  className = '',
}) => {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className={`px-6 py-6 flex items-center justify-center ${className}`}>
      <div className="flex items-center space-x-3">
        {Array.from({ length: totalPages }, (_, idx) => {
          const page = idx + 1;
          const active = page === currentPage;
          return (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`w-10 h-10 rounded-full text-sm font-bold flex items-center justify-center shadow-lg border border-[#F81DFB] transition-colors font-poppins ${
                active
                  ? 'bg-[#F81DFB] text-white'
                  : 'bg-transparent text-[#F81DFB] hover:bg-[#F81DFB] hover:text-white'
              }`}
            >
              {page}
            </button>
          );
        })}
        {showNextButton && currentPage < totalPages && (
          <img
            onClick={onNextPage || (() => onPageChange(currentPage + 1))}
            src="/assets/orders-icons/arrow-right.svg"
            alt="next page"
            className="w-10 h-10 cursor-pointer"
          />
        )}
      </div>
    </div>
  );
};

export default Pagination;
