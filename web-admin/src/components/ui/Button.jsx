import React from 'react';
import { cn } from '@/lib/utils';

const buttonVariants = {
  primary: 'bg-spotify-green hover:bg-spotify-green/90 text-white shadow-glow-green',
  secondary: 'bg-admin-bg-hover hover:bg-admin-border-hover text-admin-text-primary',
  outline: 'border-2 border-spotify-green text-spotify-green hover:bg-spotify-green hover:text-white',
  danger: 'bg-apple-red hover:bg-apple-red/90 text-white',
  ghost: 'hover:bg-admin-bg-hover text-admin-text-primary',
};

const buttonSizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
};

export const Button = React.forwardRef(({ 
  className, 
  variant = 'primary', 
  size = 'md', 
  children,
  disabled,
  ...props 
}, ref) => {
  return (
    <button
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200',
        'focus:outline-none focus:ring-2 focus:ring-spotify-green focus:ring-offset-2 focus:ring-offset-admin-bg-primary',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
        'active:scale-95',
        buttonVariants[variant],
        buttonSizes[size],
        className
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = 'Button';
