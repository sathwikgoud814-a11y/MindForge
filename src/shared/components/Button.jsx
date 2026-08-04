import React from 'react';

export function Button({
  children,
  onClick,
  variant = 'gold', // 'gold' | 'primary' | 'subtle' | 'emerald'
  size = 'md', // 'sm' | 'md' | 'lg'
  className = '',
  disabled = false,
  type = 'button',
  icon = null,
}) {
  const baseStyle = 'font-extrabold rounded-2xl transition-all flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed';

  const variants = {
    gold: 'gold-gradient text-white shadow-md hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50',
    primary: 'bg-primary hover:bg-black text-white shadow-sm disabled:opacity-50',
    subtle: 'bg-surface-subtle hover:bg-surface text-primary-muted hover:text-primary border border-border-subtle',
    emerald: 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-sm',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2.5 text-xs',
    lg: 'px-6 py-3.5 text-sm',
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {icon && <span className="material-symbols-outlined text-base">{icon}</span>}
      {children}
    </button>
  );
}
