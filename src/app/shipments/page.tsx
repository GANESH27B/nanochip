

'use client';

import { useMemo, useState, useEffect } from 'react';
import { format } from 'date-fns';
import Link from 'next/link';
import { MoreHorizontal, PlusCircle, ChevronDown, ShoppingCart } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { shipments as initialShipments, users, batches as allBatches, neededDrugs, rawMaterials } from '@/lib/data';
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
import type { Shipment, ShipmentStatus, Role, User, Batch, ShipmentHistoryEntry, RawMaterial } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';


const statusStyles: { [key: string]: string } = {
  // Batch statuses
  'In-Production': 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300',
  'Ready-for-Shipment': 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/50 dark:text-cyan-300',

  // Shipment statuses
  'In-Transit': 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
  Delivered: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
  'Requires-Approval': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
  Pending: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
  'In-Review': 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300',
  Approved: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
  Rejected: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
  Shipped: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300',
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
  const [prefillData, setPrefillData] = useState<{ batchId?: string, destination?: string, availableItems?: (Batch | RawMaterial)[] }>({});
  const { toast } = useToast();
  const router = useRouter();

  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
    const role = localStorage.getItem('userRole') as Role;
    if (role) {
      setUserRole(role);
    }
  }, []);

  const combinedLogistics = useMemo(() => {
    const manufacturerBatches = allBatches.map(b => ({
        batchId: b.id,
        productName: b.drugName,
        status: b.status,
        currentHolder: 'Alice Manufacturer', // Assuming manufacturer owns ready batches
        lastUpdate: b.manufactureDate,
        isBatch: true,
      }));
    
    // Filter out shipments that correspond to batches already in the list
    const existingBatchIds = new Set(manufacturerBatches.map(b => b.batchId));
    const uniqueShipments = shipments.filter(s => !existingBatchIds.has(s.batchId));

    const allItems = [...manufacturerBatches, ...uniqueShipments];

    if (!userRole || !isClient) return [];

    if (userRole === 'Manufacturer') {
        return allItems.filter(item => item.currentHolder === 'Alice Manufacturer' || ('startingPoint' in item && (item as Shipment).startingPoint === 'New York, NY'));
    }
    
    if (userRole === 'Distributor') {
        const distName = users.Distributor.name;
        const distLocation = users.Distributor.location;
        return allItems.filter(item => 'startingPoint' in item && ((item as Shipment).currentHolder === distName || ((item as Shipment).endingPoint === distLocation && (item as Shipment).status === 'In-Transit')));
    }
    
    if (userRole === 'Pharmacy') {
        const pharmName = users.Pharmacy.name;
        const pharmLocation = users.Pharmacy.location;
        return allItems.filter(item => 'startingPoint' in item && ((item as Shipment).currentHolder === pharmName || ((item as Shipment).endingPoint === pharmLocation && (item as Shipment).status === 'In-Transit')));
    }

    return allItems;
  }, [shipments, userRole, isClient]);


  const filteredItems = useMemo(() => {
    if (!searchTerm) {
      return combinedLogistics;
    }
    return combinedLogistics.filter((item) =>
      item.batchId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.productName && item.productName.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [searchTerm, combinedLogistics]);

  const handleCreateShipment = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const now = new Date();

    const batchId = formData.get('batchId') as string;
    if (!batchId) {
      toast({ variant: "destructive", title: "Creation Failed", description: "Please select an item to ship." });
      return;
    }
    
    const startUser = currentUser;
    const endUserName = formData.get('endingPoint') as string;
    const endUser = Object.values(users).find(u => u.name === endUserName);

    if (!startUser || !endUser) {
        toast({ variant: "destructive", title: "Creation Failed", description: "Invalid start or end point." });
        return;
    }

    setShipments(prevShipments => {
        const historyEntry: ShipmentHistoryEntry = {
            status: 'Pending',
            holder: startUser.name,
            timestamp: now.toISOString(),
        };

        const inTransitHistoryEntry: ShipmentHistoryEntry = {
            status: 'In-Transit',
            holder: endUser.name, // Immediately transfer to the distributor
            timestamp: now.toISOString(),
        };

        const newShipment: Shipment = {
          batchId: batchId,
          productName: allBatches.find(b => b.id === batchId)?.drugName || rawMaterials.find(rm => rm.id === batchId)?.name || 'Unknown Product',
          submissionType: 'NDA', // Default for new shipments
          assignedReviewer: 'Unassigned',
          currentHolder: endUser.name, // Set distributor as current holder
          startingPoint: startUser.location!,
          endingPoint: endUser.location!,
          status: 'In-Transit', // Set status to In-Transit
          createdAt: now.toISOString(),
          alerts: 0,
          lastUpdate: now.toISOString(),
          history: [historyEntry, inTransitHistoryEntry],
        };
        toast({
          title: 'Shipment Created',
          description: `Shipment for ${newShipment.batchId} to ${endUser.name} is now In-Transit.`,
        });

        // Mark the item as shipped if it's a raw material or batch
        if (userRole === 'Ingredient Supplier') {
            const newRawMaterials = rawMaterials.map(rm => rm.id === batchId ? {...rm, status: 'Shipped'} : rm);
            console.log("Updated raw materials (simulation):", newRawMaterials);
        } else if (userRole === 'Manufacturer') {
            const newBatches = allBatches.map(b => b.id === batchId ? {...b, status: 'Shipped'} : b);
            console.log("Updated batches (simulation):", newBatches);
        }

        return [newShipment, ...prevShipments];
    });

    setIsCreateDialogOpen(false);
    setPrefillData({});
  };

  const handleUpdateStatus = (batchId: string, newStatus: ShipmentStatus, nextHolderName?: string) => {
    const currentUser = userRole ? Object.values(users).find(u => u.role === userRole) : null;
    if (!currentUser) return;
    
    let nextHolder = nextHolderName ? Object.values(users).find(u => u.name === nextHolderName) : null;
    // Determine next holder if not specified
    if (!nextHolder) {
        const currentShipment = shipments.find(s => s.batchId === batchId);
        if (currentShipment) {
            const currentHolderUser = Object.values(users).find(u => u.name === currentShipment.currentHolder);
            if (currentHolderUser?.role === 'Ingredient Supplier') nextHolder = Object.values(users).find(u => u.role === 'Manufacturer');
            else if (currentHolderUser?.role === 'Manufacturer') nextHolder = Object.values(users).find(u => u.role === 'Distributor');
            else if (currentHolderUser?.role === 'Distributor') nextHolder = Object.values(users).find(u => u.role === 'Pharmacy');
        }
    }


    setShipments(currentShipments =>
      currentShipments.map(s => {
        if (s.batchId === batchId) {
          const newHistoryEntry: ShipmentHistoryEntry = {
            status: newStatus,
            holder: nextHolder?.name || currentUser.name,
            timestamp: new Date().toISOString(),
          };
          return { 
            ...s, 
            status: newStatus, 
            currentHolder: nextHolder?.name || currentUser.name, 
            lastUpdate: new Date().toISOString(),
            history: [...(s.history || []), newHistoryEntry]
          };
        }
        return s;
      })
    );
    toast({
      title: 'Shipment Status Updated',
      description: `Batch ${batchId} is now ${newStatus.replace('-', ' ')} and held by ${nextHolder?.name || currentUser.name}.`,
    });
  };

  const openCreateShipmentDialog = (batchId?: string, destination?: string) => {
    let availableItems: (Batch | RawMaterial)[] = [];
    if (userRole === 'Ingredient Supplier') {
      availableItems = rawMaterials.filter(rm => rm.status === 'In-Stock' || rm.status === 'Low-Stock');
    } else if (userRole === 'Manufacturer') {
      availableItems = allBatches.filter(b => b.status === 'Ready-for-Shipment');
    } else if (userRole === 'Distributor') {
      availableItems = shipments.filter(s => s.status === 'Delivered' && s.currentHolder === currentUser?.name).map(s => ({id: s.batchId, name: s.productName, lotNumber: s.batchId, quantity: 0, units: 'kg', status: 'In-Stock'}));
    }
    setPrefillData({ batchId, destination, availableItems });
    setIsCreateDialogOpen(true);
  };

  const manufacturers: User[] = Object.values(users).filter(u => u.role === 'Manufacturer');
  const distributors: User[] = Object.values(users).filter(u => u.role === 'Distributor');
  const pharmacies: User[] = Object.values(users).filter(u => u.role === 'Pharmacy');
  const currentUser = userRole ? Object.values(users).find(u => u.role === userRole) : null;
  
  const getNextStageUsers = (currentHolderRole: Role): User[] => {
    if (currentHolderRole === 'Ingredient Supplier') return manufacturers;
    if (currentHolderRole === 'Manufacturer') return distributors;
    if (currentHolderRole === 'Distributor') return pharmacies;
    return [];
  };

  const nextStageUsers = useMemo(() => {
    if (!userRole) return [];
    return getNextStageUsers(userRole);
}, [userRole, manufacturers, distributors, pharmacies]);

  const distributorDrugRequests = useMemo(() => {
    const distributorNames = distributors.map(d => d.name);
    return neededDrugs.filter(drug => distributorNames.includes(drug.requestedBy));
  }, [distributors]);


  const isFdaView = userRole === 'FDA';

  return (
    <>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
       {userRole === 'Manufacturer' && (
          <Card className="animate-fade-in-up">
            <CardHeader>
              <CardTitle>Distributor Drug Requests</CardTitle>
              <CardDescription>
                Drug orders from distributors that need to be fulfilled.
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
                  {distributorDrugRequests.map((drug) => (
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
                          <ShoppingCart className="mr-2 h-4 w-4" />
                          Fulfill Request
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
              <CardTitle>{isFdaView ? 'Submission Tracking' : 'Logistics'}</CardTitle>
              <CardDescription>
                {isFdaView
                  ? 'Track and manage all regulatory submissions.'
                  : 'Track ready-for-shipment batches and active shipments.'}
              </CardDescription>
            </div>
            {(userRole === 'Manufacturer' || userRole === 'Ingredient Supplier' || userRole === 'Distributor') && (
              <Button size="sm" className="gap-1" onClick={() => openCreateShipmentDialog()}>
                <PlusCircle className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  New Shipment
                </span>
              </Button>
            )}
          </CardHeader>
          <CardContent>
             {isFdaView ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Submission ID</TableHead>
                    <TableHead>Product Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Submission Date</TableHead>
                    <TableHead>Review Stage</TableHead>
                    <TableHead>Assigned Reviewer</TableHead>
                    <TableHead>
                      <span className="sr-only">Actions</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredItems.map((item, index) => (
                        <TableRow key={`${item.batchId}-${index}`} className="animate-fade-in-up" style={{ animationDelay: `${index * 0.05}s` }}>
                            <TableCell className="font-medium">{item.batchId}</TableCell>
                            <TableCell>{item.productName}</TableCell>
                            <TableCell>{(item as Shipment).submissionType || 'N/A'}</TableCell>
                            <TableCell>
                               <ClientOnlyDate isoDate={(item as Shipment).createdAt || item.lastUpdate} />
                            </TableCell>
                             <TableCell>
                                <Badge
                                    className={`border-transparent ${statusStyles[item.status] || statusStyles['Pending']}`}
                                >
                                    {item.status.replace('-', ' ')}
                                </Badge>
                             </TableCell>
                            <TableCell>{(item as Shipment).assignedReviewer || 'N/A'}</TableCell>
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
                                    <DropdownMenuItem onClick={() => router.push(`/shipments/${item.batchId}`)}>
                                        View Details
                                    </DropdownMenuItem>
                                    {item.status === 'Requires-Approval' && (
                                        <>
                                        <DropdownMenuItem onClick={() => handleUpdateStatus(item.batchId, 'In-Review')}>
                                            Start Review
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleUpdateStatus(item.batchId, 'Approved')}>
                                            Approve
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleUpdateStatus(item.batchId, 'Rejected')}>
                                            Reject
                                        </DropdownMenuItem>
                                        </>
                                    )}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
              </Table>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px] p-2"></TableHead>
                    <TableHead>Batch/Lot ID</TableHead>
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
                  {filteredItems.map((item, index) => {
                    const isShipment = 'startingPoint' in item;
                    const shipment = isShipment ? item as Shipment : null;
                    const isCurrentUserHolder = shipment?.currentHolder === currentUser?.name;
                    const currentHolderUser = shipment ? Object.values(users).find(u => u.name === shipment.currentHolder) : currentUser;
                    
                    const canShip = item.status === 'Ready-for-Shipment' && userRole === 'Manufacturer';
                    const canShipToPharmacy = isShipment && shipment.status === 'Delivered' && userRole === 'Distributor' && isCurrentUserHolder;

                    const canReceive = isShipment && shipment.currentHolder !== currentUser?.name && shipment.status === 'In-Transit' && shipment.endingPoint === currentUser?.location;

                    return (
                    <Collapsible asChild key={`${item.batchId}-${index}`}>
                      <>
                        <TableRow className="animate-fade-in-up" style={{ animationDelay: `${index * 0.05}s` }}>
                          <TableCell className="p-2">
                             {isShipment && (
                                <CollapsibleTrigger asChild>
                                <Button variant="ghost" size="sm" className='w-full'>
                                    <ChevronDown className="h-4 w-4" />
                                    <span className="sr-only">Toggle history</span>
                                </Button>
                                </CollapsibleTrigger>
                             )}
                          </TableCell>
                          <TableCell className="font-medium">{item.batchId}</TableCell>
                          <TableCell>
                            <Badge
                              className={`border-transparent ${statusStyles[item.status]}`}
                            >
                              {item.status.replace('-', ' ')}
                            </Badge>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">{item.currentHolder}</TableCell>
                          <TableCell className="hidden md:table-cell">{shipment ? `${shipment.startingPoint} to ${shipment.endingPoint}` : 'N/A'}</TableCell>
                          <TableCell className="hidden md:table-cell">
                            {isClient && <ClientOnlyDate isoDate={item.lastUpdate} />}
                          </TableCell>
                          <TableCell className="text-right">{shipment ? shipment.alerts : 'N/A'}</TableCell>
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
                                {isShipment && (
                                    <>
                                        <DropdownMenuItem asChild>
                                            <Link href={`/shipments/${item.batchId}`}>View Details</Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => router.push(`/shipments/track/${item.batchId}`)}>
                                            Track on Map
                                        </DropdownMenuItem>
                                    </>
                                )}

                                {canShip && (
                                <DropdownMenuSub>
                                    <DropdownMenuSubTrigger>Ship to Distributor</DropdownMenuSubTrigger>
                                    <DropdownMenuPortal>
                                        <DropdownMenuSubContent>
                                            <DropdownMenuLabel>Select Distributor</DropdownMenuLabel>
                                            {distributors.map(distributor => (
                                                <DropdownMenuItem 
                                                    key={distributor.id} 
                                                    onClick={() => openCreateShipmentDialog(item.batchId, distributor.name)}
                                                >
                                                    {distributor.name}
                                                </DropdownMenuItem>
                                            ))}
                                        </DropdownMenuSubContent>
                                    </DropdownMenuPortal>
                                </DropdownMenuSub>
                                )}

                                {canShipToPharmacy && (
                                  <DropdownMenuSub>
                                    <DropdownMenuSubTrigger>Ship to Pharmacy</DropdownMenuSubTrigger>
                                    <DropdownMenuPortal>
                                      <DropdownMenuSubContent>
                                        <DropdownMenuLabel>Select Pharmacy</DropdownMenuLabel>
                                        {pharmacies.map(pharmacy => (
                                          <DropdownMenuItem
                                            key={pharmacy.id}
                                            onClick={() => openCreateShipmentDialog(item.batchId, pharmacy.name)}
                                          >
                                            {pharmacy.name}
                                          </DropdownMenuItem>
                                        ))}
                                      </DropdownMenuSubContent>
                                    </DropdownMenuPortal>
                                  </DropdownMenuSub>
                                )}
                                
                                {canReceive && (
                                    <DropdownMenuItem onClick={() => handleUpdateStatus(item.batchId, 'Delivered', currentUser!.name)}>
                                        Mark as Received
                                    </DropdownMenuItem>
                                )}

                                {userRole === 'FDA' && item.status === 'Requires-Approval' && (
                                <>
                                    <DropdownMenuItem onClick={() => handleUpdateStatus(item.batchId, 'In-Transit')}>
                                    Approve Batch
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleUpdateStatus(item.batchId, 'Pending')}>
                                    Reject Batch
                                    </DropdownMenuItem>
                                </>
                                )}
                            </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                        {isShipment && (
                            <CollapsibleContent asChild>
                                <tr className="bg-muted/50">
                                    <td colSpan={8} className="p-0">
                                        <div className="p-4">
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
                                            {shipment?.history?.map((entry, i) => (
                                                <TableRow key={i} className="border-b-0">
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
                                                   {isClient && <ClientOnlyDate isoDate={entry.timestamp} />}
                                                </TableCell>
                                                </TableRow>
                                            ))}
                                            </TableBody>
                                        </Table>
                                        </div>
                                    </td>
                                </tr>
                            </CollapsibleContent>
                        )}
                      </>
                    </Collapsible>
                  )})}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </main>
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
                  Item to Ship
                </Label>
                <Select name="batchId" defaultValue={prefillData.batchId}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select an item" />
                  </SelectTrigger>
                  <SelectContent>
                    {prefillData.availableItems?.map(item => (
                      <SelectItem key={item.id} value={item.id}>
                        {item.name} ({'status' in item && item.status === 'Ready-for-Shipment' ? (item as Batch).id : ('lotNumber' in item ? item.lotNumber : item.id)})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
               <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="startingPoint" className="text-right">
                  Origin
                </Label>
                <Input id="startingPoint" name="startingPoint" defaultValue={currentUser?.name || ''} className="col-span-3" required readOnly />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="endingPoint" className="text-right">
                  Destination
                </Label>
                <Select name="endingPoint" defaultValue={prefillData.destination} required>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a destination" />
                  </SelectTrigger>
                  <SelectContent>
                    {nextStageUsers.map(user => (
                      <SelectItem key={user.id} value={user.name}>
                        {user.name} ({user.role})
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
