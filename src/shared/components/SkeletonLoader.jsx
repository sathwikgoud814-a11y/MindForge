import React from 'react';

export function SkeletonLoader() {
  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto pb-12 animate-pulse">
      <div className="h-32 bg-surface-subtle rounded-3xl border border-border-subtle"></div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="h-48 bg-surface-subtle rounded-3xl border border-border-subtle"></div>
        <div className="h-48 bg-surface-subtle rounded-3xl border border-border-subtle"></div>
        <div className="h-48 bg-surface-subtle rounded-3xl border border-border-subtle"></div>
      </div>
    </div>
  );
}
