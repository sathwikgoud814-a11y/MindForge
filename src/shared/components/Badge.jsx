import React from 'react';

export function Badge({ children, variant = 'gold' }) {
  const variants = {
    gold: 'gold-gradient text-white',
    primary: 'bg-primary text-white',
    subtle: 'bg-surface-subtle text-primary-muted border border-border-subtle',
    emerald: 'bg-emerald-500 text-white',
  };

  return (
    <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${variants[variant]}`}>
      {children}
    </span>
  );
}
