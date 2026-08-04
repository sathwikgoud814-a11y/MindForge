import React from 'react';
import { useSystem } from '../../context/SystemContext';

export function DuelResultModal() {
  const { duelResultOverlay, setDuelResultOverlay, setViewingDuel, startDuel } = useSystem();

  if (!duelResultOverlay.open || !duelResultOverlay.duel) return null;

  const d = duelResultOverlay.duel;
  const userPts = d.userScore || 0;
  const oppPts = d.opponentScore || 0;

  let title = 'VICTORY ACCOMPLISHED!';
  let subtitle = 'You won the Duel Arena!';
  let icon = '👑';
  let badge = '🏆 Duel Champion Badge';
  let xpText = `+${d.xpEarned || 300} XP`;
  let dpText = `+${d.dpEarned || 150} DP`;
  let bullet1 = `• You outperformed your opponent with ${userPts} total discipline points.`;
  let bullet2 = `• Primary category focus directives yielded maximum growth velocity.`;

  if (d.outcome === 'STALEMATE_ZERO' || (userPts === 0 && oppPts === 0)) {
    title = 'STALEMATE (0 - 0)';
    subtitle = 'Zero Discipline Engagement — Neither hunter logged progress during the duel timeframe.';
    icon = '⚖️';
    badge = '⚠️ No Rewards Distributed';
    xpText = '0 XP';
    dpText = '0 DP';
    bullet1 = '• Neither player executed directives or focus blocks before expiration.';
    bullet2 = '• Set actionable daily directives to score points during your next match.';
  } else if (d.outcome === 'DRAW' || userPts === oppPts) {
    title = `HONORABLE DRAW (${userPts} - ${oppPts})`;
    subtitle = 'Shared Mastery! Both hunters achieved equal discipline scores!';
    icon = '🤝';
    badge = '🏆 Shared Mastery Badge';
    xpText = `+${d.xpEarned || 150} XP`;
    dpText = `+${d.dpEarned || 75} DP`;
    bullet1 = `• Equal points (${userPts} PTS) achieved through identical discipline execution.`;
    bullet2 = '• Both players share victory rewards equally!';
  } else if (d.outcome === 'RUNNER_UP' || userPts < oppPts) {
    title = `RUNNER-UP (${userPts} - ${oppPts})`;
    subtitle = 'Solid effort! Your opponent took the lead, but you earned consolation XP.';
    icon = '🛡️';
    badge = '🛡️ Consolation Mastery';
    xpText = `+${d.xpEarned || 50} XP`;
    dpText = '0 DP';
    bullet1 = `• Your opponent scored ${oppPts} PTS vs your ${userPts} PTS.`;
    bullet2 = '• Increase your daily focus block duration to gain the upper hand in rematches.';
  }

  const handleRematch = () => {
    const opp = d.opponent;
    setDuelResultOverlay({ open: false, duel: null });
    startDuel(opp, d.duration, d.category);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in zoom-in-95 duration-300">
      <div className="bg-surface w-full max-w-lg rounded-3xl p-8 shadow-2xl border border-border-gold text-center flex flex-col items-center gap-6 relative overflow-hidden">
        {/* Outcome Header Icon */}
        <div className="w-24 h-24 rounded-full gold-gradient flex items-center justify-center text-white text-5xl font-black shadow-xl animate-bounce">
          {icon}
        </div>

        <div>
          <span className="text-xs font-black tracking-widest text-gold uppercase">Duel Concluded</span>
          <h2 className="text-3xl font-black text-primary tracking-tight mt-1">{title}</h2>
          <p className="text-xs font-bold text-gold mt-1">{subtitle}</p>
        </div>

        {/* Winner & Draw Score Details */}
        <div className="w-full bg-surface-subtle p-5 rounded-2xl border border-border-subtle flex flex-col gap-3 text-xs">
          <div className="flex justify-between items-center font-black pb-2 border-b border-border-subtle">
            <span className="text-primary-muted">Rewards Earned</span>
            <span className="text-gold flex items-center gap-2">
              <span>{xpText}</span> • <span>{dpText}</span> • <span>{badge}</span>
            </span>
          </div>

          <div className="flex flex-col gap-1.5 text-left pt-1">
            <span className="text-[10px] font-bold text-primary-muted uppercase">Constructive Analysis</span>
            <ul className="flex flex-col gap-1 text-[11px] text-primary font-medium">
              <li>{bullet1}</li>
              <li>{bullet2}</li>
              <li>• Both Hunters increased consistency attributes (+12 XP).</li>
            </ul>
          </div>
        </div>

        {/* Action Suite: Rematch, Share Result, Back to Hunters */}
        <div className="flex flex-col gap-2.5 w-full">
          <button
            onClick={handleRematch}
            className="w-full gold-gradient text-white font-extrabold py-3.5 rounded-2xl text-sm shadow-md hover:scale-105 transition-transform flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-lg">swords</span>
            Issue Immediate Rematch
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => alert('Duel Result Link copied to clipboard!')}
              className="py-3 rounded-2xl bg-surface-subtle text-primary font-bold text-xs border border-border-subtle hover:bg-surface"
            >
              Share Result
            </button>
            <button
              onClick={() => {
                setDuelResultOverlay({ open: false, duel: null });
                setViewingDuel(null);
              }}
              className="py-3 rounded-2xl bg-surface-subtle text-primary-muted font-bold text-xs hover:text-primary"
            >
              Back to Hunters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
