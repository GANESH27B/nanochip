import type { Shipment, Alert, User, Role, TelemetryData } from './types';

export const users: Record<Role, User> = {
  Manufacturer: {
    id: 'user-mfg',
    name: 'Alice Manufacturer',
    email: 'alice@pharma.co',
    role: 'Manufacturer',
  },
  Distributor: {
    id: 'user-dist',
    name: 'Bob Distributor',
    email: 'bob@logistics.co',
    role: 'Distributor',
  },
  Pharmacy: {
    id: 'user-pharma',
    name: 'Charlie Pharmacist',
    email: 'charlie@meds.co',
    role: 'Pharmacy',
  },
  FDA: {
    id: 'user-fda',
    name: 'Diana Regulator',
    email: 'diana@fda.gov',
    role: 'FDA',
  },
};

export const shipments: Shipment[] = [
  {
    batchId: 'B-XYZ-12345',
    currentHolder: 'City-Distro',
    status: 'In-Transit',
    createdAt: '2024-07-28T10:00:00Z',
    alerts: 2,
    lastUpdate: '2024-07-28T14:30:00Z',
  },
  {
    batchId: 'B-ABC-67890',
    currentHolder: 'Pharma-Factory',
    status: 'Requires-Approval',
    createdAt: '2024-07-27T15:00:00Z',
    alerts: 1,
    lastUpdate: '2024-07-28T09:00:00Z',
  },
  {
    batchId: 'B-DEF-11223',
    currentHolder: 'General Hospital',
    status: 'Delivered',
    createdAt: '2024-07-25T08:00:00Z',
    alerts: 0,
    lastUpdate: '2024-07-26T18:00:00Z',
  },
  {
    batchId: 'B-GHI-44556',
    currentHolder: 'Regional-Logistics',
    status: 'In-Transit',
    createdAt: '2024-07-28T11:00:00Z',
    alerts: 0,
    lastUpdate: '2024-07-28T16:45:00Z',
  },
  {
    batchId: 'B-JKL-77889',
    currentHolder: 'Pharma-Factory',
    status: 'Pending',
    createdAt: '2024-07-28T18:00:00Z',
    alerts: 0,
    lastUpdate: '2024-07-28T18:00:00Z',
  },
];

export const alerts: Alert[] = [
  {
    alertId: 'A-001',
    batchId: 'B-XYZ-12345',
    timestamp: '2024-07-28T12:05:00Z',
    type: 'Temperature',
    details: 'Temperature exceeded 8°C for 15 minutes. Current reading: 8.5°C.',
    severity: 'High',
  },
  {
    alertId: 'A-002',
    batchId: 'B-ABC-67890',
    timestamp: '2024-07-28T08:30:00Z',
    type: 'Tamper',
    details: 'Package seal was broken and then re-sealed.',
    severity: 'High',
  },
  {
    alertId: 'A-003',
    batchId: 'B-XYZ-12345',
    timestamp: '2024-07-28T13:45:00Z',
    type: 'Pressure',
    details: 'Atmospheric pressure dropped significantly, suggesting altitude change.',
    severity: 'Medium',
  },
  {
    alertId: 'A-004',
    batchId: 'B-XYZ-12345',
    timestamp: '2024-07-28T15:00:00Z',
    type: 'Humidity',
    details: 'Humidity level rose to 75%.',
    severity: 'Low',
  },
];

export const generateTelemetryData = (days: number): TelemetryData[] => {
  const data: TelemetryData[] = [];
  const now = new Date();
  for (let i = 0; i < 24 * days; i++) {
    const time = new Date(now.getTime() - i * 60 * 60 * 1000);
    data.push({
      time: time.toISOString().substring(0, 16).replace('T', ' '),
      temperature: 4 + Math.random() * 2 + (i % 24 > 10 && i % 24 < 18 ? Math.random() : -Math.random()),
      humidity: 60 + Math.random() * 5,
      pressure: 1010 + Math.random() * 10 - 5,
    });
  }
  return data.reverse();
};
