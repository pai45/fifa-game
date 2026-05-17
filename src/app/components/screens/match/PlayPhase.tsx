import { useGame } from '../../../context/GameContext';
import { HeaderBar } from '../../HeaderBar';
import { ScoreBar } from '../../ScoreBar';
import { PlayerCardComponent } from '../../PlayerCardComponent';
import { ActionCardComponent } from '../../ActionCardComponent';
import { useMatchNav } from '../MatchScreen';
import { TutorialTip } from '../../TutorialTip';
import { GameIcon } from '../../GameIcon';

const PLAY_STEPS = [
  {
    title: 'Pick Your Player',
    body: (
      <>
        Choose one player. <span className="neon-cyan">OVR</span> is base
        power. Used players are locked for the match.
      </>
    ),
  },
  {
    title: 'Pick an Action',
    body: (
      <>
        Pick one action. Options match your role:
        <span className="text-[#b6ff3d]"> ATK</span> when attacking,{' '}
        <span className="neon-cyan">DEF</span> when defending,{' '}
        <span className="neon-magenta">SPC</span> anytime.
      </>
    ),
  },
  {
    title: 'Risky Cards',
    body: (
      <>
        <GameIcon name="warning" className="inline text-sm neon-red" /> cards
        boost power but can cause fouls or red cards. Red cards remove a player.
      </>
    ),
  },
  {
    title: 'Read the Preview',
    body: (
      <>
        <span className="neon-cyan">EST</span> shows rating + action + scenario
        bonus. CPU power is hidden, and luck still matters.
      </>
    ),
  },
];

export function PlayPhase() {
  const { state, dispatch } = useGame();
  const { requestQuit } = useMatchNav();

  const allPlayerCards = state.playerAttacking ? state.deckAttackers : state.deckDefenders;
  const availablePlayerCards = allPlayerCards.filter(c => !state.redCardedCards.includes(c.id));

  const availableActionCards = state.deckActions.filter(c => {
    if (state.playerAttacking) return c.category === 'attack' || c.category === 'special';
    return c.category === 'defense' || c.category === 'special';
  });

  const canPlay = state.selectedPlayerCard && state.selectedActionCard;

  const statusLabel = !state.selectedPlayerCard
    ? (state.playerAttacking ? '01 / SELECT ATTACKER' : '01 / SELECT DEFENDER')
    : !state.selectedActionCard
    ? '02 / SELECT ACTION'
    : '✓ READY TO EXECUTE';

  const estPower =
    state.selectedPlayerCard && state.selectedActionCard && state.currentScenario
      ? state.selectedPlayerCard.rating +
        state.selectedActionCard.power +
        (state.playerAttacking ? state.currentScenario.attackBonus : state.currentScenario.defenseBonus)
      : null;

  return (
    <div className="min-h-screen flex flex-col">
      <HeaderBar
        title={`Round ${state.currentRound}`}
        subtitle={state.currentScenario?.title}
        onBack={requestQuit}
      />
      <ScoreBar playerScore={state.playerScore} opponentScore={state.opponentScore} round={state.currentRound} />

      {/* Opponent area */}
      <div className="bg-gradient-to-r from-[#0a0f1c] via-[#1a0a18] to-[#0a0f1c] border-b border-[#ff2e63]/30 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="live-dot" />
          <span className="neon-red text-[10px] uppercase tracking-[0.2em] font-mono">
            CPU // <GameIcon name={state.playerAttacking ? 'shield' : 'score'} className="inline text-xs" /> {state.playerAttacking ? 'DEFENDING' : 'ATTACKING'}
          </span>
        </div>
        <div className="flex gap-1">
          <div className="w-8 h-10 border border-[#ff2e63]/40 bg-[#0D111A] flex items-center justify-center text-[#ff5a7a]/60 text-xs clip-cyber-sm font-mono">?</div>
          <div className="w-8 h-10 border border-[#ff2e63]/40 bg-[#0D111A] flex items-center justify-center text-[#ff5a7a]/60 text-xs clip-cyber-sm font-mono">?</div>
        </div>
      </div>

      {/* Status + preview */}
      <div className="bg-[#05080f] px-4 py-3 text-center border-b border-[#1e2538] relative">
        <div className={`text-sm uppercase tracking-[0.25em] font-mono ${canPlay ? 'neon-cyan' : 'text-gray-400'}`}>
          ▸ {statusLabel}
        </div>
        <div className="flex justify-center items-end gap-3 mt-2">
          <div className="flex flex-col items-center gap-1">
            <div className="text-[9px] text-[#5CDFFF]/60 uppercase font-mono tracking-widest">
              {state.playerAttacking ? 'ATKR' : 'DEFR'}
            </div>
            {state.selectedPlayerCard ? (
              <PlayerCardComponent card={state.selectedPlayerCard} selected size="sm" />
            ) : (
              <div className="w-24 h-36 border border-dashed border-[#5CDFFF]/30 flex items-center justify-center text-[#5CDFFF]/30 text-xs clip-cyber-sm">-</div>
            )}
          </div>
          <div className="text-[#5CDFFF]/40 self-center text-lg font-display pb-6">+</div>
          <div className="flex flex-col items-center gap-1">
            <div className="text-[9px] text-[#5CDFFF]/60 uppercase font-mono tracking-widest">ACTION</div>
            {state.selectedActionCard ? (
              <ActionCardComponent card={state.selectedActionCard} selected size="sm" />
            ) : (
              <div className="w-20 h-24 border border-dashed border-[#5CDFFF]/30 flex items-center justify-center text-[#5CDFFF]/30 text-xs clip-cyber-sm">─</div>
            )}
          </div>
        </div>
        {estPower !== null && (
          <div className="mt-3 inline-block cyber-panel clip-cyber-sm px-3 py-1">
            <span className="text-[10px] text-gray-500 uppercase tracking-widest font-mono">
              EST {state.playerAttacking ? 'ATK' : 'DEF'} //{' '}
            </span>
            <span className="neon-cyan font-display">{estPower}</span>
            <span className="text-gray-700 text-[10px] font-mono"> ± luck</span>
          </div>
        )}
      </div>

      {/* Player card selection */}
      <div className="flex-1 overflow-y-auto px-4 py-3">
        <div className="text-[#5CDFFF]/60 text-[10px] uppercase tracking-[0.25em] font-mono mb-2 flex items-center justify-between">
          <span>▸ {state.playerAttacking ? 'ATKR ROSTER' : 'DEFR ROSTER'}</span>
          <span className="text-gray-700">{availablePlayerCards.length}/{allPlayerCards.length}</span>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-3 -mx-1 px-1">
          {availablePlayerCards.length > 0 ? availablePlayerCards.map(c => (
            <PlayerCardComponent
              key={c.id}
              card={c}
              selected={state.selectedPlayerCard?.id === c.id}
              onClick={() => dispatch({ type: 'SELECT_PLAYER_CARD', card: c })}
              size="sm"
            />
          )) : (
            <div className="w-full text-center text-[#ff5a7a] text-xs py-6 border border-[#ff2e63]/40 bg-[#ff2e63]/10 clip-cyber-sm font-mono uppercase tracking-widest">
              <GameIcon name="warning" className="inline text-sm" /> ROSTER DEPLETED
            </div>
          )}
        </div>

        <div className="text-[#5CDFFF]/60 text-[10px] uppercase tracking-[0.25em] font-mono mb-2 mt-3 flex items-center justify-between">
          <span>▸ {state.playerAttacking ? 'ATTACK ACTIONS' : 'DEFENSE ACTIONS'}</span>
          <span className="text-gray-700">{availableActionCards.length} avail</span>
        </div>
        <div className="grid grid-cols-3 gap-2 pb-3">
          {availableActionCards.map(c => (
            <div key={c.id} className="flex justify-center">
              <ActionCardComponent
                card={c}
                selected={state.selectedActionCard?.id === c.id}
                onClick={() => dispatch({ type: 'SELECT_ACTION_CARD', card: c })}
                size="sm"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Play button */}
      <div className="bg-gradient-to-t from-[#05080f] to-[#0e1424] border-t border-[#1e2538] px-4 py-3 sticky bottom-0">
        <button
          onClick={() => canPlay && dispatch({ type: 'PLAY_MOVE' })}
          disabled={!canPlay}
          className={`clip-cyber-btn w-full py-3 text-sm tracking-[0.25em] font-display ${
            canPlay
              ? 'cyber-btn'
              : 'bg-[#0a0f1c] border border-[#1e2538] text-gray-600 cursor-not-allowed uppercase'
          }`}
        >
          {canPlay ? '▸ EXECUTE MOVE' : statusLabel}
        </button>
      </div>
      <TutorialTip tutorialKey="play" steps={PLAY_STEPS} />
    </div>
  );
}
