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

const STORAGE_KEY = 'pd_deck_slots_v1';

const DECK_STEPS = [
  {
    title: 'Build a 5-a-side',
    body: (
      <>
        Shape the pitch with <span className="neon-cyan">2 ATK</span>,{' '}
        <span className="neon-cyan">2 DEF</span>, and <span className="neon-cyan">6 actions</span>.
      </>
    ),
  },
  {
    title: 'Edit, Save, Play',
    body: (
      <>
        Tap <span className="neon-cyan">Edit</span> to change the deck, save it, then play
        when the squad is ready.
      </>
    ),
  },
];

type Tab = 'attackers' | 'defenders' | 'actions';

interface DeckSlot {
  id: string;
  name: string;
  attackers: PlayerCard[];
  defenders: PlayerCard[];
  actions: ActionCard[];
}

interface StoredDeckSlot {
  id: string;
  name: string;
  attackers: string[];
  defenders: string[];
  actions: string[];
}

function hydrateDeck(slot: StoredDeckSlot): DeckSlot {
  return {
    id: slot.id,
    name: slot.name,
    attackers: slot.attackers.map(id => ALL_ATTACKERS.find(card => card.id === id)).filter(Boolean) as PlayerCard[],
    defenders: slot.defenders.map(id => ALL_DEFENDERS.find(card => card.id === id)).filter(Boolean) as PlayerCard[],
    actions: slot.actions.map(id => ALL_ACTIONS.find(card => card.id === id)).filter(Boolean) as ActionCard[],
  };
}

function serializeDeck(slot: DeckSlot): StoredDeckSlot {
  return {
    id: slot.id,
    name: slot.name,
    attackers: slot.attackers.map(card => card.id),
    defenders: slot.defenders.map(card => card.id),
    actions: slot.actions.map(card => card.id),
  };
}

function loadDeckSlots(fallback: DeckSlot): DeckSlot[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [fallback];
    const decks = (JSON.parse(raw) as StoredDeckSlot[]).map(hydrateDeck).filter(deck => deck.id);
    return decks.length ? decks : [fallback];
  } catch {
    return [fallback];
  }
}

function saveDeckSlots(slots: DeckSlot[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(slots.map(serializeDeck)));
}

export function DeckBuilderScreen() {
  const navigate = useNavigate();
  const { state, dispatch } = useGame();
  const defaultDeck = useMemo<DeckSlot>(
    () => ({
      id: 'deck-default',
      name: 'All Star',
      attackers: state.deckAttackers,
      defenders: state.deckDefenders,
      actions: state.deckActions,
    }),
    []
  );
  const initialDecks = useMemo(() => loadDeckSlots(defaultDeck), [defaultDeck]);

  const [decks, setDecks] = useState<DeckSlot[]>(initialDecks);
  const [activeDeckId, setActiveDeckId] = useState(initialDecks[0].id);
  const activeDeck = decks.find(deck => deck.id === activeDeckId) ?? decks[0];
  const [tab, setTab] = useState<Tab>('attackers');
  const [selAttackers, setSelAttackers] = useState<PlayerCard[]>(activeDeck.attackers);
  const [selDefenders, setSelDefenders] = useState<PlayerCard[]>(activeDeck.defenders);
  const [selActions, setSelActions] = useState<ActionCard[]>(activeDeck.actions);
  const [savedSnapshot, setSavedSnapshot] = useState(() => JSON.stringify(serializeDeck(activeDeck)));
  const [isEditing, setIsEditing] = useState(false);
  const [confirmExit, setConfirmExit] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const currentDraft = useMemo<DeckSlot>(
    () => ({ ...activeDeck, attackers: selAttackers, defenders: selDefenders, actions: selActions }),
    [activeDeck, selAttackers, selDefenders, selActions]
  );

  const dirty = JSON.stringify(serializeDeck(currentDraft)) !== savedSnapshot;
  const actionAtk = selActions.filter(action => action.category === 'attack').length;
  const actionDef = selActions.filter(action => action.category === 'defense').length;
  const actionSpc = selActions.filter(action => action.category === 'special').length;
  const actionImbalanced = selActions.length === 6 && (actionAtk === 0 || actionDef === 0);
  const deckValid = selAttackers.length === 2 && selDefenders.length === 2 && selActions.length === 6;

  const persistDecks = (nextDecks: DeckSlot[]) => {
    setDecks(nextDecks);
    saveDeckSlots(nextDecks);
  };

  const applyDeck = (deck: DeckSlot) => {
    if (dirty && isEditing) {
      setToast('Save current deck first');
      return;
    }
    setActiveDeckId(deck.id);
    setSelAttackers(deck.attackers);
    setSelDefenders(deck.defenders);
    setSelActions(deck.actions);
    setSavedSnapshot(JSON.stringify(serializeDeck(deck)));
    setIsEditing(false);
    dispatch({ type: 'SET_DECK', attackers: deck.attackers, defenders: deck.defenders, actions: deck.actions });
  };

  const saveDeck = () => {
    const nextDecks = decks.map(deck => deck.id === currentDraft.id ? currentDraft : deck);
    persistDecks(nextDecks);
    setSavedSnapshot(JSON.stringify(serializeDeck(currentDraft)));
    setIsEditing(false);
    dispatch({ type: 'SET_DECK', attackers: selAttackers, defenders: selDefenders, actions: selActions });
  };

  const createDeck = () => {
    if (dirty && isEditing) {
      setToast('Save current deck first');
      return;
    }
    const newDeck: DeckSlot = {
      id: `deck-${Date.now()}`,
      name: `Squad ${decks.length + 1}`,
      attackers: [],
      defenders: [],
      actions: [],
    };
    const nextDecks = [...decks, newDeck];
    persistDecks(nextDecks);
    setActiveDeckId(newDeck.id);
    setSelAttackers([]);
    setSelDefenders([]);
    setSelActions([]);
    setSavedSnapshot(JSON.stringify(serializeDeck(newDeck)));
    setIsEditing(true);
    setTab('attackers');
    setToast('New deck created');
  };

  const toggleAttacker = (card: PlayerCard) => {
    if (!isEditing) return;
    if (selAttackers.find(attacker => attacker.id === card.id)) {
      setSelAttackers(selAttackers.filter(attacker => attacker.id !== card.id));
    } else if (selAttackers.length < 2) {
      setSelAttackers([...selAttackers, card]);
    } else setToast('ATK line full (2/2)');
  };

  const toggleDefender = (card: PlayerCard) => {
    if (!isEditing) return;
    if (selDefenders.find(defender => defender.id === card.id)) {
      setSelDefenders(selDefenders.filter(defender => defender.id !== card.id));
    } else if (selDefenders.length < 2) {
      setSelDefenders([...selDefenders, card]);
    } else setToast('DEF line full (2/2)');
  };

  const toggleAction = (card: ActionCard) => {
    if (!isEditing) return;
    if (selActions.find(action => action.id === card.id)) {
      setSelActions(selActions.filter(action => action.id !== card.id));
    } else if (selActions.length < 6) {
      setSelActions([...selActions, card]);
    } else setToast('Actions full (6/6)');
  };

  const handleBack = () => {
    if (dirty) setConfirmExit(true);
    else navigate(-1);
  };

  const playDeck = () => {
    if (!deckValid) return;
    saveDeck();
    dispatch({ type: 'RESET' });
    navigate('/match');
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
        subtitle={isEditing ? (dirty ? 'Editing / unsaved' : 'Editing') : activeDeck.name}
        onBack={handleBack}
        showLive={false}
        rightSlot={
          <button onClick={createDeck} className="header-new-deck-btn">
            New Deck
          </button>
        }
      />

      <div className="deck-builder-scroll flex-1 overflow-y-auto px-3 pt-3 pb-28">
        <div className="max-w-md mx-auto space-y-2.5">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {decks.map(deck => (
              <button
                key={deck.id}
                onClick={() => applyDeck(deck)}
                className={`deck-pill ${deck.id === activeDeck.id ? 'deck-pill-active' : ''}`}
              >
                {deck.id === activeDeck.id && <span className="deck-pill-check">✓</span>}
                <span>{deck.name}</span>
                <span className="opacity-60">
                  P {deck.attackers.length + deck.defenders.length}/4 / ACT {deck.actions.length}/6
                </span>
              </button>
            ))}
          </div>

          <section className="five-side-card">
            <div className="five-side-header">
              <div>
                <div className="text-[10px] text-[#5CDFFF]/60 uppercase tracking-[0.28em] font-mono">
                  5-a-side Deck
                </div>
                <div className="text-white font-display uppercase tracking-[0.16em] text-sm">
                  {activeDeck.name}
                </div>
              </div>
              {deckValid ? <span className="chip chip-lime flicker">Ready</span> : <span className="chip chip-amber">Build</span>}
            </div>

            <div className="five-side-pitch">
              <div className="pitch-line pitch-line-top" />
              <div className="pitch-line pitch-line-mid" />
              <div className="pitch-circle" />
              <FormationSlot label="ATK" card={selAttackers[0]} className="slot-atk-left" onClick={() => isEditing && setTab('attackers')} />
              <FormationSlot label="ATK" card={selAttackers[1]} className="slot-atk-right" onClick={() => isEditing && setTab('attackers')} />
              <FormationSlot label="DEF" card={selDefenders[0]} className="slot-def-left" onClick={() => isEditing && setTab('defenders')} />
              <FormationSlot label="DEF" card={selDefenders[1]} className="slot-def-right" onClick={() => isEditing && setTab('defenders')} />
              <div className="formation-player formation-keeper">
                <div className="formation-badge">GK</div>
                <div className="formation-avatar formation-avatar-keeper">
                  <GameIcon name="hand" className="text-2xl" />
                </div>
                <div className="formation-name">Keeper Core</div>
              </div>
            </div>

            <div className="tactics-strip">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] text-[#5CDFFF]/60 uppercase tracking-[0.25em] font-mono">
                  6 Action Cards
                </span>
                <span className="text-[10px] text-[#5CDFFF]/45 font-mono">
                  ATK {actionAtk} / DEF {actionDef} / SPC {actionSpc}
                </span>
              </div>
              <div className="tactics-card-row">
                {Array.from({ length: 6 }).map((_, index) => {
                  const card = selActions[index];
                  return card ? (
                    <ActionCardComponent
                      key={card.id}
                      card={card}
                      selected
                      onClick={() => isEditing && setTab('actions')}
                      size="sm"
                    />
                  ) : (
                    <button key={index} onClick={() => isEditing && setTab('actions')} className="action-card-placeholder">
                      <GameIcon name="cards" className="text-xl" />
                      <span>Add Action</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </section>

          {actionImbalanced && (
            <div className="bg-[#ffb13d]/10 border border-[#ffb13d]/40 px-4 py-2 text-[#ffb13d] text-[11px] text-center font-mono uppercase tracking-widest">
              <GameIcon name="warning" className="inline text-sm" /> Add one {actionAtk === 0 ? 'attack' : 'defense'} action
            </div>
          )}

          {isEditing && (
            <>
              <div className="flex border border-[#1e2538] bg-[#0a0f1c]">
                {tabs.map(item => (
                  <button
                    key={item.key}
                    onClick={() => setTab(item.key)}
                    className={`flex-1 py-3 text-xs uppercase tracking-[0.2em] font-mono transition-colors ${
                      tab === item.key ? 'tab-active' : 'text-gray-500 hover:text-gray-300'
                    }`}
                  >
                    {item.label} <span className={item.ok ? 'text-[#b6ff3d]' : 'text-gray-600'}>({item.count})</span>
                  </button>
                ))}
              </div>

              <div className="selection-panel">
                {tab === 'attackers' && ALL_ATTACKERS.map(card => (
                  <PlayerCardComponent
                    key={card.id}
                    card={card}
                    selected={!!selAttackers.find(attacker => attacker.id === card.id)}
                    disabled={selAttackers.length >= 2 && !selAttackers.find(attacker => attacker.id === card.id)}
                    onClick={() => toggleAttacker(card)}
                    size="sm"
                  />
                ))}
                {tab === 'defenders' && ALL_DEFENDERS.map(card => (
                  <PlayerCardComponent
                    key={card.id}
                    card={card}
                    selected={!!selDefenders.find(defender => defender.id === card.id)}
                    disabled={selDefenders.length >= 2 && !selDefenders.find(defender => defender.id === card.id)}
                    onClick={() => toggleDefender(card)}
                    size="sm"
                  />
                ))}
                {tab === 'actions' && ALL_ACTIONS.map(card => (
                  <ActionCardComponent
                    key={card.id}
                    card={card}
                    selected={!!selActions.find(action => action.id === card.id)}
                    disabled={selActions.length >= 6 && !selActions.find(action => action.id === card.id)}
                    onClick={() => toggleAction(card)}
                    size="sm"
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-30 bg-gradient-to-t from-[#05080f] to-[#0e1424]/95 border-t border-[#1e2538] px-3 py-3">
        <div className="grid grid-cols-2 gap-2 max-w-md mx-auto">
          <button
            onClick={() => {
              if (isEditing) {
                saveDeck();
                setToast('Deck saved');
              } else {
                setIsEditing(true);
              }
            }}
            className="cyber-btn-ghost clip-cyber-btn py-3 text-[12px] tracking-[0.2em] font-mono"
          >
            {isEditing ? 'Save' : 'Edit'}
          </button>
          <button
            onClick={playDeck}
            disabled={!deckValid}
            className={`clip-cyber-btn py-3 text-[12px] tracking-[0.2em] font-mono ${
              deckValid ? 'cyber-btn' : 'bg-[#0a0f1c] border border-[#1e2538] text-gray-600 cursor-not-allowed'
            }`}
          >
            Play
          </button>
        </div>
      </div>

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

function FormationSlot({
  label,
  card,
  className,
  onClick,
}: {
  label: string;
  card?: PlayerCard;
  className: string;
  onClick: () => void;
}) {
  return (
    <div className={`formation-player ${className}`}>
      {card ? (
        <PlayerCardComponent card={card} onClick={onClick} size="sm" />
      ) : (
        <button onClick={onClick} className="formation-empty-card">
          <GameIcon name={label === 'ATK' ? 'score' : 'shield'} className="text-3xl" />
          <span>{label}</span>
          <small>Add Card</small>
        </button>
      )}
    </div>
  );
}
