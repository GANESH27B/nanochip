
'use client';

import AppHeader from '@/components/app/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Download, CreditCard, QrCode, Landmark, Wallet } from 'lucide-react';
import { format } from 'date-fns';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const transactions = [
  {
    id: 'TRX-001',
    date: '2024-07-15T10:30:00Z',
    description: 'Shipment Fee for B-XYZ-12345',
    amount: -75.5,
    status: 'Completed',
  },
  {
    id: 'TRX-002',
    date: '2024-07-18T14:00:00Z',
    description: 'Payment from General Hospital',
    amount: 5200.0,
    status: 'Completed',
  },
  {
    id: 'TRX-003',
    date: '2024-07-20T09:00:00Z',
    description: 'Regulatory Filing Fee - FDA',
    amount: -250.0,
    status: 'Completed',
  },
  {
    id: 'TRX-004',
    date: '2024-07-22T11:45:00Z',
    description: 'Batch Production Cost B-ABC-67890',
    amount: -12000.0,
    status: 'Completed',
  },
  {
    id: 'TRX-005',
    date: '2024-07-29T16:20:00Z',
    description: 'Service Subscription - July 2024',
    amount: -500.0,
    status: 'Pending',
  },
];

export default function BillingPage() {
  const currentBalance = transactions.reduce((acc, t) => acc + t.amount, 0);

  return (
    <div className="flex min-h-screen w-full flex-col">
      <AppHeader title="Billing" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current Balance</CardTitle>
              <span className="text-muted-foreground">$</span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${currentBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
              <p className="text-xs text-muted-foreground">Available balance in your account</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Next Invoice</CardTitle>
              <span className="text-muted-foreground">USD</span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$500.00</div>
              <p className="text-xs text-muted-foreground">Due on August 1, 2024</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-5">
            <div className="md:col-span-3">
                 <Card>
                    <CardHeader>
                        <CardTitle>Pay Invoice</CardTitle>
                        <CardDescription>Select a payment method to settle your invoice.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Tabs defaultValue="card">
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
                                    <Button className="w-full">Pay with Card</Button>
                                </div>
                            </TabsContent>
                            <TabsContent value="upi" className="mt-6">
                                <div className="grid gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="upi-id">UPI ID</Label>
                                        <Input id="upi-id" placeholder="yourname@bank" />
                                    </div>
                                    <Button className="w-full">Pay with UPI</Button>
                                </div>
                            </TabsContent>
                            <TabsContent value="netbanking" className="mt-6">
                               <div className="grid gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="bank">Bank</Label>
                                        <Input id="bank" placeholder="Select your bank" />
                                    </div>
                                    <Button className="w-full">Proceed to Net Banking</Button>
                                </div>
                            </TabsContent>
                             <TabsContent value="qr" className="mt-6 flex flex-col items-center justify-center gap-4">
                               <div className="rounded-md border p-2">
                                 <QrCode size={128} />
                               </div>
                                <p className="text-sm text-muted-foreground">Scan this QR code with your payment app.</p>
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
                         <div className="flex justify-between">
                            <span>Metformin (100 units)</span>
                            <span>$150.00</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Processing Fee</span>
                            <span>$5.00</span>
                        </div>
                         <div className="flex justify-between font-semibold">
                            <span>Total</span>
                            <span>$155.00</span>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center">
            <div className="grid gap-2">
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>
                A record of all financial activities on your account.
              </CardDescription>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <Button size="sm" variant="outline" className="h-7 gap-1">
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
                {transactions.map((transaction) => (
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
                    <TableCell className={`text-right ${transaction.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {transaction.amount < 0 ? '-' : ''}${Math.abs(transaction.amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
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

    
