import React from 'react';
import { TimerStateType } from '@/types/timer';
import { formatTime } from '@/types/timer';

export interface TimerDisplayProps {
  /** Current time in milliseconds */
  currentTime: number;
  /** Current timer state */
  currentState: TimerStateType;
  /** Current round number */
  currentRound: number;
  /** Total number of rounds */
  totalRounds: number;
  /** Whether timer is running */
  isRunning: boolean;
  /** Optional className for additional styling */
  className?: string;
}

/**
 * TimerDisplay component for high-visibility countdown display
 * Features extreme contrast with large text and state-based colors
 */
export default function TimerDisplay({
  currentTime,
  currentState,
  currentRound,
  totalRounds,
  isRunning,
  className = '',
}: TimerDisplayProps) {
  // Determine background and text colors based on timer state
  const getStateStyles = () => {
    switch (currentState) {
      case 'WORK':
        return {
          bg: 'bg-red-700 dark:bg-red-900',
          text: 'text-white',
          border: 'border-red-800 dark:border-red-950',
          shadow: 'shadow-lg shadow-red-900/50',
        };
      case 'REST':
        return {
          bg: 'bg-green-700 dark:bg-green-900',
          text: 'text-white',
          border: 'border-green-800 dark:border-green-950',
          shadow: 'shadow-lg shadow-green-900/50',
        };
      case 'FINISHED':
        return {
          bg: 'bg-purple-700 dark:bg-purple-900',
          text: 'text-white',
          border: 'border-purple-800 dark:border-purple-950',
          shadow: 'shadow-lg shadow-purple-900/50',
        };
      default: // IDLE
        return {
          bg: 'bg-gray-800 dark:bg-gray-900',
          text: 'text-white',
          border: 'border-gray-700 dark:border-gray-800',
          shadow: 'shadow-lg shadow-gray-900/50',
        };
    }
  };

  const stateStyles = getStateStyles();
  const formattedTime = formatTime(currentTime);

  // Get state label
  const getStateLabel = () => {
    switch (currentState) {
      case 'WORK':
        return 'WORK INTERVAL';
      case 'REST':
        return 'REST INTERVAL';
      case 'FINISHED':
        return 'SESSION COMPLETE';
      default:
        return 'READY';
    }
  };

  return (
    <div className={`${className}`}>
      {/* Main Timer Display */}
      <div className={`rounded-3xl p-6 md:p-8 ${stateStyles.bg} ${stateStyles.border} ${stateStyles.shadow} transition-all duration-300`}>
        <div className="text-center">
          {/* Time Display - Extreme contrast with huge text */}
          <div className={`font-bold tracking-tighter leading-none ${stateStyles.text} 
            text-7xl sm:text-8xl md:text-9xl lg:text-[10rem] xl:text-[12rem] 
            mb-4 md:mb-6`}>
            {formattedTime}
          </div>
          
          {/* State Label */}
          <div className={`text-xl sm:text-2xl md:text-3xl font-semibold mb-6 md:mb-8 ${stateStyles.text}`}>
            {getStateLabel()}
          </div>
          
          {/* Status Indicators */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 md:gap-6">
            {/* Round Indicator */}
            <div className={`px-4 py-2 rounded-xl ${stateStyles.border} bg-black/20 backdrop-blur-sm`}>
              <div className="text-lg sm:text-xl font-medium">
                Round: <span className="font-bold">{currentRound}</span> / {totalRounds}
              </div>
            </div>
            
            {/* Running Status */}
            <div className={`px-4 py-2 rounded-xl ${stateStyles.border} bg-black/20 backdrop-blur-sm`}>
              <div className="text-lg sm:text-xl font-medium">
                Status: <span className={`font-bold ${isRunning ? 'text-green-300' : 'text-yellow-300'}`}>
                  {isRunning ? 'RUNNING' : 'PAUSED'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Visual State Indicator (for additional clarity) */}
      <div className="mt-6 flex justify-center">
        <div className="flex items-center space-x-2">
          <div className={`w-4 h-4 rounded-full ${currentState === 'WORK' ? 'bg-red-500 animate-pulse' : 'bg-red-500/30'}`} />
          <span className="text-sm text-gray-300">WORK</span>
          
          <div className="w-2 h-2 rounded-full bg-gray-500 mx-2" />
          
          <div className={`w-4 h-4 rounded-full ${currentState === 'REST' ? 'bg-green-500 animate-pulse' : 'bg-green-500/30'}`} />
          <span className="text-sm text-gray-300">REST</span>
          
          <div className="w-2 h-2 rounded-full bg-gray-500 mx-2" />
          
          <div className={`w-4 h-4 rounded-full ${currentState === 'FINISHED' ? 'bg-purple-500 animate-pulse' : 'bg-purple-500/30'}`} />
          <span className="text-sm text-gray-300">FINISHED</span>
        </div>
      </div>
    </div>
  );
}
