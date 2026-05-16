const STORAGE_KEY = 'pd_tutorial_seen_v1';

export type TutorialKey =
  | 'home'
  | 'deck-builder'
  | 'toss'
  | 'scenario'
  | 'play'
  | 'round-result'
  | 'match-end'
  | 'penalty'
  | 'final';

function readSet(): Set<string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set();
    return new Set(JSON.parse(raw));
  } catch {
    return new Set();
  }
}

function writeSet(set: Set<string>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(set)));
  } catch {
    /* ignore */
  }
}

export function hasSeen(key: TutorialKey): boolean {
  return readSet().has(key);
}

export function markSeen(key: TutorialKey) {
  const s = readSet();
  s.add(key);
  writeSet(s);
}

export function resetTutorial() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

export function skipAll() {
  const all: TutorialKey[] = [
    'home', 'deck-builder', 'toss', 'scenario', 'play',
    'round-result', 'match-end', 'penalty', 'final',
  ];
  writeSet(new Set(all));
}
