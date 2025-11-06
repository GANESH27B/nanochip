'use client';

import { useState } from 'react';
import { PlusCircle } from 'lucide-react';
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
import { rawMaterials as initialRawMaterials } from '@/lib/data';
import type { RawMaterial } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useRouter } from 'next/navigation';

const statusStyles: { [key: string]: string } = {
  'In-Stock': 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
  'Low-Stock': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
  'Out-of-Stock': 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
  Shipped: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
};

export default function RawMaterialsPage() {
  const [rawMaterials, setRawMaterials] = useState<RawMaterial[]>(initialRawMaterials);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const router = useRouter();


  const handleAddMaterial = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const newMaterial: RawMaterial = {
      id: `RM-NEW-${Math.floor(Math.random() * 90000) + 10000}`,
      name: formData.get('name') as string,
      supplier: formData.get('supplier') as string,
      lotNumber: `LOT-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
      quantity: parseInt(formData.get('quantity') as string, 10),
      units: formData.get('units') as 'kg' | 'g' | 'L' | 'mL',
      status: 'In-Stock',
    };
    setRawMaterials([newMaterial, ...rawMaterials]);
    setIsDialogOpen(false);
    toast({
      title: 'Material Added',
      description: `New material ${newMaterial.name} has been added to your inventory.`,
    });
  };

  const handleShipMaterial = (materialId: string) => {
    // This logic should now likely open a shipment creation dialog
    // For now, it will mark as shipped and redirect
    setRawMaterials(prev => prev.map(m => m.id === materialId ? {...m, status: 'Shipped'} : m));
    toast({
        title: 'Material Shipped',
        description: 'The material has been marked as shipped. You can now create the shipment.',
    });
    router.push('/shipments');
  };
  
  return (
    <div className="flex min-h-screen w-full flex-col">
      <AppHeader title="Raw Materials" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Inventory</CardTitle>
              <CardDescription>
                Manage your stock of raw materials.
              </CardDescription>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="gap-1">
                  <PlusCircle className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Add Material
                  </span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleAddMaterial}>
                  <DialogHeader>
                    <DialogTitle>Add New Material</DialogTitle>
                    <DialogDescription>
                      Fill in the details for the new raw material.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="name" className="text-right">
                        Name
                      </Label>
                      <Input id="name" name="name" required className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="supplier" className="text-right">
                        Supplier
                      </Label>
                      <Input id="supplier" name="supplier" required className="col-span-3" />
                    </div>
                     <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="quantity" className="text-right">
                        Quantity
                      </Label>
                      <Input id="quantity" name="quantity" type="number" required className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="units" className="text-right">
                        Units
                        </Label>
                         <Select name="units" defaultValue="kg">
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select units" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="kg">kg</SelectItem>
                                <SelectItem value="g">g</SelectItem>
                                <SelectItem value="L">L</SelectItem>
                                <SelectItem value="mL">mL</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit">Add to Inventory</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Lot Number</TableHead>
                  <TableHead>Material Name</TableHead>
                  <TableHead>Supplier</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rawMaterials.map((material) => (
                  <TableRow key={material.id}>
                    <TableCell className="font-medium">{material.lotNumber}</TableCell>
                    <TableCell>{material.name}</TableCell>
                     <TableCell>{material.supplier}</TableCell>
                    <TableCell>{material.quantity.toLocaleString()} {material.units}</TableCell>
                    <TableCell>
                      <Badge className={`border-transparent ${statusStyles[material.status]}`}>
                        {material.status.replace('-', ' ')}
                      </Badge>
                    </TableCell>
                     <TableCell className="text-right">
                        {material.status === 'In-Stock' && (
                            <Button variant="outline" size="sm" onClick={() => handleShipMaterial(material.id)}>
                                Ship to Manufacturer
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
    </div>
  );
}
