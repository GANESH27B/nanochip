'use client';

import { useMemo, useState } from 'react';
import { format } from 'date-fns';
import Link from 'next/link';
import { MoreHorizontal, PlusCircle } from 'lucide-react';
import AppHeader from '@/components/app/header';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useSearch } from '@/hooks/use-search';
import type { Shipment } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

const statusStyles: { [key: string]: string } = {
  'In-Transit': 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
  Delivered: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
  'Requires-Approval': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
  Pending: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
};

export default function ShipmentsPage() {
  const { searchTerm } = useSearch();
  const [shipments, setShipments] = useState<Shipment[]>(initialShipments);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const filteredShipments = useMemo(() => {
    if (!searchTerm) {
      return shipments;
    }
    return shipments.filter((shipment) =>
      shipment.batchId.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, shipments]);

  const handleCreateShipment = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const now = new Date();
    const newShipment: Shipment = {
      batchId: formData.get('batchId') as string,
      currentHolder: formData.get('currentHolder') as string,
      startingPoint: formData.get('startingPoint') as string,
      endingPoint: formData.get('endingPoint') as string,
      status: 'Pending',
      createdAt: now.toISOString(),
      alerts: 0,
      lastUpdate: now.toISOString(),
    };
    setShipments([newShipment, ...shipments]);
    setIsDialogOpen(false);
    toast({
      title: 'Shipment Created',
      description: `Shipment for batch ${newShipment.batchId} has been created.`,
    });
  };

  return (
    <div className="flex min-h-screen w-full flex-col">
      <AppHeader title="Shipments" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Card className="animate-fade-in-up">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>All Shipments</CardTitle>
              <CardDescription>
                Track and manage all pharmaceutical shipments across the supply chain.
              </CardDescription>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="gap-1">
                  <PlusCircle className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    New Shipment
                  </span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleCreateShipment}>
                  <DialogHeader>
                    <DialogTitle>Create New Shipment</DialogTitle>
                    <DialogDescription>
                      Fill in the details for the new shipment.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="batchId" className="text-right">
                        Batch ID
                      </Label>
                      <Input id="batchId" name="batchId" required className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="currentHolder" className="text-right">
                        Holder
                      </Label>
                      <Input id="currentHolder" name="currentHolder" required className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="startingPoint" className="text-right">
                            Starting Point
                        </Label>
                        <Input id="startingPoint" name="startingPoint" required className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="endingPoint" className="text-right">
                            Ending Point
                        </Label>
                        <Input id="endingPoint" name="endingPoint" required className="col-span-3" />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit">Create Shipment</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Batch ID</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden md:table-cell">Current Holder</TableHead>
                  <TableHead className="hidden md:table-cell">Created At</TableHead>
                  <TableHead className="text-right">Alerts</TableHead>
                  <TableHead>
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredShipments.map((shipment, index) => (
                  <TableRow key={shipment.batchId} className="animate-fade-in-up" style={{ animationDelay: `${index * 0.05}s` }}>
                    <TableCell className="font-medium">{shipment.batchId}</TableCell>
                    <TableCell>
                      <Badge
                        className={`border-transparent ${statusStyles[shipment.status]}`}
                      >
                        {shipment.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{shipment.currentHolder}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      {format(new Date(shipment.createdAt), 'dd/MM/yyyy')}
                    </TableCell>
                    <TableCell className="text-right">{shipment.alerts}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button aria-haspopup="true" size="icon" variant="ghost">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Toggle menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem asChild>
                            <Link href={`/shipments/${shipment.batchId}`}>View Details</Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem>Acknowledge Alerts</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
