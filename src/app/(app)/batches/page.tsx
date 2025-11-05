'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { PlusCircle, MoreHorizontal } from 'lucide-react';
import AppHeader from '@/components/app/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
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
import { batches as initialBatches } from '@/lib/data';
import type { Batch } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

const statusStyles: { [key: string]: string } = {
  'In-Production': 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300',
  'Ready-for-Shipment': 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
  Shipped: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
};

export default function BatchesPage() {
  const [batches, setBatches] = useState<Batch[]>(initialBatches);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleCreateBatch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const newBatch: Batch = {
      id: `B-NEW-${Math.floor(Math.random() * 90000) + 10000}`,
      drugName: formData.get('drugName') as string,
      quantity: parseInt(formData.get('quantity') as string, 10),
      manufactureDate: new Date().toISOString(),
      expiryDate: new Date(new Date().setFullYear(new Date().getFullYear() + 2)).toISOString(),
      status: 'In-Production',
    };
    setBatches([newBatch, ...batches]);
    setIsDialogOpen(false);
    toast({
      title: 'Batch Created',
      description: `New batch ${newBatch.id} for ${newBatch.drugName} is now in production.`,
    });
  };

  const handleMarkAsReady = (batchId: string) => {
    setBatches((prevBatches) =>
      prevBatches.map((batch) =>
        batch.id === batchId ? { ...batch, status: 'Ready-for-Shipment' } : batch
      )
    );
    toast({
      title: 'Batch Updated',
      description: `Batch ${batchId} is now ready for shipment.`,
    });
  };

  const handleViewDetails = (batchId: string) => {
    router.push(`/shipments/${batchId}`);
  };

  return (
    <div className="flex min-h-screen w-full flex-col">
      <AppHeader title="Manage Batches" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Your Batches</CardTitle>
              <CardDescription>
                Manage the production and preparation of drug batches.
              </CardDescription>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="gap-1">
                  <PlusCircle className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    New Batch
                  </span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleCreateBatch}>
                  <DialogHeader>
                    <DialogTitle>Create New Batch</DialogTitle>
                    <DialogDescription>
                      Fill in the details to start a new production batch.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="drugName" className="text-right">
                        Drug Name
                      </Label>
                      <Input id="drugName" name="drugName" required className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="quantity" className="text-right">
                        Quantity
                      </Label>
                      <Input id="quantity" name="quantity" type="number" required className="col-span-3" />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit">Create Batch</Button>
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
                  <TableHead>Drug Name</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Manufacture Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {batches.map((batch) => (
                  <TableRow key={batch.id}>
                    <TableCell className="font-medium">{batch.id}</TableCell>
                    <TableCell>{batch.drugName}</TableCell>
                    <TableCell>{batch.quantity.toLocaleString()}</TableCell>
                    <TableCell>
                      {format(new Date(batch.manufactureDate), 'MM/dd/yyyy')}
                    </TableCell>
                    <TableCell>
                      <Badge className={`border-transparent ${statusStyles[batch.status]}`}>
                        {batch.status.replace('-', ' ')}
                      </Badge>
                    </TableCell>
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
                          <DropdownMenuItem
                            onClick={() => handleMarkAsReady(batch.id)}
                            disabled={batch.status !== 'In-Production'}
                          >
                            Mark as Ready
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleViewDetails(batch.id)}>
                            View Details
                          </DropdownMenuItem>
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
