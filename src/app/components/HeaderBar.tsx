import { ReactNode, useState, type CSSProperties } from 'react';
import { ALL_ATTACKERS, ALL_DEFENDERS, PlayerCard } from '../data/cards';
import { GameIcon } from './GameIcon';
import { PlayerCardComponent } from './PlayerCardComponent';

interface Props {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  rightSlot?: ReactNode;
  showLive?: boolean;
}

interface PackOption {
  id: string;
  name: string;
  coins: number;
  className: string;
}

const PACKS: PackOption[] = [
  { id: 'bronze', name: 'Bronze Pack', coins: 10, className: 'shop-pack-bronze' },
  { id: 'silver', name: 'Silver Pack', coins: 50, className: 'shop-pack-silver' },
  { id: 'gold', name: 'Gold Pack', coins: 250, className: 'shop-pack-gold' },
  { id: 'platinum', name: 'Platinum Pack', coins: 1000, className: 'shop-pack-platinum' },
];

function pickPackCard(packId: string): PlayerCard {
  const allCards = [...ALL_ATTACKERS, ...ALL_DEFENDERS];
  const silver = allCards.filter(card => card.tier === 'silver');
  const gold = allCards.filter(card => card.tier === 'gold');
  const purple = allCards.filter(card => card.tier === 'purple');
  const roll = Math.random();
  let pool = allCards;

  if (packId === 'bronze') pool = roll < 0.72 ? silver : roll < 0.94 ? gold : purple;
  if (packId === 'silver') pool = roll < 0.45 ? silver : roll < 0.86 ? gold : purple;
  if (packId === 'gold') pool = roll < 0.2 ? silver : roll < 0.72 ? gold : purple;
  if (packId === 'platinum') pool = roll < 0.12 ? gold : purple;

  return pool[Math.floor(Math.random() * pool.length)] ?? allCards[0];
}

function persistOwnedCard(card: PlayerCard) {
  try {
    const raw = window.localStorage.getItem('pd_owned_cards_v1');
    const owned = raw ? JSON.parse(raw) as string[] : [];
    window.localStorage.setItem('pd_owned_cards_v1', JSON.stringify([...owned, card.id]));
  } catch {
    // localStorage is optional for the reveal flow.
  }
}

export function HeaderBar({ title, subtitle, onBack, rightSlot, showLive = true }: Props) {
  const [shopOpen, setShopOpen] = useState(false);
  const [openingPack, setOpeningPack] = useState<PackOption | null>(null);
  const [revealedCard, setRevealedCard] = useState<PlayerCard | null>(null);

  const openPack = (pack: PackOption) => {
    const card = pickPackCard(pack.id);
    persistOwnedCard(card);
    setOpeningPack(pack);
    setRevealedCard(card);
  };

  const closeShop = () => {
    setShopOpen(false);
    setOpeningPack(null);
    setRevealedCard(null);
  };

  return (
    <div className="relative">
      <div className="bg-gradient-to-b from-[#0b1120] to-[#070b14] border-b border-[#1e2538] px-3 py-2 flex items-center gap-2 min-h-12 backdrop-blur-sm">
        {onBack && (
          <button
            onClick={onBack}
            aria-label="Go back"
            className="text-[#5CDFFF] w-10 h-10 flex items-center justify-center -ml-1 hover:bg-[#5CDFFF]/10 active:bg-[#5CDFFF]/20 transition-colors clip-cyber-sm"
          >
            <span className="text-lg leading-none">◄</span>
          </button>
        )}
        <div className="flex-1 min-w-0">
          <div className="text-white text-sm tracking-[0.18em] uppercase truncate font-display">
            <span className="text-[#5CDFFF]">/</span> {title}
          </div>
          {subtitle && <div className="text-gray-500 text-[10px] truncate font-mono tracking-wider uppercase">{subtitle}</div>}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {showLive && (
            <button onClick={() => setShopOpen(true)} className="header-shop-btn">
              Shop
            </button>
          )}
          {rightSlot}
        </div>
      </div>
      <div className="hud-line" />

      {shopOpen && (
        <div className="shop-overlay" role="dialog" aria-modal="true">
          <div className="shop-backdrop" onClick={closeShop} />
          <div className="shop-panel clip-cyber scanlines">
            <button onClick={closeShop} className="daily-card-close" aria-label="Close shop">
              x
            </button>

            {!openingPack && (
              <>
                <div className="shop-panel-header">
                  <div>
                    <div className="text-[10px] text-[#5CDFFF]/60 uppercase tracking-[0.28em] font-mono">
                      Card Shop
                    </div>
                    <div className="text-white font-display uppercase tracking-[0.16em] text-base">
                      Choose Pack
                    </div>
                  </div>
                  <GameIcon name="cards" className="text-3xl text-[#5CDFFF]" />
                </div>

                <div className="shop-pack-grid">
                  {PACKS.map(pack => (
                    <button
                      key={pack.id}
                      onClick={() => openPack(pack)}
                      className={`shop-pack-card ${pack.className}`}
                    >
                      <span className="shop-pack-icon">
                        <GameIcon name="cards" className="text-2xl" />
                      </span>
                      <span className="shop-pack-name">{pack.name}</span>
                      <span className="shop-pack-price">{pack.coins} Coins</span>
                    </button>
                  ))}
                </div>
              </>
            )}

            {openingPack && revealedCard && (
              <div className="shop-opening-stage">
                <div className="daily-card-pack" aria-hidden="true">
                  <div className={`daily-card-pack__top ${openingPack.className}`} />
                  <div className={`daily-card-pack__bottom ${openingPack.className}`} />
                  <div className="daily-card-pack__seal">
                    <GameIcon name="cards" className="text-3xl" />
                  </div>
                  <div className="daily-card-pack__shine" />
                </div>

                <div className="daily-card-burst" aria-hidden="true">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <span key={i} style={{ '--ray': i } as CSSProperties} />
                  ))}
                </div>

                <div className="daily-card-reveal">
                  <div className="text-[10px] text-[#5CDFFF]/70 uppercase tracking-[0.35em] font-mono mb-3">
                    {openingPack.name} Opened
                  </div>
                  <PlayerCardComponent card={revealedCard} />
                  <div className="mt-4 text-center">
                    <div className="neon-cyan text-sm font-display uppercase tracking-[0.16em]">
                      {revealedCard.name}
                    </div>
                    <div className="text-[#b6ff3d]/80 text-[10px] font-mono uppercase tracking-[0.24em] mt-1">
                      Added to your cards
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
