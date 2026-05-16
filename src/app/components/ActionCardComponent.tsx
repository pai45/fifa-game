import { ActionCard } from '../data/cards';

const catStyles = {
  attack: {
    border: 'border-[#b6ff3d]',
    bg: 'bg-gradient-to-br from-[#0d2010] via-[#0e1424] to-[#0d2010]',
    label: 'text-[#b6ff3d]',
    glow: 'shadow-[0_0_14px_rgba(182,255,61,0.25),inset_0_0_10px_rgba(182,255,61,0.08)]',
    tag: 'bg-[#b6ff3d] text-[#0a1a00]',
    code: 'ATK',
  },
  defense: {
    border: 'border-[#5CDFFF]',
    bg: 'bg-gradient-to-br from-[#0a1a26] via-[#0e1424] to-[#0a1a26]',
    label: 'text-[#5CDFFF]',
    glow: 'shadow-[0_0_14px_rgba(92,223,255,0.25),inset_0_0_10px_rgba(92,223,255,0.08)]',
    tag: 'bg-[#5CDFFF] text-[#04101a]',
    code: 'DEF',
  },
  special: {
    border: 'border-[#ff3df7]',
    bg: 'bg-gradient-to-br from-[#220a26] via-[#0e1424] to-[#220a26]',
    label: 'text-[#ff7df8]',
    glow: 'shadow-[0_0_16px_rgba(255,61,247,0.3),inset_0_0_10px_rgba(255,61,247,0.1)]',
    tag: 'bg-[#ff3df7] text-[#1a001a]',
    code: 'SPC',
  },
};

interface Props {
  card: ActionCard;
  selected?: boolean;
  disabled?: boolean;
  used?: boolean;
  onClick?: () => void;
  size?: 'sm' | 'md';
}

export function ActionCardComponent({ card, selected, disabled, used, onClick, size = 'md' }: Props) {
  const cat = catStyles[card.category];
  const isInactive = disabled || used;
  const w = size === 'sm' ? 'w-20' : 'w-24';
  const h = size === 'sm' ? 'h-24' : 'h-32';

  return (
    <button
      onClick={isInactive ? undefined : onClick}
      className={`${w} ${h} relative flex flex-col items-center justify-between gap-1 px-2 pt-3 pb-2 border ${cat.border} ${cat.bg} ${cat.glow} clip-cyber-sm shrink-0 transition-all
        ${selected ? 'selected-ring scale-105' : ''}
        ${isInactive ? 'opacity-30 grayscale cursor-not-allowed' : 'cursor-pointer card-hover'}
        ${card.risky ? 'ring-1 ring-[#ff2e63]/50' : ''}
      `}
    >
      <span className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#5CDFFF]/60" />
      <span className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[#5CDFFF]/60" />

      <div className={`absolute -top-px -left-px ${cat.tag} clip-tag-l px-1.5 ${size === 'sm' ? 'text-[7px]' : 'text-[8px]'} font-mono uppercase tracking-widest`}>
        {cat.code}
      </div>

      <div className="absolute -top-px -right-px bg-[#0e1424] border-l border-b border-[#5CDFFF]/40 px-1.5 text-[8px] font-mono text-[#5CDFFF] tracking-widest">
        +{card.power}
      </div>

      <span className={`${size === 'sm' ? 'text-lg' : 'text-xl'} mt-1`}>{card.icon}</span>
      <span className={`text-white ${size === 'sm' ? 'text-[9px]' : 'text-[10px]'} text-center leading-tight font-display tracking-wider uppercase`}>
        {card.title}
      </span>
      <span className={`${cat.label} text-[7px] text-center font-mono uppercase tracking-wider opacity-70 truncate w-full`}>
        {card.effect}
      </span>

      {card.risky && (
        <div className="absolute bottom-1 left-1 text-[8px] text-[#ff5a7a] font-mono uppercase tracking-widest drop-shadow-[0_0_4px_rgba(255,46,99,0.6)]">
          ⚠
        </div>
      )}

      {used && (
        <div className="absolute top-1 right-1 text-[7px] text-amber-400 bg-amber-500/20 border border-amber-500/40 px-1 font-mono uppercase tracking-widest">
          USED
        </div>
      )}
    </button>
  );
}
