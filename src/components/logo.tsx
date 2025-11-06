import { cn } from '@/lib/utils';
import React from 'react';

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <svg width="32" height="32" viewBox="0 0 138 138" fill="none" xmlns="http://www.w3.org/2000/svg">
        <title>PharmEasy Logo</title>
        <path d="M68.9999 0C30.8899 0 0 30.8899 0 69C0 107.11 30.8899 138 68.9999 138C107.11 138 138 107.11 138 69C138 30.8899 107.11 0 68.9999 0ZM91.4924 49.3336L58.2619 82.5641C57.6534 83.1726 56.8144 83.5029 55.9399 83.5029C55.0654 83.5029 54.2264 83.1726 53.6179 82.5641L45.5132 74.4594C44.2879 73.2341 44.2879 71.2186 45.5132 70.0016C46.7384 68.7764 48.7539 68.7764 49.9792 70.0016L55.9399 75.9624L87.0286 44.8736C88.2539 43.6484 90.2694 43.6484 91.4946 44.8736C92.7116 46.0989 92.7116 48.1144 91.4924 49.3334V49.3336Z" fill="#13A183"/>
      </svg>
      <div className="flex flex-col">
        <span className="text-xs text-muted-foreground">Take it easy</span>
        <span className="text-xl font-bold text-primary">PharmEasy</span>
      </div>
    </div>
  );
}
