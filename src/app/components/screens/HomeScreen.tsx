import { useState, type CSSProperties } from "react";
import { useNavigate } from "react-router";
import { useGame } from "../../context/GameContext";
import { HeaderBar } from "../HeaderBar";
import { TutorialTip } from "../TutorialTip";
import { resetTutorial } from "../../tutorial";
import { Toast } from "../Toast";
import { GameIcon } from "../GameIcon";
import { PlayerCardComponent } from "../PlayerCardComponent";
import { ALL_ATTACKERS, ALL_DEFENDERS, type PlayerCard } from "../../data/cards";

const HOME_STEPS = [
  {
    title: "Welcome, Operator",
    body: (
      <>
        <span className="neon-cyan">PITCH/DUEL</span> is a 4-round card
        duel. Each round, play one{" "}
        <span className="text-[#b6ff3d]">player card</span> and one{" "}
        <span className="text-[#ff7df8]">action card</span>. Stats, scenario,
        and luck decide the outcome.
      </>
    ),
  },
  {
    title: "You're pre-loaded",
    body: (
      <>
        Your default <span className="neon-cyan">loadout</span> is ready: 2
        attackers, 2 defenders, 6 actions. Play now or customize in{" "}
        <span className="text-[#5CDFFF]">Deck Builder</span>.
      </>
    ),
  },
  {
    title: "How a match flows",
    body: (
      <>
        <div className="space-y-1.5">
          <div>
            <span className="neon-cyan">1.</span> Coin toss (round 1 only)
          </div>
          <div>
            <span className="neon-cyan">2.</span> Scenario reveals + role
            assigned
          </div>
          <div>
            <span className="neon-cyan">3.</span> Pick a player & action card
          </div>
          <div>
            <span className="neon-cyan">4.</span> See the outcome → next round
          </div>
        </div>
        <div className="mt-3 text-[#5CDFFF]/70">
          ▸ Tap PLAY MATCH when ready.
        </div>
      </>
    ),
  },
];

export function HomeScreen() {
  const navigate = useNavigate();
  const { state, dispatch } = useGame();
  const [forceTutorial, setForceTutorial] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [dailyCard, setDailyCard] = useState<PlayerCard | null>(null);
  const [dailyOpen, setDailyOpen] = useState(false);
  const deckReady =
    state.deckAttackers.length === 2 &&
    state.deckDefenders.length === 2 &&
    state.deckActions.length >= 6;

  const startMatch = () => {
    dispatch({ type: "RESET" });
    navigate("/match");
  };

  const replay = () => {
    resetTutorial();
    setForceTutorial(true);
    setToast("Tutorial reset");
  };

  const openDailyCard = () => {
    const pool = [...ALL_ATTACKERS, ...ALL_DEFENDERS];
    const nextCard = pool[Math.floor(Math.random() * pool.length)];
    setDailyCard(nextCard);
    setDailyOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <HeaderBar
        title="Pitch Duel"
        subtitle="// Main Terminal"
        onBack={() => navigate("/")}
      />

      <div className="flex-1 flex flex-col items-center justify-center px-6 gap-4 pt-8 pb-28 relative scanlines">
        <GameIcon
          name="soccer"
          className="text-5xl text-[#5CDFFF] drop-shadow-[0_0_18px_rgba(92,223,255,0.5)] mb-1"
        />

        <div
          className={`chip ${deckReady ? "chip-lime" : "chip-amber"} flicker`}
        >
          {deckReady ? "● DECK ONLINE" : "◐ DEFAULT LOADOUT"}
        </div>

        <div className="w-full max-w-xs flex flex-col gap-3 mt-4">
          <button
            onClick={startMatch}
            className="cta-block cta-primary text-sm"
          >
            Play Match
          </button>

          <button
            onClick={() => navigate("/deck-builder")}
            className="cta-block cta-secondary text-sm"
          >
            Deck Builder
          </button>

          <button
            onClick={() => navigate("/how-to-play")}
            className="primary-text-cta w-full py-2.5"
          >
            How to Play
          </button>
        </div>

        <div className="cyber-panel clip-cyber px-4 py-3 mt-6 w-full max-w-xs">
          <div className="text-[10px] text-[#5CDFFF]/60 uppercase tracking-[0.25em] font-mono mb-2">
            ▸ Loadout Status
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            <Stat
              label="ATK"
              value={`${state.deckAttackers.length}/2`}
              ok={state.deckAttackers.length === 2}
            />
            <Stat
              label="DEF"
              value={`${state.deckDefenders.length}/2`}
              ok={state.deckDefenders.length === 2}
            />
            <Stat
              label="ACT"
              value={`${state.deckActions.length}/6`}
              ok={state.deckActions.length === 6}
            />
          </div>
        </div>

        <button
          onClick={replay}
          className="mt-2 text-[10px] text-[#5CDFFF]/40 hover:text-[#5CDFFF] font-mono tracking-[0.3em] uppercase transition-colors"
        >
          ↻ Replay Walkthrough
        </button>

        <div className="hud-line w-40 mt-2" />
        {/* <div className="text-[9px] text-[#5CDFFF]/40 font-mono tracking-[0.3em] uppercase">
          Anthropic Networks · est. 2099
        </div> */}
      </div>

      <TutorialTip
        tutorialKey="home"
        steps={HOME_STEPS}
        forceOpen={forceTutorial}
        onClose={() => setForceTutorial(false)}
      />
      <div className="fixed inset-x-0 bottom-0 z-30 px-4 pb-4 pt-5 bg-gradient-to-t from-[#05070d] via-[#05070d]/92 to-transparent">
        <button
          onClick={openDailyCard}
          className="daily-card-cta clip-cyber-btn w-full max-w-sm mx-auto min-h-[64px]"
        >
          <span className="daily-card-cta__icon">
            <GameIcon name="cards" className="text-lg" />
          </span>
          <span className="flex flex-col items-start leading-none">
            <span className="text-[10px] font-mono tracking-[0.28em] opacity-70">
              DAILY DROP
            </span>
            <span className="text-sm tracking-[0.08em]">Open Your Daily Card</span>
          </span>
        </button>
      </div>

      {dailyOpen && dailyCard && (
        <div className="daily-card-overlay" role="dialog" aria-modal="true">
          <div className="daily-card-backdrop" onClick={() => setDailyOpen(false)} />
          <div className="daily-card-stage">
            <button
              onClick={() => setDailyOpen(false)}
              className="daily-card-close"
              aria-label="Close daily card"
            >
              x
            </button>

            <div className="daily-card-pack" aria-hidden="true">
              <div className="daily-card-pack__top" />
              <div className="daily-card-pack__bottom" />
              <div className="daily-card-pack__seal">
                <GameIcon name="soccer" className="text-3xl" />
              </div>
              <div className="daily-card-pack__shine" />
            </div>

            <div className="daily-card-burst" aria-hidden="true">
              {Array.from({ length: 12 }).map((_, i) => (
                <span key={i} style={{ "--ray": i } as CSSProperties} />
              ))}
            </div>

            <div className="daily-card-reveal">
              <div className="text-[10px] text-[#5CDFFF]/70 uppercase tracking-[0.35em] font-mono mb-3">
                Card Generated
              </div>
              <PlayerCardComponent card={dailyCard} />
              <div className="mt-4 text-center">
                <div className="neon-cyan text-sm font-display uppercase tracking-[0.16em]">
                  {dailyCard.name}
                </div>
                <div className="text-[#b6ff3d]/80 text-[10px] font-mono uppercase tracking-[0.24em] mt-1">
                  {dailyCard.role === "attacker" ? "ATK" : "DEF"} // {dailyCard.trait}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <Toast message={toast} onDismiss={() => setToast(null)} />
    </div>
  );
}

function Stat({
  label,
  value,
  ok,
}: {
  label: string;
  value: string;
  ok: boolean;
}) {
  return (
    <div className="flex flex-col">
      <span className="text-[9px] text-gray-500 uppercase font-mono tracking-widest">
        {label}
      </span>
      <span
        className={`text-base font-display ${ok ? "neon-cyan" : "text-amber-400"}`}
      >
        {value}
      </span>
    </div>
  );
}
