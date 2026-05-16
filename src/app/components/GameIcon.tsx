import type { SvgIconProps } from '@mui/material/SvgIcon';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import SportsScoreIcon from '@mui/icons-material/SportsScore';
import ShieldIcon from '@mui/icons-material/Shield';
import BoltIcon from '@mui/icons-material/Bolt';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import LockIcon from '@mui/icons-material/Lock';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import TerrainIcon from '@mui/icons-material/Terrain';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn';
import GpsFixedIcon from '@mui/icons-material/GpsFixed';
import NorthIcon from '@mui/icons-material/North';
import BlockIcon from '@mui/icons-material/Block';
import PersonIcon from '@mui/icons-material/Person';
import PanToolIcon from '@mui/icons-material/PanTool';
import WarningIcon from '@mui/icons-material/Warning';
import CircleIcon from '@mui/icons-material/Circle';
import PsychologyIcon from '@mui/icons-material/Psychology';
import AirIcon from '@mui/icons-material/Air';
import TimerIcon from '@mui/icons-material/Timer';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import StyleIcon from '@mui/icons-material/Style';
import CasinoIcon from '@mui/icons-material/Casino';
import ArticleIcon from '@mui/icons-material/Article';
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import CancelIcon from '@mui/icons-material/Cancel';
import HeartBrokenIcon from '@mui/icons-material/HeartBroken';
import BalanceIcon from '@mui/icons-material/Balance';
import CrisisAlertIcon from '@mui/icons-material/CrisisAlert';

export type GameIconName =
  | 'soccer'
  | 'score'
  | 'shield'
  | 'bolt'
  | 'fire'
  | 'water'
  | 'lock'
  | 'temple'
  | 'eye'
  | 'phantom'
  | 'terrain'
  | 'arrow'
  | 'spark'
  | 'return'
  | 'target'
  | 'north'
  | 'block'
  | 'person'
  | 'hand'
  | 'warning'
  | 'red-card'
  | 'yellow-card'
  | 'mind'
  | 'wind'
  | 'timer'
  | 'wall'
  | 'run'
  | 'cards'
  | 'coin'
  | 'brief'
  | 'stats'
  | 'trophy'
  | 'close'
  | 'broken'
  | 'balance'
  | 'alert';

const icons: Record<GameIconName, typeof SportsSoccerIcon> = {
  soccer: SportsSoccerIcon,
  score: SportsScoreIcon,
  shield: ShieldIcon,
  bolt: BoltIcon,
  fire: LocalFireDepartmentIcon,
  water: WaterDropIcon,
  lock: LockIcon,
  temple: AccountBalanceIcon,
  eye: VisibilityIcon,
  phantom: VisibilityOffIcon,
  terrain: TerrainIcon,
  arrow: ArrowForwardIcon,
  spark: AutoAwesomeIcon,
  return: KeyboardReturnIcon,
  target: GpsFixedIcon,
  north: NorthIcon,
  block: BlockIcon,
  person: PersonIcon,
  hand: PanToolIcon,
  warning: WarningIcon,
  'red-card': CircleIcon,
  'yellow-card': CircleIcon,
  mind: PsychologyIcon,
  wind: AirIcon,
  timer: TimerIcon,
  wall: ViewModuleIcon,
  run: DirectionsRunIcon,
  cards: StyleIcon,
  coin: CasinoIcon,
  brief: ArticleIcon,
  stats: QueryStatsIcon,
  trophy: EmojiEventsIcon,
  close: CancelIcon,
  broken: HeartBrokenIcon,
  balance: BalanceIcon,
  alert: CrisisAlertIcon,
};

interface GameIconProps extends SvgIconProps {
  name: GameIconName;
}

export function GameIcon({ name, ...props }: GameIconProps) {
  const Icon = icons[name];
  return <Icon aria-hidden="true" focusable="false" {...props} />;
}
