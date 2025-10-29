import React from 'react';
import { cn } from '@/lib/utils';

export const Switch = ({ checked, onChange, disabled = false, className, ...props }) => {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => !disabled && onChange?.(!checked)}
      className={cn(
        'relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-spotify-green focus:ring-offset-2 focus:ring-offset-admin-bg-card',
        checked ? 'bg-spotify-green' : 'bg-admin-bg-hover',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      {...props}
    >
      <span
        className={cn(
          'inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm',
          checked ? 'translate-x-4' : 'translate-x-0.5'
        )}
      />
    </button>
  );
};
