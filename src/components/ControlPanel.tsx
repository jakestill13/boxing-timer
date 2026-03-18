'use client';

import { TimerSettings } from '@/types/timer';
import { useState, useEffect } from 'react';

interface ControlPanelProps {
  /** Current timer settings */
  settings: TimerSettings;
  /** Function to update timer settings */
  updateSettings: (settings: Partial<TimerSettings>) => void;
  /** Function to start the timer */
  startTimer: () => void;
  /** Function to stop the timer */
  stopTimer: () => void;
  /** Function to reset the timer */
  resetTimer: () => void;
  /** Whether timer is currently running */
  isRunning: boolean;
  /** Whether timer is in IDLE state */
  isIdle?: boolean;
}

export default function ControlPanel({
  settings,
  updateSettings,
  startTimer,
  stopTimer,
  resetTimer,
  isRunning,
  isIdle = true,
}: ControlPanelProps) {
  // Local state for form inputs
  const [workMinutes, setWorkMinutes] = useState<number>(Math.floor(settings.workDuration / 60000));
  const [workSeconds, setWorkSeconds] = useState<number>((settings.workDuration % 60000) / 1000);
  const [restMinutes, setRestMinutes] = useState<number>(Math.floor(settings.restDuration / 60000));
  const [restSeconds, setRestSeconds] = useState<number>((settings.restDuration % 60000) / 1000);
  const [rounds, setRounds] = useState<number>(settings.rounds);
  const [volume, setVolume] = useState<number>(settings.volume);

  // Update local state when settings change externally
  useEffect(() => {
    setWorkMinutes(Math.floor(settings.workDuration / 60000));
    setWorkSeconds((settings.workDuration % 60000) / 1000);
    setRestMinutes(Math.floor(settings.restDuration / 60000));
    setRestSeconds((settings.restDuration % 60000) / 1000);
    setRounds(settings.rounds);
    setVolume(settings.volume);
  }, [settings]);

  const handleSaveSettings = () => {
    const workDuration = workMinutes * 60000 + workSeconds * 1000;
    const restDuration = restMinutes * 60000 + restSeconds * 1000;
    
    updateSettings({
      workDuration,
      restDuration,
      rounds,
      volume,
    });
  };

  const handleLoadDefaults = () => {
    // Reset to default values (from types/timer)
    const defaultWork = 3 * 60000; // 3 minutes
    const defaultRest = 60 * 1000; // 1 minute
    const defaultRounds = 3;
    const defaultVolume = 0.7;
    
    setWorkMinutes(Math.floor(defaultWork / 60000));
    setWorkSeconds((defaultWork % 60000) / 1000);
    setRestMinutes(Math.floor(defaultRest / 60000));
    setRestSeconds((defaultRest % 60000) / 1000);
    setRounds(defaultRounds);
    setVolume(defaultVolume);
    
    updateSettings({
      workDuration: defaultWork,
      restDuration: defaultRest,
      rounds: defaultRounds,
      volume: defaultVolume,
    });
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    updateSettings({ volume: newVolume });
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 md:p-8 w-full">
      <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8 text-center text-white">
        Timer Configuration
      </h2>

      {/* Duration Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Work Duration */}
        <div className="bg-gray-900/60 p-5 rounded-xl">
          <h3 className="text-xl font-semibold mb-4 text-white flex items-center">
            <span className="w-3 h-3 bg-red-500 rounded-full mr-3"></span>
            Work Duration
          </h3>
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <label className="block text-sm text-gray-300 mb-2">Minutes</label>
              <input
                type="number"
                min="0"
                max="60"
                value={workMinutes}
                onChange={(e) => setWorkMinutes(parseInt(e.target.value) || 0)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 px-4 text-white text-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                disabled={isRunning}
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm text-gray-300 mb-2">Seconds</label>
              <input
                type="number"
                min="0"
                max="59"
                value={workSeconds}
                onChange={(e) => setWorkSeconds(parseInt(e.target.value) || 0)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 px-4 text-white text-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                disabled={isRunning}
              />
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-400">
            Total: {workMinutes}:{workSeconds.toString().padStart(2, '0')}
          </div>
        </div>

        {/* Rest Duration */}
        <div className="bg-gray-900/60 p-5 rounded-xl">
          <h3 className="text-xl font-semibold mb-4 text-white flex items-center">
            <span className="w-3 h-3 bg-green-500 rounded-full mr-3"></span>
            Rest Duration
          </h3>
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <label className="block text-sm text-gray-300 mb-2">Minutes</label>
              <input
                type="number"
                min="0"
                max="60"
                value={restMinutes}
                onChange={(e) => setRestMinutes(parseInt(e.target.value) || 0)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 px-4 text-white text-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                disabled={isRunning}
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm text-gray-300 mb-2">Seconds</label>
              <input
                type="number"
                min="0"
                max="59"
                value={restSeconds}
                onChange={(e) => setRestSeconds(parseInt(e.target.value) || 0)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 px-4 text-white text-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                disabled={isRunning}
              />
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-400">
            Total: {restMinutes}:{restSeconds.toString().padStart(2, '0')}
          </div>
        </div>
      </div>

      {/* Rounds and Volume */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Rounds */}
        <div className="bg-gray-900/60 p-5 rounded-xl">
          <h3 className="text-xl font-semibold mb-4 text-white">Rounds</h3>
          <div className="flex items-center">
            <input
              type="range"
              min="1"
              max="20"
              value={rounds}
              onChange={(e) => setRounds(parseInt(e.target.value))}
              className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
              disabled={isRunning}
            />
            <span className="ml-6 text-3xl font-bold text-white min-w-[3rem] text-center">
              {rounds}
            </span>
          </div>
          <div className="flex justify-between text-sm text-gray-400 mt-2">
            <span>1</span>
            <span>10</span>
            <span>20</span>
          </div>
        </div>

        {/* Volume */}
        <div className="bg-gray-900/60 p-5 rounded-xl">
          <h3 className="text-xl font-semibold mb-4 text-white">Volume</h3>
          <div className="flex items-center">
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={handleVolumeChange}
              className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
            <span className="ml-6 text-3xl font-bold text-white min-w-[4rem] text-center">
              {Math.round(volume * 100)}%
            </span>
          </div>
          <div className="flex justify-between text-sm text-gray-400 mt-2">
            <span>0%</span>
            <span>50%</span>
            <span>100%</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap justify-center gap-4 md:gap-6 mb-8">
        <button
          onClick={startTimer}
          disabled={isRunning}
          className="bg-green-600 hover:bg-green-700 disabled:bg-green-800 disabled:cursor-not-allowed text-white font-bold py-4 px-8 rounded-xl min-h-[52px] min-w-[140px] transition-all duration-200 text-lg md:text-xl shadow-lg hover:shadow-green-700/30 flex-1 md:flex-none"
        >
          START
        </button>
        
        <button
          onClick={stopTimer}
          disabled={!isRunning}
          className="bg-yellow-600 hover:bg-yellow-700 disabled:bg-yellow-800 disabled:cursor-not-allowed text-white font-bold py-4 px-8 rounded-xl min-h-[52px] min-w-[140px] transition-all duration-200 text-lg md:text-xl shadow-lg hover:shadow-yellow-700/30 flex-1 md:flex-none"
        >
          STOP
        </button>
        
        <button
          onClick={resetTimer}
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-8 rounded-xl min-h-[52px] min-w-[140px] transition-all duration-200 text-lg md:text-xl shadow-lg hover:shadow-red-700/30 flex-1 md:flex-none"
        >
          RESET
        </button>
      </div>

      {/* Settings Management Buttons */}
      <div className="flex flex-wrap justify-center gap-4">
        <button
          onClick={handleSaveSettings}
          disabled={isRunning}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg min-h-[44px] transition-all duration-200 text-lg shadow-lg hover:shadow-blue-700/30"
        >
          Save Settings
        </button>
        
        <button
          onClick={handleLoadDefaults}
          disabled={isRunning}
          className="bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg min-h-[44px] transition-all duration-200 text-lg shadow-lg hover:shadow-gray-600/30"
        >
          Load Defaults
        </button>
      </div>

      {/* Status Indicator */}
      <div className="mt-8 text-center">
        <div className={`inline-block px-4 py-2 rounded-full ${isRunning ? 'bg-red-500/20 text-red-300' : 'bg-green-500/20 text-green-300'}`}>
          {isRunning ? 'Timer is running' : 'Timer is stopped'}
        </div>
      </div>
    </div>
  );
}
