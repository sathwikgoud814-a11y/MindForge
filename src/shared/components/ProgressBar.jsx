import React from 'react';

export function ProgressBar({ progressPct, height = 'h-3' }) {
  const pct = Math.min(100, Math.max(0, progressPct));

  return (
    <div className={`w-full bg-surface-subtle ${height} rounded-full overflow-hidden border border-border-subtle p-0.5`}>
      <div
        className="gold-gradient h-full rounded-full transition-all duration-500 shadow-sm"
        style={{ width: `${pct}%` }}
      ></div>
    </div>
  );
}
