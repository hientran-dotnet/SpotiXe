import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export const Badge = ({ children, variant = 'default', className, ...props }) => {
  const variants = {
    default: 'bg-admin-bg-hover text-admin-text-primary',
    success: 'bg-spotify-green/20 text-spotify-green border border-spotify-green/30',
    warning: 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/30',
    danger: 'bg-apple-red/20 text-apple-red border border-apple-red/30',
    info: 'bg-apple-blue/20 text-apple-blue border border-apple-blue/30',
    premium: 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-400 border border-purple-500/30',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};

export const StatusBadge = ({ status, ...props }) => {
  const statusConfig = {
    active: { variant: 'success', label: 'Active' },
    inactive: { variant: 'default', label: 'Inactive' },
    pending: { variant: 'warning', label: 'Pending' },
    suspended: { variant: 'danger', label: 'Suspended' },
    premium: { variant: 'premium', label: 'Premium' },
  };

  const config = statusConfig[status] || statusConfig.inactive;

  return (
    <Badge variant={config.variant} {...props}>
      <Check size={12} className="mr-1" />
      {config.label}
    </Badge>
  );
};
