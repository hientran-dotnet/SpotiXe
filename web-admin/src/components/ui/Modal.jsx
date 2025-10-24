import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export const Modal = ({ isOpen, onClose, children, size = 'md', className }) => {
  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
  };

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={cn(
              'relative w-full bg-admin-bg-card rounded-xl shadow-2xl border border-admin-border-default',
              'max-h-[90vh] overflow-hidden',
              sizes[size],
              className
            )}
            role="dialog"
            aria-modal="true"
          >
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export const ModalHeader = ({ children, onClose }) => {
  return (
    <div className="flex items-center justify-between p-6 border-b border-admin-border-default">
      <div>{children}</div>
      {onClose && (
        <button
          onClick={onClose}
          className="text-admin-text-tertiary hover:text-admin-text-primary transition-colors rounded-lg p-1 hover:bg-admin-bg-hover"
          aria-label="Close modal"
        >
          <X size={20} />
        </button>
      )}
    </div>
  );
};

export const ModalTitle = ({ children }) => {
  return (
    <h2 className="text-2xl font-bold text-admin-text-primary">
      {children}
    </h2>
  );
};

export const ModalDescription = ({ children }) => {
  return (
    <p className="text-sm text-admin-text-secondary mt-1">
      {children}
    </p>
  );
};

export const ModalBody = ({ children, className }) => {
  return (
    <div className={cn('p-6 overflow-y-auto scrollbar-thin', className)}>
      {children}
    </div>
  );
};

export const ModalFooter = ({ children, className }) => {
  return (
    <div className={cn('flex items-center justify-end gap-3 p-6 border-t border-admin-border-default', className)}>
      {children}
    </div>
  );
};
