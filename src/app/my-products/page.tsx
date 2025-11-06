

'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PlusCircle, Package, MoreHorizontal, Check, X } from 'lucide-react';
import { useState, useEffect } from 'react';
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
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
  DropdownMenuSubContent
} from '@/components/ui/dropdown-menu';
import type { Product, ApprovalStatus, Role } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { products as allProducts } from '@/lib/data';
import { format } from 'date-fns';

const approvalStatusStyles: { [key: string]: string } = {
  'Not Submitted': 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
  'Pending': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
  'Approved': 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
  'Rejected': 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
};

export default function MyProductsPage() {
  const [products, setProducts] = useState<Product[]>(allProducts);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [userRole, setUserRole] = useState<Role | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const role = localStorage.getItem('userRole') as Role;
    if (role) {
      setUserRole(role);
    }
  }, []);

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
      manufacturerInfo: formData.get('applicant-info') as string, // Link to applicant
      processDescription: formData.get('process-description') as string,
      stabilityData: formData.get('stability-data') as string,
      clinicalSummary: formData.get('clinical-summary') as string,
      labelingDetails: formData.get('labeling-details') as string,
      applicantInfo: formData.get('applicant-info') as string,
      ideaStatus: 'Not Submitted',
      productStatus: 'Not Submitted',
      submissionDate: new Date().toISOString(),
    };

    setProducts(prev => [...prev, newProduct]);
    setIsAddDialogOpen(false);
    toast({
      title: 'Product Added',
      description: `${newProduct.name} has been added to your products.`,
    });
  };

  const handleViewDetails = (product: Product) => {
    setSelectedProduct(product);
    setIsDetailDialogOpen(true);
  };
  
  const handleUpdateApprovalStatus = (productId: string, type: 'idea' | 'product', status: ApprovalStatus) => {
    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        let updatedProduct = { ...p };
        if (type === 'idea') {
          updatedProduct.ideaStatus = status;
        } else {
          updatedProduct.productStatus = status;
        }
        if (status === 'Pending') {
            updatedProduct.submissionDate = new Date().toISOString();
        }
        return updatedProduct;
      }
      return p;
    }));
    toast({
      title: status === 'Pending' ? 'Submission Sent (Simulated)' : 'Approval Status Updated',
      description: `Product ${productId} ${type} approval status set to ${status}.`,
    });
  };

  const DetailItem = ({ label, value }: { label: string, value?: string }) => (
    value ? (
        <div className="grid grid-cols-3 gap-2 py-2 border-b">
            <dt className="font-semibold text-muted-foreground col-span-1">{label}</dt>
            <dd className="col-span-2">{value}</dd>
        </div>
    ) : null
  );

  const manufacturerProducts = products.filter(p => p.manufacturerInfo === 'Alice Manufacturer');
  const displayedProducts = userRole === 'Manufacturer' ? manufacturerProducts : products;

  return (
    <>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>{userRole === 'FDA' ? 'Product Submissions' : 'My Products'}</CardTitle>
              <CardDescription>
                {userRole === 'FDA' 
                    ? 'Review and manage all pharmaceutical product submissions.'
                    : 'Manage your product listings, inventory, and FDA approval status.'
                }
              </CardDescription>
            </div>
            {userRole === 'Manufacturer' && (
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
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
                        <Textarea id="manufacturer-info" name="manufacturer-info" defaultValue="Alice Manufacturer" required />
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
                        <Input id="applicant-info" name="applicant-info" defaultValue="Alice Manufacturer" required />
                        </div>
                    </div>
                    </ScrollArea>
                    <DialogFooter className="pt-4 border-t">
                        <Button type="submit">Add Product</Button>
                    </DialogFooter>
                    </form>
                </DialogContent>
                </Dialog>
            )}
          </CardHeader>
          <CardContent>
            {displayedProducts.length === 0 ? (
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
                    {userRole === 'FDA' && <TableHead>Manufacturer</TableHead>}
                    <TableHead>Submission Date</TableHead>
                    <TableHead>Idea Approval</TableHead>
                    <TableHead>Final Product Approval</TableHead>
                    <TableHead>
                      <span className="sr-only">Actions</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {displayedProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      {userRole === 'FDA' && <TableCell>{product.manufacturerInfo}</TableCell>}
                      <TableCell>{format(new Date(product.submissionDate), 'MM/dd/yyyy')}</TableCell>
                       <TableCell>
                        <Badge className={`border-transparent ${approvalStatusStyles[product.ideaStatus]}`}>
                          {product.ideaStatus}
                        </Badge>
                      </TableCell>
                       <TableCell>
                        <Badge className={`border-transparent ${approvalStatusStyles[product.productStatus]}`}>
                          {product.productStatus}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button aria-haspopup="true" size="icon" variant="ghost">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Toggle menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => handleViewDetails(product)}>
                                View Details
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {userRole === 'Manufacturer' && (
                                <>
                                    <DropdownMenuItem 
                                        disabled={product.ideaStatus !== 'Not Submitted'}
                                        onClick={() => handleUpdateApprovalStatus(product.id, 'idea', 'Pending')}
                                    >
                                        Submit for Idea Approval
                                    </DropdownMenuItem>
                                    <DropdownMenuItem 
                                        disabled={product.ideaStatus !== 'Approved' || product.productStatus !== 'Not Submitted'}
                                        onClick={() => handleUpdateApprovalStatus(product.id, 'product', 'Pending')}
                                    >
                                        Submit for Final Product Approval
                                    </DropdownMenuItem>
                                </>
                            )}
                             {userRole === 'FDA' && (
                                <>
                                  <DropdownMenuSub>
                                    <DropdownMenuSubTrigger disabled={product.ideaStatus !== 'Pending'}>Review Idea</DropdownMenuSubTrigger>
                                    <DropdownMenuPortal>
                                      <DropdownMenuSubContent>
                                        <DropdownMenuItem onClick={() => handleUpdateApprovalStatus(product.id, 'idea', 'Approved')}><Check className="mr-2 h-4 w-4 text-green-600" />Approve Idea</DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleUpdateApprovalStatus(product.id, 'idea', 'Rejected')}><X className="mr-2 h-4 w-4 text-red-600" />Reject Idea</DropdownMenuItem>
                                      </DropdownMenuSubContent>
                                    </DropdownMenuPortal>
                                  </DropdownMenuSub>
                                  <DropdownMenuSub>
                                     <DropdownMenuSubTrigger disabled={product.productStatus !== 'Pending'}>Review Final Product</DropdownMenuSubTrigger>
                                     <DropdownMenuPortal>
                                        <DropdownMenuSubContent>
                                          <DropdownMenuItem onClick={() => handleUpdateApprovalStatus(product.id, 'product', 'Approved')}><Check className="mr-2 h-4 w-4 text-green-600" />Approve Product</DropdownMenuItem>
                                          <DropdownMenuItem onClick={() => handleUpdateApprovalStatus(product.id, 'product', 'Rejected')}><X className="mr-2 h-4 w-4 text-red-600" />Reject Product</DropdownMenuItem>
                                        </DropdownMenuSubContent>
                                     </DropdownMenuPortal>
                                  </DropdownMenuSub>
                                </>
                            )}
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

      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Product Details</DialogTitle>
            <DialogDescription>{selectedProduct?.name}</DialogDescription>
          </DialogHeader>
          {selectedProduct && (
            <ScrollArea className="h-[70vh] p-1">
                <dl className="px-4 text-sm">
                    <DetailItem label="Product ID" value={selectedProduct.id} />
                    <DetailItem label="Description" value={selectedProduct.description} />
                    <DetailItem label="Dosage Form" value={selectedProduct.dosageForm} />
                    <DetailItem label="Route of Administration" value={selectedProduct.routeOfAdministration} />
                    <DetailItem label="Active Ingredients" value={selectedProduct.activeIngredients} />
                    <DetailItem label="Manufacturer Info" value={selectedProduct.manufacturerInfo} />
                    <DetailItem label="Manufacturing Process" value={selectedProduct.processDescription} />
                    <DetailItem label="Stability Data" value={selectedProduct.stabilityData} />
                    <DetailItem label="Clinical Summary" value={selectedProduct.clinicalSummary} />
                    <DetailItem label="Labeling Details" value={selectedProduct.labelingDetails} />
                    <DetailItem label="Applicant Info" value={selectedProduct.applicantInfo} />
                    <DetailItem label="Submission Date" value={format(new Date(selectedProduct.submissionDate), 'PPP')} />
                </dl>
            </ScrollArea>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetailDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

