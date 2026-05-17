import { createBrowserRouter } from 'react-router';
import { HomeScreen } from './components/screens/HomeScreen';
import { DeckBuilderScreen } from './components/screens/DeckBuilderScreen';
import { MatchScreen } from './components/screens/MatchScreen';
import { HowToPlayScreen } from './components/screens/HowToPlayScreen';

export const router = createBrowserRouter([
  { path: '/', Component: HomeScreen },
  { path: '/home', Component: HomeScreen },
  { path: '/deck-builder', Component: DeckBuilderScreen },
  { path: '/match', Component: MatchScreen },
  { path: '/how-to-play', Component: HowToPlayScreen },
  { path: '*', Component: HomeScreen },
]);
