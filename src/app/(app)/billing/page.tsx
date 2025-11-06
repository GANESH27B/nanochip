
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Download, CreditCard, QrCode, Landmark, Wallet, ReceiptText, Video, AlertCircle, VideoOff } from 'lucide-react';
import { format } from 'date-fns';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useEffect, useState, useMemo, useRef, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import type { Transaction, Role } from '@/lib/types';
import { transactions as initialTransactions } from '@/lib/data';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

type InvoiceItem = {
    name: string;
    quantity: number;
    price: number;
};

const defaultInvoice: InvoiceItem[] = [];

export default function BillingPage() {
  const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>(defaultInvoice);
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [userRole, setUserRole] = useState<Role | null>(null);
  const { toast } = useToast();
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [activeTab, setActiveTab] = useState('card');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    const role = localStorage.getItem('userRole') as Role;
    if (role) {
      setUserRole(role);
    }
    const storedInvoice = localStorage.getItem('currentInvoice');
    if (storedInvoice) {
      setInvoiceItems(JSON.parse(storedInvoice));
    }
    setIsClient(true);
  }, []);

  const stopCamera = useCallback(() => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsCameraOn(false);
    }
  }, []);

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setHasCameraPermission(true);
      setIsCameraOn(true);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      setHasCameraPermission(false);
      setIsCameraOn(false);
       toast({
        variant: 'destructive',
        title: 'Camera Access Denied',
        description: 'Please enable camera permissions in your browser settings.',
      });
    }
  }, [toast]);

  const handleToggleCamera = () => {
    if (isCameraOn) {
      stopCamera();
    } else {
      startCamera();
    }
  };

  // Stop camera when switching away from QR tab
  useEffect(() => {
    if (activeTab !== 'qr') {
      stopCamera();
    }
  }, [activeTab, stopCamera]);

  const processingFee = 5.00;
  const invoiceSubtotal = useMemo(() => invoiceItems.reduce((acc, item) => acc + item.price, 0), [invoiceItems]);
  const invoiceTotal = useMemo(() => invoiceSubtotal + processingFee, [invoiceSubtotal, processingFee]);
  const totalUnits = useMemo(() => invoiceItems.reduce((acc, item) => acc + item.quantity, 0), [invoiceItems]);

  const handlePayment = () => {
    if (invoiceItems.length === 0) {
      toast({
        variant: 'destructive',
        title: 'No Invoice to Pay',
        description: 'There is no pending invoice to be paid.',
      });
      return;
    }

    const newTransaction: Transaction = {
      id: `TRX-${Date.now()}`,
      date: new Date().toISOString(),
      description: `Payment for ${totalUnits} units (${invoiceItems.map(i => i.name).join(', ')})`,
      amount: -invoiceTotal,
      status: 'Completed',
    };

    setTransactions(prev => [newTransaction, ...prev]);
    setInvoiceItems([]);
    localStorage.removeItem('currentInvoice');

    toast({
      title: 'Payment Successful',
      description: `Your payment of $${invoiceTotal.toFixed(2)} has been processed.`,
    });
  };

  const handleExport = () => {
    if (transactions.length === 0) {
      toast({
        variant: 'destructive',
        title: 'No Data to Export',
        description: 'There are no transactions to export.',
      });
      return;
    }

    const headers = ['Transaction ID', 'Date', 'Description', 'Amount', 'Status'];
    const csvRows = [headers.join(',')];

    transactions.forEach(transaction => {
      const row = [
        `"${transaction.id}"`,
        `"${format(new Date(transaction.date), 'yyyy-MM-dd HH:mm:ss')}"`,
        `"${transaction.description.replace(/"/g, '""')}"`,
        transaction.amount,
        `"${transaction.status}"`,
      ];
      csvRows.push(row.join(','));
    });

    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.href) {
      URL.revokeObjectURL(link.href);
    }
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.setAttribute('download', 'transaction-history.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: 'Export Successful',
      description: 'Your transaction history has been downloaded.',
    });
  };

  const displayedTransactions = useMemo(() => {
    if (userRole === 'Manufacturer') {
      return transactions;
    }
    // In a real app, you would fetch and filter transactions based on the user
    return transactions;
  }, [userRole, transactions]);

  if (!isClient) {
    return null;
  }

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
         <Card className="lg:col-span-3">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Invoice Total</CardTitle>
            <ReceiptText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${invoiceItems.length > 0 ? invoiceTotal.toFixed(2) : '0.00'}</div>
            <p className="text-xs text-muted-foreground">{totalUnits > 0 ? `${totalUnits} units to be paid` : 'No pending invoice'}</p>
          </CardContent>
        </Card>
      </div>

      {userRole !== 'Manufacturer' && (
        <div className="grid gap-6 md:grid-cols-5">
            <div className="md:col-span-3">
                <Card>
                    <CardHeader>
                        <CardTitle>Pay Invoice</CardTitle>
                        <CardDescription>Select a payment method to settle your invoice.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Tabs defaultValue="card" onValueChange={setActiveTab}>
                            <TabsList className="grid w-full grid-cols-4">
                                <TabsTrigger value="card"><CreditCard className="mr-2 h-4 w-4" />Card</TabsTrigger>
                                <TabsTrigger value="upi"><Wallet className="mr-2 h-4 w-4" />UPI</TabsTrigger>
                                <TabsTrigger value="netbanking"><Landmark className="mr-2 h-4 w-4" />Bank</TabsTrigger>
                                <TabsTrigger value="qr"><QrCode className="mr-2 h-4 w-4" />Scan</TabsTrigger>
                            </TabsList>
                            <TabsContent value="card" className="mt-6">
                                <div className="grid gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="card-number">Card Number</Label>
                                        <Input id="card-number" placeholder="0000 0000 0000 0000" />
                                    </div>
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="expiry">Expires</Label>
                                            <Input id="expiry" placeholder="MM/YY" />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="cvc">CVC</Label>
                                            <Input id="cvc" placeholder="123" />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="zip">ZIP</Label>
                                            <Input id="zip" placeholder="12345" />
                                        </div>
                                    </div>
                                    <Button className="w-full" onClick={handlePayment}>Pay with Card</Button>
                                </div>
                            </TabsContent>
                            <TabsContent value="upi" className="mt-6">
                                <div className="grid gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="upi-id">UPI ID</Label>
                                        <Input id="upi-id" placeholder="yourname@bank" />
                                    </div>
                                    <Button className="w-full" onClick={handlePayment}>Pay with UPI</Button>
                                </div>
                            </TabsContent>
                            <TabsContent value="netbanking" className="mt-6">
                              <div className="grid gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="bank">Bank</Label>
                                        <Input id="bank" placeholder="Select your bank" />
                                    </div>
                                    <Button className="w-full" onClick={handlePayment}>Proceed to Net Banking</Button>
                                </div>
                            </TabsContent>
                            <TabsContent value="qr" className="mt-6 flex flex-col items-center justify-center gap-4">
                                <div className="relative w-full max-w-sm aspect-square bg-muted rounded-md overflow-hidden flex items-center justify-center">
                                    <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
                                    {!isCameraOn && hasCameraPermission !== false && (
                                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 text-center p-4">
                                        <QrCode className="h-16 w-16 text-muted-foreground mb-4" />
                                        <p className="text-muted-foreground">Click the button below to start scanning.</p>
                                      </div>
                                    )}
                                    {hasCameraPermission === false && (
                                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 text-center p-4">
                                            <Alert variant="destructive">
                                                <AlertCircle className="h-4 w-4" />
                                                <AlertTitle>Camera Access Required</AlertTitle>
                                                <AlertDescription>
                                                  Please allow camera access in your browser to use this feature.
                                                </AlertDescription>
                                            </Alert>
                                        </div>
                                    )}
                                </div>
                                <Button onClick={handleToggleCamera} variant="outline">
                                  {isCameraOn ? <VideoOff className="mr-2 h-4 w-4" /> : <Video className="mr-2 h-4 w-4" />}
                                  {isCameraOn ? 'Turn Off Camera' : 'Turn On Camera'}
                                </Button>
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>
            </div>
            <div className="md:col-span-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Invoice Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4">
                      {invoiceItems.length > 0 ? (
                        <>
                          {invoiceItems.map((item, index) => (
                              <div key={index} className="flex justify-between">
                                  <span>{`${item.name} (${item.quantity} units)`}</span>
                                  <span>${item.price.toFixed(2)}</span>
                              </div>
                          ))}
                          <div className="flex justify-between text-muted-foreground">
                              <span>Subtotal</span>
                              <span>${invoiceSubtotal.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between text-muted-foreground">
                              <span>Processing Fee</span>
                              <span>${processingFee.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between font-semibold text-lg">
                              <span>Total</span>
                              <span>${invoiceTotal.toFixed(2)}</span>
                          </div>
                        </>
                      ) : (
                        <p className="text-sm text-muted-foreground">No items in the current invoice.</p>
                      )}
                    </CardContent>
                </Card>
            </div>
        </div>
      )}

      <Card>
        <CardHeader className="flex flex-row items-center">
          <div className="grid gap-2">
            <CardTitle>Transaction History</CardTitle>
            <CardDescription>
              A record of all financial activities for your portal.
            </CardDescription>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Button size="sm" variant="outline" className="h-7 gap-1" onClick={handleExport}>
              <Download className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Export
              </span>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Transaction</TableHead>
                <TableHead className="hidden sm:table-cell">Status</TableHead>
                <TableHead className="hidden sm:table-cell">Date</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayedTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>
                    <div className="font-medium">{transaction.description}</div>
                    <div className="hidden text-sm text-muted-foreground md:inline">
                      {transaction.id}
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">{transaction.status}</TableCell>
                  <TableCell className="hidden sm:table-cell">
                    {format(new Date(transaction.date), 'MMMM d, yyyy')}
                  </TableCell>
                  <TableCell className={`text-right font-semibold ${transaction.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {transaction.amount < 0 ? '-' : ''}${Math.abs(transaction.amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </main>
  );
}
    
    
