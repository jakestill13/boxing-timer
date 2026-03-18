'use client';

import { useBoxingTimer } from '@/hooks/useBoxingTimer';
import TimerDisplay from '@/components/TimerDisplay';
import ControlPanel from '@/components/ControlPanel';
import AudioSystem from '@/components/AudioSystem';

export default function Home() {
  const {
    timerState,
    settings,
    shouldPlayGong,
    shouldPlayBeeps,
    startTimer,
    stopTimer,
    resetTimer,
    updateSettings,
  } = useBoxingTimer();

  // Determine background color based on timer state
  const getBackgroundColor = () => {
    switch (timerState.currentState) {
      case 'WORK':
        return 'bg-red-900/20';
      case 'REST':
        return 'bg-green-900/20';
      case 'FINISHED':
        return 'bg-purple-900/20';
      default:
        return 'bg-gray-900';
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${getBackgroundColor()} text-white p-4`}>
      <main className="max-w-6xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-8 md:mb-12">
          Boxing Timer
        </h1>
        
        {/* Timer Display Section */}
        <div className="mb-12 md:mb-16">
          <TimerDisplay
            currentTime={timerState.currentTime}
            currentState={timerState.currentState}
            currentRound={timerState.currentRound}
            totalRounds={timerState.totalRounds}
            isRunning={timerState.isRunning}
            className="mb-8"
          />
        </div>

        {/* Control Panel Component */}
        <div className="mb-8">
          <ControlPanel
            settings={settings}
            updateSettings={updateSettings}
            startTimer={startTimer}
            stopTimer={stopTimer}
            resetTimer={resetTimer}
            isRunning={timerState.isRunning}
            isIdle={timerState.currentState === 'IDLE'}
          />
        </div>

        {/* Audio System */}
        <AudioSystem
          shouldPlayGong={shouldPlayGong}
          shouldPlayBeeps={shouldPlayBeeps}
          volume={settings.volume}
          onAudioPlay={(type) => {
            console.log(`Audio started: ${type}`);
          }}
          onAudioComplete={(type) => {
            console.log(`Audio completed: ${type}`);
          }}
        />

        {/* Audio Indicators */}
        <div className="text-center mb-8">
          {shouldPlayGong && (
            <div className="inline-block bg-yellow-500 text-black font-bold px-6 py-3 rounded-xl animate-pulse text-lg shadow-lg">
              🔊 GONG PLAYING
            </div>
          )}
          {shouldPlayBeeps && (
            <div className="inline-block bg-blue-500 text-white font-bold px-6 py-3 rounded-xl animate-pulse text-lg shadow-lg ml-4">
              🔊 BEEPS PLAYING
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="mt-8 md:mt-12 text-center text-gray-300">
          <p className="mb-2 text-lg md:text-xl">
            The timer uses <span className="text-green-400 font-semibold">zero-drift precision timing</span> with audio cues.
          </p>
          <p className="text-base md:text-lg">
            <span className="text-yellow-400">Gong</span> plays at state changes, <span className="text-blue-400">beeps</span> play 10 seconds before interval ends.
          </p>
        </div>
      </main>
    </div>
  );
}
