'use client';

import AppHeader from '@/components/app/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, ShoppingCart } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const neededDrugs = [
  {
    id: 'DRUG-001',
    name: 'Amoxicillin 500mg',
    currentStock: 50,
    reorderLevel: 100,
    priority: 'High',
  },
  {
    id: 'DRUG-002',
    name: 'Ibuprofen 200mg',
    currentStock: 120,
    reorderLevel: 200,
    priority: 'Medium',
  },
  {
    id: 'DRUG-003',
    name: 'Paracetamol 500mg',
    currentStock: 80,
    reorderLevel: 150,
    priority: 'High',
  },
  {
    id: 'DRUG-004',
    name: 'Cetirizine 10mg',
    currentStock: 250,
    reorderLevel: 300,
    priority: 'Low',
  },
  {
    id: 'DRUG-005',
    name: 'Omeprazole 20mg',
    currentStock: 30,
    reorderLevel: 75,
    priority: 'High',
  },
];

const priorityStyles: { [key: string]: string } = {
  High: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
  Medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
  Low: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
};


export default function NeededDrugsPage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <AppHeader title="Needed Drugs" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Card>
          <CardHeader className="flex flex-row items-center">
            <div className="grid gap-2">
              <CardTitle>Drug Stock Levels</CardTitle>
              <CardDescription>
                List of drugs that are below their reorder level and require procurement.
              </CardDescription>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="sm" className="h-7 gap-1">
                    <PlusCircle className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                      New Order
                    </span>
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create Purchase Order</DialogTitle>
                    <DialogDescription>
                      Fill in the details to place a new drug order.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="drug-name" className="text-right">
                        Drug Name
                      </Label>
                      <Input id="drug-name" defaultValue="Amoxicillin 500mg" className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="quantity" className="text-right">
                        Quantity
                      </Label>
                      <Input id="quantity" defaultValue="500" type="number" className="col-span-3" />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit">Place Order</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Drug Name</TableHead>
                  <TableHead>Current Stock</TableHead>
                  <TableHead>Reorder Level</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {neededDrugs.map((drug) => (
                  <TableRow key={drug.id}>
                    <TableCell className="font-medium">{drug.name}</TableCell>
                    <TableCell>{drug.currentStock}</TableCell>
                    <TableCell>{drug.reorderLevel}</TableCell>
                    <TableCell>
                        <Badge className={`border-transparent ${priorityStyles[drug.priority]}`}>
                            {drug.priority}
                        </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" className="gap-1">
                        <ShoppingCart className="h-3.5 w-3.5" />
                        Order Now
                      </Button>
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
