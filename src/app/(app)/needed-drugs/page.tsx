
'use client';

import { useState, useMemo } from 'react';
import AppHeader from '@/components/app/header';
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

type Drug = {
  id: string;
  name: string;
  currentStock: number;
  reorderLevel: number;
  priority: 'High' | 'Medium' | 'Low';
};

type SortKey = keyof Drug | '';
type SortDirection = 'asc' | 'desc';

const initialNeededDrugs: Drug[] = [
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
  const [neededDrugs, setNeededDrugs] = useState(initialNeededDrugs);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDrugName, setSelectedDrugName] = useState('');
  const [filterTerm, setFilterTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: SortDirection }>({ key: 'priority', direction: 'desc' });
  const { toast } = useToast();
  
  const handleOrderSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const drugName = formData.get('drug-name') as string;
    const quantity = parseInt(formData.get('quantity') as string, 10);
    const reorderLevel = parseInt(formData.get('reorder-level') as string, 10);
    const currentStock = parseInt(formData.get('current-stock') as string, 10);
    const priority = formData.get('priority') as 'High' | 'Medium' | 'Low';
    
    const existingDrug = neededDrugs.find(d => d.name === drugName);

    if (!existingDrug) {
        const newDrug: Drug = {
            id: `DRUG-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
            name: drugName,
            currentStock: currentStock || 0,
            reorderLevel: reorderLevel || 0,
            priority: priority || 'Medium',
        };
        setNeededDrugs([newDrug, ...neededDrugs]);
        toast({
            title: 'Drug Added & Order Placed',
            description: `${newDrug.name} has been added. An order for ${quantity} units has been placed.`,
        });
    } else {
         toast({
            title: 'Order Placed',
            description: `Successfully ordered ${quantity} units of ${drugName}.`,
        });
    }

    setIsDialogOpen(false);
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
        drug.name.toLowerCase().includes(filterTerm.toLowerCase())
      );
    }
    
    if (sortConfig.key) {
      sortableItems.sort((a, b) => {
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
  }, [neededDrugs, filterTerm, sortConfig.key, sortConfig.direction]);

  const SortableHeader = ({ sortKey, children }: { sortKey: SortKey, children: React.ReactNode }) => (
    <TableHead onClick={() => requestSort(sortKey)} className="cursor-pointer">
      <div className="flex items-center gap-2">
        {children}
        <ArrowUpDown className="h-3 w-3" />
      </div>
    </TableHead>
  );

  return (
    <div className="flex min-h-screen w-full flex-col">
      <AppHeader title="Needed Drugs" />
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
                placeholder="Filter by drug name..."
                value={filterTerm}
                onChange={(e) => setFilterTerm(e.target.value)}
                className="w-full sm:w-auto"
              />
              <Button size="sm" className="h-9 gap-1 w-full sm:w-auto" onClick={handleNewOrderClick}>
                <PlusCircle className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  New Order
                </span>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <SortableHeader sortKey="name">Drug Name</SortableHeader>
                  <SortableHeader sortKey="currentStock">Current Stock</SortableHeader>
                  <SortableHeader sortKey="reorderLevel">Reorder Level</SortableHeader>
                  <SortableHeader sortKey="priority">Priority</SortableHeader>
                  <TableHead>
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedAndFilteredDrugs.map((drug) => (
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
                      <Button variant="outline" size="sm" className="gap-1" onClick={() => handleOrderNowClick(drug.name)}>
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
              {!selectedDrugName && (
                <>
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
              <Button type="submit">Place Order</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
