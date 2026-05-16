import { motion } from 'motion/react';
import { useGame } from '../../../context/GameContext';
import { HeaderBar } from '../../HeaderBar';
import { ScoreBar } from '../../ScoreBar';
import { TutorialTip } from '../../TutorialTip';
import { GameIcon } from '../../GameIcon';

const MATCH_END_STEPS = [
  {
    title: 'Full Time',
    body: (
      <>
        All 4 rounds are done. The big banner shows the result —{' '}
        <span className="neon-cyan">VICTORY</span>, <span className="neon-red">DEFEAT</span>,
        or <span className="text-amber-400">DEADLOCK</span> if scores are tied.
      </>
    ),
  },
  {
    title: 'Round Log',
    body: <>The log recaps every round's scenario and outcome so you can see how the match unfolded.</>,
  },
  {
    title: 'Tied? Penalties!',
    body: (
      <>
        If the match is a draw, you'll be sent into a{' '}
        <span className="text-amber-400">penalty shootout</span> to decide the winner.
      </>
    ),
  },
];

export function MatchEndPhase() {
  const { state, dispatch } = useGame();
  const tied = state.playerScore === state.opponentScore;
  const playerWins = state.playerScore > state.opponentScore;

  return (
    <div className="min-h-screen flex flex-col scanlines">
      <HeaderBar title="Full Time" subtitle="// Match Complete" />
      <ScoreBar playerScore={state.playerScore} opponentScore={state.opponentScore} label="FULL TIME" />

      <div className="flex-1 overflow-y-auto flex flex-col items-center justify-center px-6 gap-5 py-6 relative">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: tied
              ? 'radial-gradient(ellipse at center, rgba(255,180,61,0.15), transparent 60%)'
              : playerWins
                ? 'radial-gradient(ellipse at center, rgba(92,223,255,0.18), transparent 60%)'
                : 'radial-gradient(ellipse at center, rgba(255,46,99,0.15), transparent 60%)',
          }}
        />

        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="z-10 drop-shadow-[0_0_20px_rgba(92,223,255,0.5)]">
          <GameIcon
            name={tied ? 'balance' : playerWins ? 'trophy' : 'close'}
            className={`text-6xl ${tied ? 'text-amber-400' : playerWins ? 'text-[#5CDFFF]' : 'text-[#ff5a7a]'}`}
          />
        </motion.div>
        <div
          className={`text-2xl uppercase tracking-[0.3em] text-center font-display z-10 ${
            tied ? 'text-amber-400' : playerWins ? 'neon-cyan' : 'neon-red'
          }`}
        >
          {tied ? '◆ DEADLOCK ◆' : playerWins ? '◆ VICTORY ◆' : '◆ DEFEAT ◆'}
        </div>
        <div className="text-[#5CDFFF]/60 text-[10px] uppercase tracking-[0.3em] font-mono z-10">▸ After 4 Rounds</div>

        {/* Round summary */}
        <div className="cyber-panel clip-cyber w-full max-w-xs z-10">
          <div className="px-3 py-2 text-[10px] text-[#5CDFFF]/60 uppercase tracking-[0.25em] font-mono border-b border-[#1e2538]">
            ▸ Round Log
          </div>
          {state.roundResults.map((r) => (
            <div key={r.round} className="flex items-center justify-between px-3 py-2 text-[11px] border-b border-[#1e2538]/60 last:border-0 font-mono">
              <span className="text-[#5CDFFF]/60 w-6">R{r.round}</span>
              <span className="text-gray-400 flex-1 truncate px-2 uppercase tracking-wider">
                <GameIcon name={r.scenario.icon} className="inline text-sm text-[#5CDFFF]/60" /> {r.scenario.title}
              </span>
              <span
                className={`uppercase tracking-widest ${
                  r.outcome === 'goal'
                    ? r.playerAttacking ? 'neon-lime' : 'neon-red'
                    : 'text-gray-500'
                }`}
              >
                {r.outcome === 'goal' ? (r.playerAttacking ? '+1 YOU' : '+1 CPU') : r.outcome.toUpperCase()}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gradient-to-t from-[#05080f] to-[#0e1424] border-t border-[#1e2538] px-4 py-3">
        {tied ? (
          <button
            onClick={() => dispatch({ type: 'GO_TO_PENALTY' })}
            className="cyber-btn-warn clip-cyber-btn w-full py-3 text-sm tracking-[0.25em] uppercase font-display"
          >
            <GameIcon name="soccer" className="text-base" /> PENALTY SHOOTOUT
          </button>
        ) : (
          <button
            onClick={() => dispatch({ type: 'FINISH_MATCH' })}
            className="cyber-btn clip-cyber-btn w-full py-3 text-sm"
          >
            ▸ FINAL RESULT
          </button>
        )}
      </div>
      <TutorialTip tutorialKey="match-end" steps={MATCH_END_STEPS} />
    </div>
  );
}
