import { motion, AnimatePresence } from 'motion/react';
import { useEffect } from 'react';

interface Props {
  message: string | null;
  onDismiss: () => void;
  duration?: number;
}

export function Toast({ message, onDismiss, duration = 1800 }: Props) {
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(onDismiss, duration);
    return () => clearTimeout(t);
  }, [message, duration, onDismiss]);

  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 cyber-panel clip-cyber px-4 py-2 flex items-center gap-2"
        >
          <span className="live-dot" />
          <span className="neon-cyan text-[11px] uppercase tracking-[0.2em] font-mono">{message}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
