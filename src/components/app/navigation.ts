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
} from 'lucide-react';
import { usePathname } from 'next/navigation';
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
    { href: '/billing', icon: CreditCard, label: 'Billing' },
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
    { href: '/billing', icon: CreditCard, label: 'Billing' },
  ],
  FDA: [
    { href: '/dashboard', icon: Home, label: 'Dashboard' },
    { href: '/approvals', icon: Package, label: 'Approvals' },
    { href: '/alerts', icon: Siren, label: 'Alerts' },
  ],
  Patient: [{ href: '/my-prescriptions', icon: FileText, label: 'My Prescriptions' }],
  Distributor: [
    { href: '/dashboard', icon: Home, label: 'Dashboard' },
    { href: '/shipments', icon: Truck, label: 'Shipments' },
    { href: '/billing', icon: CreditCard, label: 'Billing' },
  ],
  Pharmacy: [
    { href: '/dashboard', icon: Home, label: 'Dashboard' },
    { href: '/shipments', icon: Truck, label: 'Shipments' },
    { href: '/billing', icon: CreditCard, label: 'Billing' },
  ],
};

export function useAppNavigation() {
  const pathname = usePathname();
  const [userRole, setUserRole] = useState<Role | null>(null);
  const [userName, setUserName] = useState('PharmaChain User');
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const role = localStorage.getItem('userRole') as Role;
    if (role) {
      setUserRole(role);
      const currentUser =
        users[role as keyof typeof users] || {
          name: 'PharmaChain User',
          role: role,
        };
      setUser(currentUser);
      setUserName(currentUser.name);
    }
  }, [pathname]);

  const visibleNavItems = useMemo(() => {
    if (!userRole) return [];
    if (userRole === 'Patient') return navItems.Patient;
    if (navItems[userRole]) {
      return navItems[userRole as keyof typeof navItems];
    }
    return navItems.all;
  }, [userRole]);

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    window.location.href = '/';
  };

  return { userRole, userName, user, handleLogout, visibleNavItems };
}

    