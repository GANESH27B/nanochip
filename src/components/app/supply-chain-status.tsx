'use client';

import { cn } from '@/lib/utils';
import type { Shipment, SupplyChainStage } from '@/lib/types';
import { Factory, Truck, Store, PackageCheck, Beaker, Smile } from 'lucide-react';
import { users } from '@/lib/data';

const stageIcons: { [key in SupplyChainStage]: React.ElementType } = {
  'Ingredient Supplier': Beaker,
  Manufacturer: Factory,
  Distributor: Truck,
  Pharmacy: Store,
  Patient: Smile,
};

const STAGES: SupplyChainStage[] = ['Ingredient Supplier', 'Manufacturer', 'Distributor', 'Pharmacy', 'Patient'];

export default function SupplyChainStatus({ shipment }: { shipment: Shipment }) {
  const getActiveStageIndex = () => {
    if (!shipment.history || shipment.history.length === 0) {
      return 0; // Default to Manufacturer if no history
    }

    const lastEntry = shipment.history[shipment.history.length - 1];
    const holder = Object.values(users).find(u => u.name === lastEntry.holder);
    if (!holder) return 0;
    
    if (shipment.status === 'Delivered') {
      const pharmacyIndex = STAGES.indexOf('Pharmacy');
      const holderRole = holder.role as SupplyChainStage;
      if (holderRole === 'Pharmacy') {
        return pharmacyIndex;
      }
    }


    switch (holder.role) {
      case 'Ingredient Supplier':
        return 0;
      case 'Manufacturer':
        return 1;
      case 'Distributor':
        return 2;
      case 'Pharmacy':
        return 3;
      case 'Patient':
        return 4;
      default:
        // For roles like FDA, find the last non-regulatory holder
        for (let i = shipment.history.length - 2; i >= 0; i--) {
            const prevHolder = Object.values(users).find(u => u.name === shipment.history![i].holder);
            if (prevHolder && STAGES.includes(prevHolder.role as SupplyChainStage)) {
                return STAGES.indexOf(prevHolder.role as SupplyChainStage);
            }
        }
        return 0;
    }
  };
  
  const activeStageIndex = getActiveStageIndex();
  
  const isCompleted = shipment.status === 'Delivered';

  return (
    <div className="relative">
      <div
        className="absolute left-0 top-1/2 -translate-y-1/2 h-1 w-full bg-muted"
        aria-hidden="true"
      />
      <div
        className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-primary transition-all duration-500"
        style={{ width: isCompleted ? '100%' : `${(activeStageIndex / (STAGES.length - 1)) * 100}%` }}
        aria-hidden="true"
      />
      <div className="relative flex justify-between">
        {STAGES.map((stage, index) => {
          const Icon = stageIcons[stage];
          const isActive = index === activeStageIndex && !isCompleted;
          const isPassed = index < activeStageIndex || (isCompleted && index < STAGES.length -1);
          const isFinalDelivered = isCompleted && index === STAGES.length - 1;

          return (
            <div key={stage} className="flex flex-col items-center gap-2 text-center w-20">
              <div
                className={cn(
                  'flex h-10 w-10 items-center justify-center rounded-full border-2 bg-background transition-colors',
                  (isPassed || isFinalDelivered) ? 'border-primary bg-primary/10 text-primary' : 'border-muted-foreground/50 text-muted-foreground',
                  isActive && 'animate-pulse'
                )}
              >
                {isFinalDelivered ? <PackageCheck className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
              </div>
              <p
                className={cn(
                  'text-xs font-medium',
                  (isPassed || isFinalDelivered) ? 'text-primary' : 'text-muted-foreground',
                  isActive && 'font-bold'
                )}
              >
                {stage}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
