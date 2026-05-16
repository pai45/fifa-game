import { useNavigate } from 'react-router';
import { HeaderBar } from '../HeaderBar';

const steps = [
  { icon: '🃏', code: '01', title: 'Your Deck', desc: '2 attackers, 2 defenders, and 6 action cards. A default loadout is preloaded — customize anytime in Deck Builder.' },
  { icon: '🪙', code: '02', title: 'Coin Toss (Round 1)', desc: 'Call heads or tails. If you win, choose attack or defense. Roles alternate automatically each round after.' },
  { icon: '📋', code: '03', title: 'Scenario', desc: 'Each round has a unique football scenario that boosts attack and/or defense power.' },
  { icon: '⚔️', code: '04', title: 'Play Cards', desc: 'Pick one player card and one action card. Action cards are filtered by your role (attack vs defense).' },
  { icon: '📊', code: '05', title: 'Resolution', desc: 'Card rating + action power + scenario bonus + a bit of luck decide the outcome. Even big advantages aren\'t guaranteed.' },
  { icon: '🟥', code: '06', title: 'Risky Actions', desc: 'High-power risky cards can backfire — fouls or red cards remove a card for the rest of the match.' },
  { icon: '⚽', code: '07', title: 'Tiebreaker', desc: 'If tied after 4 rounds, sudden-death penalty shootout decides the winner.' },
];

export function HowToPlayScreen() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col">
      <HeaderBar title="How to Play" subtitle="// Protocol Manual" onBack={() => navigate(-1)} />
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="flex flex-col gap-3 max-w-sm mx-auto">
          {steps.map(s => (
            <div key={s.code} className="cyber-panel clip-cyber p-4 flex gap-3 items-start relative">
              <div className="flex flex-col items-center shrink-0">
                <span className="text-2xl">{s.icon}</span>
                <span className="text-[9px] text-[#5CDFFF]/60 font-mono tracking-widest mt-1">{s.code}</span>
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-white text-sm uppercase tracking-[0.15em] font-display">{s.title}</div>
                <div className="text-gray-400 text-xs mt-1 leading-relaxed font-mono">{s.desc}</div>
              </div>
            </div>
          ))}
          <button
            onClick={() => navigate('/home')}
            className="cyber-btn clip-cyber-btn mt-2 py-3 text-xs"
          >
            ▸ ACKNOWLEDGE
          </button>
        </div>
      </div>
    </div>
  );
}
