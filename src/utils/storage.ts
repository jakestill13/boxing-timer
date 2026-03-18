import { TimerSettings, DEFAULT_TIMER_SETTINGS } from '@/types/timer';

const STORAGE_KEY = 'boxingTimerSettings';

/**
 * Load timer settings from localStorage
 * Returns default settings if no saved settings exist
 */
export function loadTimerSettings(): TimerSettings {
  if (typeof window === 'undefined') {
    return DEFAULT_TIMER_SETTINGS;
  }

  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      return DEFAULT_TIMER_SETTINGS;
    }

    const parsed = JSON.parse(saved);
    
    // Validate and merge with defaults
    return {
      workDuration: typeof parsed.workDuration === 'number' && parsed.workDuration > 0 
        ? parsed.workDuration 
        : DEFAULT_TIMER_SETTINGS.workDuration,
      restDuration: typeof parsed.restDuration === 'number' && parsed.restDuration > 0 
        ? parsed.restDuration 
        : DEFAULT_TIMER_SETTINGS.restDuration,
      rounds: typeof parsed.rounds === 'number' && parsed.rounds >= 1 && parsed.rounds <= 99
        ? parsed.rounds
        : DEFAULT_TIMER_SETTINGS.rounds,
      volume: typeof parsed.volume === 'number' && parsed.volume >= 0 && parsed.volume <= 1
        ? parsed.volume
        : DEFAULT_TIMER_SETTINGS.volume,
    };
  } catch (error) {
    console.error('Error loading timer settings from localStorage:', error);
    return DEFAULT_TIMER_SETTINGS;
  }
}

/**
 * Save timer settings to localStorage
 */
export function saveTimerSettings(settings: TimerSettings): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error('Error saving timer settings to localStorage:', error);
  }
}

/**
 * Clear saved timer settings from localStorage
 */
export function clearTimerSettings(): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing timer settings from localStorage:', error);
  }
}

/**
 * Check if timer settings exist in localStorage
 */
export function hasSavedTimerSettings(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  return localStorage.getItem(STORAGE_KEY) !== null;
}
