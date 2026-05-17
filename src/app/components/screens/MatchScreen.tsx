import { useCallback, useEffect, useMemo, useState, createContext, useContext } from 'react';
import { useNavigate } from 'react-router';
import { useGame } from '../../context/GameContext';
import { ALL_ATTACKERS, ALL_DEFENDERS, ALL_ACTIONS } from '../../data/cards';
import { TossPhase } from './match/TossPhase';
import { ScenarioPhase } from './match/ScenarioPhase';
import { PlayPhase } from './match/PlayPhase';
import { RoundResultPhase } from './match/RoundResultPhase';
import { MatchEndPhase } from './match/MatchEndPhase';
import { PenaltyPhase } from './match/PenaltyPhase';
import { FinalResultPhase } from './match/FinalResultPhase';
import { ConfirmDialog } from '../ConfirmDialog';

interface MatchNavContextValue {
  requestQuit: () => void;
}
const MatchNavContext = createContext<MatchNavContextValue | null>(null);
export function useMatchNav() {
  const ctx = useContext(MatchNavContext);
  if (!ctx) throw new Error('useMatchNav must be used within MatchScreen');
  return ctx;
}

export function MatchScreen() {
  const { state, dispatch } = useGame();
  const navigate = useNavigate();
  const [confirmQuit, setConfirmQuit] = useState(false);

  const startFreshMatch = useCallback(() => {
    const opponentAttackers = [...ALL_ATTACKERS].sort(() => Math.random() - 0.5).slice(0, 2);
    const opponentDefenders = [...ALL_DEFENDERS].sort(() => Math.random() - 0.5).slice(0, 2);
    const opponentActions = [...ALL_ACTIONS].sort(() => Math.random() - 0.5).slice(0, 6);

    dispatch({ type: 'START_MATCH', opponentAttackers, opponentDefenders, opponentActions });
  }, [dispatch]);

  const invalidMatchState = useMemo(() => {
    const hasNoResult = state.roundResults.length === 0;

    return (
      (state.phase === 'play' && !state.currentScenario) ||
      ((state.phase === 'resolving' || state.phase === 'round-result') && hasNoResult) ||
      ((state.phase === 'match-end' || state.phase === 'final') && hasNoResult)
    );
  }, [state.currentScenario, state.phase, state.roundResults.length]);

  useEffect(() => {
    if (state.phase === 'idle' || invalidMatchState) {
      startFreshMatch();
    }
  }, [state.phase, invalidMatchState, startFreshMatch]);

  const matchInProgress =
    state.phase !== 'idle' &&
    state.phase !== 'final' &&
    state.phase !== 'match-end';

  const requestQuit = () => {
    if (matchInProgress) setConfirmQuit(true);
    else {
      dispatch({ type: 'RESET' });
      navigate('/');
    }
  };

  const confirmAndQuit = () => {
    setConfirmQuit(false);
    dispatch({ type: 'RESET' });
    navigate('/');
  };

  const renderPhase = () => {
    switch (state.phase) {
      case 'toss':
      case 'toss-result':
        return <TossPhase />;
      case 'scenario':
        return <ScenarioPhase />;
      case 'play':
        return <PlayPhase />;
      case 'resolving':
      case 'round-result':
        return <RoundResultPhase />;
      case 'match-end':
        return <MatchEndPhase />;
      case 'penalty':
        return <PenaltyPhase />;
      case 'final':
        return <FinalResultPhase />;
      default:
        return (
          <div className="min-h-screen bg-[#0D111A] flex items-center justify-center">
            <div className="text-[#5CDFFF] text-sm tracking-wider animate-pulse">LOADING MATCH...</div>
          </div>
        );
    }
  };

  return (
    <MatchNavContext.Provider value={{ requestQuit }}>
      {renderPhase()}
      <ConfirmDialog
        open={confirmQuit}
        title="Quit Match?"
        message="Your current match progress will be lost."
        confirmLabel="Quit"
        cancelLabel="Keep Playing"
        destructive
        onConfirm={confirmAndQuit}
        onCancel={() => setConfirmQuit(false)}
      />
    </MatchNavContext.Provider>
  );
}
