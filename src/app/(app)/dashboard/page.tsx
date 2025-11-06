'use client';

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { alerts, shipments } from '@/lib/data';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Siren, Package, Truck, CheckCircle, ShieldCheck, AlertTriangle, ShieldX } from 'lucide-react';
import AppHeader from '@/components/app/header';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useEffect, useState, useMemo } from 'react';
import type { Role } from '@/lib/types';
import { cn } from '@/lib/utils';

export default function DashboardPage() {
  const [userRole, setUserRole] = useState<Role | null>(null);

  useEffect(() => {
    const role = localStorage.getItem('userRole') as Role;
    if (role) {
      setUserRole(role);
    }
  }, []);

  const totalShipments = shipments.length;
  const pendingApprovals = shipments.filter((s) => s.status === 'Requires-Approval').length;
  const activeAlerts = alerts.length;

  const statusCounts = shipments.reduce((acc, s) => {
    acc[s.status] = (acc[s.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.keys(statusCounts).map((status) => ({
    name: status,
    total: statusCounts[status],
  }));

  const recentAlerts = alerts.slice(0, 3);
  
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


  return (
    <div className="flex min-h-screen w-full flex-col">
      <AppHeader title={userRole ? `${userRole} Dashboard` : 'Dashboard'} />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
           <Card className={cn("animate-fade-in-up", supplyChainStatus.color)} style={{ animationDelay: '0s' }}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Supply Chain Status</CardTitle>
                <supplyChainStatus.icon className="h-4 w-4 text-current" />
              </CardHeader>
              <CardContent>
                <div className={cn("text-2xl font-bold", supplyChainStatus.color)}>{supplyChainStatus.label}</div>
                <p className="text-xs text-muted-foreground">{supplyChainStatus.description}</p>
              </CardContent>
            </Card>
          <Link href="/shipments">
            <Card className="animate-fade-in-up hover:bg-muted/50" style={{ animationDelay: '0.1s' }}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Shipments</CardTitle>
                <Truck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalShipments}</div>
                <p className="text-xs text-muted-foreground">Tracked across the network</p>
              </CardContent>
            </Card>
          </Link>
          <Link href="/shipments">
            <Card className="animate-fade-in-up hover:bg-muted/50" style={{ animationDelay: '0.2s' }}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{pendingApprovals}</div>
                <p className="text-xs text-muted-foreground">Awaiting FDA review</p>
              </CardContent>
            </Card>
          </Link>
          <Card className="animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
              <Siren className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">{activeAlerts}</div>
              <p className="text-xs text-muted-foreground">Require immediate attention</p>
            </CardContent>
          </Card>
        </div>
        <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
          <Card className="xl:col-span-2 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <CardHeader>
              <CardTitle>Shipment Status Overview</CardTitle>
              <CardDescription>A summary of all current shipment statuses.</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={chartData}>
                  <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                  <Tooltip cursor={{fill: 'hsl(var(--muted))'}} contentStyle={{backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))'}}/>
                  <Bar dataKey="total" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <Card className="animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
            <CardHeader>
              <CardTitle>Recent Alerts</CardTitle>
              <CardDescription>Top priority alerts from the network.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              {recentAlerts.length > 0 ? (
                recentAlerts.map((alert) => (
                  <Alert key={alert.alertId} variant={alert.severity === 'High' ? 'destructive' : 'default'}>
                    <Siren className="h-4 w-4" />
                    <AlertTitle className="font-semibold">{alert.type} Alert</AlertTitle>
                    <AlertDescription className="text-xs">{alert.details}</AlertDescription>
                  </Alert>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
                    <CheckCircle className="h-12 w-12 text-green-500 mb-4"/>
                    <h3 className="text-lg font-semibold">All Systems Normal</h3>
                    <p className="text-sm text-muted-foreground">No active alerts at the moment.</p>
                </div>
              )}
               <Button asChild variant="outline" size="sm">
                <Link href="/alerts">View All Alerts</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
