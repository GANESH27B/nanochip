
'use client';

import { useMemo, useState } from 'react';
import { format } from 'date-fns';
import { Check, X } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { products as initialProducts } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useSearch } from '@/hooks/use-search';
import type { Product, ApprovalStatus } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

const statusStyles: { [key: string]: string } = {
  Pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
  Approved: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
  Rejected: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
  'Not Submitted': 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
};


type PendingReviewProduct = Product & {
  pendingStage: 'Idea' | 'Final Product';
};

export default function ApprovalsPage() {
  const { searchTerm } = useSearch();
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const { toast } = useToast();
  const router = useRouter();

  const pendingReviewProducts = useMemo((): PendingReviewProduct[] => {
    const pending: PendingReviewProduct[] = [];
    products.forEach(p => {
      if (p.ideaStatus === 'Pending') {
        pending.push({ ...p, pendingStage: 'Idea' });
      }
      if (p.productStatus === 'Pending') {
        pending.push({ ...p, pendingStage: 'Final Product' });
      }
    });
    return pending;
  }, [products]);


  const filteredProducts = useMemo(() => {
    if (!searchTerm) {
      return pendingReviewProducts;
    }
    return pendingReviewProducts.filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, pendingReviewProducts]);

  const handleUpdateStatus = (productId: string, stage: 'Idea' | 'Final Product', newStatus: ApprovalStatus) => {
    setProducts(prevProducts =>
      prevProducts.map(p => {
        if (p.id === productId) {
          if (stage === 'Idea') {
            return { ...p, ideaStatus: newStatus };
          }
          return { ...p, productStatus: newStatus };
        }
        return p;
      })
    );
    toast({
      title: `Product ${stage} ${newStatus}`,
      description: `Product ${productId} ${stage} has been ${newStatus.toLowerCase()}.`,
    });
  };

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <Card>
        <CardHeader>
          <CardTitle>Awaiting FDA Review</CardTitle>
          <CardDescription>
            These product submissions require regulatory approval before proceeding.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product Name</TableHead>
                <TableHead>Manufacturer</TableHead>
                <TableHead>Stage</TableHead>
                <TableHead className="hidden md:table-cell">Submitted At</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <TableRow key={`${product.id}-${product.pendingStage}`}>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>{product.applicantInfo}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{product.pendingStage} Review</Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {format(new Date(product.submissionDate), 'dd/MM/yyyy')}
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-2">
                         <Button
                            size="sm"
                            variant="outline"
                            onClick={() => router.push(`/my-products`)} // Assuming details are on my-products
                          >
                            View Details
                          </Button>
                         <Button size="sm" onClick={() => handleUpdateStatus(product.id, product.pendingStage, 'Approved')}>
                              <Check className="mr-2 h-4 w-4" /> Approve
                          </Button>
                         <Button size="sm" variant="destructive" onClick={() => handleUpdateStatus(product.id, product.pendingStage, 'Rejected')}>
                             <X className="mr-2 h-4 w-4" /> Reject
                         </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    No product submissions currently awaiting approval.
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
