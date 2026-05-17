import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { useGame } from '../../../context/GameContext';
import { HeaderBar } from '../../HeaderBar';
import { useMatchNav } from '../MatchScreen';
import { TutorialTip } from '../../TutorialTip';
import { GameIcon } from '../../GameIcon';

const PENALTY_STEPS = [
  {
    title: 'Sudden Death',
    body: (
      <>
        Tied match: <span className="text-amber-400">penalty shootout</span>.
        Kicks alternate until someone leads after equal attempts.
      </>
    ),
  },
  {
    title: 'How It Works',
    body: (
      <>
        Tap <span className="neon-cyan">TAKE KICK</span> on your turn. CPU kicks
        auto-fire. Each kick has about a 65-75% score chance.
      </>
    ),
  },
];

export function PenaltyPhase() {
  const { state, dispatch } = useGame();
  const { requestQuit } = useMatchNav();
  const isPlayerTurn = state.penaltyRound % 2 === 0;
  const [cpuThinking, setCpuThinking] = useState(false);

  useEffect(() => {
    if (state.penaltyPhaseOver) return;
    if (!isPlayerTurn) {
      setCpuThinking(true);
      const t = setTimeout(() => {
        setCpuThinking(false);
        dispatch({ type: 'KICK_PENALTY' });
      }, 1100);
      return () => clearTimeout(t);
    }
  }, [state.penaltyRound, isPlayerTurn, state.penaltyPhaseOver, dispatch]);

  return (
    <div className="min-h-screen flex flex-col scanlines">
      <HeaderBar title="Penalty Shootout" subtitle="// Sudden Death" onBack={requestQuit} />

      {/* Penalty score */}
      <div className="bg-gradient-to-r from-[#0a0f1c] via-[#0e1424] to-[#0a0f1c] border-b border-[#1e2538] px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-[#5CDFFF] text-[10px] uppercase tracking-[0.2em] font-mono">[P1]</span>
          <span className="neon-cyan text-2xl tabular-nums font-display">{state.penaltyPlayerScore}</span>
        </div>
        <div className="chip chip-amber flicker"><GameIcon name="soccer" className="text-xs" /> PENALTIES</div>
        <div className="flex items-center gap-2">
          <span className="neon-red text-2xl tabular-nums font-display">{state.penaltyOpponentScore}</span>
          <span className="text-[#ff5a7a] text-[10px] uppercase tracking-[0.2em] font-mono">[E1]</span>
        </div>
      </div>

      {/* Kick grid by team */}
      <div className="bg-[#05080f] px-4 py-3 border-b border-[#1e2538] space-y-2">
        <KickRow label="YOU" color="text-[#5CDFFF]" kicks={state.penaltyKicks.filter(k => k.isPlayerKicking)} />
        <KickRow label="CPU" color="text-[#ff5a7a]" kicks={state.penaltyKicks.filter(k => !k.isPlayerKicking)} />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6 gap-4 relative">
        <div className="absolute inset-0 bg-[#ffb13d]/5 blur-[100px] pointer-events-none" />

        {!state.penaltyPhaseOver && (
          <>
            <GameIcon
              name={isPlayerTurn ? 'soccer' : 'hand'}
              className="text-6xl z-10 text-[#5CDFFF] drop-shadow-[0_0_20px_rgba(92,223,255,0.5)]"
            />
            <div className="chip z-10">
              KICK #{state.penaltyRound + 1} // {isPlayerTurn ? 'YOUR TURN' : "CPU'S TURN"}
            </div>
            {isPlayerTurn ? (
              <button
                onClick={() => dispatch({ type: 'KICK_PENALTY' })}
                className="cyber-btn clip-cyber-btn px-12 py-3 text-sm z-10"
              >
                <GameIcon name="soccer" className="text-base" /> TAKE KICK
              </button>
            ) : (
              <div className="text-[#5CDFFF]/60 text-[10px] uppercase tracking-[0.3em] flicker font-mono z-10">
                {cpuThinking ? '▸ CPU STEPPING UP...' : '▸ LOADING...'}
              </div>
            )}
          </>
        )}

        {state.penaltyPhaseOver && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-4 z-10">
            <GameIcon
              name={state.penaltyPlayerScore > state.penaltyOpponentScore ? 'trophy' : 'close'}
              className={`text-6xl drop-shadow-[0_0_20px_rgba(92,223,255,0.5)] ${
                state.penaltyPlayerScore > state.penaltyOpponentScore ? 'text-[#5CDFFF]' : 'text-[#ff5a7a]'
              }`}
            />
            <div
              className={`text-xl uppercase tracking-[0.3em] text-center font-display ${
                state.penaltyPlayerScore > state.penaltyOpponentScore ? 'neon-cyan' : 'neon-red'
              }`}
            >
              {state.penaltyPlayerScore > state.penaltyOpponentScore ? '◆ WIN ON PENALTIES' : '◆ LOSS ON PENALTIES'}
            </div>
            <button
              onClick={() => dispatch({ type: 'FINISH_MATCH' })}
              className="cyber-btn clip-cyber-btn px-10 py-3 text-sm mt-2"
            >
              ▸ FINAL RESULT
            </button>
          </motion.div>
        )}
      </div>
      <TutorialTip tutorialKey="penalty" steps={PENALTY_STEPS} />
    </div>
  );
}

function KickRow({ label, color, kicks }: { label: string; color: string; kicks: { result: string }[] }) {
  return (
    <div className="flex items-center gap-2">
      <span className={`${color} text-[10px] uppercase w-8 font-mono tracking-widest`}>{label}</span>
      <div className="flex gap-1 flex-1">
        {Array.from({ length: Math.max(5, kicks.length) }).map((_, i) => {
          const k = kicks[i];
          if (!k) return <div key={i} className="w-6 h-6 border border-[#1e2538] clip-cyber-sm" />;
          return (
            <motion.div
              key={i}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className={`w-6 h-6 flex items-center justify-center text-[10px] border clip-cyber-sm ${
                k.result === 'goal'
                  ? 'border-[#b6ff3d] text-[#b6ff3d] bg-[#b6ff3d]/10 shadow-[0_0_8px_rgba(182,255,61,0.4)]'
                  : 'border-[#ff2e63]/40 text-[#ff5a7a]/70 bg-[#ff2e63]/10'
              }`}
            >
              <GameIcon name={k.result === 'goal' ? 'soccer' : 'close'} className="text-xs" />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
