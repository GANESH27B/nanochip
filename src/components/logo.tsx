import { Package } from 'lucide-react';
import { cn } from '@/lib/utils';
import React from 'react';

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Package className="h-6 w-6" />
      <span className="text-lg font-semibold">PharmaChain</span>
    </div>
  );
}
