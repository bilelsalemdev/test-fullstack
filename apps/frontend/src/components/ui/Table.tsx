import React from 'react';

interface TableColumn {
  key: string;
  label: string;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

interface TableProps {
  columns: TableColumn[];
  children: React.ReactNode;
  gridTemplate?: string;
  maxHeight?: string;
  className?: string;
}

interface TableHeaderProps {
  columns: TableColumn[];
  gridTemplate?: string;
  showSelectAll?: boolean;
  onSelectAll?: (checked: boolean) => void;
  selectAllChecked?: boolean;
}

interface TableBodyProps {
  children: React.ReactNode;
  className?: string;
}

interface TableRowProps {
  children: React.ReactNode;
  gridTemplate?: string;
  onClick?: () => void;
  className?: string;
}

interface TableCellProps {
  children: React.ReactNode;
  align?: 'left' | 'center' | 'right';
  className?: string;
}

const Table: React.FC<TableProps> = ({
  columns,
  children,
  gridTemplate,
  maxHeight = '480px',
  className = '',
}) => {
  return (
    <div className={`bg-[#1D0054] rounded-xl ${className}`}>
      <div className={`overflow-x-auto overflow-y-auto`} style={{ maxHeight }}>
        {children}
      </div>
    </div>
  );
};

const TableHeader: React.FC<TableHeaderProps> = ({
  columns,
  gridTemplate,
  showSelectAll = false,
  onSelectAll,
  selectAllChecked = false,
}) => {
  const defaultGridTemplate = showSelectAll
    ? `60px ${columns.map((col) => col.width || '1fr').join(' ')}`
    : columns.map((col) => col.width || '1fr').join(' ');

  return (
    <div
      className="grid gap-2 px-6 py-4 border-b border-[#6c7aa058] bg-[#1D0054] sticky top-0 z-10"
      style={{
        gridTemplateColumns: gridTemplate || defaultGridTemplate,
      }}
    >
      {showSelectAll && (
        <div className="flex items-center justify-center">
          <input
            type="checkbox"
            checked={selectAllChecked}
            onChange={(e) => onSelectAll?.(e.target.checked)}
            className="w-4 h-4 rounded border-2 border-gray-500 bg-transparent accent-[#FF04B4] cursor-pointer"
          />
        </div>
      )}
      {columns.map((column) => (
        <div
          key={column.key}
          className={`text-xs font-medium text-gray-300 tracking-wider whitespace-nowrap ${
            column.align === 'center'
              ? 'text-center'
              : column.align === 'right'
              ? 'text-right'
              : 'text-left'
          }`}
        >
          {column.label}
        </div>
      ))}
    </div>
  );
};

const TableBody: React.FC<TableBodyProps> = ({ children, className = '' }) => {
  return <div className={`space-y-2 p-4 ${className}`}>{children}</div>;
};

const TableRow: React.FC<TableRowProps> = ({
  children,
  gridTemplate,
  onClick,
  className = '',
}) => {
  return (
    <div
      className={`grid gap-2 px-2 py-4 bg-[#6F4FF212] hover:bg-[#6F4FF230] transition-colors rounded-lg items-center w-full ${
        onClick ? 'cursor-pointer' : ''
      } ${className}`}
      style={{
        gridTemplateColumns: gridTemplate,
      }}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

const TableCell: React.FC<TableCellProps> = ({
  children,
  align = 'center',
  className = '',
}) => {
  const alignClass = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };

  return (
    <div
      className={`text-xs whitespace-nowrap ${alignClass[align]} ${className}`}
    >
      {children}
    </div>
  );
};

const TableComponent = Table as typeof Table & {
  Header: typeof TableHeader;
  Body: typeof TableBody;
  Row: typeof TableRow;
  Cell: typeof TableCell;
};

TableComponent.Header = TableHeader;
TableComponent.Body = TableBody;
TableComponent.Row = TableRow;
TableComponent.Cell = TableCell;

export default TableComponent;
