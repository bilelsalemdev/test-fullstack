import React from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  className?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  actions,
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4 ${className}`}
    >
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-white font-poppins">
          {title}
        </h1>
        {subtitle && (
          <p className="text-sm text-gray-400 mt-1 font-poppins">{subtitle}</p>
        )}
      </div>

      {actions && (
        <div className="flex items-center gap-2 md:gap-4 flex-wrap">
          {actions}
        </div>
      )}
    </div>
  );
};

export default PageHeader;
