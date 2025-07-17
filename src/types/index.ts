export interface GameState {
  isGameStarted: boolean;
  numberOfPlayers: number;
  currentPlayerIndex: number;
  locations: string[];
  selectedLocation: string;
  spyIndex: number;
  showRole: boolean;
  timerSeconds: number;
  isTimerRunning: boolean;
}

export interface Player {
  index: number;
  isSpy: boolean;
  hasSeenRole: boolean;
}
