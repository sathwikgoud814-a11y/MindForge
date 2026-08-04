import React, { useState, useEffect } from 'react';
import { useSystem } from '../../context/SystemContext';

export function FocusMode() {
  const { addXP } = useSystem();
  const [durationMinutes, setDurationMinutes] = useState(25);
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [ambientSound, setAmbientSound] = useState('quiet');

  useEffect(() => {
    let timer = null;
    if (isRunning && timeLeftSeconds > 0) {
      timer = setInterval(() => {
        setTimeLeftSeconds(prev => prev - 1);
      }, 1000);
    } else if (timeLeftSeconds === 0 && isRunning) {
      setIsRunning(false);
      const earnedXP = Math.round(durationMinutes * 15 * 1.5);
      addXP(earnedXP, 100);
      alert(`Focus Session Completed! You earned +${earnedXP} XP (1.5x Focus Boost)!`);
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeftSeconds, durationMinutes]);

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeftSeconds(durationMinutes * 60);
  };

  const selectPreset = (mins) => {
    setIsRunning(false);
    setDurationMinutes(mins);
    setTimeLeftSeconds(mins * 60);
  };

  const formatTime = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const progressPercentage = Math.round(((durationMinutes * 60 - timeLeftSeconds) / (durationMinutes * 60)) * 100);

  return (
    <div className="flex flex-col gap-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center flex flex-col items-center gap-2">
        <span className="text-xs font-bold px-3 py-1 rounded-full gold-gradient text-white uppercase tracking-wider">
          System Focus Chamber
        </span>
        <h1 className="text-3xl font-black text-primary tracking-tight">Deep Work & Concentration</h1>
        <p className="text-xs text-on-surface-variant max-w-md">
          Eliminate external distractions. Enter the zero-noise chamber to multiply XP yields.
        </p>
      </div>

      {/* Main Focus Chamber Card */}
      <div className="bg-surface rounded-3xl p-8 md:p-12 border border-black/5 premium-shadow flex flex-col items-center gap-8 relative overflow-hidden">
        {/* Ambient Ring Glow */}
        <div className="w-72 h-72 rounded-full border-8 border-secondary-gold/20 flex items-center justify-center relative shadow-inner bg-surface-container-lowest">
          <div
            className="absolute inset-0 rounded-full border-8 border-secondary-gold transition-all duration-1000"
            style={{
              clipPath: `polygon(0 0, 100% 0, 100% 100%, 0 100%)`,
              opacity: isRunning ? 1 : 0.4
            }}
          ></div>
          <div className="flex flex-col items-center gap-1 z-10">
            <span className="text-5xl md:text-6xl font-black text-primary tracking-tighter font-mono">
              {formatTime(timeLeftSeconds)}
            </span>
            <span className="text-xs font-bold text-secondary-gold uppercase tracking-widest">
              {isRunning ? 'CHAMBER ACTIVE • 1.5X XP' : 'CHAMBER PAUSED'}
            </span>
          </div>
        </div>

        {/* Preset Selector */}
        <div className="flex items-center gap-3">
          {[15, 25, 45, 60, 90].map(mins => (
            <button
              key={mins}
              onClick={() => selectPreset(mins)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                durationMinutes === mins
                  ? 'bg-primary text-white shadow-md'
                  : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
              }`}
            >
              {mins} Mins
            </button>
          ))}
        </div>

        {/* Timer Control Buttons */}
        <div className="flex items-center gap-4">
          <button
            onClick={resetTimer}
            className="p-3.5 rounded-2xl bg-surface-container-low hover:bg-surface-container text-on-surface-variant transition-colors"
            title="Reset Timer"
          >
            <span className="material-symbols-outlined text-xl">restart_alt</span>
          </button>

          <button
            onClick={toggleTimer}
            className="gold-gradient hover:scale-105 active:scale-95 text-white font-extrabold px-8 py-4 rounded-2xl text-base shadow-xl flex items-center gap-2 transition-transform"
          >
            <span className="material-symbols-outlined text-2xl">
              {isRunning ? 'pause' : 'play_arrow'}
            </span>
            {isRunning ? 'Pause Focus' : 'Start Focus Chamber'}
          </button>
        </div>

        {/* Ambient Sound Audio Selector */}
        <div className="w-full pt-6 border-t border-black/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="text-xs font-bold text-primary flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary-gold">graphic_eq</span>
            Ambient Background Audio
          </span>
          <div className="flex items-center gap-2">
            {[
              { id: 'quiet', label: 'Digital Quiet' },
              { id: 'rain', label: 'Rainfall' },
              { id: 'synth', label: 'Cyber Synth' },
              { id: 'white', label: 'White Noise' },
            ].map(snd => (
              <button
                key={snd.id}
                onClick={() => setAmbientSound(snd.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  ambientSound === snd.id
                    ? 'bg-secondary-gold/20 text-secondary-gold font-bold border border-secondary-gold/40'
                    : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
                }`}
              >
                {snd.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
