import { motion } from 'motion/react';
import { useGame, RoundOutcome } from '../../../context/GameContext';
import { HeaderBar } from '../../HeaderBar';
import { ScoreBar } from '../../ScoreBar';
import { PlayerCardComponent } from '../../PlayerCardComponent';
import { ActionCardComponent } from '../../ActionCardComponent';
import { useMatchNav } from '../MatchScreen';
import { TutorialTip } from '../../TutorialTip';
import { GameIcon, GameIconName } from '../../GameIcon';

const RESULT_STEPS = [
  {
    title: 'Round Resolved',
    body: (
      <>
        The label shows: <span className="neon-lime">GOAL</span>,{' '}
        <span className="neon-cyan">SAVED</span>, <span className="text-amber-400">MISSED</span>,{' '}
        <span className="text-amber-500">FOUL</span>, or <span className="neon-magenta">RED CARD</span>.
      </>
    ),
  },
  {
    title: 'Used Cards',
    body: (
      <>
        Round cards appear side-by-side. Used players are marked <span className="text-amber-400">USED</span> and cannot replay.
      </>
    ),
  },
  {
    title: 'Next Round',
    body: (
      <>
        Tap <span className="neon-cyan">NEXT ROUND</span>. Roles switch each
        round, so attack becomes defense.
      </>
    ),
  },
];

const outcomeConfig: Record<RoundOutcome, { label: string; color: string; icon: GameIconName; glow: string }> = {
  goal:        { label: 'GOAL',     color: 'neon-lime',     icon: 'soccer', glow: 'rgba(182,255,61,0.6)' },
  saved:       { label: 'SAVED',    color: 'neon-cyan',     icon: 'hand', glow: 'rgba(92,223,255,0.6)' },
  blocked:     { label: 'BLOCKED',  color: 'text-gray-300', icon: 'block', glow: 'rgba(200,200,200,0.4)' },
  missed:      { label: 'MISSED',   color: 'text-amber-400',icon: 'wind', glow: 'rgba(255,180,61,0.5)' },
  foul:        { label: 'FOUL',     color: 'text-amber-500',icon: 'yellow-card', glow: 'rgba(255,180,61,0.5)' },
  'red-card':  { label: 'RED CARD', color: 'neon-magenta',  icon: 'red-card', glow: 'rgba(255,61,247,0.7)' },
};

export function RoundResultPhase() {
  const { state, dispatch } = useGame();
  const { requestQuit } = useMatchNav();
  const result = state.roundResults[state.roundResults.length - 1];
  if (!result) return null;

  const oc = outcomeConfig[result.outcome];
  const playerScored = result.outcome === 'goal' && result.playerAttacking;
  const opponentScored = result.outcome === 'goal' && !result.playerAttacking;

  return (
    <div className="min-h-screen flex flex-col scanlines">
      <HeaderBar title={`Round ${result.round} // Result`} onBack={requestQuit} />
      <ScoreBar playerScore={state.playerScore} opponentScore={state.opponentScore} round={state.currentRound} />

      <div className="flex-1 overflow-y-auto flex flex-col items-center px-4 py-6 gap-4 relative">
        <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse at center, ${oc.glow}, transparent 60%)`, opacity: 0.15 }} />

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
          className="z-10"
          style={{ filter: `drop-shadow(0 0 20px ${oc.glow})` }}
        >
          <GameIcon name={oc.icon} className={`text-7xl ${oc.color}`} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`text-2xl uppercase tracking-[0.3em] font-display ${oc.color} z-10`}
        >
          {oc.label}
        </motion.div>

        {(playerScored || opponentScored) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className={`chip ${playerScored ? 'chip-lime' : 'chip-red'} z-10`}
          >
            ▲ {playerScored ? '+1 YOU' : '+1 CPU'}
          </motion.div>
        )}

        <div className="text-gray-500 text-[11px] text-center uppercase tracking-[0.2em] font-mono z-10">
          <GameIcon name={result.scenario.icon} className="inline text-sm text-[#5CDFFF]/60" /> {result.scenario.title} <span className="text-[#5CDFFF]/40">//</span> YOU {result.playerAttacking ? 'ATTACKED' : 'DEFENDED'}
        </div>

        {/* Cards used */}
        <div className="flex flex-wrap items-start justify-center gap-3 mt-2 w-full z-10">
          <div className="flex flex-col items-center gap-1">
            <span className="chip chip-lime"><GameIcon name="score" className="text-xs" /> ATKR</span>
            <PlayerCardComponent card={result.attackerCard} size="sm" />
            <ActionCardComponent card={result.attackAction} size="sm" />
          </div>
          <div className="text-[#5CDFFF]/60 self-center text-lg font-display pt-10">⟷</div>
          <div className="flex flex-col items-center gap-1">
            <span className="chip"><GameIcon name="shield" className="text-xs" /> DEFR</span>
            <PlayerCardComponent card={result.defenderCard} size="sm" />
            <ActionCardComponent card={result.defenseAction} size="sm" />
          </div>
        </div>

        {result.outcome === 'red-card' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="cyber-panel cyber-panel-magenta clip-cyber px-4 py-2 max-w-xs text-center z-10">
            <span className="neon-magenta text-[11px] uppercase tracking-widest font-mono"><GameIcon name="warning" className="inline text-sm" /> DEFENDER PURGED FROM ROSTER</span>
          </motion.div>
        )}
        {result.outcome === 'foul' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="cyber-panel clip-cyber px-4 py-2 max-w-xs text-center border-amber-500/40 z-10">
            <span className="text-amber-400 text-[11px] uppercase tracking-widest font-mono"><GameIcon name="warning" className="inline text-sm" /> FOUL // ATTACK DISRUPTED</span>
          </motion.div>
        )}
      </div>

      <div className="bg-gradient-to-t from-[#05080f] to-[#0e1424] border-t border-[#1e2538] px-4 py-3">
        <button
          onClick={() => dispatch({ type: 'NEXT_ROUND' })}
          className="cyber-btn clip-cyber-btn w-full py-3 text-sm"
        >
          {state.currentRound >= 4 ? '▸ FULL-TIME RESULT' : `▸ NEXT ROUND // ${state.currentRound + 1}/4`}
        </button>
      </div>
      <TutorialTip tutorialKey="round-result" steps={RESULT_STEPS} />
    </div>
  );
}
