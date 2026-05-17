import { useNavigate } from 'react-router';
import { HeaderBar } from '../HeaderBar';
import { GameIcon, GameIconName } from '../GameIcon';

const steps: { icon: GameIconName; code: string; title: string; desc: string }[] = [
  { icon: 'cards', code: '01', title: 'Your Deck', desc: '2 attackers, 2 defenders, 6 actions. Use the default deck or customize it.' },
  { icon: 'coin', code: '02', title: 'Coin Toss (Round 1)', desc: 'Call the toss. Winner chooses attack or defense; roles alternate after.' },
  { icon: 'brief', code: '03', title: 'Scenario', desc: 'Each round adds attack and/or defense bonuses.' },
  { icon: 'score', code: '04', title: 'Play Cards', desc: 'Pick one player and one role-matched action.' },
  { icon: 'stats', code: '05', title: 'Resolution', desc: 'Rating + action + scenario + luck decide the result.' },
  { icon: 'alert', code: '06', title: 'Risky Actions', desc: 'High-power risks can cause fouls or red cards.' },
  { icon: 'soccer', code: '07', title: 'Tiebreaker', desc: 'A 4-round tie goes to penalties.' },
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
                <GameIcon name={s.icon} className="text-2xl text-[#5CDFFF]" />
                <span className="text-[9px] text-[#5CDFFF]/60 font-mono tracking-widest mt-1">{s.code}</span>
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-white text-sm uppercase tracking-[0.15em] font-display">{s.title}</div>
                <div className="text-gray-400 text-xs mt-1 leading-relaxed font-mono">{s.desc}</div>
              </div>
            </div>
          ))}
          <button
            onClick={() => navigate('/')}
            className="cyber-btn clip-cyber-btn mt-2 py-3 text-xs"
          >
            ACKNOWLEDGE
          </button>
        </div>
      </div>
    </div>
  );
}
