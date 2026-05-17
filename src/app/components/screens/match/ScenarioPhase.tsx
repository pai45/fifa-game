import { useEffect } from 'react';
import { motion } from 'motion/react';
import { useGame } from '../../../context/GameContext';
import { HeaderBar } from '../../HeaderBar';
import { ScoreBar } from '../../ScoreBar';
import { useMatchNav } from '../MatchScreen';
import { TutorialTip } from '../../TutorialTip';
import { GameIcon } from '../../GameIcon';

const SCENARIO_STEPS = [
  {
    title: 'Scenario Briefing',
    body: (
      <>
        Each round has a football situation:
        <span className="neon-cyan"> counter attack</span>,{' '}
        <span className="neon-cyan">set piece</span>,{' '}
        <span className="neon-cyan">box defense</span>, and more.
      </>
    ),
  },
  {
    title: 'Bonus Stats',
    body: (
      <>
        <span className="text-[#b6ff3d]">ATK +X</span> and{' '}
        <span className="neon-cyan">DEF +X</span> are added this round. Bigger
        attack bonus favors the attacker.
      </>
    ),
  },
  {
    title: 'Your Role',
    body: <>The banner shows your role. Pick cards around attack or defense.</>,
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
          <GameIcon
            name={state.currentScenario.icon}
            className="text-6xl text-[#5CDFFF] drop-shadow-[0_0_18px_rgba(92,223,255,0.5)]"
          />
          <h2 className="neon-cyan uppercase tracking-[0.25em] font-display text-lg">
            {state.currentScenario.title}
          </h2>
          <p className="text-gray-400 text-xs max-w-xs leading-relaxed font-mono">{state.currentScenario.description}</p>

          <div className="flex gap-3 mt-2">
            <span className="chip chip-lime"><GameIcon name="score" className="text-xs" /> ATK +{state.currentScenario.attackBonus}</span>
            <span className="chip"><GameIcon name="shield" className="text-xs" /> DEF +{state.currentScenario.defenseBonus}</span>
          </div>

          <div className="hud-line w-full mt-2" />

          <div className={`clip-cyber-sm mt-1 px-6 py-2 text-sm uppercase tracking-[0.2em] font-display border ${
            state.playerAttacking
              ? 'border-[#b6ff3d] text-[#b6ff3d] bg-[#b6ff3d]/10 shadow-[0_0_18px_rgba(182,255,61,0.25)]'
              : 'border-[#5CDFFF] neon-cyan bg-[#5CDFFF]/10 shadow-[0_0_18px_rgba(92,223,255,0.25)]'
          }`}>
            <span className="inline-flex items-center justify-center gap-2">
              <GameIcon name={state.playerAttacking ? 'score' : 'shield'} className="text-base" />
              ROLE: {state.playerAttacking ? 'ATTACK' : 'DEFEND'}
            </span>
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
