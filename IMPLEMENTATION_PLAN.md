# Boxing Timer Implementation Plan

## Overview
This document outlines the implementation architecture for a precise, high-visibility boxing timer optimized for mobile touch interfaces. The design follows the principles established in CONSTITUTION.md and SPECIFICATION.md, focusing on zero-drift timing, audio-first state changes, and persistent user settings.

## Architecture

### Core Components

#### 1. TimerDisplay.tsx
- **Purpose**: Display large, high-contrast countdown numbers visible from a distance
- **Features**:
  - Dynamic color switching between red (WORK) and green (REST) states
  - Extremely large font sizes using Tailwind's text scaling (e.g., `text-9xl`)
  - Responsive design for mobile/tablet screens
  - Visual indicators for current round and total rounds
- **Implementation Details**:
  ```tsx
  // Example structure
  interface TimerDisplayProps {
    currentTime: number; // in milliseconds
    currentState: 'WORK' | 'REST' | 'IDLE' | 'FINISHED';
    currentRound: number;
    totalRounds: number;
  }
  ```

#### 2. ControlPanel.tsx
- **Purpose**: Provide touch-optimized controls for timer configuration and operation
- **Features**:
  - Large touch targets (minimum 44×44px) for mobile usage
  - Input fields for work duration, rest duration, and round count
  - Start/Stop/Reset buttons with clear visual states
  - Volume control slider for audio cues
  - Save/Load settings buttons
- **Implementation Details**:
  ```tsx
  // Example structure
  interface ControlPanelProps {
    workDuration: number;
    restDuration: number;
    rounds: number;
    volume: number;
    isRunning: boolean;
    onStart: () => void;
    onStop: () => void;
    onReset: () => void;
    onSettingsChange: (settings: TimerSettings) => void;
  }
  ```

#### 3. AudioSystem.tsx
- **Purpose**: Manage audio cues as primary state change triggers
- **Features**:
  - Preload audio files (long gong, three beeps) to prevent latency
  - Volume control synchronized with user settings
  - Play long gong at:
    - Start of WORK interval
    - End of WORK interval
    - End of final REST interval (session end)
  - Play three beeps 10 seconds before end of any WORK or REST interval
- **Implementation Details**:
  ```tsx
  // Example structure
  interface AudioSystemProps {
    volume: number;
    shouldPlayGong: boolean;
    shouldPlayBeeps: boolean;
    onAudioPlayed: (type: 'gong' | 'beeps') => void;
  }
  ```

### Central Logic: useBoxingTimer Hook

#### Location: `src/hooks/useBoxingTimer.ts`

#### Key Features:
1. **Zero-Drift Timing**: Uses `Date.now()` to calculate precise time deltas
2. **State Management**: Manages IDLE, WORK, REST, FINISHED states
3. **Round Tracking**: Tracks current round and total rounds
4. **Audio Coordination**: Triggers audio cues at appropriate times
5. **Settings Persistence**: Integrates with localStorage

#### Implementation Structure:
```typescript
interface TimerSettings {
  workDuration: number;    // in milliseconds
  restDuration: number;    // in milliseconds
  rounds: number;          // total number of rounds
  volume: number;          // 0.0 to 1.0
}

interface TimerState {
  currentState: 'IDLE' | 'WORK' | 'REST' | 'FINISHED';
  currentTime: number;     // remaining time in current interval (ms)
  currentRound: number;
  totalRounds: number;
  isRunning: boolean;
  lastUpdateTime: number;  // timestamp of last update (Date.now())
}

function useBoxingTimer(initialSettings: TimerSettings) {
  // Core state
  const [settings, setSettings] = useState<TimerSettings>(initialSettings);
  const [timerState, setTimerState] = useState<TimerState>({
    currentState: 'IDLE',
    currentTime: initialSettings.workDuration,
    currentRound: 1,
    totalRounds: initialSettings.rounds,
    isRunning: false,
    lastUpdateTime: Date.now(),
  });

  // Audio triggers
  const [shouldPlayGong, setShouldPlayGong] = useState(false);
  const [shouldPlayBeeps, setShouldPlayBeeps] = useState(false);

  // Update timer with zero-drift precision
  const updateTimer = useCallback(() => {
    if (!timerState.isRunning) return;

    const now = Date.now();
    const delta = now - timerState.lastUpdateTime;
    
    let newTime = timerState.currentTime - delta;
    let newState = timerState.currentState;
    let newRound = timerState.currentRound;
    let playGong = false;
    let playBeeps = false;

    // Check for interval completion
    if (newTime <= 0) {
      if (timerState.currentState === 'WORK') {
        // Work interval finished
        playGong = true;
        newState = 'REST';
        newTime = settings.restDuration;
      } else if (timerState.currentState === 'REST') {
        // Rest interval finished
        if (timerState.currentRound >= settings.rounds) {
          // All rounds completed
          playGong = true;
          newState = 'FINISHED';
          newTime = 0;
        } else {
          // Move to next round's work interval
          playGong = true;
          newState = 'WORK';
          newRound = timerState.currentRound + 1;
          newTime = settings.workDuration;
        }
      }
    }

    // Check for 10-second warning
    if (newTime <= 10000 && newTime > 0) {
      playBeeps = true;
    }

    setTimerState({
      ...timerState,
      currentState: newState,
      currentTime: Math.max(0, newTime),
      currentRound: newRound,
      lastUpdateTime: now,
    });
    
    setShouldPlayGong(playGong);
    setShouldPlayBeeps(playBeeps);
  }, [timerState, settings]);

  // Start/Stop/Reset functions
  const startTimer = () => { /* Implementation */ };
  const stopTimer = () => { /* Implementation */ };
  const resetTimer = () => { /* Implementation */ };

  // Effect for the timer interval
  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    if (timerState.isRunning) {
      intervalId = setInterval(updateTimer, 100); // Update every 100ms for precision
    }
    return () => clearInterval(intervalId);
  }, [timerState.isRunning, updateTimer]);

  return {
    timerState,
    settings,
    shouldPlayGong,
    shouldPlayBeeps,
    startTimer,
    stopTimer,
    resetTimer,
    updateSettings: setSettings,
  };
}
```

### Persistence Layer

#### localStorage Integration
- **Settings Storage**: Save all user settings to localStorage on change
- **Automatic Load**: Load settings on component mount
- **Fallback Defaults**: Provide sensible defaults if no saved settings exist

#### Implementation:
```typescript
const STORAGE_KEY = 'boxingTimerSettings';

function loadSettings(): TimerSettings {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    return JSON.parse(saved);
  }
  // Default settings: 3 minutes work, 1 minute rest, 3 rounds
  return {
    workDuration: 3 * 60 * 1000,
    restDuration: 60 * 1000,
    rounds: 3,
    volume: 0.8,
  };
}

function saveSettings(settings: TimerSettings) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}
```

### Styling Approach

#### Tailwind CSS Configuration
- **Dark Mode**: Use `dark:` variants for better visibility in low-light environments
- **High Contrast**: 
  - WORK state: Red background with white text (e.g., `bg-red-700 text-white`)
  - REST state: Green background with white text (e.g., `bg-green-700 text-white`)
  - IDLE/FINISHED: Neutral dark background
- **Mobile Optimization**:
  - Touch-friendly button sizes with `min-h-[44px] min-w-[44px]`
  - Responsive grid layouts using Tailwind's flex/grid utilities
  - Large, legible typography with appropriate line heights

#### Example Component Styling:
```tsx
<div className={`
  min-h-screen transition-colors duration-300
  ${currentState === 'WORK' ? 'bg-red-900' : ''}
  ${currentState === 'REST' ? 'bg-green-900' : ''}
  ${currentState === 'IDLE' ? 'bg-gray-900' : ''}
  ${currentState === 'FINISHED' ? 'bg-purple-900' : ''}
`}>
  <TimerDisplay 
    currentTime={currentTime}
    currentState={currentState}
    className="text-white"
  />
</div>
```

### Development Workflow

1. **Setup Project**
   ```bash
   npx create-react-app boxing-timer --template typescript
   npm install tailwindcss
   npx tailwindcss init
   ```

2. **Implement Core Hook**
   - Create `useBoxingTimer.ts` with zero-drift logic
   - Test timing accuracy with simulated intervals

3. **Build Components**
   - Create TimerDisplay with high-contrast visuals
   - Implement ControlPanel with touch-optimized inputs
   - Develop AudioSystem with preloaded sounds

4. **Integrate Persistence**
   - Add localStorage save/load functionality
   - Implement settings synchronization

5. **Mobile Testing**
   - Test on various mobile devices and screen sizes
   - Verify touch target sizes and responsiveness
   - Ensure audio plays correctly on mobile browsers

### Quality Assurance

- **Precision Testing**: Verify timer accuracy over extended periods
- **Audio Reliability**: Ensure audio cues play at exact moments
- **Mobile Usability**: Test with touch gestures and various screen orientations
- **Persistence Verification**: Confirm settings survive page reloads
- **Accessibility**: Maintain sufficient color contrast and screen reader support

This implementation plan provides a solid foundation for building a professional-grade boxing timer that adheres to all constitutional principles while delivering excellent user experience on mobile devices.
