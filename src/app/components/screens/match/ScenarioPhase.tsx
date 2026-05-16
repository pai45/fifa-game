import { useEffect } from 'react';
import { motion } from 'motion/react';
import { useGame } from '../../../context/GameContext';
import { HeaderBar } from '../../HeaderBar';
import { ScoreBar } from '../../ScoreBar';
import { useMatchNav } from '../MatchScreen';
import { TutorialTip } from '../../TutorialTip';

const SCENARIO_STEPS = [
  {
    title: 'Scenario Briefing',
    body: (
      <>
        Each round drops you into a different football situation —
        <span className="neon-cyan"> counter attack</span>,{' '}
        <span className="neon-cyan">set piece</span>,{' '}
        <span className="neon-cyan">box defense</span>, etc.
      </>
    ),
  },
  {
    title: 'Bonus Stats',
    body: (
      <>
        Watch the <span className="text-[#b6ff3d]">ATK +X</span> and{' '}
        <span className="neon-cyan">DEF +X</span> chips — they're added to your power
        for this round. A high-attack scenario favors the attacker.
      </>
    ),
  },
  {
    title: 'Your Role',
    body: <>The big banner shows whether you're attacking or defending this round. Plan your card choice around it.</>,
  },
];

export function ScenarioPhase() {
  const { state, dispatch } = useGame();
  const { requestQuit } = useMatchNav();

  useEffect(() => {
    if (!state.currentScenario) {
      dispatch({ type: 'SHOW_SCENARIO' });
    }
  }, []);

  if (!state.currentScenario) return null;

  return (
    <div className="min-h-screen flex flex-col scanlines">
      <HeaderBar title={`Round ${state.currentRound}`} subtitle="// Scenario Briefing" onBack={requestQuit} />
      <ScoreBar playerScore={state.playerScore} opponentScore={state.opponentScore} round={state.currentRound} />

      <div className="flex-1 flex flex-col items-center justify-center px-6 gap-5 relative">
        <div className="absolute inset-0 bg-[#ff3df7]/5 blur-[120px] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center gap-4 text-center z-10 cyber-panel clip-cyber px-6 py-6 max-w-sm w-full scan-sweep"
        >
          <div className="text-[10px] text-[#5CDFFF]/60 font-mono uppercase tracking-[0.3em]">▸ Scenario Loaded</div>
          <div className="text-6xl drop-shadow-[0_0_18px_rgba(92,223,255,0.5)]">{state.currentScenario.icon}</div>
          <h2 className="neon-cyan uppercase tracking-[0.25em] font-display text-lg">
            {state.currentScenario.title}
          </h2>
          <p className="text-gray-400 text-xs max-w-xs leading-relaxed font-mono">{state.currentScenario.description}</p>

          <div className="flex gap-3 mt-2">
            <span className="chip chip-lime">⚔ ATK +{state.currentScenario.attackBonus}</span>
            <span className="chip">🛡 DEF +{state.currentScenario.defenseBonus}</span>
          </div>

          <div className="hud-line w-full mt-2" />

          <div className={`clip-cyber-sm mt-1 px-6 py-2 text-sm uppercase tracking-[0.2em] font-display border ${
            state.playerAttacking
              ? 'border-[#b6ff3d] text-[#b6ff3d] bg-[#b6ff3d]/10 shadow-[0_0_18px_rgba(182,255,61,0.25)]'
              : 'border-[#5CDFFF] neon-cyan bg-[#5CDFFF]/10 shadow-[0_0_18px_rgba(92,223,255,0.25)]'
          }`}>
            {state.playerAttacking ? '⚔ ROLE: ATTACK' : '🛡 ROLE: DEFEND'}
          </div>
        </motion.div>

        <button
          onClick={() => dispatch({ type: 'START_PLAY' })}
          className="cyber-btn clip-cyber-btn px-10 py-3 text-sm z-10"
        >
          ▸ SELECT CARDS
        </button>
      </div>
      <TutorialTip tutorialKey="scenario" steps={SCENARIO_STEPS} />
    </div>
  );
}
