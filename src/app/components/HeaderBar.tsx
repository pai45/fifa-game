import { ReactNode } from 'react';

interface Props {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  rightSlot?: ReactNode;
}

export function HeaderBar({ title, subtitle, onBack, rightSlot }: Props) {
  return (
    <div className="relative">
      <div className="bg-gradient-to-b from-[#0b1120] to-[#070b14] border-b border-[#1e2538] px-3 py-2 flex items-center gap-2 min-h-12 backdrop-blur-sm">
        {onBack && (
          <button
            onClick={onBack}
            aria-label="Go back"
            className="text-[#5CDFFF] w-10 h-10 flex items-center justify-center -ml-1 hover:bg-[#5CDFFF]/10 active:bg-[#5CDFFF]/20 transition-colors clip-cyber-sm"
          >
            <span className="text-lg leading-none">◄</span>
          </button>
        )}
        <div className="flex-1 min-w-0">
          <div className="text-white text-sm tracking-[0.18em] uppercase truncate font-display">
            <span className="text-[#5CDFFF]">/</span> {title}
          </div>
          {subtitle && <div className="text-gray-500 text-[10px] truncate font-mono tracking-wider uppercase">{subtitle}</div>}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="live-dot" />
          <span className="text-[9px] text-[#5CDFFF]/70 font-mono uppercase tracking-widest">LIVE</span>
          {rightSlot}
        </div>
      </div>
      <div className="hud-line" />
    </div>
  );
}
