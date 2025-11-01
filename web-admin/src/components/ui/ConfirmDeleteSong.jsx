import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';
import { Button } from './Button';

/**
 * ConfirmDeleteSong Component
 * A reusable confirmation dialog for deleting songs
 * 
 * @param {boolean} isOpen - Whether the popup is visible
 * @param {function} onClose - Function to close the popup
 * @param {function} onConfirm - Function to execute delete action
 * @param {string} songTitle - Optional song name to display
 * @param {boolean} isDeleting - Optional loading state during deletion
 */
export const ConfirmDeleteSong = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  songTitle,
  isDeleting = false 
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="bg-admin-bg-card border border-admin-border-default rounded-xl shadow-2xl max-w-md w-full overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="relative bg-gradient-to-r from-apple-red/10 to-apple-red/5 border-b border-admin-border-default p-6">
                <button
                  onClick={onClose}
                  disabled={isDeleting}
                  className="absolute right-4 top-4 p-1 rounded-lg hover:bg-admin-bg-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <X size={20} className="text-admin-text-tertiary" />
                </button>
                
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-apple-red/20 flex items-center justify-center flex-shrink-0">
                    <AlertTriangle size={24} className="text-apple-red" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-admin-text-primary">
                      Confirm Delete
                    </h3>
                    <p className="text-sm text-admin-text-tertiary mt-0.5">
                      This action cannot be undone
                    </p>
                  </div>
                </div>
              </div>

              {/* Body */}
              <div className="p-6">
                <p className="text-admin-text-secondary leading-relaxed">
                  Are you sure you want to delete{' '}
                  {songTitle ? (
                    <>
                      <span className="font-semibold text-admin-text-primary">
                        "{songTitle}"
                      </span>
                      ?
                    </>
                  ) : (
                    'this song?'
                  )}
                </p>
                <p className="text-sm text-admin-text-tertiary mt-3">
                  This will permanently remove the song from the platform, including all streaming data and user playlists.
                </p>
              </div>

              {/* Footer */}
              <div className="bg-admin-bg-hover border-t border-admin-border-default p-6 flex items-center justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={onClose}
                  disabled={isDeleting}
                >
                  Cancel
                </Button>
                <Button
                  variant="danger"
                  onClick={onConfirm}
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                      Deleting...
                    </>
                  ) : (
                    'Delete Song'
                  )}
                </Button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ConfirmDeleteSong;
