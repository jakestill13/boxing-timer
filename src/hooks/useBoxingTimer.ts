'use client';

import { useState, useEffect, useCallback } from 'react';
import { TimerState, TimerSettings, TimerStateType, DEFAULT_TIMER_SETTINGS } from '@/types/timer';
import { loadTimerSettings, saveTimerSettings } from '@/utils/storage';

export const useBoxingTimer = () => {
  // Load initial settings from localStorage, merging with defaults for any missing properties
  const [settings, setSettings] = useState<TimerSettings>(() => {
    const loaded = loadTimerSettings();
    // Ensure all properties exist, using defaults for any missing ones
    return {
      workDuration: loaded.workDuration ?? DEFAULT_TIMER_SETTINGS.workDuration,
      restDuration: loaded.restDuration ?? DEFAULT_TIMER_SETTINGS.restDuration,
      rounds: loaded.rounds ?? DEFAULT_TIMER_SETTINGS.rounds,
      volume: loaded.volume ?? DEFAULT_TIMER_SETTINGS.volume,
    };
  });
  
  const [timerState, setTimerState] = useState<TimerState>({
    currentState: 'IDLE',
    currentTime: settings.workDuration,
    currentRound: 1,
    totalRounds: settings.rounds,
    isRunning: false,
    lastUpdateTime: Date.now(),
  });

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
    // Only trigger beeps when crossing the 10-second threshold from above
    if (timerState.currentTime > 10000 && newTime <= 10000 && newTime > 0) {
      playBeeps = true;
    }

    setTimerState(prev => ({
      ...prev,
      currentState: newState as TimerStateType,
      currentTime: Math.max(0, newTime),
      currentRound: newRound,
      lastUpdateTime: now,
    }));
    
    setShouldPlayGong(playGong);
    setShouldPlayBeeps(playBeeps);
    
    // Reset audio triggers after a short delay
    if (playGong) {
      setTimeout(() => setShouldPlayGong(false), 100);
    }
    if (playBeeps) {
      setTimeout(() => setShouldPlayBeeps(false), 100);
    }
  }, [timerState, settings]);

  // Start timer
  const startTimer = useCallback(() => {
    if (timerState.currentState === 'FINISHED') {
      // Reset to initial state if finished
      setTimerState({
        currentState: 'WORK',
        currentTime: settings.workDuration,
        currentRound: 1,
        totalRounds: settings.rounds,
        isRunning: true,
        lastUpdateTime: Date.now(),
      });
      // Play gong at the start of the first work interval after reset
      setShouldPlayGong(true);
      setTimeout(() => setShouldPlayGong(false), 100);
    } else if (timerState.currentState === 'IDLE') {
      // Start from IDLE state: transition to WORK
      setTimerState({
        currentState: 'WORK',
        currentTime: settings.workDuration,
        currentRound: 1,
        totalRounds: settings.rounds,
        isRunning: true,
        lastUpdateTime: Date.now(),
      });
      // Play gong at the start of the first work interval
      setShouldPlayGong(true);
      setTimeout(() => setShouldPlayGong(false), 100);
    } else {
      // Resume from paused state (WORK or REST)
      setTimerState(prev => ({
        ...prev,
        isRunning: true,
        lastUpdateTime: Date.now(),
      }));
    }
  }, [timerState.currentState, settings]);

  // Stop timer
  const stopTimer = useCallback(() => {
    setTimerState(prev => ({
      ...prev,
      isRunning: false,
    }));
  }, []);

  // Reset timer
  const resetTimer = useCallback(() => {
    setTimerState({
      currentState: 'IDLE',
      currentTime: settings.workDuration,
      currentRound: 1,
      totalRounds: settings.rounds,
      isRunning: false,
      lastUpdateTime: Date.now(),
    });
    setShouldPlayGong(false);
    setShouldPlayBeeps(false);
  }, [settings]);

  // Update settings
  const updateSettings = useCallback((newSettings: Partial<TimerSettings>) => {
    setSettings(prev => {
      const updated = { ...prev, ...newSettings };
      saveTimerSettings(updated);
      
      // Update timer state if needed
      setTimerState(current => {
        if (current.currentState === 'IDLE' || current.currentState === 'FINISHED') {
          return {
            ...current,
            currentTime: updated.workDuration,
            totalRounds: updated.rounds,
          };
        }
        return current;
      });
      
      return updated;
    });
  }, []);

  // Effect for the timer interval
  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    if (timerState.isRunning) {
      intervalId = setInterval(updateTimer, 100); // Update every 100ms for precision
    }
    return () => clearInterval(intervalId);
  }, [timerState.isRunning, updateTimer]);

  // Update timer state when settings change
  useEffect(() => {
    if (timerState.currentState === 'IDLE') {
      setTimerState(prev => ({
        ...prev,
        currentTime: settings.workDuration,
        totalRounds: settings.rounds,
      }));
    }
  }, [settings.workDuration, settings.rounds, timerState.currentState]);

  return {
    timerState,
    settings,
    shouldPlayGong,
    shouldPlayBeeps,
    startTimer,
    stopTimer,
    resetTimer,
    updateSettings,
  };
};
