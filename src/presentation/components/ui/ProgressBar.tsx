import React from 'react';

interface ProgressBarProps {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'success' | 'warning';
  label?: string;
  showPercentage?: boolean;
  className?: string;
  'aria-label'?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  size = 'md',
  variant = 'default',
  label,
  showPercentage = false,
  className = '',
  'aria-label': ariaLabel,
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  const progressId = `progress-${Math.random().toString(36).substr(2, 9)}`;

  const sizeClasses = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4',
  };

  const variantClasses = {
    default: 'bg-blue-600',
    success: 'bg-green-600',
    warning: 'bg-yellow-600',
  };

  return (
    <div className={`w-full ${className}`}>
      {(label || showPercentage) && (
        <div className='flex justify-between items-center mb-2'>
          {label && (
            <span
              className='text-sm font-medium text-gray-700'
              id={`${progressId}-label`}
            >
              {label}
            </span>
          )}
          {showPercentage && (
            <span
              className='text-sm text-gray-500'
              id={`${progressId}-percentage`}
            >
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}

      <div
        className={`w-full bg-gray-200 rounded-full overflow-hidden ${sizeClasses[size]}`}
        role='progressbar'
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={ariaLabel || label}
        aria-labelledby={label ? `${progressId}-label` : undefined}
        aria-describedby={
          showPercentage ? `${progressId}-percentage` : undefined
        }
      >
        <div
          className={`h-full rounded-full transition-all duration-300 ease-out ${variantClasses[variant]}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
