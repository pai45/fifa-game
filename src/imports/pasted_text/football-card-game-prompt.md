Here’s a **clean Figma Make prompt** for that football card game. Since apparently humans enjoy making strategy games and then asking machines to make the machine-readable version of the idea, I cleaned it up into something Figma Make can actually use without hallucinating three useless dashboards.

---

## Figma Make Prompt

Design a **mobile-first interactive prototype** for a **2-player football card strategy game** with **deck building**, **scenario-based turn play**, and a **penalty shootout tiebreaker**.

The game should feel like a **fast tactical card duel**, combining:

* football attack vs defense moments
* collectible card game structure
* short competitive match flow
* clean, repeatable UX

The prototype should prioritize:

* consistent layout across screens
* quick decisions
* readable cards
* premium sports game feel
* simple but dramatic match moments

---

## Core Game Concept

This is a **turn-based football mini card game**.

Each player builds a deck before the match:

* **2 Attacker cards**
* **2 Defender cards**
* a set of **Action Cards**

The match is played over **4 rounds**.

At the start of each round:

* there is a **toss**
* toss winner decides whether to **Attack** or **Defend**

For each round:

* attacking player plays:

  * 1 Attacker card
  * 1 Action card
* defending player plays:

  * 1 Defender card
  * 1 Action card

The game resolves the outcome using:

* player stats
* scenario suitability
* action card synergy
* controlled randomness

Possible outcomes:

* Goal
* Saved / Blocked
* Missed Chance
* Foul / Special effect
* Red Card risk in some cases

If a player receives a **Red Card**, that card becomes unavailable for future rounds.

After 4 rounds:

* player with more goals wins
* if tied, go to **Penalty Shootout**

Penalty Shootout:

* both sides alternate penalty-style resolution turns
* quick sudden-death style or fixed number of kicks
* first decisive advantage wins

---

## Product Goal

Create a prototype for a **short, replayable football strategy game** where the player:

1. builds a deck before the match
2. makes fast tactical choices each round
3. reacts to toss outcomes and scenarios
4. manages risk, card usage, and red cards
5. tries to outscore the opponent over 4 rounds

The game should feel:

* strategic, not complicated
* dramatic, but not cluttered
* premium and sporty
* easy to understand in one session

---

## UX Principles

Use a **strong, consistent design system** across all screens:

* same header structure
* same card sizing
* same button patterns
* same spacing rhythm
* same score display treatment
* same selection logic everywhere

Design for:

* fast taps
* minimal reading
* high visual clarity
* reusable UI blocks
* predictable navigation

Keep the interface:

* sharp
* clean
* mobile-first
* no rounded corners
* dark sports UI
* premium collectible card feel

---

## Visual Style Direction

Style:

* modern football strategy game
* esports-inspired card battler
* premium mobile game UI
* dark theme with sharp accents
* cinematic but controlled

Color palette:

* Background: **#0D111A**
* Primary accent: **#5CDFFF**
* Secondary accents:

  * green pitch highlights
  * silver metallic UI
  * gold reward / win highlights
  * red for danger / red cards
  * purple for rare / special actions

Use accent colors carefully.
Do not overdecorate.
Avoid casino or gambling vibes.
Keep it tactical and sport-focused.

---

## Screen Structure

Create the following screens:

---

### 1. Splash / Start Screen

Purpose: establish theme and clear entry point

Include:

* game title
* short subtitle
* primary CTA: **Play Match**
* secondary CTA: **Deck Builder**
* optional CTA: **How to Play**

Design notes:

* football + card strategy identity
* bold, dramatic hero composition
* minimal text
* premium sports atmosphere

---

### 2. Home Screen

Purpose: simple main menu

Include:

* Play Match
* Deck Builder
* My Cards
* Match History
* optional player profile / currency / XP placeholder

Layout:

* clean stacked menu or grid menu
* same visual language as the rest of the app

---

### 3. Deck Builder Screen

Purpose: let player build match deck

Deck rules:

* choose exactly **2 Attackers**
* choose exactly **2 Defenders**
* choose **10 to 15 Action Cards**

Structure:

* segmented tabs:

  * Attackers
  * Defenders
  * Action Cards
* selected deck summary pinned near top

  * Attackers selected: 0/2
  * Defenders selected: 0/2
  * Action Cards selected: 0/10 or 0/15

Main area:

* scrollable card grid
* cards can be tapped to select or deselect

Bottom sticky action bar:

* Reset
* Save Deck
* Start Match

UX requirements:

* selected cards must be clearly highlighted
* deck limit rules must be visible without reading too much
* locked or unavailable selections should have disabled states
* show “Deck Ready” when valid

---

### 4. Toss Screen

Purpose: pre-round decision moment

This happens before each round.

Include:

* round number
* choose Heads or Tails
* toss animation or toss reveal
* result text:

  * “You won the toss”
  * “Opponent won the toss”
* decision buttons for toss winner:

  * Attack
  * Defend

Design:

* simple dramatic layout
* focus on toss and decision
* minimal extra elements

---

### 5. Round Scenario Screen

Purpose: frame the challenge before card selection

Each round should have a football scenario.

Example scenarios:

* Counter Attack
* 1v1 Final Third
* Set Piece Chance
* Last Minute Pressure
* Box Defense
* Wide Break
* Penalty Box Chaos

Include:

* scenario title
* short one-line description
* icon or illustration
* label showing:

  * You are Attacking
  * You are Defending

This screen should help players think strategically without adding clutter.

---

### 6. Main Round Screen

Purpose: core gameplay turn

Use a consistent three-zone mobile layout.

#### Top Zone: Opponent Area

* opponent score
* role indicator
* selected card slot
* selected action slot
* cards remaining / used indicator

#### Middle Zone: Match State

* current score
* round number
* scenario title
* status label:

  * Select Attacker
  * Select Defender
  * Select Action Card
  * Ready to Resolve

#### Bottom Zone: Player Interaction Area

* visible hand / carousel of eligible player cards
* visible hand / carousel of eligible action cards
* selected card preview slots
* sticky CTA button: **Play Move**

UX behavior:

* only correct role cards are active

  * if attacking, show attacker cards
  * if defending, show defender cards
* selected choices appear in dedicated preview slots
* Play Move button activates only when both selections are complete
* already used or red-carded cards must look unavailable

Important:
Do not change the structure of this screen between rounds.
Only update labels, scenario, and role states.

---

### 7. Round Result Screen

Purpose: show outcome clearly and dramatically

Show:

* attacking player card used
* defending player card used
* both action cards used
* final outcome:

  * Goal
  * Saved
  * Blocked
  * Missed
  * Foul
  * Red Card
* short result explanation
* updated score

Include:

* Next Round button
* subtle dramatic animation or motion cue

Design:

* focused and visual
* not overloaded with numbers
* outcome should be instantly readable

---

### 8. Red Card / Card Loss State

Purpose: communicate long-term consequence

If a red card happens:

* show alert or modal
* card becomes unavailable for remaining rounds
* card slot updates visually in future screens

Use:

* red danger treatment
* crossed-out or locked card appearance
* concise copy like:

  * “Red Card: Unavailable for the rest of the match”

---

### 9. End of 4 Rounds Screen

Purpose: transition to final result or penalties

Show:

* current score after 4 rounds
* message:

  * “You Win”
  * “You Lose”
  * or “Match Tied”
* if tied:

  * primary CTA: **Go to Penalty Shootout**

---

### 10. Penalty Shootout Screen

Purpose: tiebreaker phase

Penalty phase should feel faster and more intense.

Structure:

* penalty tracker at top
* score row for shootout
* alternating attack / save resolution feel
* simple selected card / action flow
* big result feedback per kick:

  * Goal
  * Saved
  * Missed

Keep this screen visually related to the main round screen, but simplified for higher tension.

Optional:

* 3 penalties each side, then sudden death

---

### 11. Final Result Screen

Purpose: satisfying match ending

Include:

* final score
* winner announcement
* optional MVP card or key moment
* buttons:

  * Rematch
  * Back to Home
  * Edit Deck

Visual treatment:

* premium but restrained
* strong win / loss state
* clean summary of match outcome

---

## Card System

### Player Cards

#### Attacker Cards

Include:

* player illustration
* name
* role label: Attacker
* attack rating
* special trait
* rarity stars
* metallic frame
* bottom nameplate

#### Defender Cards

Include:

* player illustration
* name
* role label: Defender
* defense rating
* special trait
* rarity stars
* metallic frame
* bottom nameplate

Card tiers can include:

* Silver
* Gold
* Purple

All player cards should use the same structure for consistency.

---

### Action Cards

Action cards should be visually simpler than player cards.

Include:

* icon
* title
* category
* short one-line effect
* color-coded card type

Possible action card examples:

#### Attack actions

* Through Ball
* Power Shot
* Skill Move
* Cut Inside
* Long Shot
* Quick Break

#### Defense actions

* Slide Tackle
* Press High
* Block Lane
* Tight Marking
* Intercept
* Last-Ditch Tackle

#### Special / risky actions

* All In
* Tactical Foul
* Fast Recovery
* Mind Game
* High Risk Press

Use red and yellow danger cues for foul-risk actions.

---

## Interaction States

Design consistent states for:

### Cards

* default
* selected
* locked
* used
* red-carded
* disabled

### Buttons

* default
* active
* disabled
* pressed

### Match states

* waiting for toss
* waiting for selection
* ready to resolve
* result shown
* penalty mode
* match ended

---

## Prototype Flow

Create clickable prototype flow in this order:

1. Splash
2. Home
3. Deck Builder
4. Toss
5. Scenario Screen
6. Main Round Screen
7. Round Result
8. Toss for next round
9. Scenario Screen
10. Main Round Screen
11. Round Result
12. Repeat until 4 rounds
13. End of Match / Tied State
14. Penalty Shootout
15. Final Result

Keep transitions smooth and consistent.

---

## UX Copy Style

Use short, game-friendly text.

Examples:

* Build Deck
* Choose Your Side
* You Won the Toss
* Attack or Defend
* Counter Attack
* Select Attacker
* Select Defender
* Select Action
* Play Move
* Goal
* Saved
* Red Card
* Penalty Shootout
* Match Won

Avoid paragraphs inside the UI.
Keep labels short and readable.

---

## Important Constraints

* mobile-first only
* no rounded corners
* no cluttered layouts
* no dashboard-heavy style
* no gambling vibe
* no random screen structure changes
* no oversized text blocks
* no inconsistent card sizes

The final prototype should feel like a **tight, premium, replayable football card duel**, with **strong deck-building strategy**, **clear round-based UX**, and a **cohesive visual system**.

---

## Optional Add-on for Figma Make

Also create reusable components for:

* header bar
* score bar
* player card
* action card
* selected card slot
* bottom action bar
* toss modal
* round result badge
* red card warning state
* penalty tracker

Use reusable components across all screens so the prototype feels consistent.

---

If you want, I can also turn this into a **shorter one-block prompt** optimized specifically for pasting directly into Figma Make without section breaks.
