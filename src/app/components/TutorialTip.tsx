import { motion, AnimatePresence } from 'motion/react';
import { useEffect, useState, ReactNode } from 'react';
import { hasSeen, markSeen, skipAll, TutorialKey } from '../tutorial';
import { GameIcon } from './GameIcon';

interface Step {
  title: string;
  body: ReactNode;
}

interface Props {
  tutorialKey: TutorialKey;
  steps: Step[];
  /** Auto-open on mount if unseen. Default true. */
  autoOpen?: boolean;
  /** Allow opening externally via this flag. */
  forceOpen?: boolean;
  onClose?: () => void;
}

export function TutorialTip({ tutorialKey, steps, autoOpen = true, forceOpen, onClose }: Props) {
  const [open, setOpen] = useState(false);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (forceOpen) {
      setOpen(true);
      setIdx(0);
      return;
    }
    if (autoOpen && !hasSeen(tutorialKey)) {
      setOpen(true);
      setIdx(0);
    }
  }, [tutorialKey, autoOpen, forceOpen]);

  const close = () => {
    markSeen(tutorialKey);
    setOpen(false);
    onClose?.();
  };

  const next = () => {
    if (idx < steps.length - 1) setIdx(idx + 1);
    else close();
  };

  const skip = () => {
    skipAll();
    setOpen(false);
    onClose?.();
  };

  const step = steps[idx];

  return (
    <AnimatePresence>
      {open && step && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] bg-black/85 backdrop-blur-md flex items-center justify-center px-6"
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className="cyber-panel clip-cyber w-full max-w-sm scanlines relative"
          >
            {/* Top label */}
            <div className="flex items-center justify-between px-4 pt-4">
              <div className="flex items-center gap-2">
                <span className="live-dot" />
                <span className="text-[10px] uppercase tracking-[0.3em] font-mono neon-cyan">
                  ▸ Onboarding · {String(idx + 1).padStart(2, '0')}/{String(steps.length).padStart(2, '0')}
                </span>
              </div>
              <button
                onClick={skip}
                className="text-[10px] uppercase tracking-[0.2em] text-gray-500 hover:text-[#ff5a7a] font-mono transition-colors"
                aria-label="Skip all tutorials"
              >
                SKIP ALL <GameIcon name="close" className="inline text-xs" />
              </button>
            </div>

            <div className="px-5 pt-3 pb-4">
              <h3 className="text-white text-base uppercase tracking-[0.18em] font-display mb-2">
                {step.title}
              </h3>
              <div className="text-gray-300 text-xs leading-relaxed font-mono">
                {step.body}
              </div>
            </div>

            {/* Progress dots */}
            <div className="px-5 pb-3 flex gap-1">
              {steps.map((_, i) => (
                <span
                  key={i}
                  className={`h-1 flex-1 transition-all ${
                    i === idx
                      ? 'bg-[#5CDFFF] shadow-[0_0_8px_rgba(92,223,255,0.7)]'
                      : i < idx
                        ? 'bg-[#5CDFFF]/40'
                        : 'bg-[#1e2538]'
                  }`}
                />
              ))}
            </div>

            <div className="hud-line" />

            <div className="flex">
              {idx > 0 && (
                <button
                  onClick={() => setIdx(idx - 1)}
                  className="flex-1 py-3 text-[11px] uppercase tracking-[0.2em] text-gray-400 hover:bg-[#5CDFFF]/5 hover:text-[#5CDFFF] transition-colors font-mono"
                >
                  ◄ BACK
                </button>
              )}
              <button
                onClick={next}
                className="flex-1 py-3 text-[11px] uppercase tracking-[0.2em] neon-cyan hover:bg-[#5CDFFF]/10 border-l border-[#1e2538] transition-colors font-mono"
              >
                {idx < steps.length - 1 ? 'NEXT ▸' : 'GOT IT ▸'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
