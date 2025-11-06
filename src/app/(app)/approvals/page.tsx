'use client';

import { useMemo, useState } from 'react';
import { format } from 'date-fns';
import { MoreHorizontal, Check, X } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { shipments as initialShipments } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useSearch } from '@/hooks/use-search';
import type { Shipment, ShipmentStatus } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

const statusStyles: { [key: string]: string } = {
  'In-Transit': 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
  Delivered: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
  'Requires-Approval': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
  Pending: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
};

export default function ApprovalsPage() {
  const { searchTerm } = useSearch();
  const [shipments, setShipments] = useState<Shipment[]>(initialShipments.filter(s => s.status === 'Requires-Approval'));
  const { toast } = useToast();
  const router = useRouter();

  const filteredShipments = useMemo(() => {
    if (!searchTerm) {
      return shipments;
    }
    return shipments.filter((shipment) =>
      shipment.batchId.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, shipments]);

  const handleUpdateStatus = (batchId: string, newStatus: ShipmentStatus) => {
    setShipments(prevShipments => prevShipments.filter(s => s.batchId !== batchId));
    toast({
      title: `Shipment ${newStatus === 'Delivered' ? 'Approved' : 'Rejected'}`,
      description: `Batch ${batchId} status has been updated.`,
    });
    // In a real app, you'd also update the main shipments list
  };

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <Card>
        <CardHeader>
          <CardTitle>Awaiting FDA Review</CardTitle>
          <CardDescription>
            These shipments require regulatory approval before proceeding.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Batch ID</TableHead>
                <TableHead>Current Holder</TableHead>
                <TableHead className="hidden md:table-cell">Created At</TableHead>
                <TableHead className="text-right">Alerts</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredShipments.length > 0 ? (
                filteredShipments.map((shipment) => (
                  <TableRow key={shipment.batchId}>
                    <TableCell className="font-medium">{shipment.batchId}</TableCell>
                    <TableCell>{shipment.currentHolder}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      {format(new Date(shipment.createdAt), 'dd/MM/yyyy')}
                    </TableCell>
                    <TableCell className="text-right">{shipment.alerts}</TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-2">
                         <Button
                            size="sm"
                            variant="outline"
                            onClick={() => router.push(`/shipments/${shipment.batchId}`)}
                          >
                            View Details
                          </Button>
                         <Button size="sm" onClick={() => handleUpdateStatus(shipment.batchId, 'Delivered')}>
                              <Check className="mr-2 h-4 w-4" /> Approve
                          </Button>
                         <Button size="sm" variant="destructive" onClick={() => handleUpdateStatus(shipment.batchId, 'In-Transit')}>
                             <X className="mr-2 h-4 w-4" /> Reject
                         </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    No shipments currently awaiting approval.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </main>
  );
}
