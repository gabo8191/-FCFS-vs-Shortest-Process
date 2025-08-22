import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isInvalid?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      isInvalid,
      className = '',
      id,
      disabled,
      required,
      'aria-describedby': ariaDescribedBy,
      ...props
    },
    ref,
  ) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
    const errorId = `${inputId}-error`;
    const helperTextId = `${inputId}-helper`;
    const hasError = error || isInvalid;

    const baseInputClasses = `
    w-full px-3 py-2.5
    border rounded-lg
    text-base
    transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-offset-1
    disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50
    min-h-[44px]
  `;

    const stateClasses = hasError
      ? `
        border-red-300 bg-red-50
        focus:border-red-500 focus:ring-red-500
        text-red-900 placeholder-red-400
      `
      : `
        border-gray-300 bg-white
        focus:border-blue-500 focus:ring-blue-500
        text-gray-900 placeholder-gray-400
        hover:border-gray-400
      `;

    const iconClasses = 'w-5 h-5 text-gray-400';
    const paddingWithIcon = leftIcon ? 'pl-10' : rightIcon ? 'pr-10' : '';

    const inputClasses = `
    ${baseInputClasses}
    ${stateClasses}
    ${paddingWithIcon}
    ${className}
  `
      .replace(/\s+/g, ' ')
      .trim();

    const describedBy =
      [
        error ? errorId : null,
        helperText ? helperTextId : null,
        ariaDescribedBy,
      ]
        .filter(Boolean)
        .join(' ') || undefined;

    return (
      <div className='w-full'>
        {label && (
          <label
            htmlFor={inputId}
            className='block text-sm font-medium text-gray-700 mb-1'
          >
            {label}
            {required && (
              <span
                className='text-red-500 ml-1'
                aria-label='campo obligatorio'
              >
                *
              </span>
            )}
          </label>
        )}

        <div className='relative'>
          {leftIcon && (
            <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
              <span className={iconClasses} aria-hidden='true'>
                {leftIcon}
              </span>
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            className={inputClasses}
            disabled={disabled}
            required={required}
            aria-invalid={hasError ? 'true' : 'false'}
            aria-describedby={describedBy}
            {...props}
          />

          {rightIcon && (
            <div className='absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none'>
              <span className={iconClasses} aria-hidden='true'>
                {rightIcon}
              </span>
            </div>
          )}
        </div>

        {error && (
          <p
            id={errorId}
            className='mt-1 text-sm text-red-600'
            role='alert'
            aria-live='polite'
          >
            {error}
          </p>
        )}

        {helperText && !error && (
          <p id={helperTextId} className='mt-1 text-sm text-gray-500'>
            {helperText}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';
