import React from 'react';
import { cn } from '@/lib/utils';

export const Table = ({ children, className, ...props }) => {
  return (
    <div className="w-full overflow-x-auto scrollbar-thin rounded-lg border border-admin-border-default">
      <table className={cn('w-full text-sm', className)} {...props}>
        {children}
      </table>
    </div>
  );
};

export const TableHeader = ({ children, className, ...props }) => {
  return (
    <thead className={cn('bg-admin-bg-hover border-b border-admin-border-default', className)} {...props}>
      {children}
    </thead>
  );
};

export const TableBody = ({ children, className, ...props }) => {
  return (
    <tbody className={cn('divide-y divide-admin-border-default', className)} {...props}>
      {children}
    </tbody>
  );
};

export const TableRow = ({ children, className, hover = true, ...props }) => {
  return (
    <tr 
      className={cn(
        'transition-colors',
        hover && 'hover:bg-admin-bg-hover cursor-pointer',
        className
      )} 
      {...props}
    >
      {children}
    </tr>
  );
};

export const TableHead = ({ children, className, ...props }) => {
  return (
    <th
      className={cn(
        'px-6 py-3 text-left text-xs font-semibold text-admin-text-secondary uppercase tracking-wider',
        className
      )}
      {...props}
    >
      {children}
    </th>
  );
};

export const TableCell = ({ children, className, ...props }) => {
  return (
    <td className={cn('px-6 py-4 text-admin-text-primary', className)} {...props}>
      {children}
    </td>
  );
};
