'use client';

import {
  Bell,
  FlaskConical,
  Home,
  LineChart,
  Package,
  Siren,
  Truck,
  User,
  CreditCard,
  ClipboardList,
  MessageSquare,
  Beaker,
  FileText,
  ShoppingBag,
  FileCheck,
} from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState, useMemo } from 'react';
import type { Role } from '@/lib/types';
import { users } from '@/lib/data';

export const navItems = {
  all: [
    { href: '/dashboard', icon: Home, label: 'Dashboard' },
    { href: '/shipments', icon: Truck, label: 'Shipments' },
    { href: '/messages', icon: MessageSquare, label: 'Messages' },
    { href: '/analytics', icon: LineChart, label: 'Analytics' },
    { href: '/alerts', icon: Siren, label: 'Alerts' },
    { href: '/needed-drugs', icon: ClipboardList, label: 'Needed Drugs' },
  ],
  'Ingredient Supplier': [
    { href: '/dashboard', icon: Home, label: 'Dashboard' },
    { href: '/raw-materials', icon: Beaker, label: 'Raw Materials' },
    { href: '/shipments', icon: Truck, label: 'Shipments' },
  ],
  Manufacturer: [
    { href: '/dashboard', icon: Home, label: 'Dashboard' },
    { href: '/batches', icon: FlaskConical, label: 'Batches' },
    { href: '/shipments', icon: Truck, label: 'Shipments' },
    { href: '/my-products', icon: ShoppingBag, label: 'My Products' },
  ],
  FDA: [
    { href: '/dashboard', icon: Home, label: 'Dashboard' },
    { href: '/approvals', icon: FileCheck, label: 'Approvals' },
    { href: '/alerts', icon: Siren, label: 'Alerts' },
    { href: '/shipments', icon: Truck, label: 'Shipments' },
  ],
  Patient: [{ href: '/my-prescriptions', icon: FileText, label: 'My Prescriptions' }],
  Distributor: [
    { href: '/dashboard', icon: Home, label: 'Dashboard' },
    { href: '/shipments', icon: Truck, label: 'Shipments' },
  ],
  Pharmacy: [
    { href: '/dashboard', icon: Home, label: 'Dashboard' },
    { href: '/shipments', icon: Truck, label: 'Shipments' },
  ],
};

export function useAppNavigation() {
  const pathname = usePathname();
  const router = useRouter();
  const [userRole, setUserRole] = useState<Role | null>(null);
  const [userName, setUserName] = useState('PharmaTrust User');
  const [user, setUser] = useState<any>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const role = localStorage.getItem('userRole') as Role;
    if (role) {
      setUserRole(role);
      const currentUser =
        users[role as keyof typeof users] || {
          name: 'PharmaTrust User',
          role: role,
        };
      setUser(currentUser);
      setUserName(currentUser.name);
    }
  }, [pathname]);

  const visibleNavItems = useMemo(() => {
    if (!isClient) return []; // Render nothing on the server
    if (!userRole) {
      // Default navigation for logged-out users, adjust as needed
      return [
        { href: '/', icon: Home, label: 'Home' },
      ];
    }
    if (userRole === 'Patient') return navItems.Patient;
    if (navItems[userRole]) {
      return navItems[userRole as keyof typeof navItems];
    }
    return navItems.all;
  }, [isClient, userRole]);

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    setUserRole(null);
    setUserName('PharmaTrust User');
    setUser(null);
    router.push('/');
  };

  return { userRole, userName, user, handleLogout, visibleNavItems, isClient };
}
