import { motion, AnimatePresence } from 'motion/react';
import { ReactNode } from 'react';

interface Props {
  open: boolean;
  title: string;
  message?: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  destructive,
  onConfirm,
  onCancel,
}: Props) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center px-6"
          onClick={onCancel}
        >
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            onClick={(e) => e.stopPropagation()}
            className={`cyber-panel ${destructive ? 'cyber-panel-magenta' : ''} clip-cyber w-full max-w-xs relative scanlines`}
          >
            <div className="px-5 pt-5 pb-3">
              <div className={`text-xs uppercase tracking-[0.25em] font-mono mb-2 ${destructive ? 'neon-magenta' : 'neon-cyan'}`}>
                ▲ {destructive ? 'WARNING' : 'CONFIRM'}
              </div>
              <div className="text-white text-sm uppercase tracking-wider font-display">{title}</div>
              {message && <div className="text-gray-400 text-xs mt-2 leading-relaxed font-mono">{message}</div>}
            </div>
            <div className="hud-line" />
            <div className="flex">
              <button
                onClick={onCancel}
                className="flex-1 py-3 text-[11px] uppercase tracking-[0.2em] text-gray-400 hover:bg-[#5CDFFF]/5 hover:text-[#5CDFFF] transition-colors font-mono"
              >
                {cancelLabel}
              </button>
              <button
                onClick={onConfirm}
                className={`flex-1 py-3 text-[11px] uppercase tracking-[0.2em] border-l border-[#1e2538] transition-colors font-mono ${
                  destructive
                    ? 'text-[#ff5a7a] hover:bg-[#ff2e63]/10'
                    : 'text-[#5CDFFF] hover:bg-[#5CDFFF]/10'
                }`}
              >
                {confirmLabel} ▸
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
