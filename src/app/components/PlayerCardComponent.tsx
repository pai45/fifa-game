import { useState, type CSSProperties } from 'react';
import { PlayerCard } from '../data/cards';
import { GameIcon } from './GameIcon';

const tierStyles = {
  silver: {
    border: 'border-[#8e9aab]',
    accent: '#aeb8c8',
    accentSoft: 'rgba(174,184,200,0.34)',
    text: 'text-[#d6deea]',
    bg: 'from-[#f0f3f8] via-[#aeb8c8] to-[#647184]',
    glow: 'glow-silver',
  },
  gold: {
    border: 'border-[#ffb13d]',
    accent: '#ffb13d',
    accentSoft: 'rgba(255,177,61,0.36)',
    text: 'text-[#ffe1a6]',
    bg: 'from-[#fff2b0] via-[#ffb13d] to-[#d08312]',
    glow: 'glow-gold',
  },
  purple: {
    border: 'border-[#ba6eff]',
    accent: '#ba6eff',
    accentSoft: 'rgba(186,110,255,0.38)',
    text: 'text-[#edd8ff]',
    bg: 'from-[#f2dcff] via-[#ba6eff] to-[#6c28c8]',
    glow: 'glow-purple',
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
  const [imageFailed, setImageFailed] = useState(false);
  const isSmall = size === 'sm';
  const roleLabel = card.role === 'attacker' ? 'ATK' : 'DEF';
  const w = isSmall ? 'w-24' : 'w-32';
  const h = isSmall ? 'h-36' : 'h-48';

  return (
    <button
      onClick={isInactive ? undefined : onClick}
      className={`${w} ${h} player-card-frame relative overflow-hidden border-2 ${tier.border} ${tier.glow} shrink-0 transition-all
        ${selected ? 'selected-ring scale-105' : ''}
        ${isInactive ? 'opacity-35 grayscale cursor-not-allowed' : 'cursor-pointer card-hover'}
      `}
      style={{ '--player-accent': tier.accent, '--player-accent-soft': tier.accentSoft } as CSSProperties}
    >
      <div className="absolute inset-0 bg-[#0f1623]" />

      <div className="absolute inset-x-1 top-1 bottom-[24%] overflow-hidden bg-[#eceff2] shadow-[inset_0_0_0_1px_rgba(0,0,0,0.22)]">
        {!imageFailed ? (
          <img
            src={card.image}
            alt=""
            className="h-full w-full object-cover object-top"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center bg-[linear-gradient(135deg,#f7f7f4_0%,#f7f7f4_32%,rgba(255,255,255,0.85)_33%,rgba(255,255,255,0.85)_45%,var(--player-accent)_46%,#ffffff_61%,#111827_62%,#111827_72%,#d71930_73%)]">
            <GameIcon name={card.icon} className={`${isSmall ? 'text-4xl' : 'text-6xl'} text-[#111827] drop-shadow-[0_2px_0_rgba(255,255,255,0.65)]`} />
          </div>
        )}
        <div className="absolute inset-0 bg-[linear-gradient(135deg,transparent_0%,transparent_24%,rgba(255,255,255,0.74)_25%,rgba(255,255,255,0.22)_38%,transparent_39%),linear-gradient(115deg,transparent_0%,transparent_62%,rgba(190,0,28,0.48)_63%,rgba(190,0,28,0.95)_79%,transparent_80%)]" />
      </div>

      <div className={`absolute top-0 right-0 z-30 bg-gradient-to-br ${tier.bg} text-[#070910] border-l-2 border-b-2 border-black/45 shadow-[0_4px_10px_rgba(0,0,0,0.4)] ${isSmall ? 'w-9 h-7' : 'w-11 h-8'} flex flex-col items-center justify-center`}>
        <span className={`${isSmall ? 'text-xs' : 'text-sm'} font-display font-black leading-none tracking-normal`}>
          {card.rating}
        </span>
        <span className={`${isSmall ? 'text-[5px]' : 'text-[6px]'} font-mono font-black leading-none tracking-[0.1em]`}>
          OVR
        </span>
      </div>

      <div className={`absolute top-1.5 left-1.5 z-30 bg-black/55 px-1.5 py-0.5 border border-white/15 ${tier.text} font-display font-black uppercase tracking-[0.06em] ${isSmall ? 'text-[6px]' : 'text-[7px]'}`}>
        {roleLabel}
      </div>

      <div className="absolute inset-x-1 bottom-[24%] z-30 bg-[linear-gradient(180deg,rgba(46,46,50,0.46),rgba(29,31,37,0.94))] px-1.5 py-1 backdrop-blur-[1px] border-t border-white/10">
        <div className={`${isSmall ? 'text-[6px]' : 'text-[8px]'} text-white/90 font-mono truncate normal-case tracking-normal text-center`}>
          {card.trait}
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 z-30 flex h-[24%] items-center justify-center bg-[linear-gradient(180deg,#202836,#121824)] px-2">
        <div className={`${isSmall ? 'text-[8px]' : 'text-[11px]'} text-white font-display font-black tracking-[0.02em] truncate normal-case leading-none`}>
          {card.name}
        </div>
      </div>

      {used && !redCarded && (
        <div className="absolute top-7 right-1 z-30 text-[7px] text-amber-300 bg-black/65 border border-amber-500/50 px-1 font-mono uppercase tracking-widest">
          USED
        </div>
      )}

      {redCarded && (
        <div className="absolute inset-0 bg-[#ff2e63]/35 flex items-center justify-center z-40 backdrop-blur-[1px]">
          <GameIcon name="close" className="text-[#ff5a7a] text-4xl drop-shadow-[0_0_8px_rgba(255,46,99,0.9)]" />
        </div>
      )}
    </button>
  );
}
