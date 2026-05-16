import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { useGame } from '../../context/GameContext';
import { ALL_ATTACKERS, ALL_DEFENDERS, ALL_ACTIONS, PlayerCard, ActionCard } from '../../data/cards';
import { PlayerCardComponent } from '../PlayerCardComponent';
import { ActionCardComponent } from '../ActionCardComponent';
import { HeaderBar } from '../HeaderBar';
import { ConfirmDialog } from '../ConfirmDialog';
import { Toast } from '../Toast';
import { TutorialTip } from '../TutorialTip';
import { GameIcon } from '../GameIcon';

const DECK_STEPS = [
  {
    title: 'Build Your Squad',
    body: (
      <>
        Pick <span className="neon-cyan">2 attackers</span>,{' '}
        <span className="neon-cyan">2 defenders</span>, and{' '}
        <span className="neon-cyan">6 action cards</span>. Tabs at the top switch between them.
      </>
    ),
  },
  {
    title: 'Tiers & Risk',
    body: (
      <>
        Card borders show tier — <span className="text-gray-300">silver</span>,{' '}
        <span className="text-amber-400">gold</span>, <span className="neon-magenta">purple</span>.
        Higher tiers hit harder. Cards with <GameIcon name="warning" className="inline text-sm neon-red" /> are risky and can backfire.
      </>
    ),
  },
  {
    title: 'Balance Your Actions',
    body: (
      <>
        Make sure you bring both <span className="text-[#b6ff3d]">attack</span> and{' '}
        <span className="neon-cyan">defense</span> actions — you'll alternate roles every round.
        <span className="neon-magenta"> SPC</span> actions work in either role.
      </>
    ),
  },
  {
    title: 'Save or Start',
    body: (
      <>
        <span className="neon-cyan">Save</span> stores your deck for later.{' '}
        <span className="neon-cyan">▸ Start</span> saves and jumps straight into a match.
      </>
    ),
  },
];

type Tab = 'attackers' | 'defenders' | 'actions';

export function DeckBuilderScreen() {
  const navigate = useNavigate();
  const { state, dispatch } = useGame();
  const [tab, setTab] = useState<Tab>('attackers');
  const [selAttackers, setSelAttackers] = useState<PlayerCard[]>(state.deckAttackers);
  const [selDefenders, setSelDefenders] = useState<PlayerCard[]>(state.deckDefenders);
  const [selActions, setSelActions] = useState<ActionCard[]>(state.deckActions);
  const [confirmReset, setConfirmReset] = useState(false);
  const [confirmExit, setConfirmExit] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const initialDeck = useMemo(
    () => ({ a: state.deckAttackers, d: state.deckDefenders, ac: state.deckActions }),
    []
  );

  const dirty =
    selAttackers !== initialDeck.a || selDefenders !== initialDeck.d || selActions !== initialDeck.ac;

  const toggleAttacker = (c: PlayerCard) => {
    if (selAttackers.find(a => a.id === c.id)) setSelAttackers(selAttackers.filter(a => a.id !== c.id));
    else if (selAttackers.length < 2) setSelAttackers([...selAttackers, c]);
    else setToast('Attackers full (2/2)');
  };
  const toggleDefender = (c: PlayerCard) => {
    if (selDefenders.find(a => a.id === c.id)) setSelDefenders(selDefenders.filter(a => a.id !== c.id));
    else if (selDefenders.length < 2) setSelDefenders([...selDefenders, c]);
    else setToast('Defenders full (2/2)');
  };
  const toggleAction = (c: ActionCard) => {
    if (selActions.find(a => a.id === c.id)) setSelActions(selActions.filter(a => a.id !== c.id));
    else if (selActions.length < 6) setSelActions([...selActions, c]);
    else setToast('Actions full (6/6)');
  };

  // Action balance hint
  const actionAtk = selActions.filter(a => a.category === 'attack').length;
  const actionDef = selActions.filter(a => a.category === 'defense').length;
  const actionImbalanced =
    selActions.length === 6 && (actionAtk === 0 || actionDef === 0);

  const deckValid = selAttackers.length === 2 && selDefenders.length === 2 && selActions.length === 6;

  const saveDeck = () => {
    dispatch({ type: 'SET_DECK', attackers: selAttackers, defenders: selDefenders, actions: selActions });
  };

  const handleBack = () => {
    if (dirty) setConfirmExit(true);
    else navigate(-1);
  };

  const tabs: { key: Tab; label: string; count: string; ok: boolean }[] = [
    { key: 'attackers', label: 'ATK', count: `${selAttackers.length}/2`, ok: selAttackers.length === 2 },
    { key: 'defenders', label: 'DEF', count: `${selDefenders.length}/2`, ok: selDefenders.length === 2 },
    { key: 'actions', label: 'ACT', count: `${selActions.length}/6`, ok: selActions.length === 6 },
  ];

  return (
    <div className="min-h-screen bg-[#0D111A] flex flex-col">
      <HeaderBar
        title="Deck Builder"
        subtitle={dirty ? 'Unsaved changes' : 'Saved'}
        onBack={handleBack}
        rightSlot={
          dirty && (
            <span className="text-yellow-400 text-[10px] uppercase tracking-wider">●</span>
          )
        }
      />

      {/* Summary */}
      <div className="bg-gradient-to-r from-[#0a0f1c] via-[#0e1424] to-[#0a0f1c] px-4 py-2 flex items-center justify-between border-b border-[#1e2538]">
        <div className="flex gap-2">
          <span className={`chip ${selAttackers.length === 2 ? 'chip-lime' : ''}`}>ATK {selAttackers.length}/2</span>
          <span className={`chip ${selDefenders.length === 2 ? 'chip-lime' : ''}`}>DEF {selDefenders.length}/2</span>
          <span className={`chip ${selActions.length === 6 ? 'chip-lime' : ''}`}>ACT {selActions.length}/6</span>
        </div>
        {deckValid && <span className="chip chip-lime flicker">● READY</span>}
      </div>

      {actionImbalanced && (
        <div className="bg-[#ffb13d]/10 border-b border-[#ffb13d]/40 px-4 py-2 text-[#ffb13d] text-[11px] text-center font-mono uppercase tracking-widest">
          <GameIcon name="warning" className="inline text-sm" /> Add at least one {actionAtk === 0 ? 'attack' : 'defense'} action - you'll need it!
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-[#1e2538] bg-[#0a0f1c]">
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex-1 py-3 text-xs uppercase tracking-[0.2em] font-mono transition-colors ${
              tab === t.key ? 'tab-active' : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            {t.label} <span className={t.ok ? 'text-[#b6ff3d]' : 'text-gray-600'}>({t.count})</span>
          </button>
        ))}
      </div>

      {/* Cards grid */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="flex flex-wrap gap-3 justify-center">
          {tab === 'attackers' && ALL_ATTACKERS.map(c => (
            <PlayerCardComponent
              key={c.id}
              card={c}
              selected={!!selAttackers.find(a => a.id === c.id)}
              disabled={selAttackers.length >= 2 && !selAttackers.find(a => a.id === c.id)}
              onClick={() => toggleAttacker(c)}
            />
          ))}
          {tab === 'defenders' && ALL_DEFENDERS.map(c => (
            <PlayerCardComponent
              key={c.id}
              card={c}
              selected={!!selDefenders.find(a => a.id === c.id)}
              disabled={selDefenders.length >= 2 && !selDefenders.find(a => a.id === c.id)}
              onClick={() => toggleDefender(c)}
            />
          ))}
          {tab === 'actions' && ALL_ACTIONS.map(c => (
            <ActionCardComponent
              key={c.id}
              card={c}
              selected={!!selActions.find(a => a.id === c.id)}
              disabled={selActions.length >= 6 && !selActions.find(a => a.id === c.id)}
              onClick={() => toggleAction(c)}
            />
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="bg-gradient-to-t from-[#0a0f1c] to-[#0e1424] border-t border-[#1e2538] px-3 py-3 grid grid-cols-3 gap-2">
        <button
          onClick={() => setConfirmReset(true)}
          className="cyber-btn-ghost clip-cyber-btn py-2 text-[11px] tracking-[0.2em] font-mono"
        >
          Reset
        </button>
        <button
          onClick={() => {
            saveDeck();
            setToast('Deck saved ✓');
          }}
          disabled={!dirty}
          className={`clip-cyber-btn py-2 text-[11px] tracking-[0.2em] font-mono transition-colors border ${
            dirty
              ? 'border-[#5CDFFF]/50 text-[#5CDFFF] hover:bg-[#5CDFFF]/10 shadow-[0_0_12px_rgba(92,223,255,0.2)]'
              : 'border-[#1e2538] text-gray-600 cursor-not-allowed'
          }`}
        >
          Save
        </button>
        <button
          onClick={() => {
            if (!deckValid) return;
            saveDeck();
            dispatch({ type: 'RESET' });
            navigate('/match');
          }}
          disabled={!deckValid}
          className={`clip-cyber-btn py-2 text-[11px] tracking-[0.2em] font-mono ${
            deckValid ? 'cyber-btn' : 'bg-[#0a0f1c] border border-[#1e2538] text-gray-600 cursor-not-allowed'
          }`}
        >
          ▸ Start
        </button>
      </div>

      <ConfirmDialog
        open={confirmReset}
        title="Reset Deck?"
        message="Clear all selections in this builder. Your saved deck won't change until you Save."
        confirmLabel="Reset"
        destructive
        onConfirm={() => {
          setSelAttackers([]); setSelDefenders([]); setSelActions([]);
          setConfirmReset(false); setToast('Selections cleared');
        }}
        onCancel={() => setConfirmReset(false)}
      />

      <ConfirmDialog
        open={confirmExit}
        title="Discard Changes?"
        message="You have unsaved deck changes. Leave anyway?"
        confirmLabel="Discard"
        cancelLabel="Stay"
        destructive
        onConfirm={() => { setConfirmExit(false); navigate(-1); }}
        onCancel={() => setConfirmExit(false)}
      />

      <Toast message={toast} onDismiss={() => setToast(null)} />
      <TutorialTip tutorialKey="deck-builder" steps={DECK_STEPS} />
    </div>
  );
}
