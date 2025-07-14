import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
}

interface LoadingStateProps {
  loading: boolean;
  error?: string | null;
  empty?: boolean;
  emptyText?: string;
  children: React.ReactNode;
  loadingText?: string;
  errorRetry?: () => void;
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  text = 'Loading...',
  className = '',
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  return (
    <div
      className={`flex flex-col items-center justify-center py-8 ${className}`}
    >
      <div
        className={`animate-spin rounded-full border-2 border-gray-300 border-t-[#F81DFB] ${sizeClasses[size]}`}
      ></div>
      {text && (
        <div className="text-white mt-2 text-sm font-poppins">{text}</div>
      )}
    </div>
  );
};

const LoadingState: React.FC<LoadingStateProps> = ({
  loading,
  error,
  empty = false,
  emptyText = 'No data found',
  children,
  loadingText = 'Loading...',
  errorRetry,
  className = '',
}) => {
  if (loading) {
    return (
      <div className={`flex justify-center items-center py-8 ${className}`}>
        <LoadingSpinner text={loadingText} />
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`flex flex-col items-center justify-center py-8 ${className}`}
      >
        <div className="text-red-400 text-center mb-4 font-poppins">
          Error: {error}
        </div>
        {errorRetry && (
          <button
            onClick={errorRetry}
            className="text-red-300 hover:text-red-200 underline font-poppins"
          >
            Retry
          </button>
        )}
      </div>
    );
  }

  if (empty) {
    return (
      <div className={`flex justify-center items-center py-8 ${className}`}>
        <div className="text-gray-400 font-poppins">{emptyText}</div>
      </div>
    );
  }

  return <>{children}</>;
};

export { LoadingSpinner, LoadingState };
export default LoadingSpinner;
