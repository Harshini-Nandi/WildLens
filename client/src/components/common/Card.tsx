import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'sage' | 'forest' | 'highlight';
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  hoverable = false,
  className = '',
  ...props
}) => {
  const baseClasses = 'rounded-2xl transition-all duration-200';

  const variantClasses = {
    default: 'bg-white border border-sage-border/60 shadow-nature text-charcoal',
    sage: 'bg-sage-light border border-sage-border text-forest-dark',
    forest: 'bg-forest-dark text-cream border border-forest',
    highlight: 'bg-white border-2 border-forest shadow-nature-lg'
  };

  const hoverClasses = hoverable ? 'hover:-translate-y-0.5 hover:shadow-nature-lg cursor-pointer' : '';

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${hoverClasses} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
