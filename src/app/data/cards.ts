import type { GameIconName } from '../components/GameIcon';

export type CardTier = 'silver' | 'gold' | 'purple';
export type PlayerRole = 'attacker' | 'defender';
export type ActionCategory = 'attack' | 'defense' | 'special';

export interface PlayerCard {
  id: string;
  name: string;
  role: PlayerRole;
  rating: number;
  trait: string;
  tier: CardTier;
  icon: GameIconName;
  image: string;
}

export interface ActionCard {
  id: string;
  title: string;
  category: ActionCategory;
  effect: string;
  power: number;
  risky: boolean;
  icon: GameIconName;
}

export interface Scenario {
  id: string;
  title: string;
  description: string;
  icon: GameIconName;
  attackBonus: number;
  defenseBonus: number;
}

export const ALL_ATTACKERS: PlayerCard[] = [
  { id: 'atk1', name: 'Marcus Blaze', role: 'attacker', rating: 92, trait: 'Clinical Finisher', tier: 'gold', icon: 'bolt', image: '/player-images/atk1.png' },
  { id: 'atk2', name: 'Leo Viper', role: 'attacker', rating: 95, trait: 'Dribble King', tier: 'purple', icon: 'target', image: '/player-images/atk2.png' },
  { id: 'atk3', name: 'Kai Thunder', role: 'attacker', rating: 88, trait: 'Speed Demon', tier: 'silver', icon: 'run', image: '/player-images/atk3.png' },
  { id: 'atk4', name: 'Dante Fury', role: 'attacker', rating: 90, trait: 'Aerial Threat', tier: 'gold', icon: 'fire', image: '/player-images/atk4.png' },
  { id: 'atk5', name: 'Riku Storm', role: 'attacker', rating: 86, trait: 'Long Range', tier: 'silver', icon: 'water', image: '/player-images/atk5.png' },
  { id: 'atk6', name: 'Zane Phantom', role: 'attacker', rating: 93, trait: 'Ghost Run', tier: 'purple', icon: 'phantom', image: '/player-images/atk6.png' },
];

export const ALL_DEFENDERS: PlayerCard[] = [
  { id: 'def1', name: 'Iron Wall', role: 'defender', rating: 91, trait: 'Unbreakable', tier: 'gold', icon: 'shield', image: '/player-images/def1.png' },
  { id: 'def2', name: 'Shadow Lock', role: 'defender', rating: 89, trait: 'Man Marker', tier: 'silver', icon: 'lock', image: '/player-images/def2.png' },
  { id: 'def3', name: 'Granite', role: 'defender', rating: 94, trait: 'Brick Wall', tier: 'purple', icon: 'terrain', image: '/player-images/def3.png' },
  { id: 'def4', name: 'Hawk Eye', role: 'defender', rating: 87, trait: 'Interceptor', tier: 'gold', icon: 'eye', image: '/player-images/def4.png' },
  { id: 'def5', name: 'Steel Trap', role: 'defender', rating: 85, trait: 'Slide Master', tier: 'silver', icon: 'block', image: '/player-images/def5.png' },
  { id: 'def6', name: 'Aegis', role: 'defender', rating: 93, trait: 'Last Stand', tier: 'purple', icon: 'temple', image: '/player-images/def6.png' },
];

export const ALL_ACTIONS: ActionCard[] = [
  { id: 'act1', title: 'Through Ball', category: 'attack', effect: '+15 Attack Power', power: 15, risky: false, icon: 'arrow' },
  { id: 'act2', title: 'Power Shot', category: 'attack', effect: '+20 Attack, -5 Accuracy', power: 20, risky: false, icon: 'score' },
  { id: 'act3', title: 'Skill Move', category: 'attack', effect: '+12 Attack, Bypass Trait', power: 12, risky: false, icon: 'spark' },
  { id: 'act4', title: 'Cut Inside', category: 'attack', effect: '+10 Attack, +5 Scenario', power: 10, risky: false, icon: 'return' },
  { id: 'act5', title: 'Long Shot', category: 'attack', effect: '+25 Attack, High Risk', power: 25, risky: true, icon: 'target' },
  { id: 'act6', title: 'Quick Break', category: 'attack', effect: '+18 Counter Bonus', power: 18, risky: false, icon: 'bolt' },
  { id: 'act7', title: 'Slide Tackle', category: 'defense', effect: '+15 Defense Power', power: 15, risky: false, icon: 'shield' },
  { id: 'act8', title: 'Press High', category: 'defense', effect: '+12 Defense, Disrupt', power: 12, risky: false, icon: 'north' },
  { id: 'act9', title: 'Block Lane', category: 'defense', effect: '+10 Defense, +5 Position', power: 10, risky: false, icon: 'block' },
  { id: 'act10', title: 'Tight Marking', category: 'defense', effect: '+14 Defense Power', power: 14, risky: false, icon: 'person' },
  { id: 'act11', title: 'Intercept', category: 'defense', effect: '+18 Defense, Read Play', power: 18, risky: false, icon: 'hand' },
  { id: 'act12', title: 'Last-Ditch Tackle', category: 'defense', effect: '+22 Defense, Foul Risk', power: 22, risky: true, icon: 'warning' },
  { id: 'act13', title: 'All In', category: 'special', effect: '+30 Power, Red Card Risk', power: 30, risky: true, icon: 'red-card' },
  { id: 'act14', title: 'Tactical Foul', category: 'special', effect: 'Stop Play, Yellow Risk', power: 8, risky: true, icon: 'yellow-card' },
  { id: 'act15', title: 'Mind Game', category: 'special', effect: '-10 Opponent Power', power: 10, risky: false, icon: 'mind' },
  { id: 'act16', title: 'Fast Recovery', category: 'special', effect: '+8 All Stats', power: 8, risky: false, icon: 'wind' },
];

export const SCENARIOS: Scenario[] = [
  { id: 'sc1', title: 'Counter Attack', description: 'Quick transition, spaces open up', icon: 'bolt', attackBonus: 8, defenseBonus: 3 },
  { id: 'sc2', title: '1v1 Final Third', description: 'Face to face with the last defender', icon: 'target', attackBonus: 5, defenseBonus: 5 },
  { id: 'sc3', title: 'Set Piece Chance', description: 'Free kick from a dangerous position', icon: 'brief', attackBonus: 6, defenseBonus: 6 },
  { id: 'sc4', title: 'Last Minute Pressure', description: 'Everything on the line, final push', icon: 'timer', attackBonus: 10, defenseBonus: 2 },
  { id: 'sc5', title: 'Box Defense', description: 'Packed defense, tight spaces', icon: 'wall', attackBonus: 2, defenseBonus: 10 },
  { id: 'sc6', title: 'Wide Break', description: 'Overlapping run down the flank', icon: 'run', attackBonus: 7, defenseBonus: 4 },
  { id: 'sc7', title: 'Penalty Box Chaos', description: 'Scramble in the box, anything goes', icon: 'score', attackBonus: 8, defenseBonus: 8 },
];
