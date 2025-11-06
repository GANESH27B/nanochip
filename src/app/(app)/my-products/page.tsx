
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PlusCircle, Package, MoreHorizontal } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// In a real app, this would be a more complex type
type Product = {
  id: string;
  name: string;
  description: string;
  dosageForm?: string;
  routeOfAdministration?: string;
  activeIngredients?: string;
  manufacturerInfo?: string;
  processDescription?: string;
  stabilityData?: string;
  clinicalSummary?: string;
  labelingDetails?: string;
  applicantInfo?: string;
};

export default function MyProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleAddProduct = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const newProduct: Product = {
      id: `PROD-${Date.now()}`,
      name: formData.get('product-name') as string,
      description: formData.get('product-description') as string,
      dosageForm: formData.get('dosage-form') as string,
      routeOfAdministration: formData.get('route-of-administration') as string,
      activeIngredients: formData.get('active-ingredients') as string,
      manufacturerInfo: formData.get('manufacturer-info') as string,
      processDescription: formData.get('process-description') as string,
      stabilityData: formData.get('stability-data') as string,
      clinicalSummary: formData.get('clinical-summary') as string,
      labelingDetails: formData.get('labeling-details') as string,
      applicantInfo: formData.get('applicant-info') as string,
    };

    setProducts(prev => [...prev, newProduct]);
    setIsDialogOpen(false);
    toast({
      title: 'Product Added',
      description: `${newProduct.name} has been added to your products.`,
    });
  };

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>My Products</CardTitle>
            <CardDescription>
              Manage your product listings and inventory.
            </CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-1">
                <PlusCircle className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  New Product
                </span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <form onSubmit={handleAddProduct}>
                <DialogHeader>
                  <DialogTitle>Add New Product</DialogTitle>
                  <DialogDescription>
                    Fill in the details to add a new product to your catalog.
                  </DialogDescription>
                </DialogHeader>
                <ScrollArea className="h-[60vh] p-1">
                <div className="grid gap-4 py-4 px-4">
                  <div className="grid gap-2">
                    <Label htmlFor="product-name">Product Name (Brand & Generic)</Label>
                    <Input id="product-name" name="product-name" required />
                  </div>
                   <div className="grid gap-2">
                    <Label htmlFor="product-description">Description</Label>
                    <Textarea id="product-description" name="product-description" required />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="dosage-form">Dosage Form and Strength</Label>
                    <Input id="dosage-form" name="dosage-form" required />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="route-of-administration">Route of Administration</Label>
                    <Input id="route-of-administration" name="route-of-administration" required />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="active-ingredients">Active Ingredient(s) and Composition</Label>
                    <Textarea id="active-ingredients" name="active-ingredients" required />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="manufacturer-info">Manufacturer Name & Address</Label>
                    <Textarea id="manufacturer-info" name="manufacturer-info" required />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="process-description">Manufacturing Process Description</Label>
                    <Textarea id="process-description" name="process-description" required />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="stability-data">Stability Data and Shelf Life</Label>
                    <Input id="stability-data" name="stability-data" required />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="clinical-summary">Clinical Study Summary (Safety & Efficacy Data)</Label>
                    <Textarea id="clinical-summary" name="clinical-summary" required />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="labeling-details">Labeling and Packaging Details</Label>
                    <Textarea id="labeling-details" name="labeling-details" required />
                  </div>
                   <div className="grid gap-2">
                    <Label htmlFor="applicant-info">Applicant / Company Information</Label>
                    <Input id="applicant-info" name="applicant-info" required />
                  </div>
                </div>
                </ScrollArea>
                <DialogFooter className="pt-4 border-t">
                  <Button type="submit">Add Product</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {products.length === 0 ? (
            <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm h-96">
              <div className="flex flex-col items-center gap-1 text-center">
                <Package className="h-12 w-12 text-muted-foreground" />
                <h3 className="text-2xl font-bold tracking-tight">
                  You have no products yet.
                </h3>
                <p className="text-sm text-muted-foreground">
                  Start by adding a new product to your inventory.
                </p>
              </div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product Name</TableHead>
                  <TableHead>Dosage Form</TableHead>
                  <TableHead>
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>{product.dosageForm}</TableCell>
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
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
