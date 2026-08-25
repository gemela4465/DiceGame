export type CompareMode = 'highest' | 'lowest';
export type TieMode = 'allow_tie' | 'tie_breaker';
export type LayoutMode = 'horizontal' | 'oval';
export type MatchFormat = 'bo1' | 'bo3' | 'bo5';
export type RollTriggerMode = 'click_toggle' | 'press_hold';
export type RollExecutionMode = 'individual' | 'simultaneous';

export interface Player {
  id: string;
  name: string;
  avatar: string;
  color: string;
  dice: number[];
  isRolling: boolean;
  hasRolled: boolean;
  totalScore: number;
  rank: number;
  roundWins: number;
}

export interface GameSettings {
  playerCount: number;
  diceCount: number; // 1 to 6
  compareMode: CompareMode;
  tieMode: TieMode;
  layoutMode: LayoutMode;
  matchFormat: MatchFormat;
  rollTriggerMode: RollTriggerMode;
  rollExecutionMode: RollExecutionMode;
  timerDuration: number; // seconds, default 30
}

export type GamePhase = 
  | 'setup'         // Setting up players and rules
  | 'rolling'       // Players are rolling dice
  | 'tie_break'     // Special PK round for tied players if in tie_breaker mode
  | 'round_result'  // Single round finished, showing round ranking
  | 'match_result'  // Match/Tournament finished (BO3/BO5 winner declared)
  | 'play_timer';   // Countdown timer for taking turns playing with toy

export interface TimerSession {
  currentPlayerIndex: number;
  remainingSeconds: number;
  totalSeconds: number;
  isRunning: boolean;
  isPaused: boolean;
  isFinished: boolean;
  playedPlayers: string[]; // player IDs who finished their turn
}
