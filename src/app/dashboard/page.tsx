
'use client';

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { alerts, shipments, neededDrugs } from '@/lib/data';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
    Siren,
    Package,
    Truck,
    CheckCircle,
    ShieldCheck,
    AlertTriangle,
    ShieldX,
    FlaskConical,
    ShoppingBag,
    FileCheck,
    LayoutGrid,
    FileText,
    Beaker,
    Factory,
    Tags,
    Shield,
    Users,
    Bell,
    AreaChart,
    ArrowLeft,
    ClipboardList,
    Briefcase,
    Building,
    FileBadge,
    Users2,
    BookUser,
    DollarSign,
    Inbox,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useEffect, useState, useMemo } from 'react';
import type { Role } from '@/lib/types';
import { cn } from '@/lib/utils';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import MyProductsPage from '@/app/my-products/page';
import { useRouter } from 'next/navigation';


const manufacturerActionCategories = [
    {
        href: '/my-products',
        label: 'Product Inventory',
        icon: Inbox,
        description: 'Manage your product listings',
    },
    {
        href: '/batches',
        label: 'Batch Tracking',
        icon: FlaskConical,
        description: 'Create & view production batches',
    },
     {
        href: '/shipments',
        label: 'Order Management',
        icon: ShoppingCart,
        description: 'Ship products to distributors',
    },
    {
        href: '/analytics',
        label: 'Sales & Distribution',
        icon: AreaChart,
        description: 'Analyze sales and shipment data',
    },
    {
        href: '#',
        label: 'Customer / Retailer Management',
        icon: Users2,
        description: 'View and manage your customers'
    },
    {
        href: '/raw-materials',
        label: 'Supplier Management',
        icon: Building,
        description: 'Manage raw material suppliers',
    },
    {
        href: '/approvals',
        label: 'Compliance & Documentation',
        icon: FileBadge,
        description: 'Handle regulatory approvals',
    },
    {
        href: '/alerts',
        label: 'Review Alerts',
        icon: Siren,
        description: 'Address supply chain issues',
    }
];

const fdaActionCategories = [
    {
        id: 'product-management',
        href: '/my-products',
        label: 'Product Management',
        icon: Package,
        description: 'Add/edit products, basic details',
    },
    {
        id: 'submission-tracking',
        href: '/shipments',
        label: 'Submission Tracking',
        icon: FileText,
        description: 'FDA forms, status, documents',
    },
    {
        id: 'manufacturer-info',
        href: '/manufacturers',
        label: 'Manufacturer Info',
        icon: Factory,
        description: 'Facility, GMP, contact',
    },
    {
        id: 'labeling-packaging',
        href: '#',
        label: 'Labeling & Packaging',
        icon: Tags,
        description: 'Labels, artwork, inserts',
    },
    {
        id: 'compliance-certificates',
        href: '/approvals',
        label: 'Compliance & Certificates',
        icon: Shield,
        description: 'GMP, CoA, approvals',
    },
    {
        id: 'user-management',
        href: '#',
        label: 'User Management',
        icon: Users,
        description: 'Roles, access control',
    },
    {
        id: 'notifications-alerts',
        href: '/alerts',
        label: 'Notifications & Alerts',
        icon: Bell,
        description: 'Deadlines, updates',
    },
    {
        id: 'reports-analytics',
        href: '/analytics',
        label: 'Reports & Analytics',
        icon: AreaChart,
        description: 'Exportable data, insights',
    },
];

type ActiveFdaModule = 'dashboard-overview' | 'product-management' | null;


export default function DashboardPage() {
  const [userRole, setUserRole] = useState<Role | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [activeFdaModule, setActiveFdaModule] = useState<ActiveFdaModule>('dashboard-overview');
  const router = useRouter();


  useEffect(() => {
    const role = localStorage.getItem('userRole') as Role;
    if (role) {
      setUserRole(role);
    }
    setIsClient(true);
  }, []);
  
  const carouselImage1 = PlaceHolderImages.find(p => p.id === 'promo-carousel-1');
  const carouselImage2 = PlaceHolderImages.find(p => p.id === 'promo-carousel-2');

  const totalShipments = shipments.length;
  const pendingApprovals = shipments.filter((s) => s.status === 'Requires-Approval').length;
  const activeAlerts = alerts.length;

  const statusCounts = shipments.reduce((acc, s) => {
    acc[s.status] = (acc[s.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.keys(statusCounts).map((status) => ({
    name: status.replace('-', ' '),
    total: statusCounts[status],
  }));

  const recentAlerts = alerts.filter(a => a.severity === "High").slice(0, 3);
  
  const supplyChainStatus = useMemo(() => {
    const highSeverityAlerts = alerts.filter(a => a.severity === 'High').length;
    if (activeAlerts === 0) {
      return {
        level: 'Normal',
        label: 'All Systems Normal',
        icon: ShieldCheck,
        color: 'text-green-500',
        description: 'The supply chain is operating without any issues.'
      };
    }
    if (highSeverityAlerts > 0) {
      return {
        level: 'Critical',
        label: 'Action Required',
        icon: ShieldX,
        color: 'text-destructive',
        description: `${highSeverityAlerts} high-severity alerts require attention.`
      };
    }
    return {
      level: 'Warning',
      label: 'Minor Disruptions',
      icon: AlertTriangle,
      color: 'text-yellow-500',
      description: `${activeAlerts} low/medium alerts are active.`
    };
  }, [activeAlerts]);

  const handleFdaModuleClick = (moduleId: string, href: string) => {
    if (moduleId === 'product-management') {
      setActiveFdaModule('product-management');
    } else if (href !== '#') {
      router.push(href);
    }
  };

  if (!isClient) {
    return null;
  }

  if (userRole === 'Manufacturer') {
    return (
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in-up">
                {manufacturerActionCategories.map((cat, index) => (
                    <Link href={cat.href} key={index}>
                         <Card className="h-full hover:shadow-lg transition-shadow">
                            <CardContent className="p-4 flex flex-col items-center justify-center text-center gap-2">
                                 <div className="flex items-center justify-center bg-primary/10 rounded-full p-3 mb-2">
                                    <cat.icon className="h-6 w-6 text-primary" />
                                 </div>
                                 <p className="font-semibold">{cat.label}</p>
                                 <p className="text-xs text-muted-foreground">{cat.description}</p>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>

            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              className="w-full animate-fade-in-up"
              style={{animationDelay: '0.2s'}}
            >
              <CarouselContent>
                <CarouselItem>
                     <div className="relative w-full h-[350px] rounded-lg overflow-hidden bg-primary/10 p-8 flex items-center">
                        {carouselImage1 && (
                            <Image
                                src={carouselImage1.imageUrl}
                                alt={carouselImage1.description}
                                fill
                                className="object-cover opacity-20"
                                data-ai-hint={carouselImage1.imageHint}
                            />
                        )}
                        <div className="relative z-10 max-w-md text-primary-foreground">
                            <h2 className="text-3xl font-bold text-foreground">New Drug Requests</h2>
                            <p className="mt-2 text-muted-foreground">{neededDrugs.length} new orders are waiting for fulfillment.</p>
                            <Button asChild className="mt-4">
                                <Link href="/shipments">View Requests</Link>
                            </Button>
                        </div>
                    </div>
                </CarouselItem>
                 <CarouselItem>
                    <div className="relative w-full h-[350px] rounded-lg overflow-hidden bg-destructive/10 p-8 flex items-center">
                       {carouselImage2 && (
                            <Image
                                src={carouselImage2.imageUrl}
                                alt={carouselImage2.description}
                                fill
                                className="object-cover opacity-20"
                                data-ai-hint={carouselImage2.imageHint}
                            />
                        )}
                        <div className="relative z-10 max-w-md">
                            <h2 className="text-3xl font-bold text-foreground">Active Alerts</h2>
                            <p className="mt-2 text-muted-foreground">{activeAlerts} alerts require your immediate attention.</p>
                            <Button asChild className="mt-4" variant="destructive">
                                <Link href="/alerts">Review Alerts</Link>
                            </Button>
                        </div>
                    </div>
                </CarouselItem>
              </CarouselContent>
              <CarouselPrevious className="left-4" />
              <CarouselNext className="right-4" />
            </Carousel>
        </main>
    );
  }
  
  if (userRole === 'FDA') {
     return (
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
            {activeFdaModule !== 'dashboard-overview' && (
                <Button variant="outline" className="self-start gap-2" onClick={() => setActiveFdaModule('dashboard-overview')}>
                    <ArrowLeft className="h-4 w-4" />
                    Back to Dashboard Overview
                </Button>
            )}

            {activeFdaModule === 'dashboard-overview' && (
                <>
                <Card>
                    <CardHeader>
                        <CardTitle>FDA Regulatory Dashboard</CardTitle>
                        <CardDescription>A central hub for managing and monitoring pharmaceutical submissions and compliance.</CardDescription>
                    </CardHeader>
                </Card>
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fade-in-up">
                    {fdaActionCategories.map((cat, index) => (
                        <button key={index} className="w-full h-full text-left" onClick={() => handleFdaModuleClick(cat.id, cat.href)}>
                             <Card className="h-full hover:shadow-lg transition-shadow">
                                <CardContent className="p-4 flex flex-col items-center justify-center text-center gap-2">
                                     <div className="flex items-center justify-center bg-primary/10 rounded-full p-3 mb-2">
                                        <cat.icon className="h-6 w-6 text-primary" />
                                     </div>
                                     <p className="font-semibold">{cat.label}</p>
                                     <p className="text-xs text-muted-foreground">{cat.description}</p>
                                </CardContent>
                            </Card>
                        </button>
                    ))}
                </div>
                </>
            )}
             {activeFdaModule === 'product-management' && (
                <MyProductsPage />
            )}
        </main>
     );
  }


  return (
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in-up">
                {manufacturerActionCategories.map((cat, index) => (
                    <Link href={cat.href} key={index}>
                         <Card className="h-full hover:shadow-lg transition-shadow">
                            <CardContent className="p-4 flex flex-col items-center justify-center text-center gap-2">
                                 <div className="flex items-center justify-center bg-primary/10 rounded-full p-3 mb-2">
                                    <cat.icon className="h-6 w-6 text-primary" />
                                 </div>
                                 <p className="font-semibold">{cat.label}</p>
                                 <p className="text-xs text-muted-foreground">{cat.description}</p>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>
        </main>
    );
}
