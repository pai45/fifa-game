import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { PlayerCard, ActionCard, Scenario, SCENARIOS, ALL_ATTACKERS, ALL_DEFENDERS, ALL_ACTIONS } from '../data/cards';

export type MatchPhase = 'idle' | 'toss' | 'toss-result' | 'scenario' | 'play' | 'resolving' | 'round-result' | 'match-end' | 'penalty' | 'final';
export type RoundOutcome = 'goal' | 'saved' | 'blocked' | 'missed' | 'foul' | 'red-card';

export interface RoundResult {
  round: number;
  attackerCard: PlayerCard;
  defenderCard: PlayerCard;
  attackAction: ActionCard;
  defenseAction: ActionCard;
  outcome: RoundOutcome;
  playerAttacking: boolean;
  scenario: Scenario;
}

export interface PenaltyKick {
  kickNumber: number;
  isPlayerKicking: boolean;
  result: 'goal' | 'saved' | 'missed';
}

export interface GameState {
  // Deck
  deckAttackers: PlayerCard[];
  deckDefenders: PlayerCard[];
  deckActions: ActionCard[];

  // Match state
  phase: MatchPhase;
  currentRound: number;
  playerScore: number;
  opponentScore: number;
  playerAttacking: boolean;
  currentScenario: Scenario | null;
  tossChoice: 'heads' | 'tails' | null;
  tossResult: 'heads' | 'tails' | null;
  playerWonToss: boolean;
  initialAttackingChoice: boolean | null; // Tracks who attacked in round 1

  // Selections
  selectedPlayerCard: PlayerCard | null;
  selectedActionCard: ActionCard | null;

  // Used / disabled
  usedPlayerCards: string[];
  usedActionCards: string[];
  redCardedCards: string[];

  // Results
  roundResults: RoundResult[];

  // Opponent cards (AI)
  opponentAttackers: PlayerCard[];
  opponentDefenders: PlayerCard[];
  opponentActions: ActionCard[];
  opponentUsedPlayerCards: string[];
  opponentUsedActionCards: string[];
  opponentRedCarded: string[];

  // Penalty
  penaltyKicks: PenaltyKick[];
  penaltyPlayerScore: number;
  penaltyOpponentScore: number;
  penaltyRound: number;
  penaltyPhaseOver: boolean;
}

type Action =
  | { type: 'SET_DECK'; attackers: PlayerCard[]; defenders: PlayerCard[]; actions: ActionCard[] }
  | { type: 'START_MATCH'; opponentAttackers: PlayerCard[]; opponentDefenders: PlayerCard[]; opponentActions: ActionCard[] }
  | { type: 'SET_TOSS_CHOICE'; choice: 'heads' | 'tails' }
  | { type: 'RESOLVE_TOSS' }
  | { type: 'CHOOSE_ROLE'; attacking: boolean }
  | { type: 'SHOW_SCENARIO' }
  | { type: 'START_PLAY' }
  | { type: 'SELECT_PLAYER_CARD'; card: PlayerCard }
  | { type: 'SELECT_ACTION_CARD'; card: ActionCard }
  | { type: 'PLAY_MOVE' }
  | { type: 'NEXT_ROUND' }
  | { type: 'GO_TO_PENALTY' }
  | { type: 'KICK_PENALTY' }
  | { type: 'FINISH_MATCH' }
  | { type: 'RESET' };

const initialState: GameState = {
  deckAttackers: [ALL_ATTACKERS[0], ALL_ATTACKERS[1]],
  deckDefenders: [ALL_DEFENDERS[0], ALL_DEFENDERS[1]],
  deckActions: [ALL_ACTIONS[0], ALL_ACTIONS[1], ALL_ACTIONS[5], ALL_ACTIONS[6], ALL_ACTIONS[7], ALL_ACTIONS[14]],
  phase: 'idle',
  currentRound: 1,
  playerScore: 0,
  opponentScore: 0,
  playerAttacking: true,
  currentScenario: null,
  tossChoice: null,
  tossResult: null,
  playerWonToss: false,
  initialAttackingChoice: null,
  selectedPlayerCard: null,
  selectedActionCard: null,
  usedPlayerCards: [],
  usedActionCards: [],
  redCardedCards: [],
  roundResults: [],
  opponentAttackers: [],
  opponentDefenders: [],
  opponentActions: [],
  opponentUsedPlayerCards: [],
  opponentUsedActionCards: [],
  opponentRedCarded: [],
  penaltyKicks: [],
  penaltyPlayerScore: 0,
  penaltyOpponentScore: 0,
  penaltyRound: 0,
  penaltyPhaseOver: false,
};

function getRandomScenario(usedIds: string[]): Scenario {
  const available = SCENARIOS.filter(s => !usedIds.includes(s.id));
  if (available.length === 0) return SCENARIOS[Math.floor(Math.random() * SCENARIOS.length)];
  return available[Math.floor(Math.random() * available.length)];
}

function resolveRound(
  attackerCard: PlayerCard,
  defenderCard: PlayerCard,
  attackAction: ActionCard,
  defenseAction: ActionCard,
  scenario: Scenario
): RoundOutcome {
  const attackPower = attackerCard.rating + attackAction.power + scenario.attackBonus + Math.random() * 20;
  const defensePower = defenderCard.rating + defenseAction.power + scenario.defenseBonus + Math.random() * 20;

  // Red card check for risky actions (balanced at 12% for both)
  if (defenseAction.risky && Math.random() < 0.12) return 'red-card';
  if (attackAction.risky && Math.random() < 0.12) return 'foul';

  const diff = attackPower - defensePower;
  const roll = Math.random();

  // Balanced probabilities based on power difference
  if (diff > 15) {
    // Big attack advantage: 75% goal, 20% saved, 5% blocked
    if (roll < 0.75) return 'goal';
    if (roll < 0.95) return 'saved';
    return 'blocked';
  } else if (diff > 5) {
    // Moderate attack advantage: 60% goal, 30% saved, 10% missed
    if (roll < 0.60) return 'goal';
    if (roll < 0.90) return 'saved';
    return 'missed';
  } else if (diff > -5) {
    // Balanced: 45% goal, 35% saved, 20% missed/blocked
    if (roll < 0.45) return 'goal';
    if (roll < 0.80) return 'saved';
    return Math.random() > 0.5 ? 'missed' : 'blocked';
  } else if (diff > -15) {
    // Moderate defense advantage: 65% saved, 25% blocked, 10% goal
    if (roll < 0.65) return 'saved';
    if (roll < 0.90) return 'blocked';
    return 'goal';
  } else {
    // Big defense advantage: 75% saved, 20% blocked, 5% goal
    if (roll < 0.75) return 'saved';
    if (roll < 0.95) return 'blocked';
    return 'goal';
  }
}

function gameReducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case 'SET_DECK':
      return { ...state, deckAttackers: action.attackers, deckDefenders: action.defenders, deckActions: action.actions };

    case 'START_MATCH':
      return {
        ...initialState,
        deckAttackers: state.deckAttackers,
        deckDefenders: state.deckDefenders,
        deckActions: state.deckActions,
        opponentAttackers: action.opponentAttackers,
        opponentDefenders: action.opponentDefenders,
        opponentActions: action.opponentActions,
        phase: 'toss',
        currentRound: 1,
      };

    case 'SET_TOSS_CHOICE':
      return { ...state, tossChoice: action.choice };

    case 'RESOLVE_TOSS': {
      const result = Math.random() > 0.5 ? 'heads' : 'tails';
      const won = result === state.tossChoice;
      return { ...state, tossResult: result, playerWonToss: won, phase: 'toss-result' };
    }

    case 'CHOOSE_ROLE':
      // Save the initial choice only in round 1
      const initialChoice = state.currentRound === 1 ? action.attacking : state.initialAttackingChoice;
      return { ...state, playerAttacking: action.attacking, initialAttackingChoice: initialChoice, phase: 'scenario' };

    case 'SHOW_SCENARIO': {
      const usedScenarios = state.roundResults.map(r => r.scenario.id);
      return { ...state, currentScenario: getRandomScenario(usedScenarios), phase: 'scenario' };
    }

    case 'START_PLAY':
      return { ...state, phase: 'play', selectedPlayerCard: null, selectedActionCard: null };

    case 'SELECT_PLAYER_CARD':
      return { ...state, selectedPlayerCard: action.card };

    case 'SELECT_ACTION_CARD':
      return { ...state, selectedActionCard: action.card };

    case 'PLAY_MOVE': {
      if (!state.selectedPlayerCard || !state.selectedActionCard || !state.currentScenario) return state;

      // AI picks cards
      const availableOppPlayers = state.playerAttacking
        ? state.opponentDefenders.filter(c => !state.opponentRedCarded.includes(c.id))
        : state.opponentAttackers.filter(c => !state.opponentRedCarded.includes(c.id));
      const availableOppActions = state.opponentActions;

      const oppPlayer = availableOppPlayers[Math.floor(Math.random() * availableOppPlayers.length)] || (state.playerAttacking ? state.opponentDefenders[0] : state.opponentAttackers[0]);
      const oppAction = availableOppActions[Math.floor(Math.random() * availableOppActions.length)] || state.opponentActions[0];

      const attackerCard = state.playerAttacking ? state.selectedPlayerCard : oppPlayer;
      const defenderCard = state.playerAttacking ? oppPlayer : state.selectedPlayerCard;
      const attackAction = state.playerAttacking ? state.selectedActionCard : oppAction;
      const defenseAction = state.playerAttacking ? oppAction : state.selectedActionCard;

      const outcome = resolveRound(attackerCard, defenderCard, attackAction, defenseAction, state.currentScenario);

      let pScore = state.playerScore;
      let oScore = state.opponentScore;
      if (outcome === 'goal') {
        if (state.playerAttacking) pScore++;
        else oScore++;
      }

      const newRedCarded = [...state.redCardedCards];
      const oppNewRedCarded = [...state.opponentRedCarded];
      if (outcome === 'red-card') {
        if (!state.playerAttacking) {
          // Player was defending with risky action
          // Actually red card hits the defender (could be player or opponent)
          oppNewRedCarded.push(oppPlayer.id);
        } else {
          oppNewRedCarded.push(oppPlayer.id);
        }
      }

      const result: RoundResult = {
        round: state.currentRound,
        attackerCard,
        defenderCard,
        attackAction,
        defenseAction,
        outcome,
        playerAttacking: state.playerAttacking,
        scenario: state.currentScenario,
      };

      return {
        ...state,
        phase: 'round-result',
        playerScore: pScore,
        opponentScore: oScore,
        usedPlayerCards: [...state.usedPlayerCards, state.selectedPlayerCard.id],
        usedActionCards: [...state.usedActionCards, state.selectedActionCard.id],
        opponentUsedPlayerCards: [...state.opponentUsedPlayerCards, oppPlayer.id],
        opponentUsedActionCards: [...state.opponentUsedActionCards, oppAction.id],
        redCardedCards: newRedCarded,
        opponentRedCarded: oppNewRedCarded,
        roundResults: [...state.roundResults, result],
      };
    }

    case 'NEXT_ROUND': {
      if (state.currentRound >= 4) {
        return { ...state, phase: 'match-end' };
      }

      const nextRound = state.currentRound + 1;

      // Alternate attacking side after round 1
      // Round 1: based on toss result
      // Round 2: opposite of round 1
      // Round 3: same as round 1
      // Round 4: opposite of round 1
      let nextPlayerAttacking = state.playerAttacking;
      if (state.initialAttackingChoice !== null) {
        // Alternate: if nextRound is even, use opposite of initial choice
        nextPlayerAttacking = (nextRound % 2 === 0) ? !state.initialAttackingChoice : state.initialAttackingChoice;
      }

      return {
        ...state,
        currentRound: nextRound,
        phase: 'scenario', // Skip toss, go directly to scenario
        playerAttacking: nextPlayerAttacking,
        selectedPlayerCard: null,
        selectedActionCard: null,
        currentScenario: null,
      };
    }

    case 'GO_TO_PENALTY':
      return { ...state, phase: 'penalty', penaltyRound: 0, penaltyKicks: [], penaltyPlayerScore: 0, penaltyOpponentScore: 0, penaltyPhaseOver: false };

    case 'KICK_PENALTY': {
      const isPlayerKicking = state.penaltyRound % 2 === 0;
      const chance = 0.65 + Math.random() * 0.1;
      const scored = Math.random() < chance;
      const result = scored ? 'goal' as const : (Math.random() > 0.5 ? 'saved' as const : 'missed' as const);

      const kick: PenaltyKick = { kickNumber: state.penaltyRound + 1, isPlayerKicking, result };
      const newKicks = [...state.penaltyKicks, kick];
      const pPen = state.penaltyPlayerScore + (isPlayerKicking && result === 'goal' ? 1 : 0);
      const oPen = state.penaltyOpponentScore + (!isPlayerKicking && result === 'goal' ? 1 : 0);
      const newRound = state.penaltyRound + 1;

      // Check if shootout is decided (after both have kicked equal times, min 6 kicks)
      let over = false;
      if (newRound >= 6 && newRound % 2 === 0) {
        if (pPen !== oPen) over = true;
      }
      // Sudden death after 6
      if (newRound >= 6 && newRound % 2 === 0 && pPen !== oPen) over = true;
      // Can't catch up check
      if (newRound >= 6 && newRound % 2 === 1) {
        const playerKicked = Math.ceil(newRound / 2);
        const oppKicked = Math.floor(newRound / 2);
        const remainP = Math.max(0, 3 - playerKicked);
        const remainO = Math.max(0, 3 - oppKicked);
        if (pPen > oPen + remainO || oPen > pPen + remainP) over = true;
      }

      return {
        ...state,
        penaltyKicks: newKicks,
        penaltyPlayerScore: pPen,
        penaltyOpponentScore: oPen,
        penaltyRound: newRound,
        penaltyPhaseOver: over,
      };
    }

    case 'FINISH_MATCH':
      return { ...state, phase: 'final' };

    case 'RESET':
      return { ...initialState, deckAttackers: state.deckAttackers, deckDefenders: state.deckDefenders, deckActions: state.deckActions };

    default:
      return state;
  }
}

const GameContext = createContext<{ state: GameState; dispatch: React.Dispatch<Action> } | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  return <GameContext.Provider value={{ state, dispatch }}>{children}</GameContext.Provider>;
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used within GameProvider');
  return ctx;
}