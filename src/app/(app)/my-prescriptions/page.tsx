'use client';

import AppHeader from '@/components/app/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { shipments } from '@/lib/data';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';
import { Truck } from 'lucide-react';
import { format } from 'date-fns';

const statusStyles: { [key: string]: string } = {
  'In-Transit': 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
  Delivered: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
  'Requires-Approval': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
  Pending: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
};


// For this demo, we'll assume some shipments are for the logged-in patient.
const patientPrescriptions = shipments.slice(0, 2); // Taking first two shipments as example

export default function MyPrescriptionsPage() {
    const router = useRouter();

    return (
        <div className="flex min-h-screen w-full flex-col">
            <AppHeader title="My Prescriptions" />
            <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Welcome, Frank!</CardTitle>
                        <CardDescription>
                            Here is a summary of your current and past prescriptions.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Prescription (Batch ID)</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Last Update</TableHead>
                                    <TableHead className="text-right">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {patientPrescriptions.map((shipment) => (
                                    <TableRow key={shipment.batchId}>
                                        <TableCell className="font-medium">{shipment.batchId}</TableCell>
                                        <TableCell>
                                            <Badge className={`border-transparent ${statusStyles[shipment.status]}`}>
                                                {shipment.status.replace('-', ' ')}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>{format(new Date(shipment.lastUpdate), 'PPpp')}</TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => router.push(`/shipments/track/${shipment.batchId}`)}
                                            >
                                                <Truck className="mr-2 h-4 w-4" />
                                                Track Shipment
                                            </Button>
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