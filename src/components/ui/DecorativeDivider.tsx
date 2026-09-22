import React from 'react';

interface DecorativeDividerProps {
  className?: string;
}

export function DecorativeDivider({ className = 'mt-3' }: DecorativeDividerProps) {
  return (
    <div
      className={`flex items-center justify-center gap-2.5 sm:gap-3 ${className}`}
      aria-hidden="true"
    >
      <span className="w-8 sm:w-10 h-[1px] bg-[#C89748] shrink-0" />
      <svg
        viewBox="0 0 24 24"
        className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#C89748] fill-current shrink-0"
        aria-hidden="true"
      >
        <path d="M12 0 C12 6.627 17.373 12 24 12 C17.373 12 12 17.373 12 24 C12 17.373 6.627 12 0 12 C6.627 12 12 6.627 12 0 Z" />
      </svg>
      <span className="w-8 sm:w-10 h-[1px] bg-[#C89748] shrink-0" />
    </div>
  );
}
