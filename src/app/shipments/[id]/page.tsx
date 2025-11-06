

'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Siren, Sparkles, Loader2, Thermometer, Droplets, Gauge, MapPin } from 'lucide-react';
import { shipments as initialShipments, alerts as allAlerts, users } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { useState, useEffect, useMemo } from 'react';
import type { Shipment, Role, ShipmentStatus } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { getAlertsSummary } from '@/app/actions';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useRouter } from 'next/navigation';
import SupplyChainStatus from '@/components/app/supply-chain-status';

export default function ShipmentDetailPage({ params }: { params: { id: string } }) {
  const [shipments, setShipments] = useState(initialShipments);
  const router = useRouter();
  const [id, setId] = useState<string | null>(null);

  useEffect(() => {
    if (params.id) {
      setId(params.id);
    }
  }, [params.id]);

  const shipment = useMemo(() => shipments.find(s => s.batchId === id), [shipments, id]);

  const [userRole, setUserRole] = useState<Role | null>(null);
  const [isSummaryLoading, setIsSummaryLoading] = useState(false);
  const [summary, setSummary] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const role = localStorage.getItem('userRole') as Role;
    if (role) {
      setUserRole(role);
    }
  }, []);

  const shipmentAlerts = allAlerts.filter(a => a.batchId === id);

  const handleUpdateStatus = (newStatus: ShipmentStatus, nextHolderName?: string) => {
    if (shipment) {
      const currentUser = userRole ? Object.values(users).find(u => u.role === userRole) : null;
      if (!currentUser) return;
      
      let nextHolder = nextHolderName ? Object.values(users).find(u => u.name === nextHolderName) : null;

      if (!nextHolder) {
        const currentHolderUser = Object.values(users).find(u => u.name === shipment.currentHolder);
        if (currentHolderUser?.role === 'Ingredient Supplier') nextHolder = Object.values(users).find(u => u.role === 'Manufacturer');
        else if (currentHolderUser?.role === 'Manufacturer') nextHolder = Object.values(users).find(u => u.role === 'Distributor');
        else if (currentHolderUser?.role === 'Distributor') nextHolder = Object.values(users).find(u => u.role === 'Pharmacy');
      }

      setShipments(currentShipments =>
        currentShipments.map(s =>
          s.batchId === shipment.batchId ? { 
              ...s, 
              status: newStatus,
              currentHolder: nextHolder?.name || currentUser.name,
              history: [...(s.history || []), { status: newStatus, holder: nextHolder?.name || currentUser.name, timestamp: new Date().toISOString() }]
          } : s
        )
      );
      toast({
        title: `Shipment Status Updated`,
        description: `Batch ${shipment.batchId} has been updated to "${newStatus.replace('-', ' ')}".`,
      });
    }
  };

  const handleSummarize = async () => {
    setIsSummaryLoading(true);
    const result = await getAlertsSummary({
      alerts: shipmentAlerts.map((a) => ({ ...a, type: a.type as string })),
    });
    setIsSummaryLoading(false);

    if (result.success && result.summary) {
      setSummary(result.summary);
      setIsDialogOpen(true);
    } else {
      toast({
        variant: 'destructive',
        title: 'Summarization Failed',
        description: result.error || 'Could not generate summary.',
      });
    }
  };
  
  if (!shipment) {
    return (
      <main className="flex flex-1 flex-col items-center justify-center gap-4 p-4 md:gap-8 md:p-8">
          <Loader2 className="h-8 w-8 animate-spin" />
          <p>Loading shipment details...</p>
      </main>
    );
  }

  const currentUser = userRole ? Object.values(users).find(u => u.role === userRole) : null;
  const canUpdateStatus = shipment.currentHolder === currentUser?.name && shipment.status === 'Pending';
  const canReceive = shipment.currentHolder !== currentUser?.name && shipment.status === 'In-Transit' && shipment.endingPoint === currentUser?.location;

  return (
    <>
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader className='flex-row items-center justify-between'>
            <CardTitle>Shipment Details</CardTitle>
             <Button onClick={() => router.push(`/shipments/track/${shipment.batchId}`)}>Track on map</Button>
          </CardHeader>
          <CardContent className="grid gap-4">
             <div className="space-y-2">
               <p className="text-sm font-medium text-muted-foreground">Status</p>
               <p>{shipment.status.replace('-', ' ')}</p>
             </div>
             <div className="space-y-4">
               <p className="text-sm font-medium text-muted-foreground">Supply Chain Status</p>
               <SupplyChainStatus shipment={shipment} />
             </div>
             <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Batch/Lot ID</p>
                <p>{shipment.batchId}</p>
              </div>
               <div>
                <p className="text-sm font-medium text-muted-foreground">Current Holder</p>
                <p>{shipment.currentHolder}</p>
              </div>
             </div>
             <div>
              <p className="text-sm font-medium text-muted-foreground">Route</p>
              <p>{shipment.startingPoint} to {shipment.endingPoint}</p>
            </div>
          </CardContent>
        </Card>
        <div className="lg:col-span-3 flex flex-col gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Live Conditions</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-6">
                <div className="flex items-center gap-3">
                  <Thermometer className="h-6 w-6 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Temperature</p>
                    <p className="font-semibold">6.2°C</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Droplets className="h-6 w-6 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Humidity</p>
                    <p className="font-semibold">58%</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Gauge className="h-6 w-6 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Pressure</p>
                    <p className="font-semibold">1012 hPa</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-6 w-6 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Location</p>
                    <p className="font-semibold">En route</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Alerts</CardTitle>
                  <CardDescription>Alerts triggered for this shipment.</CardDescription>
                </div>
                {shipmentAlerts.length > 0 && (
                  <Button onClick={handleSummarize} disabled={isSummaryLoading} size="sm">
                    {isSummaryLoading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Sparkles className="mr-2 h-4 w-4" />
                    )}
                    AI Summary
                  </Button>
                )}
              </CardHeader>
              <CardContent className="grid gap-4">
                  {shipmentAlerts.length > 0 ? (
                      shipmentAlerts.map(alert => (
                          <Alert key={alert.alertId} variant={alert.severity === "High" ? "destructive" : "default"}>
                              <Siren className="h-4 w-4" />
                              <AlertTitle>{alert.type}</AlertTitle>
                              <AlertDescription>{alert.details}</AlertDescription>
                          </Alert>
                      ))
                  ) : (
                      <p className="text-sm text-muted-foreground">No alerts for this shipment.</p>
                  )}
              </CardContent>
            </Card>
        </div>
      </div>
      {(canUpdateStatus || canReceive || userRole === 'FDA') && (
       <Card>
        <CardHeader>
          <CardTitle>Update Status</CardTitle>
           <CardDescription>
            Manually update the status of this shipment.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
           {canUpdateStatus && (
              <Button onClick={() => handleUpdateStatus('In-Transit')}>Mark as Shipped</Button>
           )}
           {canReceive && (
              <Button onClick={() => handleUpdateStatus('Delivered', currentUser?.name)}>Mark as Received</Button>
           )}
           {userRole === 'FDA' && shipment.status === 'Requires-Approval' && (
            <>
              <p className='text-sm text-muted-foreground'>As an FDA agent, you can approve or reject this batch.</p>
              <div className="flex gap-2">
                  <Button onClick={() => handleUpdateStatus('In-Transit')}>Approve Batch</Button>
                  <Button variant="destructive" onClick={() => handleUpdateStatus('Pending')}>Reject Batch</Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
      )}
    </main>
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              AI-Powered Alert Summary
            </DialogTitle>
            <DialogDescription>
              A summary of alerts for batch {shipment.batchId}.
            </DialogDescription>
          </DialogHeader>
          <div className="prose prose-sm dark:prose-invert max-h-[60vh] overflow-y-auto rounded-md border bg-muted/50 p-4">
            <p style={{ whiteSpace: 'pre-wrap' }}>{summary}</p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
