'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Package } from 'lucide-react';

export default function MyProductsPage() {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <Card>
        <CardHeader>
          <CardTitle>My Products</CardTitle>
          <CardDescription>
            Manage your product listings and inventory.
          </CardDescription>
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>
    </main>
  );
}

    