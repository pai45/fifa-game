import { PlayerCard } from '../data/cards';

const tierStyles = {
  silver: {
    border: 'border-[#7c8aa0]',
    bg: 'bg-gradient-to-br from-[#1a2030] via-[#0e1424] to-[#1a2030]',
    label: 'text-[#a8b8cc]',
    glow: 'glow-silver',
    tag: 'bg-[#7c8aa0] text-[#04101a]',
  },
  gold: {
    border: 'border-[#ffb13d]',
    bg: 'bg-gradient-to-br from-[#2a1f0a] via-[#0e1424] to-[#2a1f0a]',
    label: 'text-[#ffd07a]',
    glow: 'glow-gold',
    tag: 'bg-[#ffb13d] text-[#1a0f00]',
  },
  purple: {
    border: 'border-[#ba6eff]',
    bg: 'bg-gradient-to-br from-[#1c1130] via-[#0e1424] to-[#1c1130]',
    label: 'text-[#d6a8ff]',
    glow: 'glow-purple',
    tag: 'bg-[#ba6eff] text-[#0e0420]',
  },
};

interface Props {
  card: PlayerCard;
  selected?: boolean;
  disabled?: boolean;
  redCarded?: boolean;
  used?: boolean;
  onClick?: () => void;
  size?: 'sm' | 'md';
}

export function PlayerCardComponent({ card, selected, disabled, redCarded, used, onClick, size = 'md' }: Props) {
  const tier = tierStyles[card.tier];
  const isInactive = disabled || redCarded || used;
  const w = size === 'sm' ? 'w-20' : 'w-28';
  const h = size === 'sm' ? 'h-28' : 'h-40';

  return (
    <button
      onClick={isInactive ? undefined : onClick}
      className={`${w} ${h} relative flex flex-col items-center justify-between p-2 border ${tier.border} ${tier.bg} ${tier.glow} clip-cyber-sm shrink-0 transition-all
        ${selected ? 'selected-ring scale-105' : ''}
        ${isInactive ? 'opacity-30 grayscale cursor-not-allowed' : 'cursor-pointer card-hover'}
      `}
    >
      {/* Corner brackets */}
      <span className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#5CDFFF]/60" />
      <span className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[#5CDFFF]/60" />

      {/* Tier tag */}
      <div className={`absolute -top-px -left-px ${tier.tag} clip-tag-l px-1.5 ${size === 'sm' ? 'text-[7px]' : 'text-[8px]'} font-mono uppercase tracking-widest`}>
        {card.tier}
      </div>

      {redCarded && (
        <div className="absolute inset-0 bg-[#ff2e63]/30 flex items-center justify-center z-10 backdrop-blur-[1px]">
          <span className="text-[#ff5a7a] text-3xl font-display drop-shadow-[0_0_8px_rgba(255,46,99,0.7)]">✕</span>
        </div>
      )}

      <div className={`${size === 'sm' ? 'text-2xl' : 'text-3xl'} mt-2`}>{card.emoji}</div>
      <div className="text-center w-full">
        <div className={`${size === 'sm' ? 'text-[10px]' : 'text-xs'} text-white truncate w-full font-display tracking-wider uppercase`}>{card.name}</div>
        <div className={`${tier.label} ${size === 'sm' ? 'text-[8px]' : 'text-[9px]'} uppercase tracking-[0.2em] font-mono`}>{card.role}</div>
      </div>
      <div className="flex items-baseline gap-1 mt-auto">
        <span className="neon-cyan text-lg font-display">{card.rating}</span>
        <span className="text-gray-500 text-[8px] font-mono tracking-widest">OVR</span>
      </div>
      <div className={`${size === 'sm' ? 'text-[7px]' : 'text-[8px]'} text-gray-400 truncate w-full text-center font-mono uppercase tracking-wider border-t border-[#1e2538] pt-1`}>
        {card.trait}
      </div>

      {used && !redCarded && (
        <div className="absolute top-1 right-1 text-[7px] text-amber-400 bg-amber-500/20 border border-amber-500/40 px-1 font-mono uppercase tracking-widest">
          USED
        </div>
      )}
    </button>
  );
}
