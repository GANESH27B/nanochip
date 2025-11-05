'use client';

import AppHeader from '@/components/app/header';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { shipments as initialShipments } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useSearch } from '@/hooks/use-search';
import { useMemo } from 'react';

const statusStyles: { [key: string]: string } = {
  'In-Transit': 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
  Delivered: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
  'Requires-Approval': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
  Pending: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
};

export default function ShipmentsPage() {
  const { searchTerm } = useSearch();

  const shipments = useMemo(() => {
    if (!searchTerm) {
      return initialShipments;
    }
    return initialShipments.filter((shipment) =>
      shipment.batchId.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  return (
    <div className="flex min-h-screen w-full flex-col">
      <AppHeader title="Shipments" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Card className="animate-fade-in-up">
          <CardHeader>
            <CardTitle>All Shipments</CardTitle>
            <CardDescription>
              Track and manage all pharmaceutical shipments across the supply chain.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Batch ID</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden md:table-cell">Current Holder</TableHead>
                  <TableHead className="hidden md:table-cell">Created At</TableHead>
                  <TableHead className="text-right">Alerts</TableHead>
                  <TableHead>
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {shipments.map((shipment, index) => (
                  <TableRow key={shipment.batchId} className="animate-fade-in-up" style={{ animationDelay: `${index * 0.05}s` }}>
                    <TableCell className="font-medium">{shipment.batchId}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`border-none ${statusStyles[shipment.status]}`}
                      >
                        {shipment.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{shipment.currentHolder}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      {new Date(shipment.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">{shipment.alerts}</TableCell>
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
                          <DropdownMenuItem asChild>
                            <Link href={`/shipments/${shipment.batchId}`}>View Details</Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem>Acknowledge Alerts</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
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
