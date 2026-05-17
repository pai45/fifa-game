import { motion } from 'motion/react';
import { useNavigate } from 'react-router';
import { useGame } from '../../../context/GameContext';
import { HeaderBar } from '../../HeaderBar';
import { TutorialTip } from '../../TutorialTip';
import { GameIcon } from '../../GameIcon';

const FINAL_STEPS = [
  {
    title: 'Match Archive',
    body: <>Final scoreline, plus penalties if needed, appears here.</>,
  },
  {
    title: 'MVP',
    body: (
      <>
        <span className="text-amber-400">MVP</span> goes to your goal scorer.
      </>
    ),
  },
  {
    title: 'What Next?',
    body: (
      <>
        <span className="neon-cyan">↻ REMATCH</span> uses the same deck.{' '}
        <span className="neon-cyan">HOME</span> exits.{' '}
        <span className="neon-cyan">DECK</span> opens squad tuning.
      </>
    ),
  },
];

export function FinalResultPhase() {
  const { state, dispatch } = useGame();
  const navigate = useNavigate();

  const playerWins =
    state.playerScore > state.opponentScore ||
    (state.playerScore === state.opponentScore && state.penaltyPlayerScore > state.penaltyOpponentScore);

  const mvp = state.roundResults.find(r => r.outcome === 'goal' && r.playerAttacking)?.attackerCard;

  const rematch = () => { dispatch({ type: 'RESET' }); navigate('/match'); };
  const goHome = () => { dispatch({ type: 'RESET' }); navigate('/'); };

  return (
    <div className="min-h-screen flex flex-col scanlines">
      <HeaderBar title="Final Result" subtitle="// Match Archive" />

      <div className="flex-1 overflow-y-auto flex flex-col items-center px-4 py-6 gap-4 relative">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: playerWins
              ? 'radial-gradient(ellipse at 50% 30%, rgba(92,223,255,0.2), transparent 60%)'
              : 'radial-gradient(ellipse at 50% 30%, rgba(255,46,99,0.18), transparent 60%)',
          }}
        />

        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring' }}
          className="z-10"
          style={{ filter: `drop-shadow(0 0 24px ${playerWins ? 'rgba(92,223,255,0.7)' : 'rgba(255,46,99,0.7)'})` }}
        >
          <GameIcon name={playerWins ? 'trophy' : 'broken'} className={`text-7xl ${playerWins ? 'text-[#5CDFFF]' : 'text-[#ff5a7a]'}`} />
        </motion.div>

        <div className={`text-2xl uppercase tracking-[0.3em] font-display z-10 ${playerWins ? 'neon-cyan' : 'neon-red'}`}>
          {playerWins ? '◆ MATCH WON ◆' : '◆ MATCH LOST ◆'}
        </div>

        {/* Score */}
        <div className="cyber-panel clip-cyber px-8 py-4 flex items-center gap-6 z-10">
          <div className="text-center">
            <div className="text-[#5CDFFF] text-[10px] uppercase font-mono tracking-[0.2em]">YOU</div>
            <div className="neon-cyan text-4xl tabular-nums font-display">{state.playerScore}</div>
          </div>
          <div className="text-[#5CDFFF]/40 text-2xl font-display">―</div>
          <div className="text-center">
            <div className="text-[#ff5a7a] text-[10px] uppercase font-mono tracking-[0.2em]">CPU</div>
            <div className="neon-red text-4xl tabular-nums font-display">{state.opponentScore}</div>
          </div>
        </div>

        {state.penaltyKicks.length > 0 && (
          <div className="chip chip-amber z-10">
            PENALTIES // {state.penaltyPlayerScore} - {state.penaltyOpponentScore}
          </div>
        )}

        {mvp && (
          <div className="cyber-panel clip-cyber px-4 py-3 text-center min-w-[200px] z-10" style={{ borderColor: 'rgba(255,177,61,0.4)', boxShadow: '0 0 16px rgba(255,177,61,0.2)' }}>
            <div className="text-amber-400 text-[10px] uppercase tracking-[0.25em] font-mono mb-1">
              <GameIcon name="trophy" className="inline text-sm" /> MVP
            </div>
            <div className="text-white text-sm font-display tracking-wider">
              <GameIcon name={mvp.icon} className="inline text-base text-amber-400" /> {mvp.name}
            </div>
            <div className="text-amber-400/70 text-[10px] font-mono uppercase tracking-widest">{mvp.trait}</div>
          </div>
        )}

        {/* Round summary */}
        <div className="cyber-panel clip-cyber w-full max-w-xs z-10">
          <div className="px-3 py-2 text-[10px] text-[#5CDFFF]/60 uppercase tracking-[0.25em] font-mono border-b border-[#1e2538]">
            ▸ Round Log
          </div>
          {state.roundResults.map(r => (
            <div key={r.round} className="flex items-center justify-between px-3 py-2 text-[11px] border-b border-[#1e2538]/60 last:border-0 font-mono">
              <span className="text-[#5CDFFF]/60 w-6">R{r.round}</span>
              <span className="text-gray-400 flex-1 truncate px-2 uppercase tracking-wider">{r.scenario.title}</span>
              <span className={
                r.outcome === 'goal'
                  ? r.playerAttacking ? 'neon-lime uppercase tracking-widest' : 'neon-red uppercase tracking-widest'
                  : 'text-gray-500 uppercase tracking-widest'
              }>
                {r.outcome.toUpperCase()}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gradient-to-t from-[#05080f] to-[#0e1424] border-t border-[#1e2538] px-3 py-3 grid grid-cols-3 gap-2">
        <button onClick={rematch} className="cyber-btn clip-cyber-btn py-3 text-[11px] tracking-[0.2em]">
          ↻ REMATCH
        </button>
        <button onClick={goHome} className="cyber-btn-ghost clip-cyber-btn py-3 text-[11px] tracking-[0.2em] font-mono">
          HOME
        </button>
        <button onClick={() => navigate('/deck-builder')} className="cyber-btn-ghost clip-cyber-btn py-3 text-[11px] tracking-[0.2em] font-mono">
          DECK
        </button>
      </div>
      <TutorialTip tutorialKey="final" steps={FINAL_STEPS} />
    </div>
  );
}
