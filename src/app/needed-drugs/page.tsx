

'use client';

import { useState, useMemo, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, ShoppingCart, ArrowUpDown } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { neededDrugs as initialNeededDrugs } from '@/lib/data';
import type { Drug, Role } from '@/lib/types';

type SortKey = keyof Drug | '';
type SortDirection = 'asc' | 'desc';

const priorityStyles: { [key: string]: string } = {
  High: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
  Medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
  Low: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
};

export default function NeededDrugsPage() {
  const [neededDrugs, setNeededDrugs] = useState(initialNeededDrugs);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDrugName, setSelectedDrugName] = useState('');
  const [filterTerm, setFilterTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: SortDirection }>({ key: 'priority', direction: 'desc' });
  const [userRole, setUserRole] = useState<Role | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const role = localStorage.getItem('userRole') as Role;
    if (role) {
      setUserRole(role);
    }
  }, []);
  
  const handleOrderSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const drugName = formData.get('drug-name') as string;
    const quantity = parseInt(formData.get('quantity') as string, 10);

    const newDrugRequest: Drug = {
      id: `DRUG-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      name: drugName,
      currentStock: parseInt(formData.get('current-stock') as string, 10) || 0,
      reorderLevel: parseInt(formData.get('reorder-level') as string, 10) || 50,
      priority: (formData.get('priority') as 'High' | 'Medium' | 'Low') || 'Medium',
      requestedBy: (formData.get('requested-by') as string) || 'Internal Request',
    };

    // Add to the list
    setNeededDrugs(prevDrugs => [newDrugRequest, ...prevDrugs]);
    
    // Simulate invoice generation
    const invoiceItems = [{
        name: drugName,
        quantity: quantity,
        price: Math.round(quantity * 1.5 * 100) / 100 // Simulate a price
    }];
    localStorage.setItem('currentInvoice', JSON.stringify(invoiceItems));

    toast({
      title: 'Order Placed',
      description: `Successfully ordered ${quantity} units of ${drugName}.`,
    });

    setIsDialogOpen(false);
    router.push('/billing');
  };


  const handleOrderNowClick = (drugName: string) => {
    setSelectedDrugName(drugName);
    setIsDialogOpen(true);
  };
  
  const handleNewOrderClick = () => {
    setSelectedDrugName('');
    setIsDialogOpen(true);
  };
  
  const requestSort = (key: SortKey) => {
    let direction: SortDirection = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedAndFilteredDrugs = useMemo(() => {
    let sortableItems = [...neededDrugs];
    
    if (filterTerm) {
      sortableItems = sortableItems.filter(drug =>
        drug.name.toLowerCase().includes(filterTerm.toLowerCase()) ||
        drug.requestedBy.toLowerCase().includes(filterTerm.toLowerCase())
      );
    }
    
    if (sortConfig.key) {
      sortableItems.sort((a, b) => {
        if (sortConfig.key === 'priority') {
            const priorityOrder = { High: 3, Medium: 2, Low: 1 };
            const aValue = priorityOrder[a.priority];
            const bValue = priorityOrder[b.priority];
            if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
            if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        }

        const aValue = a[sortConfig.key!];
        const bValue = b[sortConfig.key!];
        
        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [neededDrugs, filterTerm, sortConfig]);

  const SortableHeader = ({ sortKey, children, className }: { sortKey: SortKey, children: React.ReactNode, className?: string }) => (
    <TableHead onClick={() => requestSort(sortKey)} className={cn("cursor-pointer", className)}>
      <div className="flex items-center gap-2">
        {children}
        <ArrowUpDown className="h-3 w-3" />
      </div>
    </TableHead>
  );

  return (
    <>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Card>
          <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="grid gap-2">
              <CardTitle>Drug Stock Levels</CardTitle>
              <CardDescription>
                List of drugs that are below their reorder level and require procurement.
              </CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-2">
              <Input
                placeholder="Filter by drug or requestor..."
                value={filterTerm}
                onChange={(e) => setFilterTerm(e.target.value)}
                className="w-full sm:w-auto"
              />
              {userRole === 'Manufacturer' && (
                <Button size="sm" className="h-9 gap-1 w-full sm:w-auto" onClick={handleNewOrderClick}>
                  <PlusCircle className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    New Order
                  </span>
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <SortableHeader sortKey="name">Drug Name</SortableHeader>
                  <SortableHeader sortKey="requestedBy">Requested By</SortableHeader>
                  <SortableHeader sortKey="currentStock">Current Stock</SortableHeader>
                  <SortableHeader sortKey="reorderLevel">Reorder Level</SortableHeader>
                  <SortableHeader sortKey="priority">Priority</SortableHeader>
                  <TableHead className="text-right">
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedAndFilteredDrugs.map((drug) => (
                  <TableRow key={drug.id}>
                    <TableCell className="font-medium">{drug.name}</TableCell>
                    <TableCell>{drug.requestedBy}</TableCell>
                    <TableCell>{drug.currentStock}</TableCell>
                    <TableCell>{drug.reorderLevel}</TableCell>
                    <TableCell>
                      <Badge className={`border-transparent ${priorityStyles[drug.priority]}`}>
                        {drug.priority}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {userRole === 'Manufacturer' && (
                        <Button variant="outline" size="sm" className="gap-1" onClick={() => handleOrderNowClick(drug.name)}>
                          <ShoppingCart className="h-3.5 w-3.5" />
                          Order Now
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>

       <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <form onSubmit={handleOrderSubmit}>
            <DialogHeader>
              <DialogTitle>Create Purchase Order</DialogTitle>
              <DialogDescription>
                Fill in the details to place a new drug order. If the drug is not in the list, it will be added.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="drug-name" className="text-right">
                  Drug Name
                </Label>
                <Input
                  id="drug-name"
                  name="drug-name"
                  defaultValue={selectedDrugName}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="quantity" className="text-right">
                  Order Quantity
                </Label>
                <Input
                  id="quantity"
                  name="quantity"
                  defaultValue="100"
                  type="number"
                  className="col-span-3"
                  required
                />
              </div>
              {!neededDrugs.find(d => d.name === selectedDrugName) && (
                <>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="requested-by" className="text-right">
                        Requested By
                        </Label>
                        <Input id="requested-by" name="requested-by" placeholder="e.g. General Hospital" className="col-span-3" required />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="current-stock" className="text-right">
                        Current Stock
                        </Label>
                        <Input id="current-stock" name="current-stock" defaultValue="0" type="number" className="col-span-3" required />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="reorder-level" className="text-right">
                        Reorder Level
                        </Label>
                        <Input id="reorder-level" name="reorder-level" defaultValue="50" type="number" className="col-span-3" required />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="priority" className="text-right">
                        Priority
                        </Label>
                         <Select name="priority" defaultValue="Medium">
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select priority" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="High">High</SelectItem>
                                <SelectItem value="Medium">Medium</SelectItem>
                                <SelectItem value="Low">Low</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </>
              )}
            </div>
            <DialogFooter>
              <Button type="submit">Place Order &amp; Proceed to Payment</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
