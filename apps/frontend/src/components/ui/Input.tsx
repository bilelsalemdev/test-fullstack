import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: string;
  rightIcon?: string;
  variant?: 'default' | 'search';
  containerClassName?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      leftIcon,
      rightIcon,
      variant = 'default',
      className = '',
      containerClassName = '',
      ...props
    },
    ref
  ) => {
    const baseInputClasses =
      'w-full px-4 py-3 bg-transparent border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-colors font-poppins';

    const variantClasses = {
      default: 'border-gray-600 focus:border-[#FF04B4] focus:ring-[#FF04B4]/20',
      search:
        'bg-[#1D0054] border-gray-600 focus:border-[#FF04B4] focus:ring-[#FF04B4]/20',
    };

    const errorClasses = error
      ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
      : '';

    const inputClasses = `
      ${baseInputClasses}
      ${variantClasses[variant]}
      ${errorClasses}
      ${leftIcon ? 'pl-12' : ''}
      ${rightIcon ? 'pr-12' : ''}
      ${className}
    `.trim();

    return (
      <div className={`${containerClassName}`}>
        {label && (
          <label className="block text-sm font-medium text-gray-300 mb-2 font-poppins">
            {label}
          </label>
        )}

        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <img src={leftIcon} alt="" className="w-5 h-5" />
            </div>
          )}

          <input ref={ref} className={inputClasses} {...props} />

          {rightIcon && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <img src={rightIcon} alt="" className="w-5 h-5" />
            </div>
          )}
        </div>

        {error && (
          <p className="mt-1 text-sm text-red-400 font-poppins">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
