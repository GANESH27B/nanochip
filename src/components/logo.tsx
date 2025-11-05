import { cn } from '@/lib/utils';
import React from 'react';

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-primary"
      >
        <path
          d="M16 2.5L4 8.5V20.5L16 26.5L28 20.5V8.5L16 2.5Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M16 11V21"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M11 16H21"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className="text-xl font-bold text-primary">PharmaTrust</span>
    </div>
  );
}
