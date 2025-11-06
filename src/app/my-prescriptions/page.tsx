
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { shipments, batches } from '@/lib/data';
import { format } from 'date-fns';
import { useMemo } from 'react';
import type { Shipment, Batch } from '@/lib/types';

// For this demo, we'll assume some shipments are for the logged-in patient.
const patientShipments = shipments.slice(0, 2); // Taking first two shipments as example

type PatientPrescription = {
  shipment: Shipment;
  batch: Batch | undefined;
};

export default function MyPrescriptionsPage() {

  const patientPrescriptions = useMemo((): PatientPrescription[] => {
    return patientShipments.map(shipment => {
      const batch = batches.find(b => b.id === shipment.batchId);
      return { shipment, batch };
    });
  }, []);

  return (
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
                <TableHead>Prescription</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Total Items</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {patientPrescriptions.map(({ shipment, batch }) => (
                <TableRow key={shipment.batchId}>
                  <TableCell className="font-medium">{shipment.productName}</TableCell>
                  <TableCell>{format(new Date(shipment.lastUpdate), 'PP')}</TableCell>
                  <TableCell className="text-right">
                    {batch ? batch.quantity.toLocaleString() : 'N/A'}
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
