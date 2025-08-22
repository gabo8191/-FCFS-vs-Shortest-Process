import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outlined' | 'interactive';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  as?: React.ElementType;
}

export const Card: React.FC<CardProps> = ({
  variant = 'default',
  padding = 'md',
  children,
  className = '',
  as: Component = 'div',
  ...props
}) => {
  const baseClasses = `
    bg-white/95 backdrop-blur-sm rounded-2xl border border-gray-100
    transition-all duration-300 ease-out
  `;

  const variantClasses = {
    default: 'shadow-sm hover:shadow-md',
    elevated: 'shadow-lg hover:shadow-xl',
    outlined: 'border-gray-200 shadow-none hover:border-gray-300',
    interactive: `
      shadow-sm hover:shadow-lg hover:scale-[1.02]
      cursor-pointer border-gray-100 hover:border-gray-200
      focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:ring-offset-2
      active:scale-[0.98]
    `,
  };

  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  const combinedClasses = `
    ${baseClasses}
    ${variantClasses[variant]}
    ${paddingClasses[padding]}
    ${className}
  `
    .replace(/\s+/g, ' ')
    .trim();

  const additionalProps =
    variant === 'interactive' ? { tabIndex: 0, role: 'button' as const } : {};

  return (
    <Component className={combinedClasses} {...additionalProps} {...props}>
      {children}
    </Component>
  );
};
