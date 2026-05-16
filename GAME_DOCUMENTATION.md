# Pitch Duel - Game Documentation

## Table of Contents
1. [Game Overview](#game-overview)
2. [Game Flow](#game-flow)
3. [Deck System](#deck-system)
4. [Match Flow](#match-flow)
5. [Combat Resolution](#combat-resolution)
6. [Scoring System](#scoring-system)
7. [Card Mechanics](#card-mechanics)
8. [Technical Architecture](#technical-architecture)

---

## Game Overview

**Pitch Duel** is a turn-based football card duel game where players build decks and compete in 4-round matches. The game combines strategic card selection with scenario-driven gameplay and calculated outcomes.

### Core Concept
- **Pre-built decks** containing player cards and action cards
- **4 scenario-based rounds** per match
- **Attack vs Defense** roles determined by coin toss and alternating
- **Stat-based calculations** with randomness for outcome variety
- **Card consequences** including red cards that block cards for future rounds

### Design Philosophy
- **Dark esports aesthetic** (#0D111A background, #5CDFFF accents)
- **Mobile-first** responsive design
- **No rounded corners** for sharp, competitive look
- **Instant play** - players can jump straight into matches with starter deck

---

## Game Flow

### 1. Splash Screen
**File:** `src/app/components/screens/SplashScreen.tsx`

- Entry point of the game
- Displays "PITCH DUEL" branding
- Auto-navigates to Home Screen after 2 seconds

### 2. Home Screen
**File:** `src/app/components/screens/HomeScreen.tsx`

Main menu with three options:
- **Play Match** - Starts a new match with current deck
- **Deck Builder** - Opens deck customization
- **How to Play** - Shows game rules and instructions

### 3. Deck Builder Screen
**File:** `src/app/components/screens/DeckBuilderScreen.tsx`

Allows players to customize their deck:

**Deck Requirements:**
- **2 Attacker cards** (from available striker/winger pool)
- **2 Defender cards** (from available defender/goalkeeper pool)
- **6 Action cards** (from 16 available actions)

**Action Card Categories:**
- **Attack actions** - Used when attacking
- **Defense actions** - Used when defending
- **Special actions** - Can be used in either role

**Starting Deck:**
Players begin with a pre-configured starter deck:
- 2 attackers (first two in the list)
- 2 defenders (first two in the list)
- 6 action cards (specific starter cards)

### 4. Match Screen
**File:** `src/app/components/screens/MatchScreen.tsx`

The main gameplay area that orchestrates all match phases:
- Initializes opponent deck (random selection)
- Routes between different phases
- Manages overall match state

---

## Match Flow

A complete match consists of **4 rounds**, each with multiple phases:

### Phase 1: Coin Toss (Round 1 Only)
**File:** `src/app/components/screens/match/TossPhase.tsx`

**How it works:**
1. Player chooses "Heads" or "Tails"
2. Player clicks "Flip Coin"
3. Result is revealed with animation
4. **Winner chooses** to Attack or Defend
5. **Loser gets** the opposite role

**Important:** Coin toss happens **ONLY in Round 1**. After that, roles alternate automatically.

**State transitions:**
- `phase: 'toss'` → `phase: 'toss-result'` → `phase: 'scenario'`

### Phase 2: Scenario Reveal
**File:** `src/app/components/screens/match/ScenarioPhase.tsx`

**What happens:**
1. Random scenario is selected (no repeats if possible)
2. Scenario is displayed with:
   - Icon and title
   - Description
   - Player's role (Attacking/Defending)
3. Player clicks "Select Cards" to proceed

**Scenarios provide bonuses:**
Each scenario has:
- `attackBonus`: Added to attacker's power
- `defenseBonus`: Added to defender's power
- These bonuses create tactical depth based on card selection

**Example Scenarios:**
- **Quick Counter** - Fast break scenario
- **Set Piece** - Corner kick or free kick
- **One-on-One** - Direct duel situation
- **Penalty Area Chaos** - Crowded box scenario

### Phase 3: Card Selection
**File:** `src/app/components/screens/match/PlayPhase.tsx`

**Player's Turn:**
1. Select **one player card** (Attacker or Defender based on role)
2. Select **one action card** (filtered by role)
3. Click "Play Move" to lock in selection

**Opponent's Turn (AI):**
- Automatically selects cards from available pool
- Excludes red-carded cards
- Random selection (can be enhanced with AI logic)

**Card Filtering:**
- **Attacking:** Can only use Attacker cards + Attack/Special actions
- **Defending:** Can only use Defender cards + Defense/Special actions

**Card Availability:**
- Cards with **red cards** are blocked (not selectable)
- All other cards are **reusable** across rounds
- Each card shows rating and stats

### Phase 4: Round Resolution
**File:** `src/app/components/screens/match/RoundResultPhase.tsx`

**What happens:**
1. Both sides' cards are revealed
2. Outcome is calculated (see Combat Resolution)
3. Result is displayed with animation:
   - Outcome icon and label
   - Cards used by both sides
   - Score update
   - Red card warnings (if applicable)

**Possible Outcomes:**
- ⚽ **GOAL** - Attacker scores
- 🧤 **SAVED** - Defender saves the shot
- 🚫 **BLOCKED** - Defender blocks the attempt
- 💨 **MISSED** - Attacker misses the target
- 🟡 **FOUL** - Attacker commits a foul (risky attack action)
- 🟥 **RED CARD** - Defender gets sent off (risky defense action)

**Scoring:**
- Goal → Attacking team gets +1 point
- All other outcomes → No points awarded

### Phase 5: Next Round or Match End
**After Round Result:**

**If rounds 1-3:** 
- Click "Next Round"
- **Roles automatically alternate**:
  - Round 1: Coin toss winner's choice
  - Round 2: Opposite of Round 1
  - Round 3: Same as Round 1
  - Round 4: Opposite of Round 1
- Returns to Scenario phase (no coin toss)

**If round 4:**
- Click "See Results"
- Goes to Match End phase

### Phase 6: Match End
**File:** `src/app/components/screens/match/MatchEndPhase.tsx`

**Three possible outcomes:**

**1. Player Wins (Player Score > Opponent Score):**
- Shows "VICTORY!" message
- Displays final score
- Shows round-by-round breakdown
- Options: "Play Again" or "Home"

**2. Opponent Wins (Opponent Score > Player Score):**
- Shows "DEFEAT" message
- Displays final score
- Shows round-by-round breakdown
- Options: "Play Again" or "Home"

**3. Draw (Scores Equal):**
- Shows "DRAW" message
- Button: "Go to Penalties" → Penalty Shootout phase

### Phase 7: Penalty Shootout (Draw Only)
**File:** `src/app/components/screens/match/PenaltyPhase.tsx`

**How it works:**
1. Each side takes alternating penalty kicks
2. Player kicks on even rounds (0, 2, 4...)
3. Opponent kicks on odd rounds (1, 3, 5...)
4. Each kick has ~65-75% success rate
5. Outcomes: Goal, Saved, or Missed

**Win Conditions:**
- Best-of-5 format (first to 3 wins)
- After 6 kicks (3 each), if tied → Sudden death
- Sudden death: First to score when opponent doesn't
- Cannot-catch-up rule: If mathematically impossible to tie, end early

**UI:**
- Shows kick-by-kick history
- Current penalty score
- Visual feedback for each kick result

### Phase 8: Final Result (After Penalties)
**File:** `src/app/components/screens/match/FinalResultPhase.tsx`

**Displays:**
- Penalty shootout winner
- Final penalty score (e.g., "3-2 on Penalties")
- All penalty kicks taken
- Options: "Play Again" or "Home"

---

## Combat Resolution

### Power Calculation
**File:** `src/app/context/GameContext.tsx` (resolveRound function)

**Attack Power:**
```
attackPower = attackerCard.rating + attackAction.power + scenario.attackBonus + random(0-20)
```

**Defense Power:**
```
defensePower = defenderCard.rating + defenseAction.power + scenario.defenseBonus + random(0-20)
```

**Components:**
- **Card Rating:** Base power of player card (70-95 typically)
- **Action Power:** Bonus from action card (-10 to +25)
- **Scenario Bonus:** Context-specific boost (0-15)
- **Randomness:** 0-20 random roll for unpredictability

### Outcome Determination

**Power Difference = attackPower - defensePower**

**1. Check for Special Outcomes First:**
- **Red Card:** 12% chance if defense uses risky action → Defender gets red card
- **Foul:** 12% chance if attack uses risky action → No goal, possible card

**2. If no special outcome, use power difference:**

| Power Difference | Probabilities |
|-----------------|---------------|
| **diff > 15** (Big Attack Advantage) | 75% Goal, 20% Saved, 5% Blocked |
| **diff 5-15** (Moderate Attack Advantage) | 60% Goal, 30% Saved, 10% Missed |
| **diff -5 to 5** (Balanced) | 45% Goal, 35% Saved, 20% Missed/Blocked |
| **diff -15 to -5** (Moderate Defense Advantage) | 10% Goal, 65% Saved, 25% Blocked |
| **diff < -15** (Big Defense Advantage) | 5% Goal, 75% Saved, 20% Blocked |

### Balanced Design
- **No guaranteed outcomes** - Even big advantages have failure chance
- **Defense is viable** - Defenders can win with good card selection
- **Risk/reward** - Risky actions give power but risk red cards
- **Scenario matters** - Choosing cards that fit scenario gives edge

---

## Scoring System

### Regular Match Scoring
- **Goal outcome** → Attacking team gets 1 point
- **All other outcomes** → No points awarded
- **4 rounds total** → Maximum possible score is 4-0

### Match Result
- **Win:** Player score > Opponent score
- **Loss:** Player score < Opponent score
- **Draw:** Player score = Opponent score → Goes to penalties

### Penalty Shootout Scoring
- **Separate score tracking** (penaltyPlayerScore, penaltyOpponentScore)
- **Each successful goal** → +1 penalty point
- **First to win** based on best-of-5 or sudden death rules
- **Does NOT add to regular match score** (penalties are tiebreaker only)

---

## Card Mechanics

### Player Cards
**File:** `src/app/data/cards.ts`

**Structure:**
```typescript
interface PlayerCard {
  id: string;           // Unique identifier
  name: string;         // Player name
  position: string;     // ST, LW, CB, GK, etc.
  rating: number;       // Base power (70-95)
  type: 'attacker' | 'defender';
}
```

**Attacker Positions:**
- ST (Striker)
- LW (Left Wing)
- RW (Right Wing)

**Defender Positions:**
- CB (Center Back)
- LB (Left Back)
- RB (Right Back)
- GK (Goalkeeper)

### Action Cards
**File:** `src/app/data/cards.ts`

**Structure:**
```typescript
interface ActionCard {
  id: string;           // Unique identifier
  name: string;         // Action name
  power: number;        // Power modifier (-10 to +25)
  description: string;  // What the action does
  risky: boolean;       // Can trigger red card/foul
  category: 'attack' | 'defense' | 'special';
}
```

**Examples:**

**Attack Actions:**
- **Power Shot** (+20 power, risky)
- **Finesse Shot** (+12 power, safe)
- **Chip Shot** (+8 power, safe)

**Defense Actions:**
- **Slide Tackle** (+18 power, risky - can get red card)
- **Block Shot** (+10 power, safe)
- **Intercept** (+8 power, safe)

**Special Actions:**
- **Mind Games** (+15 power, works for both)
- **Tactical Foul** (varies, risky)

### Card Reusability
- **Default:** All cards can be reused every round
- **Red Card Exception:** If a player card gets a red card, it's blocked for all remaining rounds
- **No discard:** Action cards don't get discarded after use (different from original concept)

### Card Display
**Components:**
- `PlayerCardComponent.tsx` - Displays player cards with rating, position
- `ActionCardComponent.tsx` - Displays action cards with power, description

---

## Technical Architecture

### State Management
**File:** `src/app/context/GameContext.tsx`

**Global State (React Context):**
```typescript
interface GameState {
  // Deck
  deckAttackers: PlayerCard[];
  deckDefenders: PlayerCard[];
  deckActions: ActionCard[];

  // Match State
  phase: MatchPhase;
  currentRound: number;
  playerScore: number;
  opponentScore: number;
  playerAttacking: boolean;
  currentScenario: Scenario | null;
  
  // Coin Toss
  tossChoice: 'heads' | 'tails' | null;
  tossResult: 'heads' | 'tails' | null;
  playerWonToss: boolean;
  initialAttackingChoice: boolean | null;

  // Current Selections
  selectedPlayerCard: PlayerCard | null;
  selectedActionCard: ActionCard | null;

  // Card Tracking
  usedPlayerCards: string[];      // Historical tracking
  usedActionCards: string[];      // Historical tracking
  redCardedCards: string[];       // Blocked cards

  // Opponent (AI)
  opponentAttackers: PlayerCard[];
  opponentDefenders: PlayerCard[];
  opponentActions: ActionCard[];
  opponentUsedPlayerCards: string[];
  opponentUsedActionCards: string[];
  opponentRedCarded: string[];

  // Results
  roundResults: RoundResult[];

  // Penalty Shootout
  penaltyKicks: PenaltyKick[];
  penaltyPlayerScore: number;
  penaltyOpponentScore: number;
  penaltyRound: number;
  penaltyPhaseOver: boolean;
}
```

### Actions (State Updates)
```typescript
type Action =
  | { type: 'SET_DECK'; ... }
  | { type: 'START_MATCH'; ... }
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
  | { type: 'RESET' }
```

### Phase System
```typescript
type MatchPhase = 
  | 'idle'          // Before match starts
  | 'toss'          // Choosing heads/tails
  | 'toss-result'   // Showing toss result
  | 'scenario'      // Showing scenario
  | 'play'          // Selecting cards
  | 'resolving'     // (unused currently)
  | 'round-result'  // Showing outcome
  | 'match-end'     // Match finished
  | 'penalty'       // Penalty shootout
  | 'final';        // Final result after penalties
```

### Routing
**File:** `src/app/routes.tsx`

```typescript
Routes:
  / → SplashScreen (auto-redirects to /home)
  /home → HomeScreen
  /deck-builder → DeckBuilderScreen
  /match → MatchScreen
  /how-to-play → HowToPlayScreen
```

### UI Components
**Shared Components:**
- `HeaderBar.tsx` - Top bar with title and subtitle
- `ScoreBar.tsx` - Shows current score and round number
- `PlayerCardComponent.tsx` - Player card display
- `ActionCardComponent.tsx` - Action card display

**Screen Components:**
All in `src/app/components/screens/`

**Match Phase Components:**
All in `src/app/components/screens/match/`

### Styling
- **Tailwind CSS v4** for utility-first styling
- **Custom theme:** `/src/styles/theme.css`
- **Fonts:** `/src/styles/fonts.css`
- **Design tokens:** CSS variables in theme.css

**Key Colors:**
- Background: `#0D111A`
- Accent: `#5CDFFF`
- Card borders: `#1e2538`
- Success: Green tones
- Warning: Yellow tones
- Error: Red tones

### Animation
- **Motion (Framer Motion)** for transitions
- Entry animations on phase changes
- Coin flip rotation
- Result reveal effects
- Scale and fade transitions

---

## Game Balance

### Design Goals
1. **No dominant strategy** - Both attack and defense should be viable
2. **Skill + Luck balance** - Player choices matter, but randomness keeps it exciting
3. **Risk/Reward** - Risky actions are powerful but dangerous
4. **Scenario impact** - Context should influence card selection

### Balancing Mechanisms
1. **Power ranges** - Cards have ratings 70-95, keeping them competitive
2. **Random factor** - 0-20 random adds unpredictability
3. **Scenario bonuses** - 0-15 bonus rewards fitting strategy
4. **Outcome probabilities** - No guaranteed results, even with big advantage
5. **Red card risk** - 12% penalty for risky actions balances their power
6. **Alternating roles** - Each player gets 2 attacking and 2 defending rounds

### Fair Play Features
- **Single coin toss** - Roles alternate after round 1, ensuring balance
- **Equal card access** - Both players have same deck building constraints
- **Starter deck** - Beginners can compete immediately
- **Transparent calculations** - Power and outcomes are logical

---

## Future Enhancement Ideas

### Gameplay
- [ ] **Multiplayer** - Real-time PvP matches
- [ ] **Tournaments** - Bracket-style competitions
- [ ] **Career Mode** - Progress through seasons
- [ ] **Card Collection** - Unlock new cards over time
- [ ] **Deck Slots** - Save multiple deck configurations

### AI Improvements
- [ ] **Smart opponent** - AI that counters player strategy
- [ ] **Difficulty levels** - Easy, Medium, Hard AI
- [ ] **Learning AI** - Adapts to player patterns

### Cards & Strategy
- [ ] **More cards** - Expand card pool (50+ action cards, 100+ players)
- [ ] **Card rarity** - Common, Rare, Epic, Legendary tiers
- [ ] **Card synergies** - Bonus for using specific combinations
- [ ] **Formation bonuses** - Extra power for tactical setups

### Progression
- [ ] **Leveling system** - XP and player levels
- [ ] **Achievements** - Unlock rewards for milestones
- [ ] **Daily challenges** - Special match conditions
- [ ] **Leaderboards** - Global rankings

### Polish
- [ ] **Sound effects** - Audio feedback for actions
- [ ] **Music** - Background tracks
- [ ] **Animations** - More elaborate card reveals
- [ ] **Replays** - Watch match highlights
- [ ] **Statistics** - Track win rates, favorite cards, etc.

---

## Troubleshooting

### Common Issues

**Cards not showing:**
- Check that deck has required cards (2 attackers, 2 defenders, 6 actions)
- Verify cards aren't red-carded
- Ensure correct category filter (attack/defense)

**Match not starting:**
- Ensure you're clicking "Play Match" from Home screen
- Check that deck is valid in GameContext

**Penalty shootout not ending:**
- Should auto-end when winner is determined
- Check penaltyPhaseOver logic in GameContext

**Role not alternating:**
- Verify initialAttackingChoice is set in round 1
- Check NEXT_ROUND action logic

---

## Credits

**Game Design:** Pitch Duel
**Theme:** Dark Esports Aesthetic
**Framework:** React + Tailwind CSS v4
**State Management:** React Context + useReducer
**Routing:** React Router v7
**Animation:** Motion (Framer Motion)

---

## Conclusion

Pitch Duel combines strategic deck building with fast-paced card battles in a football theme. The game emphasizes:
- **Accessible gameplay** - Easy to learn, jump right in
- **Strategic depth** - Card selection and risk management matter
- **Fair competition** - Balanced mechanics ensure both sides can win
- **Exciting moments** - Randomness creates memorable comebacks and upsets

The architecture is modular and extensible, making it easy to add new features, cards, and game modes in the future.
