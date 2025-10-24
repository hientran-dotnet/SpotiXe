import React from 'react';
import { cn } from '@/lib/utils';

export const Input = React.forwardRef(({ 
  className, 
  type = 'text',
  label,
  error,
  icon: Icon,
  ...props 
}, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-admin-text-secondary mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-admin-text-tertiary">
            <Icon size={18} />
          </div>
        )}
        <input
          ref={ref}
          type={type}
          className={cn(
            'w-full px-4 py-2.5 bg-admin-bg-hover border border-admin-border-default rounded-lg',
            'text-admin-text-primary placeholder:text-admin-text-tertiary',
            'focus:outline-none focus:ring-2 focus:ring-spotify-green focus:border-transparent',
            'transition-all duration-200',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            Icon && 'pl-10',
            error && 'border-apple-red focus:ring-apple-red',
            className
          )}
          {...props}
        />
      </div>
      {error && (
        <p className="text-sm text-apple-red mt-1">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export const Textarea = React.forwardRef(({ 
  className, 
  label,
  error,
  ...props 
}, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-admin-text-secondary mb-2">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        className={cn(
          'w-full px-4 py-2.5 bg-admin-bg-hover border border-admin-border-default rounded-lg',
          'text-admin-text-primary placeholder:text-admin-text-tertiary',
          'focus:outline-none focus:ring-2 focus:ring-spotify-green focus:border-transparent',
          'transition-all duration-200 resize-vertical',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          error && 'border-apple-red focus:ring-apple-red',
          className
        )}
        {...props}
      />
      {error && (
        <p className="text-sm text-apple-red mt-1">{error}</p>
      )}
    </div>
  );
});

Textarea.displayName = 'Textarea';

export const Select = React.forwardRef(({ 
  className, 
  label,
  error,
  children,
  ...props 
}, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-admin-text-secondary mb-2">
          {label}
        </label>
      )}
      <select
        ref={ref}
        className={cn(
          'w-full px-4 py-2.5 bg-admin-bg-hover border border-admin-border-default rounded-lg',
          'text-admin-text-primary',
          'focus:outline-none focus:ring-2 focus:ring-spotify-green focus:border-transparent',
          'transition-all duration-200 cursor-pointer',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          error && 'border-apple-red focus:ring-apple-red',
          className
        )}
        {...props}
      >
        {children}
      </select>
      {error && (
        <p className="text-sm text-apple-red mt-1">{error}</p>
      )}
    </div>
  );
});

Select.displayName = 'Select';
