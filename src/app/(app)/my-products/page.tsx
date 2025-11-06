
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PlusCircle, Package } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

// In a real app, this would be a more complex type
type Product = {
  id: string;
  name: string;
  description: string;
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
            <DialogContent>
              <form onSubmit={handleAddProduct}>
                <DialogHeader>
                  <DialogTitle>Add New Product</DialogTitle>
                  <DialogDescription>
                    Fill in the details to add a new product to your catalog.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="product-name" className="text-right">
                      Name
                    </Label>
                    <Input id="product-name" name="product-name" className="col-span-3" required />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="product-description" className="text-right">
                      Description
                    </Label>
                    <Input id="product-description" name="product-description" className="col-span-3" required />
                  </div>
                </div>
                <DialogFooter>
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
            <div>
              {/* This is where you would list the products in a table or grid */}
              <p>You have {products.length} product(s).</p>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
