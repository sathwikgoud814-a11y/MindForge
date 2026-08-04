import React from 'react';

export function Card({ children, className = '', onClick = null, hover = false }) {
  return (
    <div
      onClick={onClick}
      className={`apple-card p-6 ${hover ? 'apple-card-hover cursor-pointer' : ''} ${className}`}
    >
      {children}
    </div>
  );
}
