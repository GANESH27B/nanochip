
'use client';

import { useMemo, useState, useEffect } from 'react';
import { format } from 'date-fns';
import Link from 'next/link';
import { MoreHorizontal, PlusCircle, ChevronDown } from 'lucide-react';
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
import { shipments as initialShipments, users, batches as allBatches, neededDrugs } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuPortal
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useSearch } from '@/hooks/use-search';
import type { Shipment, ShipmentStatus, Role, User, Batch, ShipmentHistoryEntry } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';


const statusStyles: { [key: string]: string } = {
  'In-Transit': 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
  Delivered: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
  'Requires-Approval': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
  Pending: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
};

const priorityStyles: { [key: string]: string } = {
  High: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
  Medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
  Low: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
};

// Component to safely render dates on the client
const ClientOnlyDate = ({ isoDate }: { isoDate: string }) => {
  const [date, setDate] = useState('');

  useEffect(() => {
    setDate(format(new Date(isoDate), 'dd/MM/yyyy p'));
  }, [isoDate]);

  return <>{date}</>;
};


export default function ShipmentsPage() {
  const { searchTerm } = useSearch();
  const [shipments, setShipments] = useState<Shipment[]>(initialShipments);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [userRole, setUserRole] = useState<Role | null>(null);
  const [prefillData, setPrefillData] = useState<{ batchId?: string, destination?: string }>({});
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const role = localStorage.getItem('userRole') as Role;
    if (role) {
      setUserRole(role);
    }
  }, []);

  const filteredShipments = useMemo(() => {
    if (!searchTerm) {
      return shipments;
    }
    return shipments.filter((shipment) =>
      shipment.batchId.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, shipments]);

  const handleCreateShipment = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const manufacturer = Object.values(users).find(u => u.role === 'Manufacturer');
    
    if (!manufacturer) {
        toast({
            variant: "destructive",
            title: "Creation Failed",
            description: "Could not create shipment. Manufacturer role not found.",
        });
        return;
    }

    const now = new Date();
    const batchId = formData.get('batchId') as string;
    const distributorId = formData.get('distributorId') as string;
    const distributor = Object.values(users).find(u => u.id === distributorId);
    
    if (!batchId) {
      toast({
        variant: "destructive",
        title: "Creation Failed",
        description: "Please select a batch to create a shipment.",
      });
      return;
    }
     if (!distributor) {
      toast({
        variant: "destructive",
        title: "Creation Failed",
        description: "Please select a distributor.",
      });
      return;
    }
    
    setShipments(prevShipments => {
        const existingShipmentIndex = prevShipments.findIndex(s => s.batchId === batchId);
        const endingPoint = formData.get('endingPoint') as string;
        
        const historyEntry: ShipmentHistoryEntry = {
            status: 'Pending',
            holder: manufacturer.name, // Starts with the manufacturer
            timestamp: now.toISOString(),
        };
        const secondHistoryEntry: ShipmentHistoryEntry = {
            status: 'Pending',
            holder: distributor.name,
            timestamp: now.toISOString(),
        };

        if (existingShipmentIndex > -1) {
            const updatedShipments = [...prevShipments];
            const existingShipment = updatedShipments[existingShipmentIndex];
            updatedShipments[existingShipmentIndex] = {
                ...existingShipment,
                currentHolder: distributor.name,
                startingPoint: formData.get('startingPoint') as string,
                endingPoint: endingPoint,
                status: 'Pending',
                lastUpdate: now.toISOString(),
                history: [historyEntry, secondHistoryEntry],
            };
            toast({
              title: 'Shipment Updated',
              description: `Shipment for ${batchId} has been recreated and assigned to ${distributor.name}.`,
            });
            return updatedShipments;
        } else {
            const newShipment: Shipment = {
              batchId: batchId,
              currentHolder: distributor.name, // Assigned to distributor
              startingPoint: formData.get('startingPoint') as string,
              endingPoint: endingPoint,
              status: 'Pending',
              createdAt: now.toISOString(),
              alerts: 0,
              lastUpdate: now.toISOString(),
              history: [historyEntry, secondHistoryEntry],
            };
            toast({
              title: 'Shipment Created',
              description: `Shipment for ${newShipment.batchId} assigned to ${distributor.name}.`,
            });
            return [newShipment, ...prevShipments];
        }
    });

    setIsCreateDialogOpen(false);
    setPrefillData({});
  };

  const handleUpdateStatus = (batchId: string, newStatus: ShipmentStatus) => {
    const currentUser = userRole ? Object.values(users).find(u => u.role === userRole) : null;
    if (!currentUser) return;

    setShipments(currentShipments =>
      currentShipments.map(s => {
        if (s.batchId === batchId) {
          const newHistoryEntry: ShipmentHistoryEntry = {
            status: newStatus,
            holder: currentUser.name,
            timestamp: new Date().toISOString(),
          };
          return { 
            ...s, 
            status: newStatus, 
            currentHolder: currentUser.name, 
            lastUpdate: new Date().toISOString(),
            history: [...(s.history || []), newHistoryEntry]
          };
        }
        return s;
      })
    );
    toast({
      title: 'Shipment Status Updated',
      description: `Batch ${batchId} is now ${newStatus.replace('-', ' ')} and held by ${currentUser.name}.`,
    });
  };

  const openCreateShipmentDialog = (batchId?: string, destination?: string) => {
    setPrefillData({ batchId, destination });
    setIsCreateDialogOpen(true);
  };


  const canUpdateStatus = userRole === 'Distributor' || userRole === 'Pharmacy' || userRole === 'FDA';
  const availableBatches: Batch[] = allBatches;
  const distributors: User[] = Object.values(users).filter(u => u.role === 'Distributor');
  const pharmacies: User[] = Object.values(users).filter(u => u.role === 'Pharmacy');


  return (
    <>
      <div className="flex min-h-screen w-full flex-col">
        <AppHeader title="Shipments" />
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
         {userRole === 'Manufacturer' && (
            <Card className="animate-fade-in-up">
              <CardHeader>
                <CardTitle>Open Drug Requests</CardTitle>
                <CardDescription>
                  Drug orders from other users that need to be fulfilled.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Drug Name</TableHead>
                      <TableHead>Requested By</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {neededDrugs.map((drug) => (
                      <TableRow key={drug.id}>
                        <TableCell className="font-medium">{drug.name}</TableCell>
                        <TableCell>{drug.requestedBy}</TableCell>
                        <TableCell>
                           <Badge className={`border-transparent ${priorityStyles[drug.priority]}`}>
                            {drug.priority}
                           </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => openCreateShipmentDialog(undefined, drug.requestedBy)}
                          >
                            Create Shipment
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

          <Card className="animate-fade-in-up">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>All Shipments</CardTitle>
                <CardDescription>
                  Track and manage all pharmaceutical shipments across the supply chain.
                </CardDescription>
              </div>
              {userRole === 'Manufacturer' && (
                <Button size="sm" className="gap-1" onClick={() => openCreateShipmentDialog()}>
                  <PlusCircle className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    New Shipment
                  </span>
                </Button>
              )}
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]"></TableHead>
                    <TableHead>Batch ID</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="hidden md:table-cell">Current Holder</TableHead>
                    <TableHead className="hidden md:table-cell">Route</TableHead>
                    <TableHead className="hidden md:table-cell">Last Updated</TableHead>
                    <TableHead className="text-right">Alerts</TableHead>
                    <TableHead>
                      <span className="sr-only">Actions</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredShipments.map((shipment, index) => (
                    <Collapsible asChild key={`${shipment.batchId}-${shipment.createdAt}`}>
                      <>
                        <TableRow className="animate-fade-in-up" style={{ animationDelay: `${index * 0.05}s` }}>
                          <TableCell>
                            <CollapsibleTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <ChevronDown className="h-4 w-4" />
                                <span className="sr-only">Toggle history</span>
                              </Button>
                            </CollapsibleTrigger>
                          </TableCell>
                          <TableCell className="font-medium">{shipment.batchId}</TableCell>
                          <TableCell>
                            <Badge
                              className={`border-transparent ${statusStyles[shipment.status]}`}
                            >
                              {shipment.status.replace('-', ' ')}
                            </Badge>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">{shipment.currentHolder}</TableCell>
                          <TableCell className="hidden md:table-cell">{shipment.startingPoint} to {shipment.endingPoint}</TableCell>
                          <TableCell className="hidden md:table-cell">
                            <ClientOnlyDate isoDate={shipment.lastUpdate} />
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
                                <DropdownMenuItem onClick={() => router.push(`/shipments/track/${shipment.batchId}`)}>
                                  Track on Map
                                </DropdownMenuItem>
                                {canUpdateStatus && (
                                <DropdownMenuSub>
                                    <DropdownMenuSubTrigger>Update Status</DropdownMenuSubTrigger>
                                    <DropdownMenuPortal>
                                        <DropdownMenuSubContent>
                                        {userRole === 'Distributor' && shipment.status === 'Pending' && (
                                            <DropdownMenuItem onClick={() => handleUpdateStatus(shipment.batchId, 'In-Transit')}>
                                                Mark as Received
                                            </DropdownMenuItem>
                                        )}
                                        {userRole === 'Pharmacy' && shipment.status === 'In-Transit' && (
                                            <DropdownMenuItem onClick={() => handleUpdateStatus(shipment.batchId, 'Delivered')}>
                                                Mark as Received
                                            </DropdownMenuItem>
                                        )}
                                        {userRole === 'FDA' && shipment.status === 'Requires-Approval' && (
                                          <>
                                            <DropdownMenuItem onClick={() => handleUpdateStatus(shipment.batchId, 'In-Transit')}>
                                              Approve Batch
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleUpdateStatus(shipment.batchId, 'Pending')}>
                                              Reject Batch
                                            </DropdownMenuItem>
                                          </>
                                        )}
                                        </DropdownMenuSubContent>
                                    </DropdownMenuPortal>
                                </DropdownMenuSub>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                        <CollapsibleContent asChild>
                          <TableRow>
                            <TableCell colSpan={8}>
                              <div className="p-4 bg-muted/50 rounded-md">
                                <h4 className="font-semibold mb-2">Shipment History</h4>
                                <Table>
                                  <TableHeader>
                                    <TableRow>
                                      <TableHead>Status</TableHead>
                                      <TableHead>Holder</TableHead>
                                      <TableHead>Timestamp</TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {shipment.history?.map((entry, i) => (
                                      <TableRow key={i}>
                                        <TableCell>
                                           <Badge
                                            variant="outline"
                                            className={statusStyles[entry.status]}
                                          >
                                            {entry.status.replace('-', ' ')}
                                          </Badge>
                                        </TableCell>
                                        <TableCell>{entry.holder}</TableCell>
                                        <TableCell>
                                          <ClientOnlyDate isoDate={entry.timestamp} />
                                        </TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </div>
                            </TableCell>
                          </TableRow>
                        </CollapsibleContent>
                      </>
                    </Collapsible>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </main>
      </div>
      <Dialog open={isCreateDialogOpen} onOpenChange={(isOpen) => { setIsCreateDialogOpen(isOpen); if (!isOpen) setPrefillData({}); }}>
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={handleCreateShipment}>
            <DialogHeader>
              <DialogTitle>Create New Shipment</DialogTitle>
              <DialogDescription>
                Manually enter the details for the new shipment.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="batchId" className="text-right">
                  Batch
                </Label>
                <Select name="batchId" defaultValue={prefillData.batchId}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a batch" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableBatches.map(batch => (
                      <SelectItem key={batch.id} value={batch.id}>
                        {batch.drugName} ({batch.id}) - Qty: {batch.quantity.toLocaleString()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
               <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="startingPoint" className="text-right">
                  Origin
                </Label>
                <Input id="startingPoint" name="startingPoint" defaultValue={Object.values(users).find(u => u.role === 'Manufacturer')?.location || 'New York, NY'} className="col-span-3" required />
              </div>
               <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="distributorId" className="text-right">
                  Distributed By
                </Label>
                <Select name="distributorId" required>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a distributor" />
                  </SelectTrigger>
                  <SelectContent>
                    {distributors.map(distributor => (
                      <SelectItem key={distributor.id} value={distributor.id}>
                        {distributor.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="endingPoint" className="text-right">
                  Distributor/Pharmacy
                </Label>
                <Select name="endingPoint" defaultValue={prefillData.destination} required>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a pharmacy" />
                  </SelectTrigger>
                  <SelectContent>
                    {pharmacies.map(pharmacy => (
                      <SelectItem key={pharmacy.id} value={pharmacy.location!}>
                        {pharmacy.name} ({pharmacy.location})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Create Shipment</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
