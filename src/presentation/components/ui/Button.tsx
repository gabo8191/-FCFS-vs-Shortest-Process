import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'success' | 'warning' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children: React.ReactNode;
  'aria-label'?: string;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  children,
  disabled,
  className = '',
  'aria-label': ariaLabel,
  ...props
}) => {
  const baseClasses = `
    inline-flex items-center justify-center
    font-medium rounded-xl
    transition-all duration-200 ease-out
    focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
    min-h-[44px] active:scale-95
    ${isLoading ? 'cursor-wait' : ''}
  `;

  const variantClasses = {
    primary: `
      bg-blue-600 text-white
      hover:bg-blue-700 hover:shadow-lg active:bg-blue-800
      focus:ring-blue-500/30
      disabled:bg-blue-300
    `,
    success: `
      bg-emerald-600 text-white
      hover:bg-emerald-700 hover:shadow-lg active:bg-emerald-800
      focus:ring-emerald-500/30
      disabled:bg-emerald-300
    `,
    warning: `
      bg-amber-600 text-white
      hover:bg-amber-700 hover:shadow-lg active:bg-amber-800
      focus:ring-amber-500/30
      disabled:bg-amber-300
    `,
    ghost: `
      bg-transparent text-gray-600 border border-gray-200
      hover:bg-gray-50 hover:text-gray-800 hover:border-gray-300 active:bg-gray-100
      focus:ring-gray-500/30
      disabled:text-gray-400 disabled:border-gray-200
    `,
  };

  const sizeClasses = {
    sm: 'px-3 py-2 text-sm gap-1',
    md: 'px-4 py-2.5 text-base gap-2',
    lg: 'px-6 py-3 text-lg gap-2',
  };

  const iconSize = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const combinedClasses = `
    ${baseClasses}
    ${variantClasses[variant]}
    ${sizeClasses[size]}
    ${className}
  `
    .replace(/\s+/g, ' ')
    .trim();

  return (
    <button
      className={combinedClasses}
      disabled={disabled || isLoading}
      aria-label={ariaLabel}
      aria-busy={isLoading}
      {...props}
    >
      {isLoading && (
        <svg
          className={`animate-spin -ml-1 mr-2 ${iconSize[size]}`}
          fill='none'
          viewBox='0 0 24 24'
          role='status'
          aria-label='Cargando'
        >
          <circle
            className='opacity-25'
            cx='12'
            cy='12'
            r='10'
            stroke='currentColor'
            strokeWidth='4'
          />
          <path
            className='opacity-75'
            fill='currentColor'
            d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
          />
        </svg>
      )}

      {leftIcon && !isLoading && (
        <span className={iconSize[size]} aria-hidden='true'>
          {leftIcon}
        </span>
      )}

      <span>{children}</span>

      {rightIcon && !isLoading && (
        <span className={iconSize[size]} aria-hidden='true'>
          {rightIcon}
        </span>
      )}
    </button>
  );
};
