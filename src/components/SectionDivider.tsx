import React from 'react';

interface SectionDividerProps {
  type?: 'cross' | 'scroll' | 'simple';
}

export default function SectionDivider({ type = 'simple' }: SectionDividerProps) {
  return (
    <div className="flex items-center justify-center py-10 select-none">
      <div className="flex items-center gap-4 w-full max-w-xs justify-center">
        {/* Left Golden Line */}
        <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-yellow-500/50 to-yellow-500/70" />

        {/* Center Aesthetic */}
        {type === 'cross' && (
          <div className="relative flex items-center justify-center w-8 h-8 rounded-full border border-yellow-500/30 bg-ivory-50/10 dark:bg-neutral-900/10 backdrop-blur-sm shadow-sm group">
            {/* Cross SVG Indicator */}
            <svg
              className="w-4 h-5 text-yellow-600 dark:text-yellow-500 fill-yellow-600 dark:fill-yellow-500 hover:scale-110 transition-transform duration-300"
              viewBox="0 0 100 120"
            >
              <rect x="42" y="10" width="16" height="100" rx="4" />
              <rect x="15" y="35" width="70" height="16" rx="4" />
            </svg>
            <div className="absolute inset-0 rounded-full border-2 border-yellow-500/20 animate-ping group-hover:block hidden" />
          </div>
        )}

        {type === 'scroll' && (
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-yellow-500/40" />
            <div className="w-2.5 h-2.5 rounded-full border border-yellow-500/65 rotate-45 flex items-center justify-center">
              <div className="w-1 h-1 bg-yellow-500" />
            </div>
            <div className="w-1.5 h-1.5 rounded-full bg-yellow-500/40" />
          </div>
        )}

        {type === 'simple' && (
          <div className="w-2 h-2 rounded-full bg-yellow-500/60" />
        )}

        {/* Right Golden Line */}
        <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-yellow-500/50 to-yellow-500/70" />
      </div>
    </div>
  );
}
