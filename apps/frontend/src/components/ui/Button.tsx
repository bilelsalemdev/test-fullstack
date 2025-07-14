import React from 'react';

interface ButtonProps {
  children?: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'icon';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
  icon?: string;
  iconAlt?: string;
  type?: 'button' | 'submit' | 'reset';
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = '',
  icon,
  iconAlt = '',
  type = 'button',
}) => {
  const baseClasses =
    'inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  const variantClasses = {
    primary: 'bg-[#8B5CF6] text-white hover:bg-[#7C3AED] focus:ring-[#8B5CF6]',
    secondary:
      'bg-[#6F4FF2] text-white hover:bg-[#5A3FD9] focus:ring-[#6F4FF2]',
    outline:
      'bg-transparent text-white border border-[#822BF1] hover:bg-[#822BF1] focus:ring-[#822BF1]',
    ghost:
      'bg-transparent text-purple-300 hover:text-white hover:bg-purple-600/10',
    icon: 'bg-[#6F4FF2] text-white hover:bg-[#5A3FD9] focus:ring-[#6F4FF2] p-2',
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm rounded-md',
    md: 'px-4 py-2 text-sm rounded-lg',
    lg: 'px-6 py-2 text-base rounded-lg',
  };

  const iconSizeClasses = {
    sm: 'rounded-md',
    md: 'rounded-lg',
    lg: 'rounded-lg',
  };

  const classes = `
    ${baseClasses}
    ${variantClasses[variant]}
    ${variant === 'icon' ? iconSizeClasses[size] : sizeClasses[size]}
    ${className}
  `.trim();

  if (variant === 'icon' && icon) {
    return (
      <button
        type={type}
        onClick={onClick}
        disabled={disabled}
        className={classes}
      >
        <img src={icon} alt={iconAlt} className="w-5 h-5" />
      </button>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={classes}
    >
      {icon && <img src={icon} alt={iconAlt} className="w-5 h-5 mr-2" />}
      {children}
    </button>
  );
};

export default Button;
