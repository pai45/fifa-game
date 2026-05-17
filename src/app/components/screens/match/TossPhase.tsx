import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { useGame } from '../../../context/GameContext';
import { HeaderBar } from '../../HeaderBar';
import { ScoreBar } from '../../ScoreBar';
import { useMatchNav } from '../MatchScreen';
import { TutorialTip } from '../../TutorialTip';
import { GameIcon } from '../../GameIcon';

const TOSS_STEPS = [
  {
    title: 'Coin Toss',
    body: (
      <>
        Pick <span className="neon-cyan">HEADS</span> or <span className="neon-cyan">TAILS</span>.
        The winner chooses attack or defense for round 1.
      </>
    ),
  },
  {
    title: 'Roles Alternate',
    body: (
      <>
        This is the <span className="text-[#b6ff3d]">only toss</span>. After
        round 1, roles flip automatically each round.
      </>
    ),
  },
];

export function TossPhase() {
  const { state, dispatch } = useGame();
  const { requestQuit } = useMatchNav();
  const [opponentChoice, setOpponentChoice] = useState<boolean | null>(null);

  const handleToss = () => {
    if (!state.tossChoice) return;
    dispatch({ type: 'RESOLVE_TOSS' });
  };

  const handleChooseRole = (attacking: boolean) => {
    dispatch({ type: 'CHOOSE_ROLE', attacking });
  };

  useEffect(() => {
    if (state.phase === 'toss-result' && !state.playerWonToss && opponentChoice === null) {
      setOpponentChoice(Math.random() > 0.5);
    }
  }, [state.phase, state.playerWonToss, opponentChoice]);

  useEffect(() => {
    if (state.phase !== 'toss-result' || state.playerWonToss || opponentChoice === null) return;

    const t = setTimeout(() => {
      dispatch({ type: 'CHOOSE_ROLE', attacking: !opponentChoice });
    }, 1800);

    return () => clearTimeout(t);
  }, [state.phase, state.playerWonToss, opponentChoice, dispatch]);

  return (
    <div className="min-h-screen flex flex-col scanlines">
      <HeaderBar title={`Round ${state.currentRound}`} subtitle="// Coin Toss Protocol" onBack={requestQuit} />
      <ScoreBar playerScore={state.playerScore} opponentScore={state.opponentScore} round={state.currentRound} />

      <div className="flex-1 flex flex-col items-center justify-center px-6 gap-6 relative">
        <div className="absolute inset-0 bg-[#5CDFFF]/5 blur-[100px] pointer-events-none" />

        {state.phase === 'toss' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-6 z-10">
            <div className="text-[10px] text-[#5CDFFF]/60 font-mono uppercase tracking-[0.3em]">▸ Initiating Toss</div>
            <div className="relative">
              <GameIcon name="coin" className="text-6xl text-[#5CDFFF] drop-shadow-[0_0_20px_rgba(92,223,255,0.5)]" />
              <div className="absolute -inset-4 border border-[#5CDFFF]/30 clip-cyber pointer-events-none" />
            </div>
            <p className="neon-cyan text-xs uppercase tracking-[0.3em] font-mono">Select Your Call</p>
            <div className="flex gap-3">
              {(['heads', 'tails'] as const).map(choice => (
                <button
                  key={choice}
                  onClick={() => dispatch({ type: 'SET_TOSS_CHOICE', choice })}
                  className={`w-28 py-3 text-sm uppercase tracking-[0.25em] font-mono clip-cyber-btn border transition-all ${
                    state.tossChoice === choice
                      ? 'border-[#5CDFFF] neon-cyan bg-[#5CDFFF]/10 shadow-[0_0_18px_rgba(92,223,255,0.35)]'
                      : 'border-[#1e2538] text-gray-400 hover:border-[#5CDFFF]/40 hover:text-[#5CDFFF]'
                  }`}
                >
                  {choice}
                </button>
              ))}
            </div>
            <button
              onClick={handleToss}
              disabled={!state.tossChoice}
              className={`clip-cyber-btn px-10 py-3 text-sm ${state.tossChoice ? 'cyber-btn' : 'bg-[#0e1424] border border-[#1e2538] text-gray-600 cursor-not-allowed'}`}
            >
              ▸ FLIP COIN
            </button>
          </motion.div>
        )}

        {state.phase === 'toss-result' && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center gap-5 z-10">
            <motion.div
              initial={{ rotateY: 0 }}
              animate={{ rotateY: 720 }}
              transition={{ duration: 0.6 }}
              className="text-6xl drop-shadow-[0_0_20px_rgba(92,223,255,0.6)]"
            >
              <GameIcon name="coin" className="text-6xl text-[#5CDFFF]" />
            </motion.div>
            <div className="text-center">
              <p className="text-[10px] text-[#5CDFFF]/60 font-mono uppercase tracking-[0.3em] mb-1">
                Result // {state.tossResult}
              </p>
              <p className={`text-lg uppercase tracking-[0.2em] font-display ${state.playerWonToss ? 'neon-cyan' : 'neon-red'}`}>
                {state.playerWonToss ? 'YOU WON THE TOSS' : 'OPPONENT WINS TOSS'}
              </p>
            </div>

            {state.playerWonToss ? (
              <div className="flex flex-col items-center gap-3 mt-2">
                <p className="text-[#5CDFFF]/70 text-[11px] uppercase tracking-[0.3em] font-mono">▸ Choose Your Side</p>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleChooseRole(true)}
                    className="clip-cyber-btn w-32 py-3 text-sm uppercase tracking-[0.2em] font-display border border-[#b6ff3d] text-[#b6ff3d] bg-[#b6ff3d]/10 hover:bg-[#b6ff3d]/20 shadow-[0_0_18px_rgba(182,255,61,0.3)] transition-all"
                  >
                    <GameIcon name="score" className="text-base" /> ATTACK
                  </button>
                  <button
                    onClick={() => handleChooseRole(false)}
                    className="clip-cyber-btn w-32 py-3 text-sm uppercase tracking-[0.2em] font-display border border-[#5CDFFF] neon-cyan bg-[#5CDFFF]/10 hover:bg-[#5CDFFF]/20 shadow-[0_0_18px_rgba(92,223,255,0.3)] transition-all"
                  >
                    <GameIcon name="shield" className="text-base" /> DEFEND
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 mt-2">
                <p className="text-[#5CDFFF]/60 text-[10px] uppercase tracking-[0.3em] font-mono">▸ Opponent Computing...</p>
                {opponentChoice !== null && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`clip-cyber-sm px-4 py-2 text-sm uppercase tracking-[0.2em] font-display border ${
                      opponentChoice
                        ? 'border-[#ff2e63] text-[#ff5a7a] bg-[#ff2e63]/10 shadow-[0_0_14px_rgba(255,46,99,0.3)]'
                        : 'border-[#5CDFFF] neon-cyan bg-[#5CDFFF]/10'
                    }`}
                  >
                    CPU → {opponentChoice ? 'ATTACK' : 'DEFEND'}
                  </motion.div>
                )}
                <div className="text-[#5CDFFF]/40 text-[10px] uppercase mt-1 font-mono tracking-[0.3em] flicker">▸ Loading round...</div>
              </div>
            )}
          </motion.div>
        )}
      </div>
      <TutorialTip tutorialKey="toss" steps={TOSS_STEPS} />
    </div>
  );
}
