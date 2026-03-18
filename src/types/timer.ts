
/**
 * Timer states as defined in the specification
 */
export type TimerStateType = 'IDLE' | 'WORK' | 'REST' | 'FINISHED';

/**
 * Timer settings interface
 * All durations are in milliseconds for precision
 */
export interface TimerSettings {
  /** Work interval duration in milliseconds */
  workDuration: number;
  /** Rest interval duration in milliseconds */
  restDuration: number;
  /** Total number of rounds */
  rounds: number;
  /** Audio volume from 0.0 to 1.0 */
  volume: number;
}

/**
 * Timer state interface
 */
export interface TimerState {
  /** Current timer state */
  currentState: TimerStateType;
  /** Remaining time in current interval (milliseconds) */
  currentTime: number;
  /** Current round number (1-indexed) */
  currentRound: number;
  /** Total number of rounds */
  totalRounds: number;
  /** Whether timer is currently running */
  isRunning: boolean;
  /** Timestamp of last update (Date.now()) for zero-drift calculation */
  lastUpdateTime: number;
}

/**
 * Audio trigger types
 */
export type AudioTriggerType = 'GONG' | 'BEEPS';

/**
 * Audio system interface
 */
export interface AudioSystemState {
  /** Whether to play the gong sound */
  shouldPlayGong: boolean;
  /** Whether to play the three beeps warning */
  shouldPlayBeeps: boolean;
  /** Last played audio type */
  lastPlayedAudio?: AudioTriggerType;
  /** Timestamp of last audio play */
  lastAudioPlayTime?: number;
}

/**
 * Control panel actions
 */
export interface TimerControls {
  /** Start the timer */
  startTimer: () => void;
  /** Stop/pause the timer */
  stopTimer: () => void;
  /** Reset timer to initial state */
  resetTimer: () => void;
  /** Update timer settings */
  updateSettings: (settings: Partial<TimerSettings>) => void;
}

/**
 * Default timer settings
 */
export const DEFAULT_TIMER_SETTINGS: TimerSettings = {
  workDuration: 3 * 60 * 1000, // 3 minutes in milliseconds
  restDuration: 60 * 1000,     // 1 minute in milliseconds
  rounds: 3,                   // 3 rounds
  volume: 0.8,                 // 80% volume
};

/**
 * Helper function to format milliseconds to MM:SS string
 */
export function formatTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

/**
 * Helper function to validate timer settings
 */
export function validateTimerSettings(settings: Partial<TimerSettings>): string[] {
  const errors: string[] = [];
  
  if (settings.workDuration !== undefined && settings.workDuration <= 0) {
    errors.push('Work duration must be greater than 0');
  }
  
  if (settings.restDuration !== undefined && settings.restDuration <= 0) {
    errors.push('Rest duration must be greater than 0');
  }
  
  if (settings.rounds !== undefined && (settings.rounds < 1 || settings.rounds > 99)) {
    errors.push('Rounds must be between 1 and 99');
  }
  
  if (settings.volume !== undefined && (settings.volume < 0 || settings.volume > 1)) {
    errors.push('Volume must be between 0.0 and 1.0');
  }
  
  return errors;
}
