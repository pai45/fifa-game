import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useGame } from '../../context/GameContext';
import { HeaderBar } from '../HeaderBar';
import { TutorialTip } from '../TutorialTip';
import { resetTutorial } from '../../tutorial';
import { Toast } from '../Toast';

const HOME_STEPS = [
  {
    title: 'Welcome, Operator',
    body: (
      <>
        <span className="neon-cyan">PITCH/DUEL</span> is a 4-round tactical card duel. Each round you'll
        play one <span className="text-[#b6ff3d]">player card</span> and one{' '}
        <span className="text-[#ff7df8]">action card</span> against the CPU.
        Outcomes are decided by stats + scenario + a dash of luck.
      </>
    ),
  },
  {
    title: 'You\'re pre-loaded',
    body: (
      <>
        A default <span className="neon-cyan">loadout</span> is already installed —
        2 attackers, 2 defenders, 6 actions. You can jump straight into a match,
        or open <span className="text-[#5CDFFF]">Deck Builder</span> to customize it.
      </>
    ),
  },
  {
    title: 'How a match flows',
    body: (
      <>
        <div className="space-y-1.5">
          <div><span className="neon-cyan">1.</span> Coin toss (round 1 only)</div>
          <div><span className="neon-cyan">2.</span> Scenario reveals + role assigned</div>
          <div><span className="neon-cyan">3.</span> Pick a player & action card</div>
          <div><span className="neon-cyan">4.</span> See the outcome → next round</div>
        </div>
        <div className="mt-3 text-[#5CDFFF]/70">▸ Tap PLAY MATCH when ready.</div>
      </>
    ),
  },
];

export function HomeScreen() {
  const navigate = useNavigate();
  const { state, dispatch } = useGame();
  const [forceTutorial, setForceTutorial] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const deckReady = state.deckAttackers.length === 2 && state.deckDefenders.length === 2 && state.deckActions.length >= 6;

  const startMatch = () => {
    dispatch({ type: 'RESET' });
    navigate('/match');
  };

  const replay = () => {
    resetTutorial();
    setForceTutorial(true);
    setToast('Tutorial reset');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <HeaderBar title="Pitch Duel" subtitle="// Main Terminal" onBack={() => navigate('/')} />

      <div className="flex-1 flex flex-col items-center justify-center px-6 gap-4 py-8 relative scanlines">
        <div className="text-5xl drop-shadow-[0_0_18px_rgba(92,223,255,0.5)] mb-1">⚽</div>

        <div className={`chip ${deckReady ? 'chip-lime' : 'chip-amber'} flicker`}>
          {deckReady ? '● DECK ONLINE' : '◐ DEFAULT LOADOUT'}
        </div>

        <div className="w-full max-w-xs flex flex-col gap-3 mt-4">
          <button onClick={startMatch} className="cyber-btn clip-cyber-btn w-full py-3 text-sm">
            ⚔ PLAY MATCH
          </button>

          <button
            onClick={() => navigate('/deck-builder')}
            className="cyber-btn-ghost clip-cyber-btn w-full py-3 text-sm tracking-[0.18em] uppercase"
          >
            ▣ Deck Builder
          </button>

          <button
            onClick={() => navigate('/how-to-play')}
            className="cyber-btn-ghost clip-cyber-btn w-full py-3 text-sm tracking-[0.18em] uppercase opacity-80"
          >
            ? How to Play
          </button>
        </div>

        <div className="cyber-panel clip-cyber px-4 py-3 mt-6 w-full max-w-xs">
          <div className="text-[10px] text-[#5CDFFF]/60 uppercase tracking-[0.25em] font-mono mb-2">▸ Loadout Status</div>
          <div className="grid grid-cols-3 gap-2 text-center">
            <Stat label="ATK" value={`${state.deckAttackers.length}/2`} ok={state.deckAttackers.length === 2} />
            <Stat label="DEF" value={`${state.deckDefenders.length}/2`} ok={state.deckDefenders.length === 2} />
            <Stat label="ACT" value={`${state.deckActions.length}/6`} ok={state.deckActions.length === 6} />
          </div>
        </div>

        <button
          onClick={replay}
          className="mt-2 text-[10px] text-[#5CDFFF]/40 hover:text-[#5CDFFF] font-mono tracking-[0.3em] uppercase transition-colors"
        >
          ↻ Replay Walkthrough
        </button>

        <div className="hud-line w-40 mt-2" />
        <div className="text-[9px] text-[#5CDFFF]/40 font-mono tracking-[0.3em] uppercase">
          Anthropic Networks · est. 2099
        </div>
      </div>

      <TutorialTip
        tutorialKey="home"
        steps={HOME_STEPS}
        forceOpen={forceTutorial}
        onClose={() => setForceTutorial(false)}
      />
      <Toast message={toast} onDismiss={() => setToast(null)} />
    </div>
  );
}

function Stat({ label, value, ok }: { label: string; value: string; ok: boolean }) {
  return (
    <div className="flex flex-col">
      <span className="text-[9px] text-gray-500 uppercase font-mono tracking-widest">{label}</span>
      <span className={`text-base font-display ${ok ? 'neon-cyan' : 'text-amber-400'}`}>{value}</span>
    </div>
  );
}
