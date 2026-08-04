import React from 'react';

export function StatCard({ label, value, color = 'text-primary' }) {
  return (
    <div className="p-3.5 rounded-2xl bg-surface-subtle border border-border-subtle flex flex-col">
      <span className="text-[10px] font-bold text-primary-muted uppercase tracking-wider">{label}</span>
      <span className={`text-xl font-black ${color}`}>{value}</span>
    </div>
  );
}
