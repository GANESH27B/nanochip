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
        className="h-8 w-8 text-primary"
      >
        <path
          d="M16 2.66666C8.63636 2.66666 2.66666 8.63636 2.66666 16C2.66666 23.3636 8.63636 29.3333 16 29.3333C23.3636 29.3333 29.3333 23.3636 29.3333 16C29.3333 8.63636 23.3636 2.66666 16 2.66666ZM20 21.3333H17.3333V16H12V13.3333H17.3333V8H20V21.3333Z"
          fill="currentColor"
        />
      </svg>
      <div className="flex flex-col">
         <span className="text-xs text-muted-foreground">Take it easy</span>
         <span className="text-xl font-bold leading-tight">PharmEasy</span>
      </div>
    </div>
  );
}
